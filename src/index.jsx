import './global.css';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, } from 'react-router-dom';
import { App } from './components/App';
import { HomePage } from './pages/HomePage/';
import { Recipes } from './pages/Recipes';
import {RecipeForm} from './pages/RecipeForm';
import {RecipeDetail} from './pages/RecipeDetail';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path:"/",
        element: <HomePage />,
      },
      {
        path: '/recipes',
        element: <Recipes />
      },
      {
        path: '/recipe-form',
        element: <RecipeForm />
      },
      {
        path: '/recipe-detail',
        element: <RecipeDetail />
      }
    ] 
  },
  
]);

createRoot(document.querySelector('#app')).render(
  <RouterProvider router={router} />
);