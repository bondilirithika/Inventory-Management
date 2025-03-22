const { db } = require('../firebaseConfig');
const { collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc } = require('firebase/firestore');

// Reference to the 'products' collection
const productCollection = collection(db, 'products');

// Create Product
const createProduct = async (productData) => {
  const newDocRef = doc(productCollection); // Auto-generate ID
  await setDoc(newDocRef, productData);
  return { id: newDocRef.id, ...productData };
};

// Get All Products
const getAllProducts = async () => {
  const snapshot = await getDocs(productCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Get Product by ID
const getProductById = async (productId) => {
  const docRef = doc(productCollection, productId);
  const productDoc = await getDoc(docRef);
  if (!productDoc.exists()) throw new Error('Product not found');
  return { id: productDoc.id, ...productDoc.data() };
};

// Update Product
const updateProduct = async (productId, updatedData) => {
  const docRef = doc(productCollection, productId);
  await updateDoc(docRef, updatedData);
  return { id: productId, ...updatedData };
};

// Delete Product
const deleteProduct = async (productId) => {
  const docRef = doc(productCollection, productId);
  await deleteDoc(docRef);
  return { message: 'Product deleted successfully' };
};

module.exports = { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct };
