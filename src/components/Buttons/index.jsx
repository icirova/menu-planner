import { Button } from "../Button"
import "./style.css"


export const Buttons = ({handleTagSelection, selectedTags}) => {

  console.log(selectedTags)
  
  return <div className="buttons">
    <Button name={"Snídaně"} 
      handleTagSelection={() => handleTagSelection("snídaně")} 
      active={selectedTags && selectedTags.includes("snídaně")}
    />

    <Button name={"Svačiny"} 
      handleTagSelection={() => handleTagSelection("svačiny")} 
      active={selectedTags && selectedTags.includes("svačiny")}
    />
    <Button name={"Polévky"} 
      handleTagSelection={handleTagSelection}
      active={selectedTags && selectedTags.includes("polévky")}
    />
    <Button name={"Obědy"} 
      handleTagSelection={handleTagSelection}
      active={selectedTags && selectedTags.includes("obědy")}
      />
    <Button name={"Večeře"} 
      handleTagSelection={handleTagSelection}
      active={selectedTags && selectedTags.includes("večeře")}
    />
    <Button name={"Moučníky"} 
      handleTagSelection={handleTagSelection}
      active={selectedTags && selectedTags.includes("moučníky")}
    />
</div>
  
}
