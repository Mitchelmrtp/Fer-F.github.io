import { Gift } from "lucide-react"

export default function LoveLetterSection() {
  return (
    <section className="bg-gradient-to-r from-pink-100 to-rose-100 py-12 px-4 mt-12">
      <div className="container mx-auto max-w-2xl text-center">
        <Gift className="h-12 w-12 text-pink-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-pink-800 mb-4">Una Carta Especial Para Ti 💌</h3>
        <div className="bg-white/70 p-6 rounded-lg shadow-lg">
          <p className="text-gray-700 leading-relaxed italic">
            "Sé que esta página parece una tienda, pero en realidad es una muestra de lo mucho que significas para mí.
            Cada 'producto' es solo una forma divertida de recordarte cuánto te amo, lo especial que eres, y todo lo
            que haría por ti. Cada día contigo es un regalo, y quería crear algo único para demostrártelo. Eres mi
            amor, mi inspiración, mi todo. 💕"
          </p>
          <p className="text-pink-600 font-semibold mt-4">Con todo mi amor, siempre tuyo/a ❤️</p>
        </div>
      </div>
    </section>
  )
}
