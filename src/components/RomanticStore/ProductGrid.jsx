import ProductCard from "./ProductCard"

export default function ProductGrid({ products = [], onProductClick, onAddToCart }) {
  // Asegurar que products sea un array
  const productList = Array.isArray(products) ? products : [];
  
  if (productList.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Cargando productos...</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {productList.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={onProductClick}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  )
}
