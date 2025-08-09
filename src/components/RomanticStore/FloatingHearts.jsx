import { useEffect } from "react"

export default function FloatingHearts({ hearts }) {
  useEffect(() => {
    // Add keyframes for float-up animation
    const style = document.createElement("style")
    style.innerHTML = `@keyframes float-up {0% {transform: translateY(0) rotate(0deg);opacity: 1;}100% {transform: translateY(-100vh) rotate(360deg);opacity: 0;}}`
    document.head.appendChild(style)
    return () => { document.head.removeChild(style) }
  }, [])

  return (
    <>
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="fixed text-pink-400 text-2xl animate-bounce pointer-events-none z-10"
          style={{ left: heart.x, bottom: 0, animation: "float-up 3s ease-out forwards" }}
        >
          💖
        </div>
      ))}
    </>
  )
}
