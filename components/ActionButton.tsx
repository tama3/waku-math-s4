
import React from 'react';

interface ActionButtonProps {
  onClick: () => void;
  text: string;
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(
  ({ onClick, text, className = '', disabled = false, icon }, ref) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
        disabled={disabled}
        className={`min-w-[150px] px-6 py-3 font-display text-lg text-white rounded-xl shadow-lg hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-offset-1 transition-all duration-150 ease-in-out transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2
          ${className} 
          ${disabled ? 'opacity-60 cursor-not-allowed bg-gray-400 hover:bg-gray-400' : ''}`}
      >
        {icon && <span aria-hidden="true">{icon}</span>}
        <span>{text}</span>
      </button>
    );
  }
);

ActionButton.displayName = 'ActionButton'; // Optional: for better debugging

export default ActionButton;
