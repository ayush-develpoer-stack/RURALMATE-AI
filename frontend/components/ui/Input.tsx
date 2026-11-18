import type { InputHTMLAttributes, ReactNode } from 'react';
import './Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  prefix?: string;
  /** Optional trailing control inside the field, e.g. a password visibility toggle. */
  rightSlot?: ReactNode;
}

export default function Input({
  label,
  error,
  hint,
  icon,
  prefix,
  rightSlot,
  id,
  className = '',
  ...rest
}: InputProps) {
  const inputId = id || rest.name;
  return (
    <div className={`field ${className}`}>
      {label && (
        <label className="field__label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <div className={`field__control ${error ? 'field__control--error' : ''}`}>
        {icon && <span className="field__icon">{icon}</span>}
        {prefix && <span className="field__prefix">{prefix}</span>}
        <input id={inputId} className="field__input" {...rest} />
        {rightSlot && <span className="field__action">{rightSlot}</span>}
      </div>
      {error ? (
        <span className="field__error">{error}</span>
      ) : (
        hint && <span className="field__hint">{hint}</span>
      )}
    </div>
  );
}
