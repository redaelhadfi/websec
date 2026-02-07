# Documentation Technique - Application E-Commerce Full Stack

**Projet réalisé par :** Reda El Hadfi  
**Module :** Sécurité des Applications Web Modernes  
**Date :** Février 2026

---

## 📋 Résumé Exécutif

Cette documentation présente une application web Full Stack complète de gestion de produits e-commerce. Le projet met en œuvre les meilleures pratiques de sécurité des applications web modernes, incluant l'authentification sécurisée, la gestion des rôles, la validation des données, et la protection contre les vulnérabilités courantes (injection SQL/NoSQL, XSS, CSRF).

L'application offre une interface utilisateur moderne et responsive avec des fonctionnalités avancées de recherche, filtrage, tri et pagination. Elle intègre également un tableau de bord administrateur avec des statistiques en temps réel.

---

## 🏗️ Architecture Technique Détaillée

### 1. Architecture Globale

L'application suit une architecture **client-serveur** en **3 tiers** qui sépare clairement les responsabilités :

#### **Tier 1 : Couche Présentation (Frontend)**
- **Technologies** : React.js 18.3.1, Vite 7.3.1, TailwindCSS 3.4.1
- **Responsabilités** :
  - Interface utilisateur interactive et responsive
  - Gestion de l'état de l'application (Context API)
  - Validation côté client
  - Communication avec le backend via API REST
  - Routage côté client (React Router v6)
- **Sécurité** :
  - Sanitization des entrées utilisateur
  - Protection contre XSS via React (échappement automatique)
  - Stockage sécurisé des tokens JWT dans localStorage
  - Gestion des sessions utilisateur

#### **Tier 2 : Couche Logique Métier (Backend)**
- **Technologies** : Node.js, Express.js 5.2.1
- **Responsabilités** :
  - API RESTful avec endpoints sécurisés
  - Authentification et autorisation (JWT)
  - Validation des données entrantes
  - Logique métier et règles de gestion
  - Gestion des fichiers uploadés
  - Journalisation des activités
- **Sécurité** :
  - Middleware d'authentification JWT
  - Middleware d'autorisation basée sur les rôles
  - Validation stricte avec Express Validator
  - Protection contre les injections NoSQL
  - Limitation de taille des fichiers uploadés
  - CORS configuré de manière restrictive

#### **Tier 3 : Couche Données (Database)**
- **Technologies** : MongoDB Atlas (Cloud), Mongoose 9.1.5 (ODM)
- **Responsabilités** :
  - Stockage persistant des données
  - Indexation pour performances optimales
  - Validation au niveau schéma
  - Relations entre collections
- **Sécurité** :
  - Connexion chiffrée (TLS/SSL)
  - Validation des schémas Mongoose
  - Protection contre les injections via paramétrage
  - Hashage des mots de passe avant stockage

### 2. Schéma Détaillé de la Base de Données

#### Collection `users`

Cette collection stocke les informations des utilisateurs de l'application.

```javascript
{
  _id: ObjectId,                    // Identifiant unique MongoDB
  name: {
    type: String,
    required: [true, 'Le nom est obligatoire'],
    minlength: [2, 'Le nom doit contenir au moins 2 caractères'],
    maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'L\'email est obligatoire'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 
            'Veuillez fournir un email valide']
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est obligatoire'],
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
    select: false                    // Non retourné par défaut dans les requêtes
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'admin'],
      message: 'Le rôle doit être "user" ou "admin"'
    },
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

**Sécurité implémentée :**
- Mot de passe hashé avec bcrypt (10 salt rounds) avant sauvegarde
- Email validé avec regex pour éviter les injections
- `select: false` sur le password pour éviter les fuites accidentelles
- Index unique sur l'email pour éviter les doublons

**Méthodes du modèle :**
```javascript
// Méthode pour comparer les mots de passe
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
}

// Hook pre-save pour hasher le mot de passe
UserSchema.pre('save', async function() {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});
```

#### Collection `products`

Cette collection stocke les produits du catalogue e-commerce.

```javascript
{
  _id: ObjectId,                    // Identifiant unique MongoDB
  name: {
    type: String,
    required: [true, 'Le nom du produit est obligatoire'],
    minlength: [3, 'Le nom doit contenir au moins 3 caractères'],
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'La description est obligatoire'],
    minlength: [10, 'La description doit contenir au moins 10 caractères'],
    maxlength: [1000, 'La description ne peut pas dépasser 1000 caractères']
  },
  price: {
    type: Number,
    required: [true, 'Le prix est obligatoire'],
    min: [0, 'Le prix ne peut pas être négatif']
  },
  category: {
    type: String,
    required: [true, 'La catégorie est obligatoire'],
    enum: {
      values: ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Toys', 'Other'],
      message: 'Catégorie invalide'
    }
  },
  stock: {
    type: Number,
    required: [true, 'Le stock est obligatoire'],
    min: [0, 'Le stock ne peut pas être négatif'],
    default: 0
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/400x300?text=No+Image'
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}
```

**Sécurité implémentée :**
- Validation stricte de toutes les entrées
- Énumérations pour limiter les valeurs possibles
- Référence au créateur pour traçabilité
- Timestamps automatiques pour audit

**Hooks du modèle :**
```javascript
// Hook pre-save pour mettre à jour le timestamp
ProductSchema.pre('save', function() {
  this.updatedAt = Date.now();
});
```

### 3. Relations entre Collections

```
User (1) ----< (N) Products
   |_id          |_createdBy
```

- **Type de relation** : One-to-Many (Un-à-Plusieurs)
- **Description** : Un utilisateur (admin) peut créer plusieurs produits
- **Implémentation** : Référence via `createdBy` pointant vers `User._id`
- **Population** : Utilisation de `.populate('createdBy', 'name email')` pour récupérer les informations du créateur

### 4. Index et Performances

**Index créés automatiquement :**
- `_id` : Index unique sur tous les documents (MongoDB par défaut)
- `email` : Index unique sur User.email (évite les doublons)

**Index recommandés pour production :**
```javascript
// Sur Product
db.products.createIndex({ name: "text", description: "text" });  // Recherche textuelle
db.products.createIndex({ category: 1 });                        // Filtrage par catégorie
db.products.createIndex({ price: 1 });                           // Tri par prix
db.products.createIndex({ createdAt: -1 });                      // Tri par date

// Sur User
db.users.createIndex({ email: 1 });                              // Déjà créé (unique)
```

---

## 🔐 Sécurité des Applications Web - Implémentation Détaillée

Cette section détaille toutes les mesures de sécurité implémentées conformément aux standards OWASP et aux meilleures pratiques de sécurité des applications web modernes.

### 1. Authentification et Gestion des Sessions

#### 1.1 Système d'Authentification JWT (JSON Web Token)

**Flux d'authentification détaillé :**

```
┌─────────┐                ┌──────────┐                ┌──────────┐
│ Client  │                │ Backend  │                │ Database │
└────┬────┘                └────┬─────┘                └────┬─────┘
     │                          │                           │
     │ 1. POST /auth/login      │                           │
     │ {email, password}        │                           │
     ├─────────────────────────>│                           │
     │                          │                           │
     │                          │ 2. Query User            │
     │                          ├──────────────────────────>│
     │                          │                           │
     │                          │ 3. User Data + Hash      │
     │                          │<──────────────────────────┤
     │                          │                           │
     │                          │ 4. bcrypt.compare()      │
     │                          │    (password, hash)      │
     │                          │                           │
     │                          │ 5. Generate JWT          │
     │                          │    jwt.sign({id}, secret)│
     │                          │                           │
     │ 6. {token, user}         │                           │
     │<─────────────────────────┤                           │
     │                          │                           │
     │ 7. Store in localStorage │                           │
     │                          │                           │
     │ 8. All future requests   │                           │
     │ Authorization: Bearer token                          │
     ├─────────────────────────>│                           │
     │                          │                           │
     │                          │ 9. Verify JWT            │
     │                          │    jwt.verify(token)     │
     │                          │                           │
     │ 10. Protected Resource   │                           │
     │<─────────────────────────┤                           │
     │                          │                           │
```

**Structure du JWT Token :**

```javascript
// Header
{
  "alg": "HS256",           // Algorithme de signature
  "typ": "JWT"              // Type de token
}

// Payload
{
  "id": "507f1f77bcf86cd799439011",  // User ID
  "iat": 1707350400,                  // Issued At (timestamp)
  "exp": 1709942400                   // Expiration (30 jours)
}

// Signature
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  SECRET_KEY
)
```

**Implémentation côté serveur :**

```javascript
// Génération du token
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,        // Clé secrète (minimum 32 caractères)
    { expiresIn: '30d' }           // Expiration du token
  );
};

// Middleware de protection des routes
exports.protect = async (req, res, next) => {
  let token;
  
  // 1. Extraction du token depuis l'en-tête Authorization
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Accès non autorisé. Veuillez vous connecter.'
    });
  }
  
  try {
    // 2. Vérification et décodage du token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Récupération de l'utilisateur depuis la BD
    req.user = await User.findById(decoded.id);
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur introuvable'
      });
    }
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token invalide ou expiré'
    });
  }
};
```

**Implémentation côté client :**

```javascript
// Configuration globale Axios
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token à chaque requête
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs d'authentification
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

#### 1.2 Hashage des Mots de Passe

**Algorithme utilisé : bcrypt**

Bcrypt est un algorithme de hashage adaptatif spécialement conçu pour les mots de passe :
- **Salt automatique** : Chaque hash est unique grâce à un salt aléatoire
- **Coût configurable** : Permet d'augmenter la difficulté avec le temps
- **Protection contre rainbow tables** : Le salt rend les attaques par tables pré-calculées inefficaces
- **Protection contre brute force** : Le coût élevé ralentit les tentatives

**Implémentation :**

```javascript
const bcrypt = require('bcryptjs');

// Configuration
const SALT_ROUNDS = 10;  // 2^10 itérations (environ 100ms par hash)

// Hook Mongoose pour hasher automatiquement
UserSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  
  // Génération du hash
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
});

// Méthode de comparaison sécurisée
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
```

**Exemple de hash généré :**
```
Mot de passe : "admin123"
Hash bcrypt  : $2a$10$N9qo8uLOickgx2ZMRZoMye.ILXMwkqsdbViVqILp7TZz5yBvKlSH2

Structure :
$2a    : Version de l'algorithme
$10    : Coût (2^10 itérations)
$N9qo8uLOickgx2ZMRZoMye : Salt (22 caractères)
ILXMwkqsdbViVqILp7TZz5yBvKlSH2 : Hash (31 caractères)
```

### 2. Autorisation Basée sur les Rôles (RBAC)

**Rôles définis dans l'application :**

| Rôle | Permissions | Restrictions |
|------|------------|--------------|
| **user** | • Consulter les produits<br>• Rechercher et filtrer<br>• Voir les détails<br>• Accéder à son profil | • Ne peut pas créer de produits<br>• Ne peut pas modifier de produits<br>• Ne peut pas supprimer de produits<br>• Pas d'accès au dashboard |
| **admin** | • Toutes les permissions "user"<br>• Créer des produits<br>• Modifier tous les produits<br>• Supprimer des produits<br>• Accès au dashboard<br>• Voir les statistiques | • Responsabilité complète sur le catalogue |

**Middleware d'autorisation :**

```javascript
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Le rôle "${req.user.role}" n'est pas autorisé à accéder à cette ressource`
      });
    }
    next();
  };
};
```

**Application sur les routes :**

```javascript
// Routes publiques (pas d'authentification requise)
router.get('/products', getProducts);
router.get('/products/:id', getProductById);

// Routes protégées - Admin uniquement
router.post('/products', 
  protect,                      // Vérifie l'authentification
  authorize('admin'),           // Vérifie le rôle admin
  validateProduct,              // Valide les données
  createProduct                 // Controller
);

router.put('/products/:id',
  protect,
  authorize('admin'),
  validateProduct,
  updateProduct
);

router.delete('/products/:id',
  protect,
  authorize('admin'),
  deleteProduct
);

router.get('/products/stats',
  protect,
  authorize('admin'),
  getProductStats
);
```

### 3. Validation des Données

La validation est effectuée à **deux niveaux** pour une sécurité maximale :

#### 3.1 Validation Côté Client (Frontend)

**Objectif :** Améliorer l'expérience utilisateur avec un feedback immédiat

```javascript
import { useForm } from 'react-hook-form';

const ProductForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const onSubmit = async (data) => {
    // Envoi au backend uniquement si validation OK
    await axios.post('/api/products', data);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('name', {
          required: 'Le nom est obligatoire',
          minLength: { value: 3, message: 'Minimum 3 caractères' },
          maxLength: { value: 100, message: 'Maximum 100 caractères' }
        })}
      />
      {errors.name && <span>{errors.name.message}</span>}
      
      <input
        type="number"
        {...register('price', {
          required: 'Le prix est obligatoire',
          min: { value: 0.01, message: 'Le prix doit être positif' },
          valueAsNumber: true
        })}
      />
      {errors.price && <span>{errors.price.message}</span>}
    </form>
  );
};
```

#### 3.2 Validation Côté Serveur (Backend)

**Objectif :** Sécurité réelle - jamais faire confiance au client

**Utilisation d'Express Validator :**

```javascript
const { body, validationResult } = require('express-validator');

// Règles de validation pour la création de produit
const productValidationRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Le nom est obligatoire')
    .isLength({ min: 3, max: 100 })
    .withMessage('Le nom doit contenir entre 3 et 100 caractères')
    .escape(),  // Protection XSS
    
  body('description')
    .trim()
    .notEmpty().withMessage('La description est obligatoire')
    .isLength({ min: 10, max: 1000 })
    .withMessage('La description doit contenir entre 10 et 1000 caractères')
    .escape(),
    
  body('price')
    .notEmpty().withMessage('Le prix est obligatoire')
    .isFloat({ min: 0.01 })
    .withMessage('Le prix doit être un nombre positif')
    .toFloat(),
    
  body('category')
    .notEmpty().withMessage('La catégorie est obligatoire')
    .isIn(['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Toys', 'Other'])
    .withMessage('Catégorie invalide'),
    
  body('stock')
    .notEmpty().withMessage('Le stock est obligatoire')
    .isInt({ min: 0 })
    .withMessage('Le stock doit être un entier positif')
    .toInt()
];

// Middleware de validation
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Erreurs de validation',
      errors: errors.array()
    });
  }
  next();
};

// Application
router.post('/products',
  protect,
  authorize('admin'),
  productValidationRules,    // Règles
  validate,                  // Vérification
  createProduct              // Controller
);
```

### 4. Protection contre les Vulnérabilités OWASP

#### 4.1 Injection NoSQL

**Vulnérabilité :**
```javascript
// ❌ DANGEREUX - Injection possible
const user = await User.findOne({ email: req.body.email });

// Si req.body.email = { $gt: "" }
// Retourne le premier utilisateur (bypass de l'authentification)
```

**Protection implémentée :**
```javascript
// ✅ SÉCURISÉ - Utilisation de Mongoose avec validation
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/  // Validation stricte
  }
});

// ✅ Validation des entrées
if (typeof email !== 'string') {
  return res.status(400).json({ message: 'Email invalide' });
}

// ✅ Paramétrage sécurisé
const user = await User.findOne({ email: email.toString() });
```

#### 4.2 Cross-Site Scripting (XSS)

**Protection côté Frontend (React) :**
```javascript
// ✅ React échappe automatiquement les variables
<h1>{product.name}</h1>  // Safe par défaut

// ❌ Utiliser dangerouslySetInnerHTML uniquement si nécessaire
<div dangerouslySetInnerHTML={{ __html: content }} />  // À éviter
```

**Protection côté Backend :**
```javascript
// ✅ Échappement avec express-validator
body('name').trim().escape()

// ✅ Sanitization manuelle si nécessaire
const sanitizedInput = input.replace(/[<>]/g, '');
```

#### 4.3 Cross-Site Request Forgery (CSRF)

**Protection implémentée :**
- Utilisation de tokens JWT dans les en-têtes (pas de cookies)
- SameSite cookies si utilisation de sessions
- Vérification de l'origine des requêtes avec CORS

```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.CLIENT_URL,  // URL spécifique du frontend
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

#### 4.4 Exposition de Données Sensibles

**Protection :**
```javascript
// ✅ Exclusion du mot de passe dans les réponses
UserSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// ✅ Select explicite
const user = await User.findById(id).select('-password');

// ✅ Variables d'environnement pour les secrets
JWT_SECRET=votre_secret_très_long_et_aléatoire_minimum_32_caractères
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
```

#### 4.5 Contrôle d'Accès Défaillant

**Protection :**
```javascript
// ✅ Vérification du propriétaire avant modification
const product = await Product.findById(req.params.id);

if (product.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
  return res.status(403).json({
    message: 'Non autorisé à modifier ce produit'
  });
}
```

### 5. Gestion Sécurisée des Fichiers

**Configuration Multer :**

```javascript
const multer = require('multer');
const path = require('path');

// Configuration du stockage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Nom unique pour éviter les collisions
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtrage des types de fichiers
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Type de fichier non autorisé. Seules les images sont acceptées.'), false);
  }
};

// Configuration finale
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024  // Limite à 5MB
  },
  fileFilter: fileFilter
});

// Application sur la route
router.post('/products',
  protect,
  authorize('admin'),
  upload.single('image'),    // Upload d'une seule image
  createProduct
);
```

**Protections implémentées :**
- ✅ Vérification du type MIME
- ✅ Limite de taille de fichier
- ✅ Noms de fichiers uniques (évite l'écrasement)
- ✅ Stockage dans un dossier dédié
- ✅ Pas d'exécution de fichiers uploadés

### 6. Gestion des Erreurs Sécurisée

**Mauvaise pratique - Exposition d'informations :**
```javascript
// ❌ Ne jamais faire cela en production
app.use((err, req, res, next) => {
  res.status(500).json({
    error: err.stack,        // Révèle la structure du code
    message: err.message,    // Peut révéler des infos sensibles
    query: req.query         // Peut contenir des données sensibles
  });
});
```

**Bonne pratique implémentée :**
```javascript
// ✅ Gestion d'erreurs sécurisée
app.use((err, req, res, next) => {
  console.error('[ERROR]', err);  // Log côté serveur uniquement
  
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Une erreur est survenue'
    : err.message;
  
  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});
```

### 7. Headers de Sécurité HTTP

**Recommandation : Utiliser Helmet.js**

```javascript
const helmet = require('helmet');

app.use(helmet());  // Active plusieurs protections

// Configuration personnalisée si nécessaire
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,  // Si embedding nécessaire
}));
```

**Headers ajoutés automatiquement :**
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=15552000`

## 📡 Documentation Complète de l'API REST

L'API REST suit les conventions REST et retourne toutes les réponses en format JSON avec une structure standardisée.

### Structure de Réponse Standard

```javascript
// Réponse réussie
{
  "success": true,
  "data": { /* données */ },
  "message": "Message de succès"
}

// Réponse d'erreur
{
  "success": false,
  "message": "Description de l'erreur",
  "errors": [ /* détails des erreurs */ ]
}
```

### 1. Routes d'Authentification (`/api/auth`)

#### POST /api/auth/register
**Description :** Créer un nouveau compte utilisateur

**Accès :** Public

**Requête :**
```json
{
  "name": "Reda El Hadfi",
  "email": "reda@example.com",
  "password": "SecurePass123!",
  "role": "user"
}
```

**Validation :**
- `name` : requis, 2-50 caractères
- `email` : requis, format email valide, unique
- `password` : requis, minimum 6 caractères
- `role` : optionnel, "user" ou "admin" (défaut: "user")

**Réponse (201) :**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Reda El Hadfi",
    "email": "reda@example.com",
    "role": "user",
    "createdAt": "2026-02-15T10:30:00.000Z"
  }
}
```

---

#### POST /api/auth/login
**Description :** Connexion d'un utilisateur existant

**Accès :** Public

**Requête :**
```json
{
  "email": "reda@example.com",
  "password": "SecurePass123!"
}
```

**Réponse (200) :**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Reda El Hadfi",
    "email": "reda@example.com",
    "role": "user"
  }
}
```

---

#### GET /api/auth/me
**Description :** Obtenir les informations de l'utilisateur connecté

**Accès :** Privé (authentification requise)

**En-têtes requis :**
```
Authorization: Bearer <token>
```

**Réponse (200) :**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Reda El Hadfi",
    "email": "reda@example.com",
    "role": "user"
  }
}
```

---

### 2. Routes Produits (`/api/products`)

#### GET /api/products
**Description :** Récupérer la liste des produits avec filtrage et pagination

**Accès :** Public

**Paramètres de requête :**

| Paramètre | Type | Description | Exemple |
|-----------|------|-------------|---------|
| `search` | string | Recherche dans nom et description | `?search=laptop` |
| `category` | string | Filtrer par catégorie | `?category=Electronics` |
| `minPrice` | number | Prix minimum | `?minPrice=100` |
| `maxPrice` | number | Prix maximum | `?maxPrice=1000` |
| `inStock` | boolean | Produits en stock uniquement | `?inStock=true` |
| `sort` | string | Tri (-price, name, -createdAt) | `?sort=-price` |
| `page` | number | Numéro de page | `?page=2` |
| `limit` | number | Résultats par page | `?limit=12` |

**Exemples :**
```bash
# Recherche "laptop" dans Electronics, triés par prix décroissant
GET /api/products?search=laptop&category=Electronics&sort=-price

# Produits entre 100€ et 500€, en stock
GET /api/products?minPrice=100&maxPrice=500&inStock=true
```

**Réponse (200) :**
```json
{
  "success": true,
  "count": 15,
  "pagination": {
    "page": 1,
    "limit": 12,
    "totalPages": 2,
    "totalResults": 15
  },
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "MacBook Pro 16\"",
      "description": "Laptop professionnel...",
      "price": 2499.99,
      "category": "Electronics",
      "stock": 10,
      "image": "uploads/macbook-1707350400000.jpg"
    }
  ]
}
```

---

#### GET /api/products/:id
**Description :** Récupérer les détails d'un produit spécifique

**Accès :** Public

**Réponse (200) :**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "MacBook Pro 16\"",
    "description": "Description complète...",
    "price": 2499.99,
    "category": "Electronics",
    "stock": 10,
    "image": "uploads/macbook.jpg",
    "createdBy": {
      "_id": "507f...",
      "name": "Admin User"
    }
  }
}
```

---

#### POST /api/products
**Description :** Créer un nouveau produit (Admin uniquement)

**Accès :** Privé - Admin

**En-têtes requis :**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Corps de la requête (FormData) :**
```javascript
formData.append('name', 'MacBook Pro 16"');
formData.append('description', 'Laptop professionnel...');
formData.append('price', '2499.99');
formData.append('category', 'Electronics');
formData.append('stock', '10');
formData.append('image', fileObject);
```

**Validation :**
- `name` : 3-100 caractères
- `description` : 10-1000 caractères
- `price` : nombre > 0
- `category` : Electronics, Clothing, Books, Home, Sports, Toys, Other
- `stock` : entier ≥ 0
- `image` : optionnel, jpeg/jpg/png/gif/webp, max 5MB

**Réponse (201) :**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "MacBook Pro 16\"",
    "price": 2499.99,
    "image": "uploads/image-123456789.jpg"
  }
}
```

---

#### PUT /api/products/:id
**Description :** Mettre à jour un produit existant (Admin uniquement)

**Accès :** Privé - Admin

**En-têtes requis :**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Corps de la requête :** Même format que POST, tous les champs optionnels

---

#### DELETE /api/products/:id
**Description :** Supprimer un produit (Admin uniquement)

**Accès :** Privé - Admin

**En-têtes requis :**
```
Authorization: Bearer <token>
```

**Réponse (200) :**
```json
{
  "success": true,
  "message": "Produit supprimé avec succès"
}
```

---

#### GET /api/products/stats/dashboard
**Description :** Obtenir les statistiques pour le dashboard admin

**Accès :** Privé - Admin

**Réponse (200) :**
```json
{
  "success": true,
  "data": {
    "totalProducts": 47,
    "totalValue": 125789.50,
    "averagePrice": 2676.37,
    "totalStock": 523,
    "outOfStock": 3,
    "lowStock": 8,
    "byCategory": [
      { "_id": "Electronics", "count": 15, "totalValue": 45000 }
    ]
  }
}
```

---

### 3. Codes de Statut HTTP

| Code | Signification | Utilisation |
|------|---------------|-------------|
| **200** | OK | Requête réussie (GET, PUT, DELETE) |
| **201** | Created | Ressource créée (POST) |
| **400** | Bad Request | Données invalides |
| **401** | Unauthorized | Token manquant/invalide |
| **403** | Forbidden | Rôle insuffisant |
| **404** | Not Found | Ressource introuvable |
| **409** | Conflict | Email déjà utilisé |
| **500** | Server Error | Erreur serveur |

## 🎯 Fonctionnalités Implémentées - Description Détaillée

### 1. Authentification et Gestion des Utilisateurs 🔐

#### Inscription (Register)
- Formulaire avec validation en temps réel
- Vérification de la complexité du mot de passe
- Détection des emails déjà utilisés
- Génération automatique du token JWT
- Redirection automatique vers le dashboard

**Flux d'inscription :**
1. L'utilisateur remplit le formulaire (nom, email, mot de passe, rôle)
2. Validation côté client avec React Hook Form
3. Envoi des données au backend avec Axios
4. Validation côté serveur avec Express Validator
5. Vérification de l'unicité de l'email dans MongoDB
6. Hashage du mot de passe avec bcrypt (10 rounds)
7. Création du document User dans MongoDB
8. Génération du token JWT (expiration 30 jours)
9. Retour du token et des infos utilisateur
10. Stockage du token dans localStorage
11. Mise à jour du contexte d'authentification
12. Redirection selon le rôle (admin → dashboard, user → products)

#### Connexion (Login)
- Interface intuitive avec feedback visuel
- Gestion des erreurs d'authentification
- Mémorisation de la session
- Protection contre les attaques par force brute

**Flux de connexion :**
1. Saisie email et mot de passe
2. Envoi au backend
3. Recherche de l'utilisateur par email
4. Comparaison sécurisée du mot de passe avec bcrypt
5. Génération du token JWT si authentification réussie
6. Stockage du token et redirection

#### Gestion de Session
- Vérification automatique du token à chaque requête
- Déconnexion automatique si token expiré/invalide
- Intercepteurs Axios pour gestion centralisée
- Redirection vers login si nécessaire

### 2. Gestion Complète des Produits (CRUD) 📦

#### Create - Création de Produit (Admin)
**Page :** `/admin/products/new`

**Fonctionnalités :**
- Formulaire multi-champs avec validation
- Upload d'image avec aperçu en temps réel
- Sélection de catégorie par dropdown
- Gestion du stock avec contrôle numérique
- Validation des prix (nombres positifs uniquement)
- Indicateur de progression de l'upload
- Messages de succès/erreur

**Champs du formulaire :**
- **Nom** : 3-100 caractères, obligatoire
- **Description** : 10-1000 caractères, obligatoire
- **Prix** : Nombre décimal > 0, obligatoire
- **Catégorie** : 7 choix prédéfinis, obligatoire
- **Stock** : Entier ≥ 0, obligatoire
- **Image** : JPEG/PNG/GIF/WEBP, max 5MB, optionnel

**Processus de création :**
1. Admin remplit le formulaire
2. Sélection d'une image → aperçu immédiat
3. Validation côté client avant envoi
4. Envoi FormData avec token JWT
5. Validation côté serveur
6. Upload et stockage de l'image
7. Création du document Product dans MongoDB
8. Retour du produit créé avec URL de l'image
9. Affichage du message de succès
10. Redirection vers la liste des produits

#### Read - Consultation des Produits (Public)
**Page principale :** `/products`

**Fonctionnalités avancées :**

**1. Recherche textuelle**
- Barre de recherche en temps réel
- Recherche simultanée dans nom ET description
- Recherche insensible à la casse
- Utilisation de regex MongoDB pour correspondances partielles
- Mise en évidence des résultats

**2. Filtrage multiple**
- **Par catégorie** : Dropdown avec 7 catégories + "Toutes"
- **Par disponibilité** : Checkbox "En stock uniquement"
- **Par plage de prix** : Sliders min/max
  - Prix minimum : 0€ par défaut
  - Prix maximum : ajustable
  - Validation min < max

**3. Tri avancé**
- **Par prix** : Croissant/Décroissant
- **Par nom** : Alphabétique A-Z / Z-A
- **Par date** : Plus récents d'abord / Plus anciens
- **Par stock** : Stock élevé/faible en premier
- Indicateur visuel du tri actif

**4. Pagination intelligente**
- 12 produits par page (configurable)
- Navigation Previous/Next
- Numéros de pages cliquables
- Affichage "Page X sur Y"
- Compteur total de résultats
- Désactivation des boutons aux extrémités
- Préservation des filtres entre les pages

**5. Affichage des cartes produit**
- Image responsive avec fallback
- Nom du produit (tronqué si long)
- Prix formaté en euros
- Badge de catégorie coloré
- Indicateur de stock (couleur verte/rouge)
- Bouton "Voir détails" avec hover effect
- Animation au survol

#### Update - Modification de Produit (Admin)
**Page :** `/admin/products/edit/:id`

**Fonctionnalités :**
- Pré-remplissage automatique du formulaire
- Modification partielle (uniquement les champs changés)
- Changement d'image avec préservation de l'ancienne
- Aperçu de l'image actuelle
- Confirmation avant sauvegarde
- Gestion des erreurs de validation

**Processus de modification :**
1. Récupération du produit existant
2. Affichage du formulaire pré-rempli
3. Admin modifie les champs souhaités
4. Option de changer l'image
5. Soumission avec token JWT
6. Validation côté serveur
7. Mise à jour dans MongoDB (champs modifiés uniquement)
8. Si nouvelle image : suppression ancienne + upload nouvelle
9. Retour du produit mis à jour
10. Redirection vers page de détail

#### Delete - Suppression de Produit (Admin)
**Localisation :** Bouton "Supprimer" dans liste et détail

**Fonctionnalités :**
- Modal de confirmation avant suppression
- Affichage du nom du produit à supprimer
- Boutons Annuler / Confirmer
- Suppression de l'image associée du serveur
- Suppression du document MongoDB
- Feedback de succès
- Redirection vers liste

**Processus de suppression :**
1. Admin clique sur "Supprimer"
2. Ouverture modal de confirmation
3. Affichage détails du produit
4. Clic sur "Confirmer la suppression"
5. Envoi requête DELETE avec token
6. Vérification des droits admin
7. Suppression du fichier image (fs.unlink)
8. Suppression du document MongoDB
9. Message de succès
10. Mise à jour de la liste (refresh)

### 3. Interface Utilisateur Moderne 🎨

#### Design System
- **Framework CSS** : TailwindCSS 3.4.1
- **Palette de couleurs** :
  - Primaire : Bleu (#3B82F6)
  - Secondaire : Violet (#8B5CF6)
  - Succès : Vert (#10B981)
  - Danger : Rouge (#EF4444)
  - Neutre : Gris (#6B7280)
- **Typographie** :
  - Font principale : Inter, system-ui, sans-serif
  - Tailles adaptatives : text-sm à text-4xl
  - Poids : font-normal, font-medium, font-bold

#### Responsive Design
- **Mobile First** : Design optimisé mobile d'abord
- **Breakpoints** :
  - Mobile : < 640px
  - Tablet : 640px - 1024px
  - Desktop : > 1024px
- **Grilles adaptatives** :
  - Mobile : 1 colonne
  - Tablet : 2 colonnes
  - Desktop : 3-4 colonnes

#### Animations et Transitions
- **Animations CSS** :
  - Fade-in au chargement (opacity 0 → 1)
  - Slide-in pour les modals
  - Scale au hover des cartes (transform: scale(1.05))
  - Rotation des icônes
- **Transitions fluides** :
  - duration-300 pour effets rapides
  - ease-in-out pour courbes naturelles
- **Effets de hover** :
  - Changement de couleur
  - Élévation (box-shadow)
  - Transformation de taille

#### Feedback Visuel
- **États de chargement** :
  - Spinners animés
  - Skeleton loaders
  - Texte "Chargement..."
- **Messages de succès** :
  - Toast notifications (coin supérieur droit)
  - Icône verte avec checkmark
  - Auto-dismiss après 3 secondes
- **Messages d'erreur** :
  - Affichage sous les champs concernés
  - Couleur rouge avec icône d'alerte
  - Bordure rouge sur inputs invalides
- **États désactivés** :
  - Opacité réduite (opacity-50)
  - Curseur not-allowed
  - Désactivation des interactions

### 4. Dashboard Administrateur 📊

#### Statistiques Globales (Cards)
**Premier niveau d'information :**

1. **Total Produits**
   - Nombre total de produits en base
   - Icône : 📦
   - Couleur : Bleu

2. **Valeur Totale**
   - Somme de (prix × stock) de tous les produits
   - Format : Euros avec 2 décimales
   - Icône : 💰
   - Couleur : Vert

3. **Prix Moyen**
   - Moyenne arithmétique des prix
   - Indicateur de positionnement gamme
   - Icône : 📈
   - Couleur : Violet

4. **Stock Total**
   - Somme de tous les stocks
   - Indicateur de capacité d'inventaire
   - Icône : 📊
   - Couleur : Orange

#### Alertes et Indicateurs
**Deuxième niveau d'information :**

1. **Produits en Rupture de Stock**
   - Compteur de produits avec stock = 0
   - Badge rouge si > 0
   - Liste déroulante des produits concernés
   - Action rapide : "Réapprovisionner"

2. **Stock Faible (< 10 unités)**
   - Compteur de produits nécessitant réapprovisionnement
   - Badge jaune/orange
   - Liste avec quantités restantes
   - Tri par urgence (stock croissant)

#### Distribution par Catégorie
**Visualisation :**
- Tableau avec colonnes : Catégorie, Nombre, Valeur
- Tri par nombre de produits (décroissant)
- Pourcentage de la catégorie sur le total
- Barre de progression visuelle
- Couleurs différentes par catégorie

**Données affichées :**
```
Electronics   : 15 produits (32%) - 45 000€
Clothing      : 12 produits (26%) - 8 500€
Books         : 20 produits (43%) - 2 300€
```

#### Produits Récents
- Liste des 5 derniers produits ajoutés
- Miniature de l'image
- Nom, prix, catégorie
- Date d'ajout (format relatif : "il y a 2 jours")
- Boutons d'action rapide : Voir, Modifier, Supprimer

#### Actions Rapides
- Bouton "Ajouter un Produit" prominent
- Bouton "Exporter les Données" (CSV)
- Bouton "Rafraîchir les Stats"
- Filtres de période (Aujourd'hui, Semaine, Mois, Année)

### 5. Sécurité Implémentée en Profondeur 🔒

#### Protection contre les Injections
**NoSQL Injection :**
- Validation stricte des types de données
- Utilisation de Mongoose avec schémas typés
- Sanitization des entrées avec Express Validator
- Pas d'utilisation de `$where` ou `eval`

**Exemple de protection :**
```javascript
// ❌ Vulnérable
const user = await User.findOne({ email: req.body.email });

// ✅ Protégé
const email = validator.isEmail(req.body.email) ? req.body.email : null;
if (!email) return res.status(400).json({ error: 'Email invalide' });
const user = await User.findOne({ email: email });
```

#### Protection XSS (Cross-Site Scripting)
- Échappement automatique par React (dangerouslySetInnerHTML non utilisé)
- Sanitization avec `.escape()` d'Express Validator
- Content-Security-Policy headers
- Validation des types de fichiers uploadés

**Exemple :**
```javascript
// Entrée malveillante
name: "<script>alert('XSS')</script>"

// Après sanitization
name: "&lt;script&gt;alert(&#x27;XSS&#x27;)&lt;/script&gt;"
```

#### Protection CSRF (Cross-Site Request Forgery)
- Tokens JWT dans headers (pas de cookies)
- Vérification de l'origine avec CORS
- SameSite cookies si sessions utilisées
- Validation du header Authorization

#### Rate Limiting (Recommandé)
- Limitation à 100 requêtes/15 minutes par IP
- Protection contre brute force sur login
- Utilisation de express-rate-limit (à implémenter)

## 🛠️ Stack Technologique - Justification des Choix

### Frontend

#### React 18.3.1 - Library UI
**Raisons du choix :**
- **Popularité et Écosystème** : Bibliothèque la plus utilisée, grande communauté
- **Virtual DOM** : Performance optimale avec reconciliation intelligente
- **Composants Réutilisables** : Architecture modulaire et maintenable
- **Hooks** : Gestion d'état simplifiée (useState, useEffect, useContext)
- **Sécurité** : Échappement automatique des variables (protection XSS)

**Avantages sécurité :**
- Protection XSS par défaut
- Validation stricte des props
- Isolation des composants

#### Vite 7.3.1 - Build Tool
**Raisons du choix :**
- **Rapidité** : HMR (Hot Module Replacement) instantané
- **ES Modules** : Pas de bundling en développement
- **Performance** : Build optimisé avec Rollup
- **Developer Experience** : Configuration minimale

**Comparaison avec alternatives :**
- Webpack : Plus lent, configuration complexe
- Parcel : Moins de contrôle
- Create React App : Obsolète, lent

#### React Router v6 - Navigation
**Raisons du choix :**
- **Routing Déclaratif** : Routes définies en JSX
- **Nested Routes** : Hiérarchie d'URLs intuitive
- **Code Splitting** : Chargement lazy des pages
- **History API** : URLs propres sans #

**Fonctionnalités utilisées :**
- `<Routes>` et `<Route>` pour définition des routes
- `<Link>` et `<Navigate>` pour navigation
- `useNavigate()` pour navigation programmée
- `useParams()` pour récupération des paramètres d'URL
- `<Outlet>` pour nested routing

#### TailwindCSS 3.4.1 - Styling
**Raisons du choix :**
- **Utility-First** : Classes CSS atomiques réutilisables
- **Responsive Design** : Breakpoints intégrés (sm, md, lg, xl)
- **Customisation** : Configuration via tailwind.config.js
- **Purge CSS** : Suppression automatique des classes non utilisées
- **Performance** : Bundle CSS minimal en production

**Avantages :**
- Développement rapide
- Cohérence visuelle
- Pas de CSS custom à maintenir
- Optimisation automatique

#### Axios - HTTP Client
**Raisons du choix :**
- **Intercepteurs** : Ajout automatique du token JWT
- **Gestion des Erreurs** : Centralisée avec intercepteurs de réponse
- **Timeout** : Protection contre requêtes longues
- **Transformation** : Conversion automatique JSON
- **Support FormData** : Pour upload de fichiers

**Configuration sécurisée :**
```javascript
// Intercepteur requête : ajouter token
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Intercepteur réponse : gérer 401
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

#### React Hook Form - Validation de Formulaires
**Raisons du choix :**
- **Performance** : Pas de re-render inutiles
- **API Simple** : `register()` et `handleSubmit()`
- **Validation Intégrée** : Règles inline ou schémas
- **TypeScript** : Support natif du typage
- **Taille** : Très léger (9KB gzipped)

**Exemple d'utilisation :**
```javascript
const { register, handleSubmit, formState: { errors } } = useForm();

<input
  {...register('email', {
    required: 'Email obligatoire',
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Email invalide'
    }
  })}
/>
{errors.email && <span>{errors.email.message}</span>}
```

---

### Backend

#### Node.js - Runtime JavaScript
**Raisons du choix :**
- **JavaScript Fullstack** : Même langage front et back
- **Asynchrone** : Event Loop non-bloquant, idéal pour I/O
- **NPM** : Plus grand registre de packages
- **Performance** : Moteur V8 de Google
- **Écosystème** : Frameworks matures (Express, NestJS)

**Aspect sécurité :**
- Mises à jour régulières des vulnérabilités
- Large communauté détectant les failles

#### Express.js 5.2.1 - Framework Web
**Raisons du choix :**
- **Minimaliste** : Framework non-opinionated, flexible
- **Middleware** : Architecture modulaire et réutilisable
- **Routing** : Système de routes puissant
- **Maturité** : Utilisé en production depuis 10+ ans
- **Performance** : Léger et rapide

**Middlewares utilisés :**
1. `express.json()` - Parsing JSON
2. `cors()` - Gestion CORS
3. `protect` - Authentification JWT
4. `authorize()` - Autorisation par rôle
5. `upload.single()` - Upload fichiers
6. `validate` - Validation des données

#### MongoDB Atlas - Base de Données NoSQL
**Raisons du choix :**
- **Cloud Natif** : Hébergement managé, haute disponibilité
- **Flexible** : Schéma dynamique, adapté aux évolutions
- **Performance** : Indexation rapide, agrégations puissantes
- **Scalabilité** : Sharding horizontal automatique
- **Sécurité** : Chiffrement au repos et en transit

**Avantages pour ce projet :**
- Pas de migrations complexes
- Requêtes rapides sur grandes collections
- Agrégations pour statistiques dashboard
- Gestion des relations avec populate()

#### Mongoose 9.1.5 - ODM (Object Document Mapper)
**Raisons du choix :**
- **Schémas Typés** : Définition stricte des modèles
- **Validation** : Règles de validation déclaratives
- **Middleware** : Hooks pre/post save/update/delete
- **Relations** : Population de documents référencés
- **TypeScript** : Support du typage

**Schémas avec validation :**
```javascript
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email obligatoire'],
    unique: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Email invalide']
  },
  password: {
    type: String,
    required: [true, 'Mot de passe obligatoire'],
    minlength: [6, 'Minimum 6 caractères']
  }
});
```

#### JWT (JSON Web Token) - Authentification
**Raisons du choix :**
- **Stateless** : Pas de stockage serveur, scalable
- **Self-Contained** : Token contient les infos utilisateur
- **Sécurisé** : Signature HMAC empêche la falsification
- **Standard** : RFC 7519, interopérable
- **Performance** : Pas de requête BD à chaque vérification

**Structure JWT :**
```
Header.Payload.Signature
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.    ← Header (algorithme)
eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSJ9. ← Payload (user ID)
Yz3uTmj0pOi9X5JqN8zRkP2WvLbQsGhMtKdFwEcAaI     ← Signature (HMAC)
```

**Sécurité JWT :**
- Secret de 32+ caractères
- Expiration à 30 jours
- Stockage côté client (localStorage)
- Envoi dans header Authorization

#### Bcryptjs - Hashage de Mots de Passe
**Raisons du choix :**
- **Salt Automatique** : Chaque hash est unique
- **Coût Adaptatif** : Augmente la difficulté avec le temps
- **Résistance** : Protection contre rainbow tables et brute force
- **Pure JS** : Pas de dépendances natives (contrairement à bcrypt)

**Configuration :**
```javascript
const SALT_ROUNDS = 10;  // 2^10 itérations ≈ 100ms
const hash = await bcrypt.hash(password, SALT_ROUNDS);
```

**Sécurité :**
- Chaque hash prend ~100ms (ralentit le brute force)
- Salt aléatoire intégré dans le hash
- Impossible de retrouver le mot de passe original

#### Multer - Upload de Fichiers
**Raisons du choix :**
- **Middleware Express** : Intégration native
- **Validation** : Type MIME, taille, nombre de fichiers
- **Storage Configurable** : Disque, mémoire, cloud (S3)
- **Renommage** : Évite les collisions de noms

**Configuration sécurisée :**
```javascript
const upload = multer({
  storage: multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
      const uniqueName = Date.now() + '-' + Math.random();
      cb(null, uniqueName + path.extname(file.originalname));
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 },  // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non autorisé'));
    }
  }
});
```

#### Express Validator - Validation des Données
**Raisons du choix :**
- **Middleware Express** : Intégration fluide
- **Chaînable** : Règles de validation multiples
- **Sanitization** : Nettoyage des entrées (trim, escape)
- **Messages Personnalisés** : Erreurs explicites
- **Validation Complexe** : Custom validators

**Exemple complet :**
```javascript
const productValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Nom obligatoire')
    .isLength({ min: 3, max: 100 })
    .escape(),  // Protection XSS
  body('price')
    .notEmpty()
    .isFloat({ min: 0.01 })
    .withMessage('Prix doit être > 0')
    .toFloat(),
  body('email')
    .optional()
    .isEmail().normalizeEmail(),
  body('category')
    .isIn(['Electronics', 'Clothing', 'Books'])
];
```

#### CORS - Cross-Origin Resource Sharing
**Raisons du choix :**
- **Sécurité** : Contrôle des origines autorisées
- **Flexibilité** : Configuration par route
- **Credentials** : Support des cookies et JWT

**Configuration :**
```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

#### dotenv - Variables d'Environnement
**Raisons du choix :**
- **Sécurité** : Secrets hors du code source
- **Flexibilité** : Configuration par environnement (dev, prod)
- **Standard** : Pattern .env reconnu universellement

**Variables critiques :**
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=your_super_secret_minimum_32_characters_long
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
```

---

### Outils de Développement

#### ESLint - Linting JavaScript
- Détection d'erreurs avant exécution
- Respect des conventions de code
- Configuration React recommandée

#### Prettier - Formatage de Code
- Format automatique cohérent
- Intégration IDE (VS Code)
- Configuration partagée en équipe

#### Nodemon - Auto-Restart Backend
- Redémarrage automatique lors des modifications
- Surveillance des fichiers .js
- Accélération du développement

#### Vite Dev Server - HMR Frontend
- Hot Module Replacement instantané
- Pas de rechargement complet de la page
- Préservation de l'état de l'application

## 📦 Structure Détaillée du Projet

```
fullstack-app/
│
├── backend/                          # Serveur Node.js/Express
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js          # Configuration MongoDB
│   │   │   │                        # - Connexion Atlas avec Mongoose
│   │   │   │                        # - Gestion des événements (connected, error)
│   │   │   │                        # - Options de connexion sécurisées
│   │   │   └── seed.js              # Script de peuplement de la BD
│   │   │                            # - Création des utilisateurs par défaut
│   │   │                            # - Création de produits de test
│   │   │                            # - Nettoyage avant insertion
│   │   │
│   │   ├── models/
│   │   │   ├── User.js              # Modèle Utilisateur
│   │   │   │                        # - Schéma: name, email, password, role
│   │   │   │                        # - Validation: email unique, format email
│   │   │   │                        # - Hook pre-save: hashage du mot de passe
│   │   │   │                        # - Méthode comparePassword()
│   │   │   │                        # - Méthode toJSON() : exclut le password
│   │   │   │
│   │   │   └── Product.js           # Modèle Produit
│   │   │                            # - Schéma: name, description, price, category, stock, image
│   │   │                            # - Validation: prix > 0, stock >= 0
│   │   │                            # - Enum: catégories prédéfinies
│   │   │                            # - Référence: createdBy (User)
│   │   │                            # - Hook pre-save: mise à jour updatedAt
│   │   │                            # - Index: name (text), category, price
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js    # Contrôleur Authentification
│   │   │   │                        # - register(): Inscription utilisateur
│   │   │   │                        # - login(): Connexion et génération JWT
│   │   │   │                        # - getMe(): Récupération profil utilisateur
│   │   │   │
│   │   │   └── productController.js # Contrôleur Produits
│   │   │                            # - getProducts(): Liste avec filtres/pagination
│   │   │                            # - getProductById(): Détails d'un produit
│   │   │                            # - createProduct(): Création (admin)
│   │   │                            # - updateProduct(): Modification (admin)
│   │   │                            # - deleteProduct(): Suppression (admin)
│   │   │                            # - getProductStats(): Statistiques dashboard
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.js              # Middleware Authentification
│   │   │   │                        # - protect: Vérification JWT
│   │   │   │                        # - authorize(): Vérification des rôles
│   │   │   │                        # - Extraction du token depuis header
│   │   │   │                        # - Décodage et validation du token
│   │   │   │                        # - Ajout de req.user pour controllers
│   │   │   │
│   │   │   ├── validator.js         # Middleware Validation
│   │   │   │                        # - validateProduct: Règles produit
│   │   │   │                        # - validateAuth: Règles auth
│   │   │   │                        # - Gestion des erreurs de validation
│   │   │   │                        # - Formatage des messages d'erreur
│   │   │   │
│   │   │   └── upload.js            # Middleware Upload Fichiers
│   │   │                            # - Configuration Multer
│   │   │                            # - Stockage: disque local (uploads/)
│   │   │                            # - Renommage: timestamp + random
│   │   │                            # - Filtrage: types MIME autorisés
│   │   │                            # - Limite: 5MB par fichier
│   │   │
│   │   └── routes/
│   │       ├── authRoutes.js        # Routes Authentification
│   │       │                        # - POST /api/auth/register
│   │       │                        # - POST /api/auth/login
│   │       │                        # - GET /api/auth/me (protected)
│   │       │
│   │       └── productRoutes.js     # Routes Produits
│   │                                # - GET /api/products (public)
│   │                                # - GET /api/products/:id (public)
│   │                                # - POST /api/products (admin)
│   │                                # - PUT /api/products/:id (admin)
│   │                                # - DELETE /api/products/:id (admin)
│   │                                # - GET /api/products/stats (admin)
│   │
│   ├── uploads/                     # Dossier des fichiers uploadés
│   │   ├── .gitkeep                 # Préserve le dossier dans Git
│   │   └── [images...]              # Images des produits
│   │
│   ├── server.js                    # Point d'entrée du serveur
│   │                                # - Initialisation Express
│   │                                # - Configuration des middlewares globaux
│   │                                # - Connexion à MongoDB
│   │                                # - Enregistrement des routes
│   │                                # - Gestion des erreurs globale
│   │                                # - Démarrage du serveur (port 5000)
│   │
│   ├── .env                         # Variables d'environnement
│   │                                # - MONGODB_URI
│   │                                # - JWT_SECRET
│   │                                # - PORT
│   │                                # - NODE_ENV
│   │
│   ├── package.json                 # Dépendances backend
│   │                                # - express, mongoose, jsonwebtoken
│   │                                # - bcryptjs, multer, express-validator
│   │                                # - cors, dotenv
│   │
│   ├── DEPLOYMENT.md                # Guide de déploiement Render
│   └── MONGODB_ATLAS.md             # Guide de configuration MongoDB Atlas
│
└── frontend/                        # Application React
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx           # Barre de navigation
    │   │   │                        # - Logo et liens principaux
    │   │   │                        # - Menu utilisateur (si connecté)
    │   │   │                        # - Bouton déconnexion
    │   │   │                        # - Responsive: burger menu mobile
    │   │   │
    │   │   ├── Footer.jsx           # Pied de page
    │   │   │                        # - Copyright
    │   │   │                        # - Liens légaux
    │   │   │                        # - Réseaux sociaux
    │   │   │
    │   │   ├── ProductCard.jsx      # Carte produit
    │   │   │                        # - Affichage image
    │   │   │                        # - Nom, prix, catégorie
    │   │   │                        # - Badge stock
    │   │   │                        # - Bouton "Voir détails"
    │   │   │                        # - Animations hover
    │   │   │
    │   │   └── ProtectedRoute.jsx   # Route protégée
    │   │                            # - Vérification de l'authentification
    │   │                            # - Vérification du rôle (si admin requis)
    │   │                            # - Redirection vers /login si non authentifié
    │   │                            # - Affichage "Accès refusé" si rôle insuffisant
    │   │
    │   ├── pages/
    │   │   ├── Home.jsx             # Page d'accueil
    │   │   │                        # - Hero section avec gradient
    │   │   │                        # - Présentation de l'application
    │   │   │                        # - CTA vers produits
    │   │   │                        # - Animations d'entrée
    │   │   │
    │   │   ├── Login.jsx            # Page de connexion
    │   │   │                        # - Formulaire email/password
    │   │   │                        # - Validation React Hook Form
    │   │   │                        # - Gestion des erreurs
    │   │   │                        # - Redirection après succès
    │   │   │                        # - Lien vers inscription
    │   │   │
    │   │   ├── Register.jsx         # Page d'inscription
    │   │   │                        # - Formulaire complet
    │   │   │                        # - Validation côté client
    │   │   │                        # - Vérification du mot de passe
    │   │   │                        # - Lien vers connexion
    │   │   │
    │   │   ├── Products.jsx         # Liste des produits
    │   │   │                        # - Barre de recherche
    │   │   │                        # - Filtres: catégorie, prix, stock
    │   │   │                        # - Tri: prix, nom, date
    │   │   │                        # - Grille responsive des cartes
    │   │   │                        # - Pagination
    │   │   │                        # - État de chargement
    │   │   │
    │   │   ├── ProductDetail.jsx    # Détails d'un produit
    │   │   │                        # - Image grande taille
    │   │   │                        # - Informations complètes
    │   │   │                        # - Prix et stock
    │   │   │                        # - Boutons admin (modifier/supprimer)
    │   │   │                        # - Breadcrumb navigation
    │   │   │
    │   │   ├── ProductForm.jsx      # Création/Modification produit
    │   │   │                        # - Formulaire complet
    │   │   │                        # - Upload d'image avec aperçu
    │   │   │                        # - Validation stricte
    │   │   │                        # - Mode création ou édition
    │   │   │                        # - Pré-remplissage pour édition
    │   │   │
    │   │   └── Dashboard.jsx        # Tableau de bord admin
    │   │                            # - Statistiques en cartes
    │   │                            # - Graphiques catégories
    │   │                            # - Alertes stock
    │   │                            # - Produits récents
    │   │                            # - Accès rapide aux actions
    │   │
    │   ├── context/
    │   │   ├── AuthContext.jsx      # Contexte d'authentification
    │   │   │                        # - État global: user, token
    │   │   │                        # - Fonctions: login, logout, register
    │   │   │                        # - Persistance dans localStorage
    │   │   │                        # - Initialisation au chargement
    │   │   │
    │   │   ├── AuthContextProvider.js # Provider du contexte
    │   │   │                        # - Séparé pour Fast Refresh
    │   │   │                        # - Wrapping de l'application
    │   │   │
    │   │   └── hooks/
    │   │       └── useAuth.js       # Hook personnalisé
    │   │                            # - Accès facile au contexte
    │   │                            # - Vérification de l'utilisation
    │   │
    │   ├── utils/
    │   │   └── axios.js             # Instance Axios configurée
    │   │                            # - Base URL de l'API
    │   │                            # - Intercepteur requête: ajout token
    │   │                            # - Intercepteur réponse: gestion 401
    │   │                            # - Timeout par défaut
    │   │
    │   ├── App.jsx                  # Composant principal
    │   │                            # - Configuration React Router
    │   │                            # - Définition des routes
    │   │                            # - Layout global (Navbar + Footer)
    │   │                            # - Routes protégées
    │   │
    │   ├── main.jsx                 # Point d'entrée React
    │   │                            # - Rendu de l'application
    │   │                            # - Wrapping avec providers
    │   │                            # - Import CSS global
    │   │
    │   └── index.css                # Styles globaux
    │                                # - Import TailwindCSS
    │                                # - Classes utilitaires custom
    │                                # - Animations personnalisées
    │                                # - Variables CSS
    │
    ├── public/                      # Fichiers statiques
    │   └── [assets...]              # Images, favicon, etc.
    │
    ├── .env                         # Variables d'environnement frontend
    │                                # - VITE_API_URL=http://localhost:5000/api
    │
    ├── package.json                 # Dépendances frontend
    │                                # - react, react-dom, react-router-dom
    │                                # - axios, react-hook-form
    │                                # - tailwindcss, vite
    │
    ├── vite.config.js               # Configuration Vite
    │                                # - Plugin React
    │                                # - Alias de chemins
    │                                # - Proxy API (optionnel)
    │
    ├── tailwind.config.js           # Configuration TailwindCSS
    │                                # - Chemins de contenu
    │                                # - Thème personnalisé
    │                                # - Plugins
    │
    ├── postcss.config.js            # Configuration PostCSS
    │                                # - TailwindCSS
    │                                # - Autoprefixer
    │
    ├── eslint.config.js             # Configuration ESLint
    │                                # - Règles React recommandées
    │                                # - Hooks rules
    │
    ├── DEPLOYMENT.md                # Guide de déploiement Vercel/Netlify
    └── README.md                    # Documentation frontend

```

### Analyse de la Structure

#### Séparation Frontend/Backend
**Avantages :**
- Déploiement indépendant (backend Render, frontend Vercel)
- Scalabilité séparée (scale backend sans toucher frontend)
- Équipes différentes possibles
- Technologies interchangeables

#### Architecture Modulaire Backend
- **Controllers** : Logique métier isolée
- **Models** : Définition des données
- **Middleware** : Logiques transversales (auth, validation)
- **Routes** : Définition des endpoints
- **Config** : Configuration centralisée

#### Architecture Composants Frontend
- **Pages** : Composants de haut niveau (routes)
- **Components** : Composants réutilisables
- **Context** : Gestion d'état globale
- **Utils** : Fonctions utilitaires
- **Hooks** : Logique réutilisable

## 🚀 Guide d'Installation et d'Exécution Complet

### Prérequis Système

Avant de commencer, assurez-vous d'avoir installé :

| Logiciel | Version Minimale | Version Recommandée | Vérification |
|----------|------------------|---------------------|--------------|
| **Node.js** | 16.0.0 | 18.x ou 20.x (LTS) | `node --version` |
| **npm** | 8.0.0 | 9.x ou 10.x | `npm --version` |
| **MongoDB** | 5.0 | 7.0 (ou MongoDB Atlas) | `mongod --version` |
| **Git** | 2.0 | Dernière version | `git --version` |

#### Installation des Prérequis

**Node.js et npm :**
- **Windows/Mac** : Télécharger depuis [nodejs.org](https://nodejs.org/)
- **Linux (Ubuntu/Debian)** :
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```

**MongoDB :**
- **Option 1 (Recommandé)** : Utiliser MongoDB Atlas (Cloud, gratuit)
  - Créer un compte sur [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
  - Voir MONGODB_ATLAS.md pour le guide complet
  
- **Option 2** : Installation locale
  - **Mac** : `brew install mongodb-community`
  - **Windows** : Télécharger depuis [mongodb.com](https://www.mongodb.com/try/download/community)
  - **Linux** : Suivre [docs.mongodb.com](https://docs.mongodb.com/manual/installation/)

---

### Installation du Projet

#### 1. Cloner le Dépôt

```bash
# Cloner depuis GitHub
git clone https://github.com/votre-username/fullstack-app.git

# Accéder au dossier
cd fullstack-app
```

#### 2. Installation et Configuration du Backend

```bash
# Accéder au dossier backend
cd backend

# Installer les dépendances
npm install

# Créer le fichier .env
cp .env.example .env  # ou créer manuellement
```

**Configuration du fichier `.env` :**

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce

# JWT Secret (générer avec: openssl rand -base64 32)
JWT_SECRET=votre_secret_très_sécurisé_minimum_32_caractères_aléatoires

# Port du serveur
PORT=5000

# Environnement
NODE_ENV=development

# URL du client (pour CORS)
CLIENT_URL=http://localhost:5173
```

**Génération d'un JWT Secret sécurisé :**
```bash
# Méthode 1: OpenSSL (Linux/Mac)
openssl rand -base64 32

# Méthode 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Méthode 3: En ligne
# Visiter: https://generate-secret.vercel.app/32
```

#### 3. Peuplement de la Base de Données

```bash
# Exécuter le script de seed
npm run seed

# Sortie attendue:
# ✅ MongoDB Connected
# ✅ Database cleared
# ✅ 2 users created
# ✅ 20 products created
# ✅ Seed completed successfully
```

**Comptes créés par le seed :**
- **Admin** : `admin@example.com` / `admin123`
- **User** : `user@example.com` / `user123`

#### 4. Démarrage du Backend

```bash
# Mode développement (avec auto-restart)
npm run dev

# Mode production
npm start
```

**Vérification :**
- Le serveur démarre sur `http://localhost:5000`
- Vous devriez voir : `✅ MongoDB Connected` et `🚀 Server running on port 5000`

**Tester l'API :**
```bash
# Test de santé
curl http://localhost:5000/api/auth/me

# Devrait retourner une erreur 401 (normal, pas de token)
```

---

#### 5. Installation et Configuration du Frontend

**Ouvrir un nouveau terminal** (laisser le backend tourner)

```bash
# Retour à la racine
cd ..

# Accéder au dossier frontend
cd frontend

# Installer les dépendances
npm install

# Créer le fichier .env
cp .env.example .env  # ou créer manuellement
```

**Configuration du fichier `.env` :**

```env
# URL de l'API backend
VITE_API_URL=http://localhost:5000/api
```

#### 6. Démarrage du Frontend

```bash
# Mode développement
npm run dev
```

**Sortie attendue :**
```
  VITE v7.3.1  ready in 350 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**Accéder à l'application :**
- Ouvrir le navigateur sur `http://localhost:5173`
- Vous devriez voir la page d'accueil

---

### Vérification de l'Installation

#### Checklist Complète

- [ ] Backend démarre sans erreur sur le port 5000
- [ ] MongoDB est connecté (message "MongoDB Connected")
- [ ] Frontend démarre sans erreur sur le port 5173
- [ ] La page d'accueil s'affiche correctement
- [ ] La connexion avec `admin@example.com` / `admin123` fonctionne
- [ ] La liste des produits s'affiche (20 produits)
- [ ] Les filtres et la recherche fonctionnent
- [ ] Le dashboard admin est accessible
- [ ] La création d'un produit fonctionne

#### Tests Manuels Rapides

**1. Test de Connexion**
```bash
# Dans un terminal
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Devrait retourner un token JWT
```

**2. Test de Récupération des Produits**
```bash
curl http://localhost:5000/api/products

# Devrait retourner la liste des 20 produits
```

**3. Test de Recherche**
```bash
curl "http://localhost:5000/api/products?search=laptop&category=Electronics"

# Devrait retourner les laptops de la catégorie Electronics
```

---

### Commandes Disponibles

#### Backend (`cd backend`)

| Commande | Description | Utilisation |
|----------|-------------|-------------|
| `npm start` | Démarrage en production | Après déploiement |
| `npm run dev` | Démarrage en développement | Développement local |
| `npm run seed` | Peupler la base de données | Première installation |
| `npm test` | Lancer les tests (si configurés) | CI/CD |

#### Frontend (`cd frontend`)

| Commande | Description | Utilisation |
|----------|-------------|-------------|
| `npm run dev` | Serveur de développement | Développement local |
| `npm run build` | Build de production | Avant déploiement |
| `npm run preview` | Prévisualiser le build | Tester avant déploiement |
| `npm run lint` | Vérifier le code (ESLint) | Avant commit |

---

### Résolution des Problèmes Courants

#### Problème 1 : "ECONNREFUSED 127.0.0.1:27017"
**Cause :** MongoDB n'est pas démarré ou mauvaise URI de connexion

**Solution :**
```bash
# Si MongoDB local:
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # Mac

# Si MongoDB Atlas: Vérifier MONGODB_URI dans .env
```

#### Problème 2 : "Port 5000 already in use"
**Cause :** Un autre processus utilise le port 5000

**Solution :**
```bash
# Trouver le processus
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows

# Tuer le processus
kill -9 <PID>  # Mac/Linux
taskkill /PID <PID> /F  # Windows

# Ou changer le port dans .env
PORT=5001
```

#### Problème 3 : "Cannot find module 'express'"
**Cause :** Dépendances non installées

**Solution :**
```bash
cd backend  # ou frontend
rm -rf node_modules package-lock.json
npm install
```

#### Problème 4 : "JWT Secret is not defined"
**Cause :** Fichier .env manquant ou mal configuré

**Solution :**
```bash
# Vérifier que .env existe et contient JWT_SECRET
cat backend/.env

# Si manquant, générer un nouveau secret
echo "JWT_SECRET=$(openssl rand -base64 32)" >> backend/.env
```

#### Problème 5 : "CORS Error"
**Cause :** CLIENT_URL mal configuré dans backend/.env

**Solution :**
```env
# Dans backend/.env
CLIENT_URL=http://localhost:5173
```

#### Problème 6 : "Network Error" dans le Frontend
**Cause :** VITE_API_URL incorrect ou backend non démarré

**Solution :**
```bash
# Vérifier que le backend tourne
curl http://localhost:5000/api/products

# Vérifier frontend/.env
cat frontend/.env
# Devrait contenir: VITE_API_URL=http://localhost:5000/api
```

---

### Configuration Avancée

#### Changement du Port Backend

**Fichier : `backend/.env`**
```env
PORT=8000  # Changer 5000 en 8000
```

**Puis mettre à jour le frontend :**
```env
# frontend/.env
VITE_API_URL=http://localhost:8000/api
```

#### Utilisation de MongoDB Local au lieu d'Atlas

**Fichier : `backend/.env`**
```env
MONGODB_URI=mongodb://localhost:27017/ecommerce
```

**Démarrer MongoDB :**
```bash
mongod --dbpath /path/to/data/directory
```

#### Activer HTTPS en Développement (Optionnel)

**Fichier : `frontend/vite.config.js`**
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync('./certs/key.pem'),
      cert: fs.readFileSync('./certs/cert.pem')
    }
  }
});
```

---

### Workflow de Développement Recommandé

#### 1. Démarrage Quotidien
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev

# Terminal 3: MongoDB (si local)
mongod
```

#### 2. Avant chaque Commit
```bash
# Frontend: Vérifier les erreurs ESLint
cd frontend && npm run lint

# Backend: Tester manuellement les endpoints modifiés

# Git
git add .
git commit -m "feat: description des changements"
git push
```

#### 3. Avant le Déploiement
```bash
# Frontend: Build de production
cd frontend && npm run build

# Tester le build
npm run preview

# Backend: Vérifier les variables d'environnement
# S'assurer que NODE_ENV=production
```

## 📊 Diagrammes et Schémas d'Architecture

### 1. Diagramme de Séquence - Processus d'Authentification Complet

```
┌─────────┐         ┌──────────────┐         ┌───────────────┐         ┌──────────┐
│ Client  │         │   Frontend   │         │    Backend    │         │ MongoDB  │
│(Browser)│         │    (React)   │         │   (Express)   │         │  (Atlas) │
└────┬────┘         └──────┬───────┘         └───────┬───────┘         └────┬─────┘
     │                     │                         │                      │
     │ 1. Saisie email     │                         │                      │
     │    et password      │                         │                      │
     ├────────────────────>│                         │                      │
     │                     │                         │                      │
     │                     │ 2. Validation client   │                      │
     │                     │    (React Hook Form)   │                      │
     │                     │                         │                      │
     │                     │ 3. POST /api/auth/login │                      │
     │                     │    { email, password }  │                      │
     │                     ├────────────────────────>│                      │
     │                     │                         │                      │
     │                     │                         │ 4. Validation Express│
     │                     │                         │    Validator         │
     │                     │                         │                      │
     │                     │                         │ 5. Query User by email│
     │                     │                         ├─────────────────────>│
     │                     │                         │                      │
     │                     │                         │ 6. User document     │
     │                     │                         │<─────────────────────┤
     │                     │                         │                      │
     │                     │                         │ 7. bcrypt.compare()  │
     │                     │                         │    (password, hash)  │
     │                     │                         │    ~100ms            │
     │                     │                         │                      │
     │                     │                         │ 8. If valid:         │
     │                     │                         │    jwt.sign({id})    │
     │                     │                         │    expiresIn: '30d'  │
     │                     │                         │                      │
     │                     │ 9. {token, user}       │                      │
     │                     │<────────────────────────┤                      │
     │                     │                         │                      │
     │                     │ 10. Store in localStorage│                     │
     │                     │     localStorage.setItem()│                    │
     │                     │                         │                      │
     │                     │ 11. Update AuthContext │                      │
     │                     │     setUser(user)      │                      │
     │                     │                         │                      │
     │ 12. Redirect to     │                         │                      │
     │     Dashboard       │                         │                      │
     │<────────────────────┤                         │                      │
     │                     │                         │                      │
     │                     │ 13. All future requests │                      │
     │                     │     Authorization: Bearer token                │
     │                     ├────────────────────────>│                      │
     │                     │                         │                      │
     │                     │                         │ 14. Verify JWT       │
     │                     │                         │     jwt.verify(token)│
     │                     │                         │                      │
     │                     │ 15. Protected resource │                      │
     │                     │<────────────────────────┤                      │
     │                     │                         │                      │
```

---

### 2. Diagramme de Séquence - Création de Produit (Admin)

```
┌──────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
│Admin │      │ Frontend │      │   Auth   │      │ Product  │      │ MongoDB  │
│ User │      │  (React) │      │Middleware│      │Controller│      │          │
└──┬───┘      └────┬─────┘      └────┬─────┘      └────┬─────┘      └────┬─────┘
   │               │                 │                 │                 │
   │ 1. Remplit formulaire          │                 │                 │
   │    + upload image              │                 │                 │
   ├──────────────>│                 │                 │                 │
   │               │                 │                 │                 │
   │               │ 2. Validation   │                 │                 │
   │               │    React Hook Form                │                 │
   │               │                 │                 │                 │
   │               │ 3. POST /api/products             │                 │
   │               │    FormData + JWT token           │                 │
   │               ├────────────────>│                 │                 │
   │               │                 │                 │                 │
   │               │                 │ 4. Verify JWT   │                 │
   │               │                 │    Extract user │                 │
   │               │                 │                 │                 │
   │               │                 │ 5. Check role   │                 │
   │               │                 │    authorize('admin')             │
   │               │                 │                 │                 │
   │               │                 │ 6. If admin ✓   │                 │
   │               │                 ├────────────────>│                 │
   │               │                 │                 │                 │
   │               │                 │                 │ 7. Validate data│
   │               │                 │                 │    Express Validator
   │               │                 │                 │                 │
   │               │                 │                 │ 8. Upload image │
   │               │                 │                 │    Multer       │
   │               │                 │                 │    Save to /uploads
   │               │                 │                 │                 │
   │               │                 │                 │ 9. Create Product│
   │               │                 │                 ├────────────────>│
   │               │                 │                 │                 │
   │               │                 │                 │10. Product saved│
   │               │                 │                 │<────────────────┤
   │               │                 │                 │                 │
   │               │11. {success, data: product}       │                 │
   │               │<────────────────────────────────────                │
   │               │                 │                 │                 │
   │12. Show success│                │                 │                 │
   │    message    │                 │                 │                 │
   │<──────────────┤                 │                 │                 │
   │               │                 │                 │                 │
   │13. Redirect to│                │                 │                 │
   │    /products  │                 │                 │                 │
   │<──────────────┤                 │                 │                 │
   │               │                 │                 │                 │
```

---

### 3. Diagramme de Composants React

```
┌────────────────────────────────────────────────────────────────┐
│                           App.jsx                              │
│                    (React Router Configuration)                │
└───────────────────────────┬────────────────────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            │               │               │
    ┌───────▼──────┐ ┌─────▼─────┐ ┌──────▼──────┐
    │   Navbar     │ │   Routes  │ │   Footer    │
    │              │ │           │ │             │
    └──────────────┘ └─────┬─────┘ └─────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼─────┐     ┌─────▼──────┐    ┌─────▼─────┐
   │  Public  │     │  Private   │    │  Admin    │
   │  Routes  │     │  Routes    │    │  Routes   │
   └────┬─────┘     └─────┬──────┘    └─────┬─────┘
        │                 │                  │
        │                 │                  │
    ┌───▼────┐      ┌─────▼──────┐    ┌─────▼──────────┐
    │ Home   │      │  Products  │    │  Dashboard     │
    │ Login  │      │  Detail    │    │  ProductForm   │
    │Register│      │            │    │                │
    └────────┘      └─────┬──────┘    └────────────────┘
                          │
                    ┌─────▼──────┐
                    │ProductCard │
                    │(Reusable)  │
                    └────────────┘

┌─────────────────────────────────────────────────────────────────┐
│              AuthContext (Global State)                         │
│  - user: { id, name, email, role }                             │
│  - token: JWT string                                           │
│  - login(), logout(), register()                               │
└─────────────────────────────────────────────────────────────────┘
```

---

### 4. Diagramme de Flux de Données - Recherche et Filtrage

```
┌─────────────────────────────────────────────────────────────────┐
│                         Products.jsx                            │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Search     │  │   Filters    │  │     Sort     │         │
│  │   Input      │  │  (Category,  │  │  (Price,     │         │
│  │              │  │   Price,     │  │   Name)      │         │
│  │              │  │   Stock)     │  │              │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                 │                 │                  │
│         └─────────────────┼─────────────────┘                  │
│                           │                                     │
│                  ┌────────▼────────┐                           │
│                  │  Build Query    │                           │
│                  │  Parameters     │                           │
│                  └────────┬────────┘                           │
│                           │                                     │
│                  ┌────────▼────────┐                           │
│                  │  useEffect()    │                           │
│                  │  Triggers API   │                           │
│                  └────────┬────────┘                           │
└───────────────────────────┼─────────────────────────────────────┘
                            │
                   ┌────────▼────────┐
                   │  Axios Request  │
                   │  GET /products? │
                   │  search=laptop& │
                   │  category=Elect&│
                   │  sort=-price    │
                   └────────┬────────┘
                            │
        ┌───────────────────▼───────────────────┐
        │         Backend Express               │
        │  ┌────────────────────────────────┐   │
        │  │  productController.js          │   │
        │  │                                │   │
        │  │  1. Extract query params       │   │
        │  │  2. Build MongoDB query        │   │
        │  │     - $regex for search        │   │
        │  │     - $gte/$lte for prices     │   │
        │  │     - Category match           │   │
        │  │  3. Apply sort                 │   │
        │  │  4. Apply pagination           │   │
        │  │  5. Execute query              │   │
        │  └────────────┬───────────────────┘   │
        └───────────────┼───────────────────────┘
                        │
                ┌───────▼────────┐
                │    MongoDB     │
                │  - Index on    │
                │    name (text) │
                │  - Index on    │
                │    category    │
                │  - Index on    │
                │    price       │
                └───────┬────────┘
                        │
                        │ Results
                        │
        ┌───────────────▼───────────────────┐
        │  Response JSON                    │
        │  {                                │
        │    success: true,                 │
        │    count: 15,                     │
        │    pagination: {...},             │
        │    data: [products]               │
        │  }                                │
        └───────────────┬───────────────────┘
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                    Products.jsx                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  setState(products)                                  │   │
│  │  Render ProductCard components                       │   │
│  │  Render Pagination controls                          │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

### 5. Schéma de Sécurité - Couches de Protection

```
┌─────────────────────────────────────────────────────────────────┐
│                  COUCHE 1 : FRONTEND                            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  • Validation côté client (React Hook Form)             │   │
│  │  • Échappement automatique (React)                      │   │
│  │  • Stockage sécurisé du token (localStorage)            │   │
│  │  • Vérification des rôles avant affichage               │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTPS (En production)
┌────────────────────────────▼────────────────────────────────────┐
│                  COUCHE 2 : BACKEND API                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  MIDDLEWARE 1 : CORS                                     │   │
│  │  - Origines autorisées uniquement                       │   │
│  │  - Méthodes HTTP contrôlées                             │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  MIDDLEWARE 2 : Authentication (protect)                │   │
│  │  - Vérification du token JWT                            │   │
│  │  - Validation de la signature                           │   │
│  │  - Vérification de l'expiration                         │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  MIDDLEWARE 3 : Authorization (authorize)               │   │
│  │  - Vérification du rôle (admin/user)                    │   │
│  │  - Contrôle d'accès basé sur les permissions            │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  MIDDLEWARE 4 : Validation (Express Validator)          │   │
│  │  - Validation des types de données                      │   │
│  │  - Sanitization (trim, escape)                          │   │
│  │  - Règles métier (min/max, format)                      │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  MIDDLEWARE 5 : Upload (Multer)                         │   │
│  │  - Vérification du type MIME                            │   │
│  │  - Limite de taille (5MB)                               │   │
│  │  - Renommage sécurisé                                   │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  CONTROLLERS                                             │   │
│  │  - Logique métier                                       │   │
│  │  - Interaction avec MongoDB                             │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │ TLS/SSL (MongoDB Atlas)
┌────────────────────────────▼────────────────────────────────────┐
│                  COUCHE 3 : BASE DE DONNÉES                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  MONGOOSE SCHEMAS                                        │   │
│  │  - Validation au niveau du schéma                       │   │
│  │  - Types stricts                                        │   │
│  │  - Required fields                                      │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  HOOKS & METHODS                                         │   │
│  │  - pre-save: Hashage du mot de passe                    │   │
│  │  - comparePassword: Vérification sécurisée              │   │
│  │  - toJSON: Exclusion du password                        │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  MONGODB                                                 │   │
│  │  - Chiffrement au repos                                 │   │
│  │  - Chiffrement en transit (TLS)                         │   │
│  │  - Authentification (username/password)                 │   │
│  │  - IP Whitelist                                         │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

### 6. Diagramme de Déploiement

```
┌──────────────────────────────────────────────────────────────────┐
│                        INTERNET                                  │
└────────────┬─────────────────────────────────┬───────────────────┘
             │                                 │
             │ HTTPS                           │ HTTPS
             │                                 │
    ┌────────▼─────────┐              ┌───────▼─────────┐
    │   Vercel/Netlify │              │   Render        │
    │   (Frontend)     │              │   (Backend)     │
    │                  │              │                 │
    │  - Static Files  │              │  - Node.js      │
    │  - CDN Global    │              │  - Express API  │
    │  - Auto SSL      │─────────────>│  - Auto Deploy  │
    │  - CI/CD GitHub  │  API Calls   │  - Health Check │
    └──────────────────┘              └────────┬────────┘
                                               │
                                               │ TLS/SSL
                                               │
                                      ┌────────▼─────────┐
                                      │  MongoDB Atlas   │
                                      │   (Database)     │
                                      │                  │
                                      │  - Cloud Hosted  │
                                      │  - Auto Backup   │
                                      │  - Encryption    │
                                      │  - Monitoring    │
                                      └──────────────────┘
```

## 🌐 Guide de Déploiement en Production

### Vue d'Ensemble du Déploiement

L'application sera déployée sur 3 services cloud distincts :

1. **Frontend** : Vercel ou Netlify (gratuit)
2. **Backend** : Render (gratuit avec limitations)
3. **Database** : MongoDB Atlas (cluster M0 gratuit)

---

### Étape 1 : Préparation du Code

#### 1.1 Configuration Git

```bash
# Initialiser Git si pas déjà fait
git init

# Créer .gitignore
cat > .gitignore << EOF
# Dependencies
node_modules/
.pnp
.pnp.js

# Environment variables
.env
.env.local
.env.production

# Build outputs
dist/
build/
*.log

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/

# Uploads (ne pas commiter les images de test)
backend/uploads/*
!backend/uploads/.gitkeep
EOF

# Ajouter tous les fichiers
git add .
git commit -m "feat: Initial commit - Full Stack E-Commerce App"
```

#### 1.2 Créer un Dépôt GitHub

```bash
# Sur GitHub: Créer un nouveau repository "fullstack-ecommerce"

# Lier le dépôt local
git remote add origin https://github.com/votre-username/fullstack-ecommerce.git
git branch -M main
git push -u origin main
```

---

### Étape 2 : Déploiement de la Base de Données (MongoDB Atlas)

#### 2.1 Création du Cluster

1. Aller sur [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Créer un compte ou se connecter
3. Cliquer sur "Build a Database"
4. Choisir **M0 Sandbox** (gratuit)
5. Sélectionner une région proche (ex: eu-west-1)
6. Nommer le cluster : `Cluster0`
7. Cliquer sur "Create"

#### 2.2 Configuration de la Sécurité

**Créer un utilisateur de base de données :**
1. Database Access → Add New Database User
2. Username : `ecommerce_user`
3. Password : Générer un mot de passe sécurisé (noter quelque part)
4. Database User Privileges : Read and write to any database
5. Add User

**Configurer le Network Access :**
1. Network Access → Add IP Address
2. **Option 1 (Développement)** : Allow Access from Anywhere → `0.0.0.0/0`
3. **Option 2 (Production)** : Ajouter uniquement l'IP de Render
4. Confirm

#### 2.3 Obtenir la Connection String

1. Database → Connect
2. Choose: Drivers
3. Driver: Node.js, Version: 5.5 or later
4. Copier la connection string :
   ```
   mongodb+srv://ecommerce_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Remplacer `<password>` par le mot de passe réel
6. Ajouter le nom de la base : `/ecommerce` avant le `?`
   ```
   mongodb+srv://ecommerce_user:MOT_DE_PASSE@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
   ```

---

### Étape 3 : Déploiement du Backend (Render)

#### 3.1 Préparation du Backend

**Créer `backend/package.json` avec script de production :**
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed": "node src/config/seed.js"
  }
}
```

**Créer `backend/render.yaml` (optionnel) :**
```yaml
services:
  - type: web
    name: ecommerce-backend
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5000
```

#### 3.2 Déploiement sur Render

1. Aller sur [render.com](https://render.com)
2. Se connecter avec GitHub
3. Cliquer sur "New +" → "Web Service"
4. Connecter le repository GitHub
5. Configuration :
   - **Name** : `ecommerce-backend`
   - **Branch** : `main`
   - **Root Directory** : `backend`
   - **Environment** : `Node`
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
   - **Instance Type** : `Free`

6. **Variables d'Environnement** :
   Cliquer sur "Advanced" → "Add Environment Variable"

   ```
   NODE_ENV = production
   PORT = 5000
   MONGODB_URI = mongodb+srv://ecommerce_user:PASSWORD@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
   JWT_SECRET = votre_secret_très_long_et_sécurisé_32_caractères_minimum
   CLIENT_URL = https://votre-frontend.vercel.app
   ```

7. Cliquer sur "Create Web Service"

8. Attendre le déploiement (5-10 minutes)

9. **URL du backend** : `https://ecommerce-backend.onrender.com`

#### 3.3 Peupler la Base de Données en Production

**Méthode 1 : Via Render Shell**
1. Dashboard Render → votre service
2. Shell (en haut à droite)
3. Exécuter : `npm run seed`

**Méthode 2 : Localement vers Production**
```bash
# Dans backend/.env.production
MONGODB_URI=mongodb+srv://ecommerce_user:PASSWORD@cluster0.xxxxx.mongodb.net/ecommerce

# Exécuter le seed
NODE_ENV=production npm run seed
```

#### 3.4 Vérification du Backend

```bash
# Test de santé
curl https://ecommerce-backend.onrender.com/api/products

# Devrait retourner la liste des produits
```

---

### Étape 4 : Déploiement du Frontend (Vercel)

#### 4.1 Préparation du Frontend

**Mettre à jour `frontend/.env.production` :**
```env
VITE_API_URL=https://ecommerce-backend.onrender.com/api
```

**Tester le build localement :**
```bash
cd frontend
npm run build
npm run preview
```

#### 4.2 Déploiement sur Vercel

1. Aller sur [vercel.com](https://vercel.com)
2. Se connecter avec GitHub
3. Cliquer sur "Add New..." → "Project"
4. Importer le repository GitHub
5. Configuration :
   - **Framework Preset** : Vite
   - **Root Directory** : `frontend`
   - **Build Command** : `npm run build`
   - **Output Directory** : `dist`

6. **Environment Variables** :
   ```
   VITE_API_URL = https://ecommerce-backend.onrender.com/api
   ```

7. Cliquer sur "Deploy"

8. Attendre le déploiement (2-3 minutes)

9. **URL du frontend** : `https://votre-app.vercel.app`

#### 4.3 Alternative : Netlify

1. Aller sur [netlify.com](https://www.netlify.com)
2. Cliquer sur "Add new site" → "Import an existing project"
3. Connecter GitHub et sélectionner le repository
4. Configuration :
   - **Base directory** : `frontend`
   - **Build command** : `npm run build`
   - **Publish directory** : `frontend/dist`

5. **Environment variables** :
   ```
   VITE_API_URL = https://ecommerce-backend.onrender.com/api
   ```

6. Deploy

---

### Étape 5 : Configuration Post-Déploiement

#### 5.1 Mettre à Jour CORS sur le Backend

**Fichier : `backend/server.js`**
```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'https://votre-app.vercel.app',
    'http://localhost:5173'  // Pour développement local
  ],
  credentials: true
}));
```

**Commit et push :**
```bash
git add backend/server.js
git commit -m "fix: Update CORS for production frontend"
git push
```

Render redéploiera automatiquement.

#### 5.2 Vérification Complète

**Checklist de production :**

- [ ] Backend accessible : `https://ecommerce-backend.onrender.com/api/products`
- [ ] Frontend accessible : `https://votre-app.vercel.app`
- [ ] Connexion fonctionne (admin@example.com / admin123)
- [ ] Liste des produits s'affiche
- [ ] Création de produit fonctionne (admin)
- [ ] Upload d'image fonctionne
- [ ] Dashboard affiche les statistiques
- [ ] Pas d'erreurs CORS dans la console
- [ ] HTTPS actif sur les deux URLs

---

### Étape 6 : Monitoring et Maintenance

#### 6.1 Monitoring Render

**Dashboard Render :**
- Logs en temps réel
- Utilisation CPU/RAM
- Santé du service (Health Checks)
- Redémarrages automatiques en cas d'erreur

**Configurer les Health Checks :**
- Path : `/api/products`
- Frequency : 5 minutes
- Timeout : 30 secondes

#### 6.2 Monitoring Vercel

**Analytics :**
- Nombre de visiteurs
- Temps de chargement
- Erreurs frontend
- Géographie des utilisateurs

#### 6.3 Monitoring MongoDB Atlas

**Metrics :**
- Connections actives
- Opérations par seconde
- Utilisation du storage
- Latence des requêtes

**Alertes :**
- Configurer des alertes email si :
  - Utilisation > 80% du quota gratuit
  - Pics de connexions anormaux
  - Erreurs de connexion

---

### Étape 7 : Domaine Personnalisé (Optionnel)

#### 7.1 Acheter un Domaine

**Registrars recommandés :**
- Namecheap (~10€/an pour .com)
- GoDaddy
- Google Domains
- OVH (pour .fr)

#### 7.2 Configurer le Domaine sur Vercel

1. Vercel Dashboard → Settings → Domains
2. Add Domain → `votre-domaine.com`
3. Suivre les instructions DNS :
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```
4. Attendre propagation DNS (5 minutes - 48 heures)
5. SSL activé automatiquement

#### 7.3 Configurer le Domaine sur Render (Backend)

1. Render Dashboard → Settings → Custom Domain
2. Add Custom Domain → `api.votre-domaine.com`
3. Instructions DNS :
   ```
   Type: CNAME
   Name: api
   Value: ecommerce-backend.onrender.com
   ```
4. SSL automatique via Let's Encrypt

---

### Bonnes Pratiques de Production

#### Sécurité

**Backend :**
```javascript
// Helmet pour headers de sécurité
const helmet = require('helmet');
app.use(helmet());

// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limite par IP
});
app.use('/api/', limiter);

// Compression des réponses
const compression = require('compression');
app.use(compression());
```

**MongoDB :**
- Activer IP Whitelist stricte (IP de Render uniquement)
- Rotation régulière du mot de passe
- Activer l'audit logging

#### Performance

**Frontend :**
- Code splitting avec React.lazy()
- Lazy loading des images
- CDN pour les assets statiques (Vercel le fait automatiquement)

**Backend :**
- Indexes MongoDB sur les champs fréquemment interrogés
- Cache avec Redis (si nécessaire)
- Compression Gzip activée

#### Logs

```javascript
// Winston pour logging structuré
const winston = require('winston');
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

---

### Coûts et Limitations (Tier Gratuit)

| Service | Plan Gratuit | Limitations |
|---------|--------------|-------------|
| **MongoDB Atlas** | M0 Sandbox | 512 MB storage, Connexions partagées |
| **Render** | Free Tier | 750 heures/mois, Sleep après 15 min d'inactivité, 512 MB RAM |
| **Vercel** | Hobby | 100 GB bandwidth, Builds illimités |

**Recommandations :**
- Render Free : Le backend s'endort après 15 min → première requête lente (~30s)
- Solution : Keep-alive ping toutes les 10 minutes ou upgrade à 7$/mois
- MongoDB M0 : Suffisant pour ~10000 produits et 1000 utilisateurs

---

### Mise à Jour du Déploiement

#### Workflow Git

```bash
# Développement local
git checkout -b feature/nouvelle-fonctionnalite

# Développement...
git add .
git commit -m "feat: Ajout de la fonctionnalité X"

# Push
git push origin feature/nouvelle-fonctionnalite

# Créer une Pull Request sur GitHub
# Merge vers main

# Déploiement automatique :
# - Vercel redéploie automatiquement le frontend
# - Render redéploie automatiquement le backend
```

#### Rollback en Cas d'Erreur

**Vercel :**
1. Dashboard → Deployments
2. Trouver le déploiement précédent stable
3. Cliquer sur "..." → "Redeploy"

**Render :**
1. Dashboard → Deploy
2. View Previous Deploys
3. Rollback to Deploy

---

### Support et Documentation

**Render :**
- Docs : [render.com/docs](https://render.com/docs)
- Status : [status.render.com](https://status.render.com)

**Vercel :**
- Docs : [vercel.com/docs](https://vercel.com/docs)
- Discord : Support communautaire

**MongoDB Atlas :**
- Docs : [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- Support : Via le dashboard

## 📝 Notes Importantes et Bonnes Pratiques

### Sécurité en Production

#### 1. Variables d'Environnement
**Jamais commiter les secrets :**
```bash
# ❌ NE JAMAIS FAIRE
git add .env
git commit -m "Add configuration"

# ✅ TOUJOURS
# .gitignore doit contenir .env
echo ".env" >> .gitignore
```

**Générer des secrets forts :**
```bash
# JWT Secret (minimum 32 caractères)
openssl rand -base64 32

# Password pour production
openssl rand -base64 24
```

#### 2. Mots de Passe
**Complexité minimale :**
- Minimum 6 caractères (augmenter à 8-12 en production)
- Mélange majuscules, minuscules, chiffres, symboles
- Pas de mots du dictionnaire

**Stockage :**
- Toujours hasher avec bcrypt (jamais en clair)
- Salt rounds : 10 minimum (12 recommandé pour production)
- Ne jamais logger les mots de passe

#### 3. Tokens JWT
**Bonnes pratiques :**
```javascript
// ✅ Bonne configuration
const token = jwt.sign(
  { id: user._id },              // Payload minimal
  process.env.JWT_SECRET,        // Secret fort
  { expiresIn: '30d' }           // Expiration obligatoire
);

// ❌ Mauvaise configuration
const token = jwt.sign(
  { id: user._id, password: user.password },  // Ne jamais inclure le password
  'secret',                                     // Secret trop faible
  {}                                            // Pas d'expiration
);
```

**Stockage côté client :**
- localStorage : Simple mais vulnérable au XSS
- sessionStorage : Plus sûr, perdu à la fermeture du navigateur
- httpOnly cookies : Plus sécurisé (nécessite configuration CORS)

#### 4. Upload de Fichiers
**Validation stricte :**
```javascript
// Vérifier le type MIME (pas juste l'extension)
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
if (!allowedMimeTypes.includes(file.mimetype)) {
  throw new Error('Type de fichier non autorisé');
}

// Limite de taille stricte
const maxSize = 5 * 1024 * 1024;  // 5MB
if (file.size > maxSize) {
  throw new Error('Fichier trop volumineux');
}

// Renommer pour éviter collisions et injections
const uniqueName = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
```

**Stockage sécurisé :**
- Pas dans le dossier public accessible directement
- Utiliser un service cloud (AWS S3, Cloudinary) en production
- Scanner les fichiers avec un antivirus si possible

#### 5. Protection CORS
**Configuration stricte en production :**
```javascript
// ❌ Développement uniquement
app.use(cors({ origin: '*' }));

// ✅ Production
app.use(cors({
  origin: [
    'https://votre-domaine.com',
    'https://www.votre-domaine.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

### Performance et Optimisation

#### 1. Base de Données
**Indexes MongoDB :**
```javascript
// Créer des indexes pour les requêtes fréquentes
ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ category: 1, price: -1 });
ProductSchema.index({ createdAt: -1 });

// Vérifier les indexes
db.products.getIndexes()
```

**Pagination obligatoire :**
- Toujours limiter les résultats (default: 12 par page)
- Utiliser skip() et limit() avec Mongoose
- Retourner les métadonnées de pagination

#### 2. Requêtes Optimisées
**Select uniquement les champs nécessaires :**
```javascript
// ❌ Récupère tous les champs
const products = await Product.find();

// ✅ Select spécifique
const products = await Product.find()
  .select('name price category image stock')
  .populate('createdBy', 'name');
```

**Éviter les requêtes N+1 :**
```javascript
// ❌ N+1 queries
const products = await Product.find();
for (let product of products) {
  product.user = await User.findById(product.createdBy);
}

// ✅ Population
const products = await Product.find().populate('createdBy');
```

#### 3. Mise en Cache
**Headers HTTP :**
```javascript
// Cache des ressources statiques
app.use('/uploads', express.static('uploads', {
  maxAge: '1d',
  etag: true
}));

// No-cache pour les API
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});
```

#### 4. Compression
```javascript
const compression = require('compression');
app.use(compression());
```

---

### Gestion des Erreurs

#### 1. Codes HTTP Appropriés
| Situation | Code HTTP |
|-----------|-----------|
| Succès GET/PUT/DELETE | 200 OK |
| Succès POST (création) | 201 Created |
| Données invalides | 400 Bad Request |
| Non authentifié | 401 Unauthorized |
| Authentifié mais pas autorisé | 403 Forbidden |
| Ressource introuvable | 404 Not Found |
| Conflit (ex: email déjà utilisé) | 409 Conflict |
| Erreur serveur | 500 Internal Server Error |

#### 2. Messages d'Erreur
```javascript
// ❌ Trop d'informations (révèle la structure)
res.status(500).json({
  error: 'MongoError: E11000 duplicate key error collection: users index: email_1',
  stack: err.stack
});

// ✅ Message générique en production
res.status(409).json({
  success: false,
  message: 'Cet email est déjà utilisé'
});
```

#### 3. Logging Structuré
```javascript
// Production: Logger les erreurs, pas les exposer
console.error('[ERROR]', {
  timestamp: new Date().toISOString(),
  error: err.message,
  stack: err.stack,
  user: req.user?.id,
  endpoint: req.originalUrl
});

res.status(500).json({
  success: false,
  message: 'Une erreur est survenue'
});
```

---

### Limitations Connues du Projet

#### 1. Render Free Tier
**Problème :** Le backend s'endort après 15 minutes d'inactivité
**Impact :** Première requête peut prendre 30 secondes
**Solutions :**
- Keep-alive ping toutes les 10 minutes
- Upgrade à Render Standard ($7/mois) pour service always-on
- Utiliser un service externe (UptimeRobot) pour ping régulier

#### 2. Stockage Local des Images
**Problème :** Images stockées sur le serveur Render (éphémère)
**Impact :** Images perdues lors des redéploiements
**Solutions :**
- Migrer vers AWS S3 ou Cloudinary
- Configurer un volume persistant sur Render

#### 3. Pas de Validation Email
**Problème :** Pas de vérification de l'email lors de l'inscription
**Impact :** Comptes créés sans email valide
**Solutions :**
- Implémenter envoi d'email de confirmation (Nodemailer + Gmail)
- Ajouter un champ `emailVerified` dans le schéma User

#### 4. Pas de Reset Password
**Problème :** Pas de fonctionnalité "Mot de passe oublié"
**Impact :** Utilisateur bloqué si mot de passe perdu
**Solutions :**
- Implémenter reset token avec expiration
- Envoi email avec lien de reset

#### 5. Pas de Rate Limiting
**Problème :** Pas de protection contre les attaques par force brute
**Impact :** Vulnérable aux tentatives multiples de connexion
**Solutions :**
```javascript
const rateLimit = require('express-rate-limit');
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Trop de tentatives de connexion, réessayez dans 15 minutes'
});
app.use('/api/auth/login', loginLimiter);
```

---

### Améliorations Futures Recommandées

#### Fonctionnalités Utilisateur
- [ ] **Panier d'achat** : Ajout de produits, quantités, total
- [ ] **Gestion des commandes** : Historique, statuts, suivi
- [ ] **Paiement en ligne** : Intégration Stripe/PayPal
- [ ] **Profil utilisateur** : Modification email, mot de passe, avatar
- [ ] **Favoris** : Sauvegarder des produits
- [ ] **Système de notation** : Note et avis sur les produits
- [ ] **Notifications** : Emails pour commandes, promotions

#### Fonctionnalités Admin
- [ ] **Gestion des utilisateurs** : Liste, modification, suppression
- [ ] **Gestion des commandes** : Validation, expédition, annulation
- [ ] **Statistiques avancées** : Charts, CA, produits populaires
- [ ] **Export de données** : CSV, PDF pour rapports
- [ ] **Promotions** : Codes promo, réductions

#### Technique
- [ ] **Tests automatisés** : Jest, Supertest, React Testing Library
- [ ] **CI/CD** : GitHub Actions pour tests automatiques
- [ ] **Documentation API** : Swagger/OpenAPI
- [ ] **Multi-langue** : i18next pour FR/EN
- [ ] **Mode sombre** : Toggle light/dark theme
- [ ] **PWA** : Application web progressive, offline support
- [ ] **Websockets** : Notifications temps réel
- [ ] **GraphQL** : Alternative à REST pour flexibilité des requêtes

#### Sécurité Avancée
- [ ] **2FA (Two-Factor Authentication)** : Double authentification
- [ ] **Captcha** : Protection contre bots (Google reCAPTCHA)
- [ ] **Audit logs** : Traçabilité des actions admin
- [ ] **Encryption au repos** : Chiffrement des données sensibles
- [ ] **Security headers** : Helmet.js avec configuration stricte
- [ ] **Input sanitization avancée** : DOMPurify côté client

---

### Ressources et Liens Utiles

#### Documentation Officielle
- **React** : [react.dev](https://react.dev)
- **Express** : [expressjs.com](https://expressjs.com)
- **MongoDB** : [docs.mongodb.com](https://docs.mongodb.com)
- **Mongoose** : [mongoosejs.com](https://mongoosejs.com)
- **JWT** : [jwt.io](https://jwt.io)
- **TailwindCSS** : [tailwindcss.com](https://tailwindcss.com)

#### Sécurité
- **OWASP Top 10** : [owasp.org/www-project-top-ten](https://owasp.org/www-project-top-ten/)
- **Web Security Academy** : [portswigger.net/web-security](https://portswigger.net/web-security)
- **npm audit** : Scanner les vulnérabilités des dépendances

#### Outils de Test
- **Postman** : [postman.com](https://www.postman.com) - Test d'API
- **Insomnia** : [insomnia.rest](https://insomnia.rest) - Alternative à Postman
- **MongoDB Compass** : GUI pour visualiser la base de données

#### Déploiement
- **Render Docs** : [render.com/docs](https://render.com/docs)
- **Vercel Docs** : [vercel.com/docs](https://vercel.com/docs)
- **MongoDB Atlas** : [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)

---

### Support et Contribution

#### Contact
- **Auteur** : Reda El Hadfi
- **Module** : Sécurité des Applications Web Modernes
- **Date** : Février 2026

#### Licence
Ce projet est destiné à des fins éducatives dans le cadre du module "Sécurité des Applications Web Modernes".

---

### Changelog

#### Version 1.0.0 (Février 2026)
- ✅ Authentification JWT complète
- ✅ CRUD produits avec upload d'images
- ✅ Recherche, filtrage, tri et pagination
- ✅ Dashboard administrateur avec statistiques
- ✅ Interface responsive avec TailwindCSS
- ✅ Validation à double niveau (client + serveur)
- ✅ Protection contre injections NoSQL
- ✅ Hashage bcrypt des mots de passe
- ✅ Contrôle d'accès basé sur les rôles
- ✅ Documentation complète en français

---

### Conclusion

Cette application Full Stack démontre l'implémentation des principes fondamentaux de **sécurité des applications web modernes** :

1. **Authentification sécurisée** : JWT, bcrypt, expiration des tokens
2. **Autorisation granulaire** : Contrôle d'accès basé sur les rôles (RBAC)
3. **Validation stricte** : Double validation client/serveur
4. **Protection contre OWASP Top 10** : Injection, XSS, CSRF, etc.
5. **Architecture moderne** : Séparation frontend/backend, API REST
6. **Déploiement cloud** : MongoDB Atlas, Render, Vercel

Le projet est prêt pour la démonstration et le déploiement en production avec les configurations appropriées.

**Pour toute question ou clarification, n'hésitez pas à consulter cette documentation détaillée.**
