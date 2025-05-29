// frontend/src/components/ProjectDetail.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '../axiosConfig';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

const ProjectDetail = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [commentsError, setCommentsError] = useState(null);

    // Define styles object BEFORE it's used
    const styles = {
        container: {
            maxWidth: '900px',
            margin: '20px auto',
            padding: '30px',
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
            fontFamily: 'Arial, sans-serif',
        },
        header: {
            textAlign: 'center',
            marginBottom: '30px',
        },
        title: {
            fontSize: '2.8em',
            color: '#333',
            marginBottom: '10px',
            fontWeight: 'bold',
        },
        owner: {
            fontSize: '1.1em',
            color: '#666',
        },
        image: {
            width: '100%',
            height: '400px',
            objectFit: 'cover',
            borderRadius: '8px',
            marginBottom: '25px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        },
        description: {
            fontSize: '1.1em',
            color: '#444',
            lineHeight: '1.7',
            marginBottom: '25px',
        },
        detailsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '30px',
            padding: '20px',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            border: '1px solid #eee',
        },
        detailItem: {
            backgroundColor: '#ffffff',
            padding: '15px',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            textAlign: 'center',
            fontSize: '1.05em',
            color: '#555',
        },
        section: {
            marginTop: '30px',
            paddingTop: '20px',
            borderTop: '1px solid #eee',
        },
        sectionTitle: {
            fontSize: '2em',
            color: '#333',
            marginBottom: '20px',
            textAlign: 'center',
        },
        progressBarContainer: {
            width: '100%',
            backgroundColor: '#e0e0e0',
            borderRadius: '5px',
            overflow: 'hidden',
            marginBottom: '15px',
        },
        progressBarFill: {
            height: '25px',
            backgroundColor: '#28a745',
            // This will be calculated dynamically based on project.percentage_funded
            width: '0%', // Initial width
            borderRadius: '5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '0.9em',
        },
    };

    // Helper to format date
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Function to fetch comments
    const fetchComments = useCallback(async () => {
        setCommentsLoading(true);
        setCommentsError(null);
        try {
            const response = await api.get(`/projects/${id}/comments/`);
            setComments(response.data);
            setCommentsLoading(false);
        } catch (err) {
            console.error("Error fetching comments:", err);
            setCommentsError("Failed to load comments. Please try again.");
            setCommentsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await api.get(`/projects/${id}/`);
                setProject(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching project details:", err);
                if (err.response && err.response.status === 404) {
                    setError("Project not found.");
                } else {
                    setError("Failed to load project details. Please try again.");
                }
                setLoading(false);
            }
        };

        fetchProject();
        fetchComments();
    }, [id, fetchComments]);

    const handleCommentAdded = (newComment) => {
        setComments(prevComments => [...prevComments, newComment]);
    };

    if (loading) return <div style={styles.container}>Loading project...</div>;
    if (error) return <div style={styles.container}>Error: {error}</div>;
    if (!project) return <div style={styles.container}>Project not found.</div>;

    // Convert numerical string values to actual numbers for calculations and formatting
    const percentageFunded = parseFloat(project.percentage_funded);
    const goalAmount = parseFloat(project.goal_amount);
    const currentAmount = parseFloat(project.current_amount);
    let imageUrl = 'https://via.placeholder.com/600x400?text=No+Image';

    if (project.image) {
        let rawImagePath = project.image;
        if (!rawImagePath.startsWith('http')) {
            rawImagePath = `http://localhost:8000${rawImagePath}`;
        }
        imageUrl = rawImagePath;
    }

    // Dynamic width for progress bar
    const progressBarWidth = `${Math.min(100, Math.max(0, percentageFunded))}%`;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>{project.title}</h1>
                <p style={styles.owner}>by {project.owner_username}</p>
            </div>

            <img src={imageUrl} alt={project.title} style={styles.image} />

            <div style={styles.description}>{project.description}</div>

            <div style={styles.detailsGrid}>
                <div style={styles.detailItem}>
                    <strong>Goal:</strong> ${isNaN(goalAmount) ? '0.00' : goalAmount.toFixed(2)}
                </div>
                <div style={styles.detailItem}>
                    <strong>Current:</strong> ${isNaN(currentAmount) ? '0.00' : currentAmount.toFixed(2)}
                </div>
                <div style={styles.detailItem}>
                    <strong>Funded:</strong> {isNaN(percentageFunded) ? '0.00' : percentageFunded.toFixed(2)}%
                </div>
                <div style={styles.detailItem}>
                    <strong>Starts:</strong> {formatDate(project.start_date)}
                </div>
                <div style={styles.detailItem}>
                    <strong>Ends:</strong> {formatDate(project.end_date)}
                </div>
                <div style={styles.detailItem}>
                    <strong>Status:</strong> {project.is_active ? "Active" : "Closed"}
                </div>
            </div>

            {/* Progress Bar */}
            <div style={styles.progressBarContainer}>
                <div style={{ ...styles.progressBarFill, width: progressBarWidth }}>
                    {percentageFunded.toFixed(2)}% Funded
                </div>
            </div>

            {/* Comments Section */}
            <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Comments</h3>
                {commentsLoading ? (
                    <p>Loading comments...</p>
                ) : commentsError ? (
                    <p style={{ color: 'red' }}>Error: {commentsError}</p>
                ) : (
                    <CommentList comments={comments} />
                )}
                <CommentForm projectId={id} onCommentAdded={handleCommentAdded} />
            </div>

            {/* Placeholder for Donations section - will add this next */}
            <div style={styles.section}>
                <h3 style={styles.sectionTitle}>Donations</h3>
                <p>Donation list and form will go here.</p>
            </div>
        </div>
    );
};

export default ProjectDetail;