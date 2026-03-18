import { Button } from "../Button";
import { SUITABILITY_OPTIONS } from "../../constants/recipeMetadata";
import "./style.css";

export const SuitabilityButtons = ({ handleSuitabilitySelection, selectedSuitabilities }) => {
  return (
    <div className="buttons buttons--suitability">
      {SUITABILITY_OPTIONS.map((option) => (
        <Button
          key={option.value}
          label={option.label}
          onClick={() => handleSuitabilitySelection(option.value)}
          active={selectedSuitabilities.includes(option.value)}
        />
      ))}
    </div>
  );
};
