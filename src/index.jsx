import "./global.css";
import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import { App } from "./components/App/index.jsx";
import { HomePage } from "./pages/HomePage/index.jsx";
import { WeeklyPlanner } from "./pages/WeeklyPlanner/index.jsx";
import { RecipeLibrary } from "./pages/RecipeLibrary/index.jsx";
import { RecipeForm } from "./pages/RecipeForm/index.jsx";
import { RecipeDetail } from "./pages/RecipeDetail/index.jsx";

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/planner",
        element: <WeeklyPlanner />,
      },
      {
        path: "/recipes",
        element: <RecipeLibrary />,
      },
      {
        path: "/recipe-form",
        element: <RecipeForm />,
      },
      {
        path: "/recipe-form/:id/edit",
        element: <RecipeForm />,
      },
      {
        path: "/recipe-detail/:id",
        element: <RecipeDetail />,
      },
    ],
  },
]);

createRoot(document.querySelector("#app")).render(
  <RouterProvider router={router} future={{ v7_startTransition: true }} />,
);
