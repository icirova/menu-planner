// src/pages/HomePage/index.jsx
import './style.css';
import { DailyMenuCards } from '../../components/DailyMenuCards';
import { useOutletContext } from 'react-router-dom';

export const HomePage = () => {
  const { recipeList } = useOutletContext();     // vezme z App.jsx
  return (
    <div className="main">
      <h1 className='title'>Menu</h1>
      <DailyMenuCards recipes={recipeList} /> 
    </div>
  );
};
