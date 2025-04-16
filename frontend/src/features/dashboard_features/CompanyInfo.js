const CompanyInfo = ({ newCompany }) => {
    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>Company Info</h2>
        <div style={styles.infoBox}>
          <h3><span style={styles.label}>Company Name:</span> {newCompany.company_name}</h3>
          <h3><span style={styles.label}>Location:</span> {newCompany.location}</h3>
          <h3><span style={styles.label}>Potential Revenue:</span> {newCompany.potential_revenue}</h3>
          <h3><span style={styles.label}>Region:</span> {newCompany.region}</h3>
          <h3><span style={styles.label}>Size:</span> {newCompany.size}</h3>
        </div>
      </div>
    );
  };
  
  const styles = {
    container: {
      maxWidth: "500px",
      margin: "20px auto",
      padding: "20px",
      backgroundColor: "#f8f9fa",
      borderRadius: "10px",
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      textAlign: "center",
      fontFamily: "Arial, sans-serif",
    },
    heading: {
      fontSize: "22px",
      color: "#333",
      marginBottom: "15px",
    },
    infoBox: {
      backgroundColor: "#ffffff",
      padding: "15px",
      borderRadius: "8px",
      boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
      textAlign: "left",
    },
    label: {
      color: "#007BFF",
      fontWeight: "bold",
    },
  };
  
  export default CompanyInfo;
  