export function DialogContent({ children, className }) {
  return (
    <div className={`rounded-xl shadow-xl p-6 bg-white ${className || ''}`}>{children}</div>
  )
}
