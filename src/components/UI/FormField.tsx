import type { BaseComponentProps } from '../../types';

interface FormFieldProps extends BaseComponentProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'textarea' | 'select';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  help?: string;
  options?: { value: string; label: string }[];
  rows?: number;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  help,
  options,
  rows = 3,
  className = '',
}) => {
  const fieldId = `field-${name}`;
  const helpId = help ? `${fieldId}-help` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;

  const fieldClasses = `
    form-input
    ${error ? 'border-error focus:border-error focus:ring-error/50' : ''}
  `;

  const renderField = () => {
    switch (type) {
      case 'textarea':
        return (
          <textarea
            id={fieldId}
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className={`${fieldClasses} resize-none`}
            aria-describedby={[helpId, errorId].filter(Boolean).join(' ') || undefined}
            aria-invalid={!!error}
            required={required}
          />
        );
      
      case 'select':
        return (
          <select
            id={fieldId}
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={fieldClasses}
            aria-describedby={[helpId, errorId].filter(Boolean).join(' ') || undefined}
            aria-invalid={!!error}
            required={required}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      default:
        return (
          <input
            id={fieldId}
            name={name}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={fieldClasses}
            aria-describedby={[helpId, errorId].filter(Boolean).join(' ') || undefined}
            aria-invalid={!!error}
            required={required}
          />
        );
    }
  };

  return (
    <div className={`form-group ${className}`}>
      <label htmlFor={fieldId} className="form-label">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>
      
      {renderField()}
      
      {help && (
        <p id={helpId} className="form-help">
          {help}
        </p>
      )}
      
      {error && (
        <p id={errorId} className="form-error">
          {error}
        </p>
      )}
    </div>
  );
};