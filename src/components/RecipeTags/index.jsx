import "./style.css";
import { getTagIcon } from "../../utils/getTagIcon";

export const RecipeTags = ({ tags }) => {
  return (
     <>
    <h2 className="recipe-detail__subtitle">Tagy:</h2>
    <div className="tags">
      {tags.map((tag, i) => (
        <span key={i} className="tag">
          {getTagIcon(tag)} {tag}
        </span>
      ))}
    </div>
    </>
  );
};
