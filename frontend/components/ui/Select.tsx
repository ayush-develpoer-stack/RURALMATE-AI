import type { SelectHTMLAttributes } from 'react';
import './Select.css';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: Option[];
}

export default function Select({
  label,
  error,
  hint,
  options,
  id,
  className = '',
  ...rest
}: SelectProps) {
  const selectId = id || rest.name;
  return (
    <div className={`field ${className}`}>
      {label && (
        <label className="field__label" htmlFor={selectId}>
          {label}
        </label>
      )}
      <div className={`select__control ${error ? 'field__control--error' : ''}`}>
        <select id={selectId} className="select__input" {...rest}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      {error ? (
        <span className="field__error">{error}</span>
      ) : (
        hint && <span className="field__hint">{hint}</span>
      )}
    </div>
  );
}
