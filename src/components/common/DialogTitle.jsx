export function DialogTitle({ children, className }) {
  return <h2 className={`font-bold text-xl ${className || ''}`}>{children}</h2>
}
