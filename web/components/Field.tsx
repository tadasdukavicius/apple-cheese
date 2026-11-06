import type { ReactNode } from 'react';

interface FieldProps {
  id: string;
  label: ReactNode;
  error?: string | undefined;
  children: (props: { id: string; 'aria-invalid': boolean; 'aria-describedby': string | undefined; className: string }) => ReactNode;
}

/** Label + input wrapper that wires up ids, aria-invalid and the error message. */
export default function Field({ id, label, error, children }: FieldProps) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      {children({
        id,
        'aria-invalid': !!error,
        'aria-describedby': error ? errorId : undefined,
        className: `input ${error ? 'input-error' : ''}`,
      })}
      {error && (
        <p id={errorId} role="alert" className="mt-1 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
