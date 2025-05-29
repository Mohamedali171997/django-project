// frontend/src/components/CommentList.js
import React from 'react';

const CommentList = ({ comments }) => {
    const styles = {
        commentsListContainer: {
            padding: '20px',
            backgroundColor: '#f9f9f9',
            borderRadius: '8px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        },
        commentItem: {
            backgroundColor: 'white',
            padding: '15px',
            borderBottom: '1px solid #eee',
            marginBottom: '10px',
            borderRadius: '6px',
        },
        commentItemLast: { // No border bottom for the last item
            borderBottom: 'none',
            marginBottom: '0',
        },
        commentHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '5px',
        },
        commentAuthor: {
            fontWeight: 'bold',
            color: '#333',
        },
        commentDate: {
            fontSize: '0.85em',
            color: '#777',
        },
        commentContent: {
            fontSize: '1em',
            color: '#444',
            lineHeight: '1.5',
        },
        noComments: {
            textAlign: 'center',
            color: '#777',
            fontStyle: 'italic',
        },
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (!comments || comments.length === 0) {
        return (
            <div style={styles.commentsListContainer}>
                <p style={styles.noComments}>No comments yet. Be the first to comment!</p>
            </div>
        );
    }

    return (
        <div style={styles.commentsListContainer}>
            {comments.map((comment, index) => (
                <div
                    key={comment.id}
                    style={{
                        ...styles.commentItem,
                        ...(index === comments.length - 1 ? styles.commentItemLast : {})
                    }}
                >
                    <div style={styles.commentHeader}>
                        <span style={styles.commentAuthor}>{comment.commenter_username || 'Anonymous'}</span>
                        <span style={styles.commentDate}>{formatDate(comment.created_at)}</span>
                    </div>
                    <p style={styles.commentContent}>{comment.content}</p>
                </div>
            ))}
        </div>
    );
};

export default CommentList;