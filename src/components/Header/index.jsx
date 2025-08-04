import { Navbar } from "../Navbar"
import "./style.css"

export const Header = () => {
  return <header className="header">
     <h1 className="header__title" >Dnešní menu</h1>
     <Navbar />
  </header>
}
