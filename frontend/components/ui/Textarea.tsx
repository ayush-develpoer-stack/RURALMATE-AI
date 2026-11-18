import type { TextareaHTMLAttributes } from 'react';
import './Textarea.css';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export default function Textarea({
  label,
  error,
  hint,
  id,
  className = '',
  ...rest
}: TextareaProps) {
  const areaId = id || rest.name;
  return (
    <div className={`field ${className}`}>
      {label && (
        <label className="field__label" htmlFor={areaId}>
          {label}
        </label>
      )}
      <textarea
        id={areaId}
        className={`textarea__input ${error ? 'textarea__input--error' : ''}`}
        {...rest}
      />
      {error ? (
        <span className="field__error">{error}</span>
      ) : (
        hint && <span className="field__hint">{hint}</span>
      )}
    </div>
  );
}
