const ContactsInfo = ({ newCompany }) => {
    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>Contacts</h2>
        {newCompany && newCompany.related_contacts.length > 0 ? (
          <ul style={styles.list}>
            {newCompany.related_contacts.map((contact) => (
              <li key={contact.contact_name} style={styles.contactCard}>
                <h3><span style={styles.label}>Name:</span> {contact.contact_name}</h3>
                <h3><span style={styles.label}>Email:</span> {contact.email}</h3>
                <h3><span style={styles.label}>Phone:</span> {contact.phone}</h3>
                <h3><span style={styles.label}>Title:</span> {contact.title}</h3>
              </li>
            ))}
          </ul>
        ) : (
          <p style={styles.noContacts}>No contacts available</p>
        )}
      </div>
    );
  };
  
  const styles = {
    container: {
      maxWidth: "600px",
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
    list: {
      listStyleType: "none",
      padding: 0,
    },
    contactCard: {
      backgroundColor: "#ffffff",
      padding: "15px",
      marginBottom: "10px",
      borderRadius: "8px",
      boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
      textAlign: "left",
    },
    label: {
      color: "#007BFF",
      fontWeight: "bold",
    },
    noContacts: {
      fontSize: "16px",
      color: "#777",
    },
  };
  
  export default ContactsInfo;
  