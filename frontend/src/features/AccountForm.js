import React, { useState } from 'react';
import axios from 'axios';

const AccountForm = () => {
  const [company, setCompany] = useState({
    industry: "",
    companies: [
      {
        company_name: "",
        size: "",
        location: "",
        related_contacts: [
          { contact_name: "", title: "", email: "", phone: "" },
          { contact_name: "", title: "", email: "", phone: "" },
          { contact_name: "", title: "", email: "", phone: "" }
        ],
        region: "",
        potential_revenue: ""
      }
    ]
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompany(prevState => ({ ...prevState, [name]: value }));
  };

  const handleCompanyChange = (e) => {
    const { name, value } = e.target;
    const updatedCompanies = [...company.companies];
    updatedCompanies[0][name] = value;
    setCompany(prevState => ({ ...prevState, companies: updatedCompanies }));
  };

  const handleContactChange = (e, index) => {
    const { name, value } = e.target;
    const updatedContacts = [...company.companies[0].related_contacts];
    updatedContacts[index][name] = value;
    setCompany(prevState => ({
      ...prevState,
      companies: [{ ...prevState.companies[0], related_contacts: updatedContacts }]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('https://sales-force.onrender.com/api/new/account', { account_info: company })
      .then(res => {
        alert(res.data.message);
        setCompany({
          industry: "",
          companies: [{
            company_name: "",
            size: "",
            location: "",
            related_contacts: [
              { contact_name: "", title: "", email: "", phone: "" },
              { contact_name: "", title: "", email: "", phone: "" },
              { contact_name: "", title: "", email: "", phone: "" }
            ],
            region: "",
            potential_revenue: ""
          }]
        });
      })
      .catch(err => console.log(err));
  };

  const formStyle = {
    width: '50%',
    margin: 'auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    backgroundColor: '#f9f9f9',
  };

  const inputStyle = {
    width: '100%',
    padding: '8px',
    margin: '5px 0',
    border: '1px solid #ccc',
    borderRadius: '4px',
  };

  const buttonStyle = {
    width: '100%',
    padding: '10px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '10px'
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h1>Account Form</h1>
      <label>Industry Name:</label>
      <input type="text" name="industry" value={company.industry} onChange={handleInputChange} required style={inputStyle} />
      
      <label>Company Name:</label>
      <input type="text" name="company_name" value={company.companies[0].company_name} onChange={handleCompanyChange} required style={inputStyle} />
      
      <label>Company Size:</label>
      <input type="text" name="size" value={company.companies[0].size} onChange={handleCompanyChange} required style={inputStyle} />
      
      <label>Location:</label>
      <input type="text" name="location" value={company.companies[0].location} onChange={handleCompanyChange} required style={inputStyle} />
      
      <label>Region:</label>
      <input type="text" name="region" value={company.companies[0].region} onChange={handleCompanyChange} required style={inputStyle} />
      
      <label>Potential Revenue:</label>
      <input type="text" name="potential_revenue" value={company.companies[0].potential_revenue} onChange={handleCompanyChange} required style={inputStyle} />
      
      <h2>Related Contacts</h2>
      {company.companies[0].related_contacts.map((contact, index) => (
        <div key={index}>
          <h3>Contact {index + 1}</h3>
          <label>Contact Name:</label>
          <input type="text" name="contact_name" value={contact.contact_name} onChange={(e) => handleContactChange(e, index)} required style={inputStyle} />
          
          <label>Title:</label>
          <input type="text" name="title" value={contact.title} onChange={(e) => handleContactChange(e, index)} required style={inputStyle} />
          
          <label>Email:</label>
          <input type="email" name="email" value={contact.email} onChange={(e) => handleContactChange(e, index)} required style={inputStyle} />
          
          <label>Phone:</label>
          <input type="text" name="phone" value={contact.phone} onChange={(e) => handleContactChange(e, index)} required style={inputStyle} />
        </div>
      ))}
      
      <button type="submit" style={buttonStyle}>Submit</button>
    </form>
  );
};

export default AccountForm;