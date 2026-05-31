const Input = ({
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  className = "",
  label,
  error
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-4 py-3 border ${error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'} rounded-xl focus:outline-none focus:ring-4 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 ${className}`}
      />
      {error && <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>}
    </div>
  );
};

export default Input;