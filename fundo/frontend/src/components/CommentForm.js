// frontend/src/components/CommentForm.js
import React, { useState } from 'react';
import api from '../axiosConfig'; // Your configured Axios instance
import { isAuthenticated } from '../api/AuthService'; // Assuming you have this helper

const CommentForm = ({ projectId, onCommentAdded }) => {
    const [commentContent, setCommentContent] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const loggedIn = isAuthenticated(); // Check if user is logged in

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (!loggedIn) {
            setError("You must be logged in to leave a comment.");
            setLoading(false);
            return;
        }

        if (commentContent.trim() === '') {
            setError("Comment cannot be empty.");
            setLoading(false);
            return;
        }

        try {
            const response = await api.post('/comments/', {
                project: projectId, // Pass the project ID
                content: commentContent,
            });
            setCommentContent(''); // Clear the form
            setLoading(false);
            onCommentAdded(response.data); // Notify parent to refresh comments
            console.log('Comment added:', response.data);
        } catch (err) {
            console.error('Error submitting comment:', err);
            setError('Failed to submit comment. Please try again.');
            setLoading(false);
        }
    };

    // Inline styles for the form
    const styles = {
        commentFormContainer: {
            padding: '20px',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            marginBottom: '20px',
        },
        textarea: {
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            minHeight: '80px',
            fontSize: '1em',
            boxSizing: 'border-box', // Crucial for padding/border not affecting width
        },
        button: {
            backgroundColor: '#007bff',
            color: 'white',
            padding: '10px 15px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1em',
            fontWeight: 'bold',
            transition: 'background-color 0.3s ease',
        },
        buttonHover: {
            backgroundColor: '#0056b3',
        },
        error: {
            color: 'red',
            marginBottom: '10px',
        },
        loginPrompt: {
            textAlign: 'center',
            padding: '15px',
            backgroundColor: '#ffe0b2',
            borderRadius: '4px',
            color: '#e65100',
            fontWeight: 'bold',
        }
    };

    if (!loggedIn) {
        return (
            <div style={styles.commentFormContainer}>
                <p style={styles.loginPrompt}>Please log in to leave a comment.</p>
            </div>
        );
    }

    return (
        <div style={styles.commentFormContainer}>
            <h3>Leave a Comment</h3>
            <form onSubmit={handleSubmit}>
                <textarea
                    style={styles.textarea}
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="Write your comment here..."
                    disabled={loading}
                ></textarea>
                {error && <p style={styles.error}>{error}</p>}
                <button
                    type="submit"
                    style={styles.button}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.button.backgroundColor}
                    disabled={loading}
                >
                    {loading ? 'Submitting...' : 'Post Comment'}
                </button>
            </form>
        </div>
    );
};

export default CommentForm;