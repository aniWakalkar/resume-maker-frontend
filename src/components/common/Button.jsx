const Button = ({ 
  children, 
  onClick, 
  type = "button", 
  variant = "primary", 
  isLoading = false,
  disabled = false,
  className = "",
  fullWidth = false
}) => {
  const baseStyles = "px-6 py-2.5 rounded-lg font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg disabled:opacity-50",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 disabled:opacity-50",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg disabled:opacity-50",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 disabled:opacity-50"
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </span>
      ) : children}
    </button>
  );
};

export default Button;