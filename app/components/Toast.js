// app/components/Toast.js
import { useEffect } from "react";

export default function Toast({ message, type = "success", visible, onClose }) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 3000); // Auto-close after 3 seconds
      return () => clearTimeout(timer); // Clean up on unmount or if visible changes
    }
  }, [visible, onClose]);

  if (!visible) return null;

  const toastStyles = {
    base: "fixed top-16 right-20 p-6 rounded-lg shadow-lg transition-opacity duration-500 ease-in-out z-50",
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    info: "bg-blue-500 text-white",
  };

  return (
    <div className={`${toastStyles.base} ${toastStyles[type]}`}>
      <span>{message}</span>
    </div>
  );
}
