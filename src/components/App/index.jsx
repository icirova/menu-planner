import { Outlet } from "react-router-dom";
import { Header } from "../Header";
import { Footer } from "../Footer";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import {
  loadCustomRecipes,
  normalizeCustomRecipe,
  saveCustomRecipes,
} from "../../storage/recipesStorage";
import { areRecipeIdsEqual } from "../../utils/recipeIds";
import {
  loadStoredMenuState,
  removeRecipeFromStoredMenu,
  saveMenuState,
} from "../../storage/menuStorage";
import { initialMenuState, menuReducer } from "../../reducers/menuReducer";

const BACKUP_VERSION = 1;
const DATE_STAMP_LENGTH = 10;

const getBackupFileName = () => {
  const stamp = new Date().toISOString().slice(0, DATE_STAMP_LENGTH);
  return `menu-planner-backup-${stamp}.json`;
};

const validateImportedData = (parsed) => {
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Soubor neobsahuje validní JSON objekt.");
  }

  if (!Array.isArray(parsed.customRecipes)) {
    throw new Error("V záloze chybí pole customRecipes.");
  }

  if (
    parsed.weeklyMenu !== null &&
    !Array.isArray(parsed.weeklyMenu) &&
    typeof parsed.weeklyMenu !== "object"
  ) {
    throw new Error("Položka weeklyMenu má neplatný formát.");
  }

  return {
    customRecipes: parsed.customRecipes.map(normalizeCustomRecipe),
    weeklyMenu: parsed.weeklyMenu ?? null,
  };
};

export const App = () => {
  const [customRecipes, setCustomRecipes] = useState([]);
  const [isRecipesReady, setIsRecipesReady] = useState(false);
  const [weeklyMenu, menuDispatch] = useReducer(menuReducer, initialMenuState);
  const [isMenuReady, setIsMenuReady] = useState(false);
  const [storageWarning, setStorageWarning] = useState(null);
  const [backupMessage, setBackupMessage] = useState(null);
  const importInputRef = useRef(null);
  const hasInitializedMenu = useRef(false);

  const recipeList = useMemo(() => customRecipes, [customRecipes]);

  const addRecipe = (newRecipe) => {
    setCustomRecipes((prev) => [...prev, normalizeCustomRecipe(newRecipe)]);
  };

  const updateRecipe = (updatedRecipe) => {
    setCustomRecipes((prev) =>
      prev.some((recipe) => areRecipeIdsEqual(recipe.id, updatedRecipe.id))
        ? prev.map((recipe) =>
            areRecipeIdsEqual(recipe.id, updatedRecipe.id)
              ? normalizeCustomRecipe(updatedRecipe)
              : recipe,
          )
        : [...prev, normalizeCustomRecipe(updatedRecipe)],
    );
  };

  const deleteRecipe = async (recipeId) => {
    const nextRecipes = customRecipes.filter((recipe) => !areRecipeIdsEqual(recipe.id, recipeId));
    if (nextRecipes.length === customRecipes.length) return false;

    setCustomRecipes(nextRecipes);
    menuDispatch({ type: "REMOVE_RECIPE_FROM_WEEK", recipeId });

    const [recipeSaveResult] = await Promise.all([
      saveCustomRecipes(nextRecipes),
      removeRecipeFromStoredMenu(recipeId),
    ]);

    setStorageWarning((prev) => recipeSaveResult.warning || prev);
    return true;
  };

  useEffect(() => {
    let ignore = false;

    const hydrateCustomRecipes = async () => {
      const { recipes: storedRecipes, warning } = await loadCustomRecipes();
      if (!ignore) {
        setCustomRecipes(storedRecipes);
        setStorageWarning(warning);
        setIsRecipesReady(true);
      }
    };

    void hydrateCustomRecipes();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!isRecipesReady || hasInitializedMenu.current) return;

    let ignore = false;

    const hydrateMenuState = async () => {
      const { state: storedState, warning } = await loadStoredMenuState();
      if (ignore) return;

      if (storedState) {
        menuDispatch({ type: "INIT_FROM_STORAGE", payload: storedState, recipes: recipeList });
      }

      setStorageWarning((prev) => warning || prev);
      hasInitializedMenu.current = true;
      setIsMenuReady(true);
    };

    void hydrateMenuState();

    return () => {
      ignore = true;
    };
  }, [isRecipesReady, recipeList]);

  useEffect(() => {
    if (!isRecipesReady) return;

    const persistCustomRecipes = async () => {
      const { warning } = await saveCustomRecipes(customRecipes);
      setStorageWarning(warning);
    };

    void persistCustomRecipes();
  }, [customRecipes, isRecipesReady]);

  useEffect(() => {
    if (!isMenuReady) return;

    const persistMenuState = async () => {
      const { warning } = await saveMenuState(weeklyMenu);
      setStorageWarning((prev) => warning || prev);
    };

    void persistMenuState();
  }, [weeklyMenu, isMenuReady]);

  const handleExportBackup = () => {
    const payload = {
      version: BACKUP_VERSION,
      exportedAt: new Date().toISOString(),
      customRecipes,
      weeklyMenu,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = getBackupFileName();
    link.click();

    URL.revokeObjectURL(url);
    setBackupMessage("Záloha byla stažena do JSON souboru.");
  };

  const handleImportClick = () => {
    importInputRef.current?.click();
  };

  const handleImportBackup = async (event) => {
    const [file] = Array.from(event.target.files || []);
    event.target.value = "";

    if (!file) return;

    if (!window.confirm("Import přepíše vlastní recepty i týdenní plán. Pokračovat?")) {
      return;
    }

    try {
      const content = await file.text();
      const parsed = JSON.parse(content);
      const { customRecipes: importedRecipes, weeklyMenu } = validateImportedData(parsed);

      const recipeSaveResult = await saveCustomRecipes(importedRecipes);
      const menuSaveResult = await saveMenuState(weeklyMenu);
      const warning = [recipeSaveResult.warning, menuSaveResult.warning]
        .filter(Boolean)
        .join(" ");

      setCustomRecipes(importedRecipes);
      setStorageWarning(warning || null);
      setBackupMessage(
        warning
          ? "Import proběhl s omezeními. Zkontroluj hlášku o ukládání."
          : "Import byl dokončen. Aplikace se obnoví s novými daty.",
      );

      window.location.reload();
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "Import zálohy selhal.";
      setBackupMessage(`Import se nepodařil: ${message}`);
    }
  };

  if (!isRecipesReady) {
    return (
      <div className="container">
        <Header />
        <main className="main">
          <p>Načítám uložená data...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isMenuReady) {
    return (
      <div className="container">
        <Header />
        <main className="main">
          <p>Načítám uložený plán...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="container">
      <Header />
      {backupMessage && (
        <p className="app-message app-message--info" role="status">
          {backupMessage}
        </p>
      )}
      {storageWarning && (
        <p className="app-message app-message--warning" role="alert">
          {storageWarning}
        </p>
      )}
      <Outlet
        context={{
          recipeList,
          addRecipe,
          updateRecipe,
          deleteRecipe,
          weeklyMenu,
          menuDispatch,
        }}
      />
      <Footer
        onExportBackup={handleExportBackup}
        onImportClick={handleImportClick}
        importInputRef={importInputRef}
        onImportBackup={handleImportBackup}
      />
    </div>
  );
};
