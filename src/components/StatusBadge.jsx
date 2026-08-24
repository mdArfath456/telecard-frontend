import React from "react";
export default function StatusBadge({ value }) {
  return (
    <span
      className={`status status-${String(value || "")
        .toLowerCase()
        .replaceAll("_", "-")}`}
    >
      {String(value || "").replaceAll("_", " ")}
    </span>
  );
}
