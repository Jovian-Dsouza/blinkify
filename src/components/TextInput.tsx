"use client";
import { ChangeEvent } from "react";

export interface TextInputProps {
  id: string;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  id,
  value,
  onChange,
  type = "text",
  required = true,
  placeholder,
}) => (
  <input
    id={id}
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="mt-2 block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 focus:outline-none"
    required={required}
  />
);
