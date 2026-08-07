function Card({ children, className = "" }) {
  return <div className={`rounded-lg border border-gray-200 bg-white shadow-[0_8px_30px_rgb(17,24,39,0.06)] ${className}`}>{children}</div>;
}
export default Card;
