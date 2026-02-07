import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../utils/axios';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/products/${id}`);
      setProduct(response.data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <Link to="/products" className="text-blue-600 hover:underline mt-4 inline-block">
          ← Back to Products
        </Link>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/products" className="text-blue-600 hover:underline mb-6 inline-block">
        ← Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-lg shadow-lg p-8">
        <div>
          <img
            src={product.image.startsWith('http') ? product.image : `${API_URL}${product.image}`}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg"
          />
        </div>

        <div>
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            {product.featured && (
              <span className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full">
                Featured
              </span>
            )}
          </div>

          <p className="text-gray-600 mb-6">{product.description}</p>

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-gray-600">Price:</span>
              <span className="text-3xl font-bold text-blue-600">${product.price}</span>
            </div>

            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-gray-600">Category:</span>
              <span className="font-semibold">{product.category}</span>
            </div>

            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-gray-600">Stock:</span>
              <span className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
              </span>
            </div>

            {product.createdBy && (
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-gray-600">Seller:</span>
                <span className="font-semibold">{product.createdBy.name}</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-gray-600">Added:</span>
              <span className="text-sm text-gray-500">
                {new Date(product.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              disabled={product.stock === 0}
              className="btn-primary w-full"
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
            <button className="btn-secondary w-full">
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
