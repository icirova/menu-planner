import "./style.css";

export const RecipeTags = ({ tags }) => {
  return (
     <>
    {/* <h2 className="recipe-detail__subtitle">Tagy:</h2> */}
    <div className="tags">
      {tags.map((tag, i) => (
        <span key={i} className="tag">
          {tag}
        </span>
      ))}
    </div>
    </>
  );
};
