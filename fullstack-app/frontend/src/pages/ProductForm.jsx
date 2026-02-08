import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from '../utils/axios';
import categoryLabels from '../utils/categoryLabels';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      name: '',
      description: '',
      price: '',
      category: 'Electronics',
      stock: '',
      featured: false
    }
  });

  const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Toys', 'Other'];

  useEffect(() => {
    if (isEditMode) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      const product = response.data.data;
      
      setValue('name', product.name);
      setValue('description', product.description);
      setValue('price', product.price);
      setValue('category', product.category);
      setValue('stock', product.stock);
      setValue('featured', product.featured);
      setImagePreview(product.image);
    } catch (err) {
      setError(err.response?.data?.message || 'Échec du chargement du produit');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');

      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('price', data.price);
      formData.append('category', data.category);
      formData.append('stock', data.stock);
      formData.append('featured', data.featured);

      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (isEditMode) {
        await axios.put(`/api/products/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post('/api/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message || `Échec de la ${isEditMode ? 'mise à jour' : 'création'} du produit`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          {isEditMode ? 'Modifier le Produit' : 'Créer un Nouveau Produit'}
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nom du Produit *
            </label>
            <input
              {...register('name', {
                required: 'Le nom du produit est requis',
                minLength: { value: 3, message: 'Le nom doit contenir au moins 3 caractères' }
              })}
              className="input-field"
              placeholder="Entrer le nom du produit"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description *
            </label>
            <textarea
              {...register('description', {
                required: 'La description est requise',
                minLength: { value: 10, message: 'La description doit contenir au moins 10 caractères' }
              })}
              className="input-field"
              rows="4"
              placeholder="Entrer la description du produit"
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Prix (€) *
              </label>
              <input
                type="number"
                step="0.01"
                {...register('price', {
                  required: 'Le prix est requis',
                  min: { value: 0, message: 'Le prix doit être positif' }
                })}
                className="input-field"
                placeholder="0.00"
              />
              {errors.price && (
                <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Stock *
              </label>
              <input
                type="number"
                {...register('stock', {
                  required: 'Le stock est requis',
                  min: { value: 0, message: 'Le stock doit être positif' }
                })}
                className="input-field"
                placeholder="0"
              />
              {errors.stock && (
                <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Catégorie *
            </label>
            <select {...register('category')} className="input-field">
              {categories.map(cat => (
                <option key={cat} value={cat}>{categoryLabels[cat] || cat}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Image du Produit
            </label>
            <input
              type="file"
              accept="image/*"
              {...register('image')}
              onChange={handleImageChange}
              className="input-field"
            />
            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview.startsWith('http') || imagePreview.startsWith('data:') 
                    ? imagePreview 
                    : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${imagePreview}`}
                  alt="Aperçu"
                  className="w-32 h-32 object-cover rounded"
                />
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('featured')}
                className="mr-2"
              />
              <span className="text-gray-700 text-sm font-bold">
                Marquer comme En Vedette
              </span>
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? 'Enregistrement...' : (isEditMode ? 'Mettre à Jour' : 'Créer le Produit')}
            </button>
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="btn-secondary flex-1"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
