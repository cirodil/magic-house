import React from "react";

export default function HouseIcon({ size = 120, color = "#0288d1" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Крыша */}
      <path
        d="M12 5L4 11L12 17L20 11L12 5Z"
        fill="#FFD54F"
        stroke="#FFA000"
        strokeWidth="1"
      />

      {/* Стены */}
      <path d="M5 11L5 19H19V11" stroke={color} strokeWidth="1.5" fill="none" />

      {/* Окна */}
      <rect
        x="7"
        y="13"
        width="3"
        height="3"
        rx="0.5"
        fill="#81D4FA"
        stroke="#0288D1"
        strokeWidth="0.5"
      />
      <rect
        x="14"
        y="13"
        width="3"
        height="3"
        rx="0.5"
        fill="#81D4FA"
        stroke="#0288D1"
        strokeWidth="0.5"
      />
      <rect
        x="7"
        y="17"
        width="3"
        height="1.5"
        rx="0.25"
        fill="#FFECB3"
        stroke="#FFA000"
        strokeWidth="0.5"
      />
      <rect
        x="14"
        y="17"
        width="3"
        height="1.5"
        rx="0.25"
        fill="#FFECB3"
        stroke="#FFA000"
        strokeWidth="0.5"
      />

      {/* Дверь */}
      <path
        d="M10 13V19H14V13Z"
        fill="#A5D6A7"
        stroke="#388E3C"
        strokeWidth="0.5"
      />
      <circle cx="12" cy="16" r="0.4" fill="#5D4037" />

      {/* Дым из трубы */}
      <path
        d="M8 9L8 7.5C8 6.67157 8.67157 6 9.5 6H10.5C11.3284 6 12 6.67157 12 7.5V9"
        stroke="#78909C"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
