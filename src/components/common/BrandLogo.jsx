import React from 'react';

/**
 * Modern Brand Logo Icon Component for axiscaculator
 * Features an energetic, stylized lightning bolt with gradient styling
 */
export function BrandLogo({ className = 'w-10 h-10', iconClassName = 'w-5 h-5' }) {
  return (
    <div
      className={`rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/25 transition-all ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className={iconClassName}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M13 2 L4.5 13.5 H11.5 L10.5 22 L19.5 10.5 H12.5 L13 2Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="0.75"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
