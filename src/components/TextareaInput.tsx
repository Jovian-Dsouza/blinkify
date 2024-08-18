"use client";
import { ChangeEvent } from "react";

export interface TextareaInputProps {
  id: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  placeholder?: string;
  rows: number;
}

export const TextareaInput: React.FC<TextareaInputProps> = ({
  id,
  value,
  onChange,
  required = true,
  placeholder,
  rows = 5,
}) => (
  <textarea
    id={id}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    rows={rows}
    className="mt-2 block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 focus:outline-none"
    required={required}
  ></textarea>
);
