import axios from "axios";
import { useEffect, useState } from "react";

const Report = ({ activeDeals, newCompany }) => {
  const [caseFeedback, setCaseFeedback] = useState([]);
  const [inputs, setInputs] = useState({ oppertunity: "", rating: "" });
  const [rating, setRating] = useState([]);

  useEffect(() => {
    async function fetchCaseFeedback() {
      if (newCompany) {
        let response = await axios.get(`http://localhost:8080/api/report/v5/${newCompany.company_name}`);
        let data = await response.data;
        setCaseFeedback(data.message);
        console.log("Reports : ", data.message);
      }
    }
    fetchCaseFeedback();
  }, [newCompany, newCompany.company_name]);

  useEffect(() => {
    async function fetchRating() {
      if (newCompany) {
        let response = await axios.get(`http://localhost:8080/api/rating/v6/${newCompany.company_name}`);
        let data = await response.data;
        setRating(data.message);
        console.log("Rating  : ", data.message);
      }
    }
    fetchRating();
  }, [newCompany, newCompany.company_name]);

  function handleChange(e) {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (inputs.oppertunity !== "" || inputs.rating !== "") {
      axios
        .post("http://localhost:8080/api/rating/v6/oppertunity", {
          oppertunity: inputs.oppertunity,
          rating: inputs.rating,
          companyName: newCompany.company_name,
        })
        .then((res) => {
          if (res) {
            console.log(res);
            alert(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Reports Info</h2>

      <section style={styles.section}>
        <h3>Active Opportunities: <span style={styles.highlight}>{activeDeals}</span></h3>
      </section>

      <section style={styles.section}>
        <h3>Cases Duration</h3>
        <ul style={styles.list}>
          {caseFeedback.map((feedback) => (
            <li key={feedback._id} style={styles.listItem}>
              <p><strong>ID:</strong> {feedback._id}</p>
              <p><strong>Description:</strong> {feedback.description}</p>
              <p><strong>Priority:</strong> {feedback.priority}</p>
              <p><strong>Start Date:</strong> {feedback.date.slice(0, feedback.date.indexOf("T"))}</p>
              <p><strong>Status:</strong> {feedback.status}</p>
              <p><strong>Support:</strong> {feedback.support}</p>
              <p><strong>End Date:</strong> {feedback.createdAt.slice(0, feedback.date.indexOf("T"))}</p>
            </li>
          ))}
        </ul>
      </section>

      <section style={styles.section}>
        <h3>Opportunities Rating</h3>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label htmlFor="oppertunity" style={styles.label}>Opportunity:</label>
          <input type="text" name="oppertunity" id="oppertunity" placeholder="Enter Opportunity" onChange={handleChange} required style={styles.input} />

          <label htmlFor="rating" style={styles.label}>Rating:</label>
          <input type="number" name="rating" id="rating" placeholder="Out of 5" onChange={handleChange} required style={styles.input} />

          <button type="submit" style={styles.button}>Submit</button>
        </form>

        <ul style={styles.list}>
          {rating.map((r) => (
            <li key={r._id} style={styles.listItem}>
              <p><strong>Opportunity:</strong> {r.oppertunity}</p>
              <p><strong>Rating:</strong> {r.rating}</p>
              <p><strong>Date:</strong> {r.createdAt.slice(0, r.createdAt.indexOf("T"))}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "20px auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    textAlign: "center",
    color: "#333",
    fontSize: "24px",
  },
  section: {
    backgroundColor: "#ffffff",
    padding: "15px",
    marginBottom: "15px",
    borderRadius: "8px",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
  },
  highlight: {
    color: "#e63946",
    fontWeight: "bold",
  },
  list: {
    listStyleType: "none",
    padding: "0",
  },
  listItem: {
    backgroundColor: "#eef2f3",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "5px",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "15px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
  },
  label: {
    fontSize: "14px",
    fontWeight: "bold",
  },
  input: {
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "14px",
  },
  button: {
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#007BFF",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  buttonHover: {
    backgroundColor: "#0056b3",
  },
};

export default Report;
