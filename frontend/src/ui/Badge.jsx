function Badge({ children, className = "" }) { return <span className={`inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ${className}`}>{children}</span>; }
export default Badge;
