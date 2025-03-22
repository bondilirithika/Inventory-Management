import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import { auth } from '../../firebase';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', quantity: 0 });
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  // Fetch Products
  const fetchProducts = useCallback(async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error('User not authenticated');
        return;
      }
      const token = await user.getIdToken();
      const response = await axios.get('http://localhost:5000/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error.message);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Add Product
  const handleAddProduct = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();
      await axios.post('http://localhost:5000/products', newProduct, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewProduct({ name: '', quantity: 0 });
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error.message);
    }
  };

  // Edit Product
  const handleEditProduct = async () => {
    try {
      const user = auth.currentUser;
      if (!user || !currentProduct) return;
      const token = await user.getIdToken();
      await axios.put(`http://localhost:5000/products/${currentProduct.id}`, currentProduct, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowModal(false);
      fetchProducts();
    } catch (error) {
      console.error('Error editing product:', error.message);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (productId) => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const token = await user.getIdToken();
      await axios.delete(`http://localhost:5000/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error.message);
    }
  };

  // Modal Setup
  const openEditModal = (product) => {
    setCurrentProduct(product);
    setShowModal(true);
  };

  return (
    <div>
      <h1>Product Management</h1>
      
      {/* Add Product Form */}
      <Form>
        <Form.Group>
          <Form.Label>Product Name</Form.Label>
          <Form.Control
            type="text"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Quantity</Form.Label>
          <Form.Control
            type="number"
            value={newProduct.quantity}
            onChange={(e) => setNewProduct({ ...newProduct, quantity: Number(e.target.value) })}
            required
          />
        </Form.Group>
        <Button onClick={handleAddProduct}>Add Product</Button>
      </Form>

      {/* Product Table */}
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.quantity}</td>
                <td>
                  <Button variant="warning" onClick={() => openEditModal(product)}>Edit</Button>{' '}
                  <Button variant="danger" onClick={() => handleDeleteProduct(product.id)}>Delete</Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No products available</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                value={currentProduct?.name || ''}
                onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="number"
                value={currentProduct?.quantity || 0}
                onChange={(e) => setCurrentProduct({ ...currentProduct, quantity: Number(e.target.value) })}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditProduct}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductManagement;
