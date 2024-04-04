import './style.css';
import { DailyMenuCards } from '../../components/DailyMenuCards';

export const HomePage = () => {
  return <div className="main">
    <h1 className='title'>Menu</h1>
      <DailyMenuCards />
  </div>

};
