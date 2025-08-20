import React from 'react';

type Option<T extends string> = { value: T; label: string };

interface Props<T extends string> {
  label: string;
  value: T;
  /** Совместимо с useState-сеттером: принимает T или (prev: T) => T */
  onChange: (v: React.SetStateAction<T>) => void;
  options: Option<T>[];
  disabled?: boolean;
}

export function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
  disabled = false,
}: Props<T>) {
  return (
    <label className="block text-sm">
      <span className="text-gray-700">{label}</span>
      <select
        className="mt-1 w-full rounded-md border px-3 py-2 disabled:opacity-60"
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        disabled={disabled}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}