import "./style.css"
import { NavLink } from "react-router-dom"

const getNavItemClassName = ({ isActive, isPending }) =>
  isPending ? "menu__item" : isActive ? "active menu__item" : "menu__item";

export const Navbar = () => {
  return <nav className="menu" aria-label="Hlavní navigace">
    <div className="menu__brand">Týden na talíři</div>
    <ul className="menu__list">
        <li ><NavLink to="/" className={getNavItemClassName}>Přehled</NavLink></li>
        <li ><NavLink to="/planner" className={getNavItemClassName}>Plánování</NavLink></li>
        <li ><NavLink to="/recipes" className={getNavItemClassName}>Recepty</NavLink></li>
    </ul>
  </nav>
}
