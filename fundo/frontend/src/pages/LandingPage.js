// frontend/src/pages/LandingPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHandshake, FaRocket, FaUsers } from 'react-icons/fa';
import api from '../axiosConfig';
import ProjectCard from '../components/ProjectCard'; // Re-use your existing ProjectCard

const LandingPage = () => {
    const [popularProjects, setPopularProjects] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [errorProjects, setErrorProjects] = useState(null);

    useEffect(() => {
        const fetchPopularProjects = async () => {
            try {
                const response = await api.get('/projects/', {
                    params: {
                        limit: 3 // Request 3 projects
                    }
                });
                setPopularProjects(response.data.results ? response.data.results.slice(0, 3) : response.data.slice(0, 3));
                setLoadingProjects(false);
            } catch (err) {
                console.error("Error fetching popular projects:", err);
                setErrorProjects("Failed to load popular projects. Please try again.");
                setLoadingProjects(false);
            }
        };

        fetchPopularProjects();
    }, []);

    const styles = {
        container: {
            fontFamily: 'Arial, sans-serif',
            color: '#333',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#f8f9fa', // Light gray background
            // Added padding top to account for the fixed global Navbar
            paddingTop: '00px', // Adjust this value based on your Navbar's height
        },
        // REMOVED HEADER RELATED STYLES:
        // header: {}, logo: {}, nav: {}, navLink: {}, navLinkHover: {}

        primaryButton: {
            backgroundColor: '#007bff',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
            textDecoration: 'none',
            fontWeight: 'bold',
            transition: 'background-color 0.3s ease',
            border: 'none',
            cursor: 'pointer',
        },
        primaryButtonHover: {
            backgroundColor: '#0056b3',
        },
        secondaryButton: {
            backgroundColor: 'transparent',
            color: '#007bff',
            padding: '10px 20px',
            borderRadius: '5px',
            textDecoration: 'none',
            fontWeight: 'bold',
            transition: 'background-color 0.3s ease, color 0.3s ease',
            border: '2px solid #007bff',
            cursor: 'pointer',
        },
        secondaryButtonHover: {
            backgroundColor: '#e0f2ff',
            color: '#0056b3',
        },
        heroSection: {
            background: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("/hero-bg.jpg") center/cover no-repeat',
            color: 'white',
            padding: '120px 20px',
            textAlign: 'center',
            minHeight: '500px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        },
        heroTitle: {
            fontSize: '3.5em',
            marginBottom: '15px',
            fontWeight: 'bold',
            maxWidth: '900px',
            margin: '0 auto 15px auto',
        },
        heroSubtitle: {
            fontSize: '1.5em',
            marginBottom: '40px',
            maxWidth: '700px',
            lineHeight: '1.5',
        },
        buttonContainer: {
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
        },
        section: {
            padding: '60px 20px',
            textAlign: 'center',
            maxWidth: '1200px',
            margin: '40px auto',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
        },
        sectionTitle: {
            fontSize: '2.5em',
            marginBottom: '40px',
            color: '#333',
            fontWeight: 'bold',
        },
        gridContainer: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '30px',
            justifyContent: 'center',
        },
        card: {
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '25px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
            transition: 'transform 0.3s ease',
        },
        cardHover: {
            transform: 'translateY(-5px)',
        },
        cardIcon: {
            fontSize: '3em',
            color: '#007bff',
            marginBottom: '15px',
        },
        cardTitle: {
            fontSize: '1.5em',
            fontWeight: 'bold',
            marginBottom: '10px',
        },
        cardDescription: {
            fontSize: '1em',
            color: '#555',
            lineHeight: '1.6',
        },
        projectCardContainer: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '20px', // Space between ProjectCard components
        },
        imageSection: {
            display: 'flex',
            alignItems: 'center',
            gap: '40px',
            flexDirection: 'column',
        },
        imageContainer: {
            maxWidth: '500px',
            borderRadius: '15px',
            overflow: 'hidden',
            boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
        },
        responsiveImage: {
            width: '100%',
            height: 'auto',
            display: 'block',
        },
        mapSection: {
            padding: '60px 20px',
            textAlign: 'center',
            maxWidth: '900px',
            margin: '40px auto',
            backgroundColor: '#f0f4f8', // Slightly different background for map
            borderRadius: '8px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
        },
        mapIframe: {
            width: '100%',
            height: '400px',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        },
        footer: {
            backgroundColor: '#333',
            color: 'white',
            padding: '30px 20px',
            textAlign: 'center',
            marginTop: 'auto', // Pushes footer to the bottom
        },
    };

    return (
        <div style={styles.container}>
            {/* The global Navbar from App.js will now handle navigation */}

            {/* Hero Section */}
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={styles.heroSection}
            >
                <h2 style={styles.heroTitle}>Investissez dans le futur de la Tunisie</h2>
                <p style={styles.heroSubtitle}>
                    Fundo connecte les entrepreneurs tunisiens avec les investisseurs et les supporters pour bâtir ensemble un avenir prospère.
                </p>
                <div style={styles.buttonContainer}>
                    <Link to="/projects" style={styles.primaryButton}
                        onMouseOver={(e) => Object.assign(e.currentTarget.style, styles.primaryButtonHover)}
                        onMouseOut={(e) => Object.assign(e.currentTarget.style, styles.primaryButton)}
                    >
                        Découvrir les projets
                    </Link>
                    <Link to="/create-project" style={styles.secondaryButton}
                        onMouseOver={(e) => Object.assign(e.currentTarget.style, styles.secondaryButtonHover)}
                        onMouseOut={(e) => Object.assign(e.currentTarget.style, styles.secondaryButton)}
                    >
                        Lancer un projet
                    </Link>
                </div>
            </motion.section>

            {/* How It Works Section */}
            <section style={styles.section}>
                <h2 style={styles.sectionTitle}>Comment ça marche ?</h2>
                <div style={styles.gridContainer}>
                    <motion.div style={styles.card}
                        whileHover={styles.cardHover}
                    >
                        <FaRocket style={styles.cardIcon} />
                        <h3 style={styles.cardTitle}>Lancez vos idées</h3>
                        <p style={styles.cardDescription}>Proposez vos projets et recevez le soutien de la communauté tunisienne.</p>
                    </motion.div>
                    <motion.div style={styles.card}
                        whileHover={styles.cardHover}
                    >
                        <FaUsers style={styles.cardIcon} />
                        <h3 style={styles.cardTitle}>Trouvez des supporters</h3>
                        <p style={styles.cardDescription}>Attirez des investisseurs et donateurs locaux pour concrétiser vos rêves.</p>
                    </motion.div>
                    <motion.div style={styles.card}
                        whileHover={styles.cardHover}
                    >
                        <FaHandshake style={styles.cardIcon} />
                        <h3 style={styles.cardTitle}>Créez des connexions</h3>
                        <p style={styles.cardDescription}>Collaborez avec des talents et bâtissez des projets à impact réel en Tunisie.</p>
                    </motion.div>
                </div>
            </section>

            {/* Popular Projects Section */}
            <section style={{...styles.section, backgroundColor: '#f0f4f8'}}>
                <h2 style={styles.sectionTitle}>Projets populaires</h2>
                {loadingProjects ? (
                    <p>Chargement des projets...</p>
                ) : errorProjects ? (
                    <p style={{ color: 'red' }}>{errorProjects}</p>
                ) : popularProjects.length > 0 ? (
                    <div style={styles.projectCardContainer}>
                        {popularProjects.map(project => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                ) : (
                    <p>Aucun projet populaire trouvé pour le moment.</p>
                )}
            </section>

            {/* Call to Action for Community Support */}
            <section style={styles.section}>
                <div style={{...styles.gridContainer, gridTemplateColumns: '1fr', '@media (min-width: 768px)': { gridTemplateColumns: '1fr 1fr', textAlign: 'left' }}}>
                    <div style={styles.imageContainer}>
                        <img
                            src="/images/community-support.jpg"
                            alt="Communauté solidaire"
                            style={styles.responsiveImage}
                        />
                    </div>
                    <div>
                        <h2 style={{...styles.sectionTitle, textAlign: 'left', marginBottom: '20px'}}>Unissez-vous pour impacter</h2>
                        <p style={{fontSize: '1.1em', color: '#555', lineHeight: '1.6', marginBottom: '30px'}}>
                            Chaque contribution aide à bâtir une Tunisie plus forte, innovante et solidaire. Participez à des histoires uniques et faites partie du changement.
                        </p>
                        <Link to="/projects" style={styles.primaryButton}
                            onMouseOver={(e) => Object.assign(e.currentTarget.style, styles.primaryButtonHover)}
                            onMouseOut={(e) => Object.assign(e.currentTarget.style, styles.primaryButton)}
                        >
                            Explorer les réussites
                        </Link>
                    </div>
                </div>
            </section>

            {/* Interactive Map Section */}
            <section style={styles.mapSection}>
                <h2 style={styles.sectionTitle}>Carte interactive de la Tunisie</h2>
                <p style={{fontSize: '1.1em', color: '#555', marginBottom: '30px'}}>
                    Découvrez les projets en cours dans différentes régions tunisiennes. Cliquez sur les marqueurs pour en savoir plus.
                </p>
                <div style={styles.mapIframeContainer}>
                    <iframe
                        src="https://www.openstreetmap.org/export/embed.html?bbox=7.5,30.0,12.0,37.5&layer=mapnik"
                        style={styles.mapIframe}
                        allowFullScreen
                        loading="lazy"
                        title="Carte de la Tunisie"
                    ></iframe>
                </div>
            </section>

            {/* Final Call to Action Section */}
            <section style={{...styles.section, marginBottom: '0'}}>
                <h2 style={styles.sectionTitle}>Rejoignez la communauté Fundo</h2>
                <p style={{fontSize: '1.1em', color: '#555', marginBottom: '40px'}}>
                    Que vous soyez un entrepreneur à la recherche de financement ou un investisseur souhaitant soutenir l'innovation locale, Fundo est votre plateforme.
                </p>
                <Link to="/register" style={styles.primaryButton}
                    onMouseOver={(e) => Object.assign(e.currentTarget.style, styles.primaryButtonHover)}
                    onMouseOut={(e) => Object.assign(e.currentTarget.style, styles.primaryButton)}
                >
                    Créer un compte
                </Link>
            </section>

            {/* Footer */}
            <footer style={styles.footer}>
                © 2025 Fundo Tunisia. Tous droits réservés.
            </footer>
        </div>
    );
};

export default LandingPage;