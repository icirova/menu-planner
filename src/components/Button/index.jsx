import "./style.css"

export const Button = ({name, handleTagSelection, active}) => {
  return <>
    <button  
      className={`button ${active ? 'button--active' : ''}`}  
      onClick={() => handleTagSelection(name.toLowerCase())}>{name}
    </button>
  </>
}
