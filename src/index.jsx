import './global.css';
import { createRoot } from 'react-dom/client';
import { createHashRouter, RouterProvider, } from 'react-router-dom';
import { App } from './components/App';
import { HomePage } from './pages/HomePage/';
import { WeeklyPlanner } from './pages/WeeklyPlanner';
import { RecipeLibrary } from './pages/RecipeLibrary';
import {RecipeForm} from './pages/RecipeForm';
import {RecipeDetail} from './pages/RecipeDetail';

const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path:"/",
        element: <HomePage />,
      },
      {
        path: '/planner',
        element: <WeeklyPlanner />
      },
      {
        path: '/recipes',
        element: <RecipeLibrary />
      },
      {
        path: '/recipe-form',
        element: <RecipeForm />
      },
      {
        path: '/recipe-form/:id/edit',
        element: <RecipeForm />
      },
      {
        path: '/recipe-detail/:id',
        element: <RecipeDetail />
      }
    ] 
  },
  
]);

createRoot(document.querySelector('#app')).render(
  <RouterProvider router={router} />
);
