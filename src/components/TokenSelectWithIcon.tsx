"use client";
import { useState } from "react";
import { Token, tokens } from "@/data/tokens";
import Image from "next/image";

interface CustomSelectProps {
  id: string;
  token: Token;
  onChange: (token: string) => void;
  options: Token[];
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  id,
  token,
  onChange,
  options,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="block w-full text-left font-bold rounded-md border-0 py-2 pl-10 pr-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 focus:outline-none"
      >
        {token && (
          <div className="flex items-center">
            <Image
              src={token.icon}
              alt={token.symbol}
              className="absolute left-2 h-5 w-5 rounded-full"
              width={20}
              height={20}
            />
            <span className="">{token.symbol}</span>
          </div>
        )}
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
          {options.map((option) => (
            <div
              key={option.address}
              onClick={() => handleSelect(option.address)}
              className="flex font-bold items-center cursor-pointer p-2 hover:bg-gray-100"
            >
              <Image
                src={option.icon}
                alt={option.symbol}
                className="h-5 w-5 mr-2 rounded-full"
                width={20}
                height={20}
              />
              <span>{option.symbol}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Usage in your component
export const TokenSelectWithIcon = ({
  token,
  onChange,
}: {
  token: Token;
  onChange: (value: string) => void;
}) => (
  <CustomSelect
    id="tokenAddress"
    token={token}
    onChange={onChange}
    options={tokens}
  />
);
