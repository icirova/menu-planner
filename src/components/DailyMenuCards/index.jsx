import "./style.css"
import { DailyMenuCard } from "../DailyMenuCard"
import { ShoppingList } from "../ShoppingList"
import { NotesCard } from "../NotesCard"


export const DailyMenuCards = () => {
  return <div className="cards">
    <DailyMenuCard day={"Pondělí"} img={"1-menu.webp"}/>
    <DailyMenuCard day={"Úterý"} img={"2-menu.webp"}/>
    <DailyMenuCard day={"Středa"} img={"3-menu.webp"}/>
    <DailyMenuCard day={"Čtvrtek"} img={"4-menu.webp"}/>
    <DailyMenuCard day={"Pátek"} img={"5-menu.webp"}/>
    <DailyMenuCard day={"Sobota"} img={"6-menu.webp"}/>
    <DailyMenuCard day={"Neděle"} img={"7-menu.webp"}/>
    <NotesCard />
    <ShoppingList />
   

  </div>
}
