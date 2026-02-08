require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Product.deleteMany();
    console.log('Cleared existing data');

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });

    const user = await User.create({
      name: 'Jean Dupont',
      email: 'user@example.com',
      password: 'user123',
      role: 'user'
    });

    console.log('Created users');

    const products = [
      {
        name: 'Ordinateur Portable Pro 15',
        description: 'Ordinateur portable haute performance avec 16 Go de RAM et 512 Go SSD. Idéal pour les développeurs et créateurs de contenu.',
        price: 1299.99,
        category: 'Electronics',
        stock: 25,
        featured: true,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
        createdBy: admin._id
      },
      {
        name: 'Souris Sans Fil Ergonomique',
        description: 'Souris sans fil ergonomique avec suivi de précision et longue autonomie de batterie.',
        price: 29.99,
        category: 'Electronics',
        stock: 150,
        featured: false,
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
        createdBy: admin._id
      },
      {
        name: 'Clavier Mécanique RGB',
        description: 'Clavier mécanique rétroéclairé RGB avec switches bleus. Parfait pour le gaming et la frappe rapide.',
        price: 89.99,
        category: 'Electronics',
        stock: 45,
        featured: false,
        image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400',
        createdBy: admin._id
      },
      {
        name: 'Montre Connectée Sport',
        description: 'Montre connectée avec capteur cardiaque, GPS et suivi d\'activité. Résistante à l\'eau.',
        price: 199.99,
        category: 'Electronics',
        stock: 40,
        featured: true,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
        createdBy: admin._id
      },
      {
        name: 'Écouteurs Bluetooth Premium',
        description: 'Écouteurs sans fil avec réduction de bruit active et qualité audio exceptionnelle. Autonomie de 30 heures.',
        price: 149.99,
        category: 'Electronics',
        stock: 60,
        featured: true,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        createdBy: admin._id
      },
      {
        name: 'Tablette Numérique 10 pouces',
        description: 'Tablette avec écran HD 10 pouces, processeur rapide et 64 Go de stockage. Parfaite pour le divertissement.',
        price: 349.99,
        category: 'Electronics',
        stock: 30,
        featured: false,
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
        createdBy: admin._id
      },
      {
        name: 'Webcam HD 1080p',
        description: 'Webcam haute définition 1080p avec microphone intégré. Idéale pour les visioconférences.',
        price: 59.99,
        category: 'Electronics',
        stock: 80,
        featured: false,
        image: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=400',
        createdBy: admin._id
      },
      {
        name: 'Disque Dur Externe 1 To',
        description: 'Disque dur externe portable USB 3.0 avec 1 To de capacité. Compact et fiable pour vos sauvegardes.',
        price: 69.99,
        category: 'Electronics',
        stock: 90,
        featured: false,
        image: 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=400',
        createdBy: admin._id
      },
      {
        name: 'T-Shirt Coton Classique',
        description: 'T-shirt en coton confortable disponible en plusieurs couleurs. Pré-rétréci et durable.',
        price: 19.99,
        category: 'Clothing',
        stock: 200,
        featured: false,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
        createdBy: admin._id
      },
      {
        name: 'Jean Slim Homme',
        description: 'Jean slim coupe moderne en denim stretch. Confortable et élégant pour toutes les occasions.',
        price: 49.99,
        category: 'Clothing',
        stock: 120,
        featured: false,
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
        createdBy: admin._id
      },
      {
        name: 'Veste d\'Hiver Chaude',
        description: 'Veste d\'hiver imperméable avec doublure en polaire. Protection optimale contre le froid et la pluie.',
        price: 129.99,
        category: 'Clothing',
        stock: 55,
        featured: true,
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
        createdBy: admin._id
      },
      {
        name: 'Robe d\'Été Fleurie',
        description: 'Robe légère à motifs fleuris, parfaite pour les journées estivales. Tissu respirant et agréable.',
        price: 39.99,
        category: 'Clothing',
        stock: 85,
        featured: false,
        image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400',
        createdBy: admin._id
      },
      {
        name: 'Pull en Laine Mérinos',
        description: 'Pull en laine mérinos douce et chaude. Coupe classique qui ne se démode jamais.',
        price: 79.99,
        category: 'Clothing',
        stock: 65,
        featured: false,
        image: 'https://images.unsplash.com/photo-1434389677669-e08b4cda3a00?w=400',
        createdBy: admin._id
      },
      {
        name: 'Chaussettes Sport (lot de 5)',
        description: 'Lot de 5 paires de chaussettes de sport en coton renforcé. Respirantes et confortables.',
        price: 14.99,
        category: 'Clothing',
        stock: 300,
        featured: false,
        image: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=400',
        createdBy: admin._id
      },
      {
        name: 'Casquette Tendance',
        description: 'Casquette ajustable au style moderne. Protection solaire avec un look décontracté.',
        price: 24.99,
        category: 'Clothing',
        stock: 110,
        featured: false,
        image: 'https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=400',
        createdBy: admin._id
      },
      {
        name: 'Guide JavaScript Moderne',
        description: 'Guide complet de la programmation JavaScript moderne. Couvre les fonctionnalités ES6+ et les bonnes pratiques.',
        price: 39.99,
        category: 'Books',
        stock: 80,
        featured: true,
        image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
        createdBy: admin._id
      },
      {
        name: 'Le Petit Prince',
        description: 'Chef-d\'oeuvre de la littérature française par Antoine de Saint-Exupéry. Édition illustrée de luxe.',
        price: 15.99,
        category: 'Books',
        stock: 150,
        featured: false,
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
        createdBy: admin._id
      },
      {
        name: 'Apprendre React en 30 Jours',
        description: 'Guide pratique pour maîtriser React.js en un mois. Projets concrets et exercices progressifs.',
        price: 34.99,
        category: 'Books',
        stock: 70,
        featured: false,
        image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
        createdBy: admin._id
      },
      {
        name: 'Atlas du Monde Illustré',
        description: 'Atlas géographique complet avec cartes détaillées et informations sur chaque pays du monde.',
        price: 45.99,
        category: 'Books',
        stock: 40,
        featured: false,
        image: 'https://images.unsplash.com/photo-1553729459-afe8f2e2ed65?w=400',
        createdBy: admin._id
      },
      {
        name: 'Cuisine Marocaine Traditionnelle',
        description: 'Recettes authentiques du Maroc avec instructions détaillées. Tajines, couscous et pâtisseries.',
        price: 29.99,
        category: 'Books',
        stock: 55,
        featured: false,
        image: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400',
        createdBy: admin._id
      },
      {
        name: 'Introduction à la Cybersécurité',
        description: 'Manuel complet sur les fondamentaux de la cybersécurité. Menaces, défenses et bonnes pratiques.',
        price: 49.99,
        category: 'Books',
        stock: 35,
        featured: true,
        image: 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=400',
        createdBy: admin._id
      },
      {
        name: 'Roman Policier: L\'Ombre du Doute',
        description: 'Thriller captivant plein de suspense et de rebondissements. Un page-turner impossible à lâcher.',
        price: 12.99,
        category: 'Books',
        stock: 95,
        featured: false,
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
        createdBy: admin._id
      },
      {
        name: 'Fauteuil de Bureau Ergonomique',
        description: 'Fauteuil de bureau ergonomique avec support lombaire et hauteur réglable. Confortable pour de longues heures de travail.',
        price: 249.99,
        category: 'Home',
        stock: 30,
        featured: true,
        image: 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=400',
        createdBy: admin._id
      },
      {
        name: 'Lampe de Bureau LED',
        description: 'Lampe de bureau LED moderne avec luminosité et température de couleur réglables.',
        price: 45.99,
        category: 'Home',
        stock: 60,
        featured: false,
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400',
        createdBy: admin._id
      },
      {
        name: 'Cafetière Programmable',
        description: 'Cafetière programmable avec carafe thermique. Prépare 12 tasses de café parfait.',
        price: 129.99,
        category: 'Home',
        stock: 35,
        featured: false,
        image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400',
        createdBy: admin._id
      },
      {
        name: 'Set de Casseroles Inox',
        description: 'Set complet de 5 casseroles en acier inoxydable avec couvercles. Compatible tous feux dont induction.',
        price: 89.99,
        category: 'Home',
        stock: 25,
        featured: false,
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
        createdBy: admin._id
      },
      {
        name: 'Aspirateur Robot Intelligent',
        description: 'Aspirateur robot avec navigation intelligente et commande par application. Nettoyage automatique programmable.',
        price: 299.99,
        category: 'Home',
        stock: 15,
        featured: true,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400',
        createdBy: admin._id
      },
      {
        name: 'Coussin Décoratif Velours',
        description: 'Coussin décoratif en velours doux. Ajoute une touche d\'élégance à votre intérieur.',
        price: 22.99,
        category: 'Home',
        stock: 140,
        featured: false,
        image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400',
        createdBy: admin._id
      },
      {
        name: 'Miroir Mural Design',
        description: 'Miroir mural rond avec cadre en métal doré. Diamètre 60 cm. Élégant et moderne.',
        price: 79.99,
        category: 'Home',
        stock: 20,
        featured: false,
        image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=400',
        createdBy: admin._id
      },
      {
        name: 'Chaussures de Course Légères',
        description: 'Chaussures de course légères avec excellent amorti et matière respirante. Confort optimal.',
        price: 79.99,
        category: 'Sports',
        stock: 100,
        featured: false,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
        createdBy: admin._id
      },
      {
        name: 'Tapis de Yoga Premium',
        description: 'Tapis de yoga antidérapant avec rembourrage extra. Écologique et durable.',
        price: 34.99,
        category: 'Sports',
        stock: 75,
        featured: false,
        image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400',
        createdBy: admin._id
      },
      {
        name: 'Haltères Réglables 20 kg',
        description: 'Paire d\'haltères réglables de 2 à 20 kg. Système de verrouillage rapide et sécurisé.',
        price: 159.99,
        category: 'Sports',
        stock: 20,
        featured: true,
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400',
        createdBy: admin._id
      },
      {
        name: 'Ballon de Football Professionnel',
        description: 'Ballon de football taille 5, cousu main. Revêtement en PU de haute qualité pour un contrôle optimal.',
        price: 39.99,
        category: 'Sports',
        stock: 50,
        featured: false,
        image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400',
        createdBy: admin._id
      },
      {
        name: 'Raquette de Tennis Carbone',
        description: 'Raquette de tennis en fibre de carbone. Légère et puissante avec un excellent sweet spot.',
        price: 119.99,
        category: 'Sports',
        stock: 35,
        featured: false,
        image: 'https://images.unsplash.com/photo-1617083934551-ac1f1c240d00?w=400',
        createdBy: admin._id
      },
      {
        name: 'Sac de Sport Grande Capacité',
        description: 'Sac de sport spacieux avec compartiment chaussures séparé. Bandoulière réglable et poignées renforcées.',
        price: 44.99,
        category: 'Sports',
        stock: 65,
        featured: false,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
        createdBy: admin._id
      },
      {
        name: 'Robot Éducatif Programmable',
        description: 'Robot éducatif pour apprendre la programmation en s\'amusant. Compatible avec Scratch et Python.',
        price: 89.99,
        category: 'Toys',
        stock: 40,
        featured: true,
        image: 'https://images.unsplash.com/photo-1535378620166-273708d44e4c?w=400',
        createdBy: admin._id
      },
      {
        name: 'Puzzle 1000 Pièces',
        description: 'Puzzle de 1000 pièces représentant un paysage magnifique. Parfait pour les soirées en famille.',
        price: 19.99,
        category: 'Toys',
        stock: 90,
        featured: false,
        image: 'https://images.unsplash.com/photo-1494059980473-813e73ee784b?w=400',
        createdBy: admin._id
      },
      {
        name: 'Jeu de Construction Créatif',
        description: 'Set de construction avec 500 pièces colorées. Stimule la créativité et la motricité fine des enfants.',
        price: 34.99,
        category: 'Toys',
        stock: 70,
        featured: false,
        image: 'https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=400',
        createdBy: admin._id
      },
      {
        name: 'Peluche Géante Ours',
        description: 'Peluche ours géante de 80 cm en tissu ultra-doux. Le compagnon idéal pour les petits.',
        price: 29.99,
        category: 'Toys',
        stock: 50,
        featured: false,
        image: 'https://images.unsplash.com/photo-1559715541-5daf8a0296d0?w=400',
        createdBy: admin._id
      },
      {
        name: 'Kit de Magie pour Enfants',
        description: 'Coffret de magie avec 50 tours expliqués pas à pas. Pour les apprentis magiciens dès 8 ans.',
        price: 24.99,
        category: 'Toys',
        stock: 0,
        featured: false,
        image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=400',
        createdBy: admin._id
      },
      {
        name: 'Sac à Dos Voyage',
        description: 'Sac à dos de voyage spacieux avec compartiments multiples et housse pour ordinateur portable.',
        price: 59.99,
        category: 'Other',
        stock: 55,
        featured: false,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
        createdBy: admin._id
      },
      {
        name: 'Lunettes de Soleil Polarisées',
        description: 'Lunettes de soleil avec verres polarisés UV400. Design élégant et monture légère.',
        price: 34.99,
        category: 'Other',
        stock: 85,
        featured: false,
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
        createdBy: admin._id
      },
      {
        name: 'Bouteille Isotherme 750 ml',
        description: 'Bouteille isotherme en acier inoxydable. Garde vos boissons chaudes 12h et froides 24h.',
        price: 27.99,
        category: 'Other',
        stock: 130,
        featured: false,
        image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
        createdBy: admin._id
      },
      {
        name: 'Parapluie Compact Automatique',
        description: 'Parapluie compact avec ouverture et fermeture automatique. Résistant au vent et ultra-léger.',
        price: 18.99,
        category: 'Other',
        stock: 0,
        featured: false,
        image: 'https://images.unsplash.com/photo-1534309466160-70b22cc6254d?w=400',
        createdBy: admin._id
      }
    ];

    await Product.insertMany(products);
    console.log(`Created ${products.length} products`);

    console.log('\nDatabase seeded successfully!');
    console.log(`\nTotal: ${products.length} products across all categories`);
    console.log('\nLogin credentials:');
    console.log('   Admin: admin@example.com / admin123');
    console.log('   User:  user@example.com / user123\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
