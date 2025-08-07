import { Button } from "../Button";
import "./style.css";

export const SuitabilityButtons = ({ handleSuitabilitySelection, selectedSuitabilities }) => {
  const options = ["bez lepku", "bez mléka", "veganské"];

  return (
    <div className="buttons buttons--suitability">
      {options.map((label) => (
        <Button
          key={label}
          name={label}
          handleTagSelection={() => handleSuitabilitySelection(label)}
          active={selectedSuitabilities.includes(label)}
        />
      ))}
    </div>
  );
};
