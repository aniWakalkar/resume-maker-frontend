const Card = ({ children, className = "", title }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-xl p-8 ${className}`}>
      {title && (
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{title}</h1>
      )}
      {children}
    </div>
  );
};

export default Card;