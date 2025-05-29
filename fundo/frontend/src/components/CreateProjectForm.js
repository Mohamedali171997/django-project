// frontend/src/components/CreateProjectForm.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axiosConfig'; // Assuming you have an Axios instance configured for API calls

const CreateProjectForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        goal_amount: '',
        start_date: '',
        end_date: '',
        category: '', // Store category ID
        image: null, // For file input
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        // Fetch categories from your API
        const fetchCategories = async () => {
            try {
                const response = await api.get('/categories/');
                setCategories(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching categories:", err);
                setError("Failed to load categories. Please try again.");
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, image: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        // Basic client-side validation
        if (!formData.title || !formData.description || !formData.goal_amount || !formData.start_date || !formData.end_date || !formData.category) {
            setError("Please fill in all required fields.");
            return;
        }
        if (new Date(formData.end_date) < new Date(formData.start_date)) {
            setError("End date cannot be before start date.");
            return;
        }
        if (parseFloat(formData.goal_amount) <= 0) {
            setError("Goal amount must be greater than zero.");
            return;
        }

        const data = new FormData();
        for (const key in formData) {
            if (formData[key] !== null) { // Don't append null values
                data.append(key, formData[key]);
            }
        }

        try {
            const response = await api.post('/projects/', data, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Important for file uploads
                },
            });
            setSuccessMessage("Project created successfully!");
            console.log("Project created:", response.data);
            // Redirect to the newly created project's detail page or project list
            navigate('/projects'); // Or navigate(`/projects/${response.data.id}`); if you have a detail page
        } catch (err) {
            console.error("Error creating project:", err);
            // More specific error handling based on API response
            if (err.response && err.response.data) {
                setError(err.response.data.detail || err.response.data.message || "Failed to create project.");
                // If there are field-specific errors
                if (err.response.data.title) setError(prev => prev + ` Title: ${err.response.data.title}`);
                if (err.response.data.description) setError(prev => prev + ` Description: ${err.response.data.description}`);
                if (err.response.data.goal_amount) setError(prev => prev + ` Goal Amount: ${err.response.data.goal_amount}`);
                if (err.response.data.category) setError(prev => prev + ` Category: ${err.response.data.category}`);
                if (err.response.data.start_date) setError(prev => prev + ` Start Date: ${err.response.data.start_date}`);
                if (err.response.data.end_date) setError(prev => prev + ` End Date: ${err.response.data.end_date}`);
                if (err.response.data.image) setError(prev => prev + ` Image: ${err.response.data.image}`);
            } else {
                setError("Failed to create project. Please check your connection.");
            }
        }
    };

    if (loading) return <div>Loading categories...</div>;
    if (error && !categories.length) return <div>Error: {error}</div>; // Only show error if categories failed to load at start

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Create New Project</h2>
            {error && <p style={styles.error}>{error}</p>}
            {successMessage && <p style={styles.success}>{successMessage}</p>}
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                    <label htmlFor="title" style={styles.label}>Project Title:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="description" style={styles.label}>Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        style={styles.textarea}
                    ></textarea>
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="goal_amount" style={styles.label}>Goal Amount ($):</label>
                    <input
                        type="number"
                        id="goal_amount"
                        name="goal_amount"
                        value={formData.goal_amount}
                        onChange={handleChange}
                        required
                        min="0.01"
                        step="0.01"
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="start_date" style={styles.label}>Start Date:</label>
                    <input
                        type="date"
                        id="start_date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="end_date" style={styles.label}>End Date:</label>
                    <input
                        type="date"
                        id="end_date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="category" style={styles.label}>Category:</label>
                    <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        style={styles.select}
                    >
                        <option value="">Select a Category</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div style={styles.formGroup}>
                    <label htmlFor="image" style={styles.label}>Project Image:</label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={styles.fileInput}
                    />
                </div>
                <button type="submit" style={styles.button}>Create Project</button>
            </form>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '600px',
        margin: '50px auto',
        padding: '30px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
    },
    heading: {
        textAlign: 'center',
        color: '#333',
        marginBottom: '25px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    formGroup: {
        marginBottom: '18px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontWeight: 'bold',
        color: '#555',
    },
    input: {
        width: '100%',
        padding: '12px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        fontSize: '16px',
        boxSizing: 'border-box', // Ensure padding doesn't affect width
    },
    textarea: {
        width: '100%',
        padding: '12px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        fontSize: '16px',
        minHeight: '100px',
        resize: 'vertical',
        boxSizing: 'border-box',
    },
    select: {
        width: '100%',
        padding: '12px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        fontSize: '16px',
        boxSizing: 'border-box',
    },
    fileInput: {
        width: '100%',
        padding: '10px 0',
    },
    button: {
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '14px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '18px',
        marginTop: '20px',
        transition: 'background-color 0.3s ease',
    },
    buttonHover: {
        backgroundColor: '#45a049',
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginBottom: '15px',
        fontWeight: 'bold',
    },
    success: {
        color: 'green',
        textAlign: 'center',
        marginBottom: '15px',
        fontWeight: 'bold',
    },
};

export default CreateProjectForm;
