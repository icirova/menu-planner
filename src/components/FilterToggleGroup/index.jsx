import { Button } from "../Button";
import "./style.css";

export const FilterToggleGroup = ({
  options,
  selectedValues = [],
  onToggle,
  className = "",
}) => {
  const classes = ["buttons", className].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      {options.map((option) => (
        <Button
          key={option.value}
          label={option.label}
          onClick={() => onToggle(option.value)}
          active={selectedValues.includes(option.value)}
        />
      ))}
    </div>
  );
};
