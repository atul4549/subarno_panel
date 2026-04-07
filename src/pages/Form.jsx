import React, { useState } from 'react';
import { motion } from "framer-motion";
import { useProductStore } from "../stores/useProductStore";

// ==================== CONSTANTS ====================
const categories = [

    'Bathroom Wall Tile',
    'Kitchen Wall Tile',
    'Elevation Wall Tile',
    'Floor Tile',

    // { mainCategory: 'wall_tile', subcategory: ['bathroom', "kitchen", "elevation"] },
    // { mainCategory: 'floor_tile', subcategory: ["24x24_matt", "24x24_gvt", "24x24_double_charge", "24x48"] }
];

// ==================== STYLES ====================
const containerStyles = {
    backgroundColor: '#1f2937',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    borderRadius: '0.5rem',
    padding: '2rem',
    paddingTop: '4rem',
    maxWidth: '36rem',
    margin: '0 auto',
};

const titleStyles = {
    fontSize: '1.5rem',
    fontWeight: 600,
    marginBottom: '1.5rem',
    color: '#6ee7b7',
};

const formStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
};

const inputBaseStyles = {
    display: 'block',
    width: '100%',
    backgroundColor: '#374151',
    border: '1px solid #4b5563',
    borderRadius: '0.375rem',
    padding: '0.5rem 0.75rem',
    color: 'white',
    outline: 'none',
    transition: 'border-color 300ms ease-in-out, box-shadow 300ms ease-in-out',
};

const inputFocusStyles = {
    borderColor: '#10b981',
    boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.2)',
};

const textareaStyles = {
    ...inputBaseStyles,
    resize: 'vertical',
    minHeight: '5rem',
};

const selectStyles = {
    ...inputBaseStyles,
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
    backgroundPosition: 'right 0.5rem center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '1.5em 1.5em',
    paddingRight: '2.5rem',
};

const fileUploadContainerStyles = {
    marginTop: '0.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
};

const fileInputStyles = {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: 0,
};

const fileLabelStyles = {
    cursor: 'pointer',
    backgroundColor: '#374151',
    padding: '0.5rem 0.75rem',
    border: '1px solid #4b5563',
    borderRadius: '0.375rem',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: '1.25rem',
    color: '#d1d5db',
    display: 'inline-flex',
    alignItems: 'center',
    transition: 'background-color 300ms ease-in-out',
};

const fileLabelHoverStyles = {
    backgroundColor: '#4b5563',
};

const uploadedTextStyles = {
    fontSize: '0.875rem',
    color: '#9ca3af',
};

const previewImageStyles = {
    maxWidth: '100px',
    maxHeight: '100px',
    borderRadius: '0.375rem',
    border: '2px solid #10b981',
    objectFit: 'cover',
};

const removeButtonStyles = {
    cursor: 'pointer',
    backgroundColor: '#dc2626',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.375rem',
    fontSize: '0.75rem',
    color: 'white',
    border: 'none',
    marginLeft: '0.5rem',
};

// ==================== MAIN COMPONENT ====================
export const Form = () => {
    const { createProduct, loading } = useProductStore();
    
    // State
    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        price: 100,
        category: "",
        image: null,  // Will store Base64 string
        subCategory: ""
    });
    
    const [imagePreview, setImagePreview] = useState(null); // For preview display

    // ==================== HANDLERS ====================
    const handleCategoryChange = (e) => {
        const selectedCategory = e.target.value;
        setNewProduct({ 
            ...newProduct, 
            category: selectedCategory,
            subCategory: ""
        });
    };

    // ==================== IMAGE HANDLER (Base64 version) ====================
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        
        if (file) {
            // Check if file is an image
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }
            
            // Check file size (e.g., limit to 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }
            
            // Create FileReader to convert to Base64
            const reader = new FileReader();
            
            // Set up what happens when the file is loaded
            reader.onloadend = () => {
                // Store Base64 string in state
                setNewProduct({ ...newProduct, image: reader.result });
                // Also store preview URL (optional, for better performance)
                setImagePreview(reader.result);
            };
            
            // Start reading the file as Base64
            reader.readAsDataURL(file);
        } else {
            // Handle case when user cancels or removes file
            setNewProduct({ ...newProduct, image: null });
            setImagePreview(null);
        }
    };

    // Optional: Function to remove image
    const handleRemoveImage = () => {
        setNewProduct({ ...newProduct, image: null });
        setImagePreview(null);
        // Clear the file input
        const fileInput = document.getElementById('image');
        if (fileInput) fileInput.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate image is selected
        if (!newProduct.image) {
            alert('Please upload an image');
            return;
        }
        
        try {
            // Send the product data with Base64 image
            await createProduct(newProduct);
            
            console.log("Product created successfully", newProduct);
            
            // Reset form
            setNewProduct({ 
                name: "", 
                description: "", 
                price: "", 
                category: "", 
                subCategory: "", 
                image: null 
            });
            setImagePreview(null);
            
            // Reset file input
            const fileInput = document.getElementById('image');
            if (fileInput) fileInput.value = '';
            
        } catch (error) {
            console.log("Error creating product:", error);
            alert('Failed to create product. Please try again.');
        }
    };

    // Helper function to get subcategories
    const getSubcategories = () => {
        const selectedCategory = categories.find(cat => cat.mainCategory === newProduct.category);
        return selectedCategory ? selectedCategory.subcategory : [];
    };

    // Dynamic button styles
    const submitButtonStyles = {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        padding: '0.5rem 1rem',
        border: '1px solid transparent',
        borderRadius: '0.375rem',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        fontSize: '0.875rem',
        fontWeight: 500,
        color: 'white',
        backgroundColor: loading ? '#059669' : '#10b981',
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'background-color 300ms ease-in-out',
        opacity: loading ? 0.5 : 1,
    };

    const submitButtonHoverStyles = {
        backgroundColor: '#047857',
    };

    // ==================== RENDER ====================
    return (
        <motion.div
            style={containerStyles}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <h2 style={titleStyles}>Create New Product</h2>
            
            <form onSubmit={handleSubmit} style={formStyles}>
                {/* Product Name */}
                <div>
                    <input
                        type='text'
                        id='name'
                        name='name'
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        style={inputBaseStyles}
                        onFocus={(e) => Object.assign(e.target.style, inputFocusStyles)}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#4b5563';
                            e.target.style.boxShadow = 'none';
                        }}
                        required
                        placeholder='Product Name'
                    />
                </div>
                
                {/* Category Select */}
                <div>
                    <select
                        style={selectStyles}
                        value={newProduct.category}
                        onChange={handleCategoryChange}
                        required
                    >
                        <option value="">Select category</option>
                        {categories.map(cat => (
                            // <option key={cat.mainCategory} value={cat.mainCategory}>
                            //     {cat.mainCategory.replace('_', ' ').toUpperCase()}
                            // </option>
                            <option>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Subcategory Select */}
                {/* {newProduct.category && (
                    <div>
                        <select
                            style={selectStyles}
                            value={newProduct.subCategory}
                            onChange={(e) => setNewProduct({ ...newProduct, subCategory: e.target.value })}
                            required
                        >
                            <option value="">Select subcategory</option>
                            {getSubcategories().map(sub => (
                                <option key={sub} value={sub}>
                                    {sub.replace(/_/g, ' ').toUpperCase()}
                                </option>
                            ))}
                        </select>
                    </div>
                )} */}
                
                {/* Description */}
                <div>
                    <textarea
                        id='description'
                        name='description'
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                        rows={3}
                        style={textareaStyles}
                        onFocus={(e) => Object.assign(e.target.style, inputFocusStyles)}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#4b5563';
                            e.target.style.boxShadow = 'none';
                        }}
                        required
                        placeholder='Description'
                    />
                </div>

                {/* Price */}
                <div>
                    <input
                        type='number'
                        id='price'
                        name='price'
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        step='0.01'
                        style={inputBaseStyles}
                        onFocus={(e) => Object.assign(e.target.style, inputFocusStyles)}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#4b5563';
                            e.target.style.boxShadow = 'none';
                        }}
                        required
                        placeholder="Price"
                    />
                </div>

                {/* Image Upload Section with handleImageChange */}
                <div style={fileUploadContainerStyles}>
                    <input
                        type='file'
                        id='image'
                        style={fileInputStyles}
                        accept='image/jpeg, image/png, image/jpg, image/gif, image/webp'
                        onChange={handleImageChange}  // ← handleImageChange is used here
                    />
                    <label
                        htmlFor='image'
                        style={fileLabelStyles}
                        onMouseEnter={(e) => Object.assign(e.target.style, fileLabelHoverStyles)}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = fileLabelStyles.backgroundColor;
                        }}
                    >
                        📸 Choose Image
                    </label>
                    
                    {newProduct.image && (
                        <span style={uploadedTextStyles}>
                            ✓ Image ready (Base64 encoded)
                        </span>
                    )}
                </div>

                {/* Image Preview Section */}
                {imagePreview && (
                    <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img 
                            src={imagePreview} 
                            alt="Product preview" 
                            style={previewImageStyles}
                        />
                        <button
                            type="button"
                            onClick={handleRemoveImage}
                            style={removeButtonStyles}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#991b1b'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
                        >
                            Remove
                        </button>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type='submit'
                    style={submitButtonStyles}
                    disabled={loading}
                    onMouseEnter={(e) => !loading && Object.assign(e.target.style, submitButtonHoverStyles)}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = loading ? '#059669' : '#10b981';
                    }}
                >
                    {loading ? "⏳ Creating Product..." : "✨ Create Product"}
                </button>
            </form>
        </motion.div>
    );
};