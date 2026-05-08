import { Outlet } from "react-router-dom";
import { Header } from "../Header/index.jsx";
import { Footer } from "../Footer/index.jsx";
import { useAppDataStore } from "../../hooks/useAppDataStore.js";

export const App = () => {
  const { isMenuReady, isRecipesReady, outletContext, storageWarning } = useAppDataStore();

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
      {storageWarning && (
        <p className="app-message app-message--warning" role="alert">
          {storageWarning}
        </p>
      )}
      <Outlet context={outletContext} />
      <Footer />
    </div>
  );
};
