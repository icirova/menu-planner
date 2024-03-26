import { Outlet } from 'react-router-dom';
import { Header } from '../Header';
import { Footer } from '../Footer';


export const App = () => (
  <div className='container'>
    <Header />
    <Outlet />
    <Footer />
  </div>
);

