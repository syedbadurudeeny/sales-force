import { Link, useNavigate } from "react-router-dom";

export default function Layout({ children }) {
    const getUserToken = localStorage.getItem("userAccessToken");
    const getUserDetails = JSON.parse(localStorage.getItem("userDetails"));

    const navigate = useNavigate();

    function logout() {
        localStorage.removeItem("userAccessToken");
        localStorage.removeItem("userDetails");
        navigate("/register");
    }

    return (
        <>
            <header style={styles.header}>
                <h1 style={styles.logo}>Sales Force</h1>
                <nav>
                    <ul style={styles.navList}>
                        {!getUserToken && (
                            <li style={styles.navItem}>
                                <Link to="/register" style={styles.navLink}>Register</Link>
                            </li>
                        )}

                        {!getUserToken && (
                            <li style={styles.navItem}>
                                <Link to="/login" style={styles.navLink}>Login</Link>
                            </li>
                        )}

                        {getUserToken && (["sales manager", "sales head", "sales lead"].includes(getUserDetails.role)) && (
                            <li style={styles.navItem}>
                                <Link to="/" style={styles.navLink}>Home</Link>
                            </li>
                        )}

                        {getUserToken && (
                            <li style={styles.navItem}>
                                <Link to="/dashboard" style={styles.navLink}>Dashboard</Link>
                            </li>
                        )}

                        {getUserToken && ["sales manager", "sales head"].includes(getUserDetails.role) && (
                            <li style={styles.navItem}>
                                <Link to="/acc/form" style={styles.navLink}>Acc Form</Link>
                            </li>
                        )}

                        {getUserToken && ["sales manager", "sales head"].includes(getUserDetails.role) && (
                            <li style={styles.navItem}>
                                <Link to="/email" style={styles.navLink}>Email</Link>
                            </li>
                        )}

                        {getUserToken && (
                            <li style={styles.navItem}>
                                <Link to="/conversation" style={styles.navLink}>Conversation</Link>
                            </li>
                        )}

                        {getUserToken && (
                            <li style={styles.navItem}>
                                <Link to="/register" onClick={logout} style={{ ...styles.navLink, ...styles.logout }}>Logout</Link>
                            </li>
                        )}
                    </ul>
                </nav>
            </header>

            <main style={styles.main}>
                {children}
            </main>
        </>
    );
}

// Internal Styling
const styles = {
    header: {
        backgroundColor: "#007bff",
        padding: "15px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "#fff",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    },
    logo: {
        margin: 0,
        fontSize: "24px",
        fontWeight: "bold",
    },
    navList: {
        listStyle: "none",
        display: "flex",
        gap: "15px",
        margin: 0,
        padding: 0,
    },
    navItem: {
        display: "inline-block",
    },
    navLink: {
        color: "#fff",
        textDecoration: "none",
        fontSize: "16px",
        padding: "8px 12px",
        borderRadius: "5px",
        transition: "background 0.3s ease",
    },
    logout: {
        backgroundColor: "#dc3545",
        padding: "8px 12px",
    },
    main: {
        padding: "20px",
        minHeight: "80vh",
    }
};

