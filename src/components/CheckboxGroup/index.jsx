export const CheckboxGroup = ({
  legend,
  name,
  options,
  selectedValues = [],
  onToggle,
  className = "",
}) => {
  const classes = ["recipe-form-page__subsection", "form__item", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      <fieldset className="form__fieldset">
        <legend className="form__label">{legend}</legend>
        <div className="form__checkbox-group">
          {options.map((option) => {
            const isSelected = selectedValues.includes(option.value);
            const isDisabled = option.disabled;

            return (
              <label
                key={option.value}
                className={[
                  "form__checkbox-label",
                  isSelected ? "is-selected" : "",
                  isDisabled ? "is-disabled" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <input
                  type="checkbox"
                  name={name}
                  value={option.value}
                  className="form__checkbox"
                  checked={isSelected}
                  disabled={isDisabled}
                  onChange={() => onToggle(option.value)}
                />
                <span>{option.label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
};
