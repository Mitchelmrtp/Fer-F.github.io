export function Button({ children, className, onClick, type = "button" }) {
  return (
    <button type={type} className={`px-4 py-2 rounded font-semibold transition ${className || ''}`} onClick={onClick}>
      {children}
    </button>
  )
}
