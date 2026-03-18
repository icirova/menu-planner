export const CheckboxGroup = ({
  legend,
  name,
  options,
  selectedValues = [],
  onToggle,
}) => {
  return (
    <div className="form__item">
      <fieldset className="form__fieldset">
        <legend className="form__label">{legend}</legend>
        <div className="form__checkbox-group">
          {options.map((option) => (
            <label key={option.value} className="form__checkbox-label">
              <input
                type="checkbox"
                name={name}
                value={option.value}
                className="form__checkbox"
                checked={selectedValues.includes(option.value)}
                onChange={() => onToggle(option.value)}
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
};
