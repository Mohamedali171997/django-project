// frontend/src/components/ProjectCard.js
import React from 'react';
import { Link } from 'react-router-dom'; // Make sure Link is imported

function ProjectCard({ project }) {
    let imageUrl = 'https://via.placeholder.com/300x200?text=No+Image';

    if (project.image) {
        let rawImagePath = project.image;

        // 1. Remove potential full domain from the start if it exists
        rawImagePath = rawImagePath.replace('http://localhost:8000', '');

        // 2. Ensure it starts with /media/ (or just / if your Django MEDIA_URL is just '/')
        // Based on your setup, it should be /media/
        if (!rawImagePath.startsWith('/media/')) {
            // This handles cases where project.image is "project_images/..."
            // or just "téléchargement.png"
            rawImagePath = `/media/${rawImagePath}`;
        }

        // Now, combine with the base URL for the frontend display
        imageUrl = `http://localhost:8000${rawImagePath}`;
    }

    // Convert numerical string values to actual numbers for calculations and formatting
    const percentageFunded = parseFloat(project.percentage_funded);
    const goalAmount = parseFloat(project.goal_amount);
    const currentAmount = parseFloat(project.current_amount);

    return (
        // --- ADD THE LINK COMPONENT HERE, WRAPPING THE ENTIRE CARD ---
        <Link to={`/projects/${project.id}`} style={styles.link}>
            <div style={styles.card}>
                <img src={imageUrl} alt={project.title} style={styles.image} />
                <div style={styles.content}>
                    <h3 style={styles.title}>{project.title}</h3>
                    {/* Safely truncate description and add ellipsis */}
                    <p style={styles.description}>
                        {project.description ? project.description.substring(0, 100) + '...' : ''}
                    </p>
                    <p style={styles.info}>
                        {/* Use toFixed for correct currency display */}
                        Goal: ${isNaN(goalAmount) ? '0.00' : goalAmount.toFixed(2)} | Current: ${isNaN(currentAmount) ? '0.00' : currentAmount.toFixed(2)}
                    </p>
                    <div style={styles.progressBarContainer}>
                        <div
                            style={{
                                ...styles.progressBarFill,
                                // Ensure percentageFunded is a number and clamp between 0 and 100
                                width: `${isNaN(percentageFunded) ? 0 : Math.min(percentageFunded, 100)}%`
                            }}
                        ></div>
                    </div>
                    <p style={styles.info}>
                        {/* Use the parsed percentageFunded variable and toFixed */}
                        Funded: {isNaN(percentageFunded) ? '0.00' : percentageFunded.toFixed(2)}%
                    </p>
                    <p style={styles.owner}>By: {project.owner_username}</p>
                </div>
            </div>
        </Link>
        // --- END OF LINK COMPONENT ---
    );
}

const styles = {
    link: {
        textDecoration: 'none', // Remove underline from the link
        color: 'inherit',        // Ensure text color is inherited, not blue like default links
        display: 'block',        // Make the link fill the card's space
        // Add hover effects here if desired for the link itself
        // e.g., ':hover': { transform: 'translateY(-3px)' } (but this is done on the card div)
    },
    card: {
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        margin: '15px',
        width: '300px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        backgroundColor: '#fff',
        transition: 'transform 0.2s ease-in-out', // Smooth transition for hover effect
        cursor: 'pointer', // Indicate it's clickable
    },
    cardHover: { // Define a hover style for the card itself
        transform: 'translateY(-5px)', // Example: lift the card on hover
    },
    image: {
        width: '100%',
        height: '200px',
        objectFit: 'cover',
    },
    content: {
        padding: '15px',
        flexGrow: 1, // Makes content expand to fill available space
    },
    title: {
        fontSize: '1.2em',
        marginBottom: '8px',
        color: '#333',
    },
    description: {
        fontSize: '0.9em',
        color: '#666',
        marginBottom: '10px',
    },
    info: {
        fontSize: '0.9em',
        color: '#555',
        marginBottom: '5px',
    },
    owner: {
        fontSize: '0.8em',
        color: '#888',
        marginTop: '10px',
    },
    progressBarContainer: {
        width: '100%',
        backgroundColor: '#e0e0e0',
        borderRadius: '5px',
        height: '10px',
        marginTop: '10px',
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#4CAF50', // Green
        borderRadius: '5px',
    },
};

export default ProjectCard;