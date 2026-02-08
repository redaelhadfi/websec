import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import categoryLabels from '../utils/categoryLabels';

const Home = () => {
  const { user } = useAuth();

  const categories = [
    { key: 'Electronics' },
    { key: 'Clothing' },
    { key: 'Books' },
    { key: 'Home' },
    { key: 'Sports' },
    { key: 'Toys' }
  ];

  return (
    <div className="min-h-screen">
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-6xl md:text-7xl font-extrabold mb-6 animate-fade-in">
            Bienvenue sur <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-300">E-Shop</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-2xl mx-auto">Découvrez des produits exceptionnels à des prix imbattables avec une livraison rapide</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/products"
              className="bg-white text-blue-600 px-10 py-4 rounded-lg font-bold hover:bg-gray-100 transition transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              Parcourir les Produits
            </Link>
            {!user && (
              <Link
                to="/register"
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-10 py-4 rounded-lg font-bold hover:from-pink-600 hover:to-purple-600 transition transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                Commencer
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">Pourquoi Nous Choisir ?</h2>
        <p className="text-center text-gray-600 mb-16 text-lg">Rejoignez des milliers de clients satisfaits</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-800">Produits de Qualité</h3>
            <p className="text-gray-600 leading-relaxed">Sélection soigneuse de produits premium de haute qualité</p>
          </div>
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
            <div className="bg-gradient-to-br from-green-500 to-green-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-800">Meilleurs Prix</h3>
            <p className="text-gray-600 leading-relaxed">Prix compétitifs avec des offres et réductions exclusives</p>
          </div>
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-gray-800">Livraison Rapide</h3>
            <p className="text-gray-600 leading-relaxed">Expédition ultra-rapide directement chez vous</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-b from-gray-50 to-gray-100 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">Acheter par Catégorie</h2>
          <p className="text-center text-gray-600 mb-12 text-lg">Explorez notre large gamme de produits</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Link
                key={category.key}
                to={`/products?category=${category.key}`}
                className="bg-white p-8 rounded-xl text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-blue-500 group"
              >
                <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{categoryLabels[category.key]}</h3>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {!user && (
        <div className="container mx-auto px-4 py-20">
          <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-3xl p-16 text-center overflow-hidden shadow-2xl">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-300 rounded-full mix-blend-overlay filter blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6">Prêt à Commencer vos Achats ?</h2>
              <p className="text-xl md:text-2xl mb-10 text-blue-50">Rejoignez des milliers de clients satisfaits et profitez d'offres exclusives !</p>
              <Link
                to="/register"
                className="bg-white text-blue-600 px-12 py-5 rounded-xl font-bold hover:bg-gray-100 transition transform hover:scale-105 inline-block shadow-2xl text-lg"
              >
                Créer un Compte Gratuit
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
