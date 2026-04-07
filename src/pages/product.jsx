// import React from 'react'
// import { motion } from "framer-motion";

// export const ProductListing = () => {
//   return (
//     <motion.div
//                 style={containerStyles}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.8 }}
//             >
//               <h2 style={titleStyles}>Product Dashboard</h2>
            
//             </motion.div>
//   )
// }

// // ==================== STYLES ====================
// const containerStyles = {
//     // backgroundColor: '#1f2937',
//     boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
//     borderRadius: '0.5rem',
//     padding: '2rem',
//     paddingTop: '4rem',
//     maxWidth: '36rem',
//     margin: '0 auto',
// };

// const titleStyles = {
//     fontSize: '1.5rem',
//     fontWeight: 600,
//     marginBottom: '1.5rem',
//     color: '#6ee7b7',
// };



// ProductList.jsx
import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {useProductStore} from '../stores/useProductStore';
// import ProductFormModal from '../comp/ProductFormModal';
import './ProductList.css'; // Import CSS file

// Main Component
// export default function ProductsScreen() {
export const ProductListing = () => {
  const {
    deleteProduct,
    toggleFeaturedProduct,
    products,
    fetchProducts,
    loading,
    error,
    clearError,
    // createProduct,
    // updateProduct,
  } = useProductStore();
  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // const handleSubmit = useCallback(async (formData, productId) => {
  //   try {
  //     if (productId) {
  //       await updateProduct(productId, formData);
  //     } else {
  //       await createProduct(formData);
  //     }
  //     setShowModal(false);
  //     setEditingProduct(null);
  //   } catch (error) {
  //     alert("Failed to save product: " + error.message);
  //     throw error;
  //   }
  // }, [createProduct, updateProduct]);

  // const closeModal = useCallback(() => {
  //   setShowModal(false);
  //   setEditingProduct(null);
  // }, []);

  const ProductCard = ({ product, index }) => {
    const [imageError, setImageError] = useState(false);

    return (
      <motion.div
        className="product-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
      >
        <div className="card-content">
          <div className="image-container">
            <img
              src={imageError ? '/placeholder-image.jpg' : product.image}
              alt={product.name}
              className="product-image"
              onError={() => setImageError(true)}
            />
            {product.isFeatured && (
              <div className="featured-badge">
                <span className="featured-badge-text">Featured</span>
              </div>
            )}
          </div>

          <div className="product-details">
            <div className="product-header">
              <h3 className="product-name">{product.name}</h3>
              {/* <button
                onClick={() => toggleFeaturedProduct(product._id)}
                className="star-button"
                aria-label={product.isFeatured ? "Remove from featured" : "Add to featured"}
              >
                {product.isFeatured ? "★" : "☆"}
              </button> */}
            </div>

            <span className="product-category">{product.category}</span>

            <p className="product-description">
              {product.description || "No description available"}
            </p>

            <div className="price-stock-container">
              <span className="product-price">
                Rs {product.price}
              </span>
              {/* <div className="stock-badge">
                <span className="stock-text">Stock: {product.stock || 0}</span>
              </div> */}
            </div>

            <div className="action-buttons">
              <button
                onClick={() => deleteProduct(product._id)}
                className="action-button delete-button"
              >
                Delete
              </button>

              {/* <button
                onClick={() => {
                  setEditingProduct(product);
                  setShowModal(true);
                }}
                className="action-button edit-button"
              >
                Edit
              </button> */}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-text">{error}</p>
        <button 
          onClick={() => {
            clearError();
            fetchProducts();
          }} 
          className="retry-button"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      className="container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="products-list">
        {/* Header */}
        <div className="header-container">
          <div>
            <h1 className="title">Products</h1>
          </div>
            <p className="subtitle">
              {products.length} items available
            </p>
          {/* <button 
            onClick={() => setShowModal(true)} 
            className="add-button"
            aria-label="Add new product"
          >
            + Add Product
          </button> */}
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="empty-container">
            <p className="empty-text">No products found</p>
            <p className="empty-subtext">
              Add your first product to get started
            </p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map((product, index) => (
              <ProductCard 
                key={product._id} 
                product={product} 
                index={index}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* ADD/EDIT PRODUCT MODAL */}
      {/* <ProductFormModal
        isOpen={showModal}
        editingProduct={editingProduct}
        onSubmit={handleSubmit}
        onClose={closeModal}
      /> */}
    </motion.div>
  );
}