import React, { useEffect } from "react";
export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (toast) {
      const t = setTimeout(onClose, 3200);
      return () => clearTimeout(t);
    }
  }, [toast, onClose]);
  if (!toast) return null;
  return (
    <div className={`toast ${toast.type || "success"}`}>
      <span>{toast.message}</span>
      <button onClick={onClose}>×</button>
    </div>
  );
}
