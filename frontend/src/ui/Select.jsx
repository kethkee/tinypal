function Select({ children, className = "", ...props }) { return <select className={`w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 ${className}`} {...props}>{children}</select>; }
export default Select;
