const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Application E-Commerce</h3>
            <p className="text-gray-400">
              Projet Full Stack développé dans le cadre du module Sécurité des Applications Web Modernes.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Technologies</h3>
            <ul className="space-y-2 text-gray-400">
              <li>React.js + Vite</li>
              <li>Node.js + Express</li>
              <li>MongoDB Atlas</li>
              <li>JWT Authentication</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Réalisé par</h3>
            <p className="text-gray-400">Reda El Hadfi</p>
            <p className="text-gray-400">Module: Sécurité Web</p>
            <p className="text-gray-400 text-sm mt-2">Année universitaire 2025-2026</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2026 Projet Académique - Full Stack E-Commerce Application</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
