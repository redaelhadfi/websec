require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Product.deleteMany();
    console.log('🗑️  Cleared existing data');

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });

    const user = await User.create({
      name: 'John Doe',
      email: 'user@example.com',
      password: 'user123',
      role: 'user'
    });

    console.log('👥 Created users');

    const products = [
      {
        name: 'Laptop Pro 15',
        description: 'High-performance laptop with 16GB RAM and 512GB SSD. Perfect for developers and content creators.',
        price: 1299.99,
        category: 'Electronics',
        stock: 25,
        featured: true,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
        createdBy: admin._id
      },
      {
        name: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse with precision tracking and long battery life.',
        price: 29.99,
        category: 'Electronics',
        stock: 150,
        featured: false,
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
        createdBy: admin._id
      },
      {
        name: 'Programming Book: JavaScript',
        description: 'Comprehensive guide to modern JavaScript programming. Covers ES6+ features and best practices.',
        price: 39.99,
        category: 'Books',
        stock: 80,
        featured: true,
        image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
        createdBy: admin._id
      },
      {
        name: 'Mechanical Keyboard',
        description: 'RGB backlit mechanical keyboard with blue switches. Perfect for gaming and typing.',
        price: 89.99,
        category: 'Electronics',
        stock: 45,
        featured: false,
        image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400',
        createdBy: admin._id
      },
      {
        name: 'Office Chair Pro',
        description: 'Ergonomic office chair with lumbar support and adjustable height. Comfortable for long work hours.',
        price: 249.99,
        category: 'Home',
        stock: 30,
        featured: true,
        image: 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=400',
        createdBy: admin._id
      },
      {
        name: 'Desk Lamp LED',
        description: 'Modern LED desk lamp with adjustable brightness and color temperature.',
        price: 45.99,
        category: 'Home',
        stock: 60,
        featured: false,
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400',
        createdBy: admin._id
      },
      {
        name: 'Running Shoes',
        description: 'Lightweight running shoes with excellent cushioning and breathable material.',
        price: 79.99,
        category: 'Sports',
        stock: 100,
        featured: false,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
        createdBy: admin._id
      },
      {
        name: 'Yoga Mat Premium',
        description: 'Non-slip yoga mat with extra cushioning. Eco-friendly and durable.',
        price: 34.99,
        category: 'Sports',
        stock: 75,
        featured: false,
        image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400',
        createdBy: admin._id
      },
      {
        name: 'Smart Watch',
        description: 'Fitness tracker smartwatch with heart rate monitor and GPS. Water resistant.',
        price: 199.99,
        category: 'Electronics',
        stock: 40,
        featured: true,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
        createdBy: admin._id
      },
      {
        name: 'Coffee Maker Pro',
        description: 'Programmable coffee maker with thermal carafe. Brews 12 cups of perfect coffee.',
        price: 129.99,
        category: 'Home',
        stock: 35,
        featured: false,
        image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400',
        createdBy: admin._id
      },
      {
        name: 'T-Shirt Cotton Classic',
        description: 'Comfortable cotton t-shirt available in multiple colors. Pre-shrunk and durable.',
        price: 19.99,
        category: 'Clothing',
        stock: 200,
        featured: false,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
        createdBy: admin._id
      },
      {
        name: 'Backpack Travel',
        description: 'Spacious travel backpack with multiple compartments and padded laptop sleeve.',
        price: 59.99,
        category: 'Other',
        stock: 55,
        featured: false,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
        createdBy: admin._id
      }
    ];

    await Product.insertMany(products);
    console.log('📦 Created sample products');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n👤 Login credentials:');
    console.log('   Admin: admin@example.com / admin123');
    console.log('   User:  user@example.com / user123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
