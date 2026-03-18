import { Button } from "../Button";
import { TAG_OPTIONS } from "../../constants/recipeMetadata";
import "./style.css";

export const Buttons = ({ handleTagSelection, selectedTags = [] }) => {
  return (
    <div className="buttons">
      {TAG_OPTIONS.map((tag) => (
        <Button
          key={tag.value}
          label={tag.label}
          onClick={() => handleTagSelection(tag.value)}
          active={selectedTags.includes(tag.value)}
        />
      ))}
    </div>
  );
};
