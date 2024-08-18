"use client";

export interface FormFieldProps {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  children,
}) => (
  <div>
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-gray-900"
    >
      {label}
    </label>
    {children}
  </div>
);
