import { Star } from "lucide-react"

export default function ProductCard({ product, onClick, onAddToCart }) {
  return (
    <div
      className="hover:shadow-xl transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm border-pink-200 cursor-pointer"
      onClick={() => onClick(product)}
    >
      <div className="p-4">
        <div className="relative mb-4">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name || product.title}
            className="w-full h-48 object-cover rounded-lg"
          />
          <span className="absolute top-2 right-2 bg-pink-500 text-white px-2 py-1 rounded text-xs">{product.category}</span>
        </div>
        <h3 className="font-bold text-lg text-gray-800 mb-2">{product.name || product.title}</h3>
        <p className="text-gray-600 text-sm mb-3">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-pink-600 font-bold text-lg">{product.price}</span>
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current" />
            ))}
          </div>
        </div>
        <button
          className="w-full mt-3 bg-pink-500 hover:bg-pink-600 text-white py-2 rounded"
          onClick={e => {
            e.stopPropagation()
            console.log('Botón agregar al carrito clickeado:', product);
            onAddToCart(product)
          }}
        >
          Agregar al corazón 💕
        </button>
      </div>
    </div>
  )
}
