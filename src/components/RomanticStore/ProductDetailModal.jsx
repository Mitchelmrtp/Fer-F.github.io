
import { useState } from "react"
import { Dialog } from "../../components/common/Dialog"
import { DialogContent } from "../../components/common/DialogContent"
import { DialogHeader } from "../../components/common/DialogHeader"
import { DialogTitle } from "../../components/common/DialogTitle"
import { Button } from "../../components/common/Button"

const opcionesPago = ["besos", "abrazos", "baile", "canción", "regalo sorpresa"];

export default function ProductDetailModal({ product, open, onClose, onAddToCart }) {
  const [pago, setPago] = useState(opcionesPago[0]);
  if (!product) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gradient-to-br from-pink-50 to-rose-50">
        <DialogHeader>
          <DialogTitle className="text-2xl text-pink-800">{product.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            className="w-full h-48 object-cover rounded-lg"
          />
          <div className="bg-white/50 p-4 rounded-lg">
            <p className="text-gray-700 leading-relaxed">{product.surprise}</p>
          </div>
          <div className="text-center">
            <span className="text-pink-600 font-bold text-xl">{product.price}</span>
          </div>
          <div className="mb-2">
            <label className="block text-pink-700 font-semibold mb-1">Forma de pago:</label>
            <select
              value={pago}
              onChange={e => setPago(e.target.value)}
              className="w-full p-2 rounded border border-pink-300"
            >
              {opcionesPago.map(op => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>
          </div>
          <Button
            className="w-full bg-pink-500 hover:bg-pink-600 text-white"
            onClick={() => {
              onAddToCart({ ...product, pago })
              onClose()
            }}
          >
            Agregar al corazón 💕
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
