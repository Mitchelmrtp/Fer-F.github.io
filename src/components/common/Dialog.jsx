export function Dialog({ open, onOpenChange, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30" onClick={() => onOpenChange(false)}>
      <div className="relative" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}
