import { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, forwardRef } from "react";

interface FieldWrapperProps {
  label?: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

function FieldWrapper({ label, error, hint, children }: FieldWrapperProps) {
  return (
    <div>
      {label && (
        <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      {children}
      {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}
      {!error && hint && <p className="mt-1.5 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, hint, icon, className = "", ...props }, ref) => {
    return (
      <FieldWrapper label={label} error={error} hint={hint}>
        <div className="relative">
          {icon && (
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={`focus-ring w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 ${
              icon ? "pl-9" : ""
            } ${
              error
                ? "border-red-300 focus:ring-red-500/30 focus:border-red-400"
                : "border-slate-300 dark:border-slate-700"
            } ${className}`}
            {...props}
          />
        </div>
      </FieldWrapper>
    );
  }
);
TextField.displayName = "TextField";

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, error, hint, className = "", children, ...props }, ref) => {
    return (
      <FieldWrapper label={label} error={error} hint={hint}>
        <select
          ref={ref}
          className={`focus-ring w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-800 transition dark:bg-slate-900 dark:text-slate-100 ${
            error
              ? "border-red-300 focus:ring-red-500/30 focus:border-red-400"
              : "border-slate-300 dark:border-slate-700"
          } ${className}`}
          {...props}
        >
          {children}
        </select>
      </FieldWrapper>
    );
  }
);
SelectField.displayName = "SelectField";
