const express = require('express');
const { db } = require('../firebaseConfig');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

// Add Product
router.post('/', verifyToken, async (req, res) => {
  const { name, quantity, lowStockThreshold = 5 } = req.body;
  const userEmail = req.user?.email;

  if (!name || quantity === undefined) {
    return res.status(400).json({ error: 'Name and quantity are required' });
  }

  try {
    const numericQuantity = Number(quantity);
    if (isNaN(numericQuantity)) {
      return res.status(400).json({ error: 'Quantity must be a valid number' });
    }

    // Check if user exists, create user if not
    const userRef = db.collection('users').doc(userEmail);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      await userRef.set({ profile: { email: userEmail, createdAt: new Date() } });
    }

    // Check for duplicate product name
    const productRef = userRef.collection('products').doc(name);
    const productDoc = await productRef.get();

    if (productDoc.exists) {
      return res.status(400).json({ error: 'Product with this name already exists' });
    }

    const productData = {
      quantity: numericQuantity,
      lowStockThreshold: Number(lowStockThreshold),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await productRef.set(productData);
    res.status(201).json({ name, ...productData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Products
router.get('/', verifyToken, async (req, res) => {
  const userEmail = req.user?.email;

  try {
    const snapshot = await db.collection('users').doc(userEmail).collection('products').get();
    const products = snapshot.docs.map(doc => ({ name: doc.id, ...doc.data() }));
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Product
// Update Product
router.put('/:productName', verifyToken, async (req, res) => {
  const { productName } = req.params;
  const { quantity, lowStockThreshold } = req.body;
  const userEmail = req.user?.email;

  if (!userEmail) {
    return res.status(400).json({ error: 'User email not provided' });
  }

  try {
    console.log('User Email:', userEmail);
    console.log('Updating Product:', productName);

    const productRef = db.collection('users').doc(userEmail).collection('products').doc(productName);
    const docSnapshot = await productRef.get();

    if (!docSnapshot.exists) {
      console.log('Product not found:', productName);
      return res.status(404).json({ error: 'Product not found' });
    }

    const updates = {};
    if (quantity !== undefined) {
      const numericQuantity = Number(quantity);
      if (isNaN(numericQuantity)) {
        return res.status(400).json({ error: 'Quantity must be a valid number' });
      }
      updates.quantity = numericQuantity;
    }

    if (lowStockThreshold !== undefined) {
      const numericThreshold = Number(lowStockThreshold);
      if (isNaN(numericThreshold)) {
        return res.status(400).json({ error: 'Low stock threshold must be a valid number' });
      }
      updates.lowStockThreshold = numericThreshold;
    }

    updates.updatedAt = new Date();

    await productRef.update(updates);
    console.log('Product Updated:', updates);
    res.status(200).json({ message: 'Product updated successfully', updates });
  } catch (error) {
    console.error('Error updating product:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Delete Product
router.delete('/:productName', verifyToken, async (req, res) => {
  const { productName } = req.params;
  const userEmail = req.user?.email;

  if (!userEmail) {
    return res.status(400).json({ error: 'User email not provided' });
  }

  try {
    console.log('User Email:', userEmail);
    console.log('Deleting Product:', productName);

    const productRef = db.collection('users').doc(userEmail).collection('products').doc(productName);
    const docSnapshot = await productRef.get();

    if (!docSnapshot.exists) {
      console.log('Product not found:', productName);
      return res.status(404).json({ error: 'Product not found' });
    }

    await productRef.delete();
    console.log('Product Deleted:', productName);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error.message);
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
