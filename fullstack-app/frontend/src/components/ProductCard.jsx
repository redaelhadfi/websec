import { Link } from 'react-router-dom';
import categoryLabels from '../utils/categoryLabels';

const ProductCard = ({ product, onDelete, isAdmin }) => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{product.name}</h3>
          {product.featured && (
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
              En Vedette
            </span>
          )}
        </div>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-blue-600">{product.price} €</span>
          <span className="text-sm text-gray-500">Stock : {product.stock}</span>
        </div>
        <div className="mb-3">
          <span className="inline-block bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
            {categoryLabels[product.category] || product.category}
          </span>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/products/${product._id}`}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-center"
          >
            Voir Détails
          </Link>
          {isAdmin && (
            <>
              <Link
                to={`/products/edit/${product._id}`}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
              >
                Modifier
              </Link>
              <button
                onClick={() => onDelete(product._id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Supprimer
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
