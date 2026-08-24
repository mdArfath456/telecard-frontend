import React from "react";
const paths = {
  home: "M3 11 12 3l9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
  grid: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
  cart: "M3 4h2l2 11h10l2-8H6M9 19a1 1 0 1 0 0 2 1 1 0 0 0 0-2m8 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2",
  user: "M20 21a8 8 0 0 0-16 0M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8",
  box: "M4 7l8-4 8 4-8 4-8-4Zm0 0v10l8 4 8-4V7M12 11v10",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3Z",
  logout: "M10 17l5-5-5-5M15 12H3M21 19V5a2 2 0 0 0-2-2h-5",
  search: "m21 21-4.3-4.3M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4",
  plus: "M12 5v14M5 12h14",
  edit: "m4 20 4-1 10-10-3-3L5 16l-1 4ZM13.5 6.5l3 3",
  trash: "M4 7h16M10 11v6m4-6v6M7 7l1 13h8l1-13M9 7V4h6v3",
  arrow: "M5 12h14M13 6l6 6-6 6",
  check: "m5 12 4 4L19 6",
  close: "M6 6l12 12M18 6 6 18",
  menu: "M4 7h16M4 12h16M4 17h16",
  credit: "M3 6h18v12H3zM3 10h18",
  lock: "M6 10V8a6 6 0 0 1 12 0v2M5 10h14v10H5z",
};
export default function Icon({ name, size = 20, stroke = 1.8 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name] || paths.grid} />
    </svg>
  );
}
