import React, { useEffect, useState } from "react";
import axios from "axios";

const Email = () => {
  const [emails, setEmails] = useState([]);
  const [emailData, setEmailData] = useState({ to: "", subject: "", message: "" });

  const sendEmail = () => {
    axios.post("http://localhost:8080/api/account/v4/send-email", emailData)
      .then((res) => {
        if(res){
          alert("Email sent successfully!");
          setEmailData({ to: "", subject: "", message: "" });
        }
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    axios.get('http://localhost:8080/api/account/v4/send-email/', {
      headers: {
        'Content-Type': "application/json"
      }
    }).then((res) => {
      if(res){
        setEmails(res.data.message);
      }
    })
    .catch((err) => console.log(err));
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Dashboard</h2>

      <h3 style={styles.subHeader}>Send Email</h3>
      <input type="email" placeholder="Recipient Email" value={emailData.to} onChange={e => setEmailData({ ...emailData, to: e.target.value })} style={styles.input} />
      <input type="text" placeholder="Subject" value={emailData.subject} onChange={e => setEmailData({ ...emailData, subject: e.target.value })} style={styles.input} />
      <textarea placeholder="Message" value={emailData.message} onChange={e => setEmailData({ ...emailData, message: e.target.value })} style={styles.textarea}></textarea>
      <button onClick={sendEmail} style={styles.button}>Send Email</button>

      <h3 style={styles.subHeader}>Recent Emails</h3>
      <ul style={styles.list}>
        {emails.map(email => (
          <li key={email._id} style={styles.listItem}>
            <h3><span style={styles.label}>Sent Email:</span> {email.to}</h3>
            <h3><span style={styles.label}>Subject:</span> {email.subject}</h3>
            <h3><span style={styles.label}>Message:</span> {email.message}</h3>
            <h3><span style={styles.label}>Date:</span> {email.createdAt.slice(0,email.createdAt.indexOf('T'))}</h3>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "auto",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  header: {
    textAlign: "center",
    color: "#333",
  },
  subHeader: {
    color: "#555",
    marginBottom: "10px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  textarea: {
    width: "100%",
    height: "100px",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  list: {
    listStyleType: "none",
    padding: 0,
  },
  listItem: {
    backgroundColor: "#fff",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "10px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  label: {
    color: "#007BFF",
    fontWeight: "bold",
  }
};

export default Email;
