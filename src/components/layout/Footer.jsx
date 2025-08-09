import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
      <footer className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-4">Flores F.</h3>
            <p className="text-sm text-gray-600">Calle cualquiera 123</p>
            <p className="text-sm text-gray-600">Distrito legal, CP 12345</p>
            <p className="text-sm text-gray-600">Tel: 999-234-567</p>
            <p className="text-sm text-gray-600">hello@misflores.com</p>
          </div>
  
          <div>
            <h3 className="font-bold mb-4">Información</h3>
            <ul className="space-y-2">
              <li><Link to="/quienes-somos" className="text-sm text-gray-600 hover:text-gray-900">Quienes somos</Link></li>
              <li><Link to="/atencion-cliente" className="text-sm text-gray-600 hover:text-gray-900">Atención al cliente</Link></li>
              <li><Link to="/comisiones" className="text-sm text-gray-600 hover:text-gray-900">Comisiones</Link></li>
              <li><Link to="/delivery" className="text-sm text-gray-600 hover:text-gray-900">Delivery</Link></li>
            </ul>
          </div>
  
          <div>
            <h3 className="font-bold mb-4">Ayuda</h3>
            <ul className="space-y-2">
              <li><Link to="/metodos-pago" className="text-sm text-gray-600 hover:text-gray-900">Métodos de Pago</Link></li>
              <li><Link to="/reembolso" className="text-sm text-gray-600 hover:text-gray-900">Reembolso</Link></li>
              <li><Link to="/privacidad" className="text-sm text-gray-600 hover:text-gray-900">Política de Privacidad</Link></li>
            </ul>
          </div>
  
          <div>
            <h3 className="font-bold mb-4">Redes Sociales</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-gray-900">📷</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">👤</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">🎵</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">💬</a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>2024 M1TCH3L MFTP. All rights reserved</p>
        </div>
      </footer>
    );
  }