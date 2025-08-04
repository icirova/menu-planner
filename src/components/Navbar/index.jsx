import "./style.css"
import { NavLink } from "react-router-dom"


export const Navbar = () => {
  return <nav className="menu">

    <ul className="menu__list">
        <li ><NavLink to="/" className={({ isActive, isPending }) => isPending ? "menu__item" : isActive ? "active menu__item" : "menu__item"}>Domů</NavLink></li>
        <li ><NavLink to="/recipes" className="menu__item">Recepty</NavLink></li>
        <li ><NavLink to="/recipe-form" className="menu__item" >Vytvořit</NavLink></li>
    </ul>
  </nav>
}
