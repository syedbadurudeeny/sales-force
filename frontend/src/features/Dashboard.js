import { Link } from "react-router-dom";
import CompanyInfo from "./dashboard_features/CompanyInfo";
import ContactsInfo from "./dashboard_features/ContactsInfo";
import Opportunities from "./dashboard_features/Opportunities";
import Cases from "./dashboard_features/Cases";
import Report from "./dashboard_features/Report";

function Dashboard({ company, dealsFuncReportCount, salesFuncReportCount, activeDeals, saleChat }) {
    const getUserDetails = JSON.parse(localStorage.getItem("userDetails"));

    let newCompany = company.length === 0 ? "" : company;

    return (
        <>
            <style>
                {`
                :root {
                    --primary-color: #007bff;
                    --secondary-color: #2C3E50;
                    --text-dark: #1a1a1a;
                    --text-light: #ffffff;
                    --card-bg: #f9f9f9;
                    --shadow-color: rgba(0, 0, 0, 0.1);
                }

                .dashboard-container {
                    max-width: 1200px;
                    margin: auto;
                    padding: 20px;
                    font-family: 'Poppins', Arial, sans-serif;
                }

                h1 {
                    text-align: center;
                    color: var(--primary-color);
                    font-size: 2rem;
                    margin-bottom: 25px;
                    font-weight: 600;
                }

                h2 {
                    text-align: center;
                    color: var(--secondary-color);
                    font-size: 1.8rem;
                    margin-bottom: 20px;
                    font-weight: 500;
                }

                section {
                    background: var(--card-bg);
                    padding: 20px;
                    margin-bottom: 15px;
                    border-radius: 10px;
                    box-shadow: 0 4px 8px var(--shadow-color);
                    transition: transform 0.2s ease-in-out;
                }

                section:hover {
                    transform: scale(1.02);
                }

                .cta-button {
                    display: block;
                    width: fit-content;
                    margin: 20px auto;
                    padding: 12px 20px;
                    font-size: 16px;
                    font-weight: bold;
                    background: var(--primary-color);
                    color: var(--text-light);
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: background 0.3s ease-in-out, transform 0.2s ease-in-out;
                    text-decoration: none;
                }

                .cta-button:hover {
                    background: #0056b3;
                    transform: scale(1.05);
                }

                ul {
                    list-style: none;
                    padding-left: 0;
                }

                ul li {
                    margin: 10px 0;
                    font-size: 16px;
                    font-weight: 500;
                    color: var(--text-dark);
                }

                ul li strong {
                    color: var(--primary-color);
                }

                .input-field {
                    width: 100%;
                    padding: 10px;
                    margin-top: 10px;
                    border: 1px solid var(--secondary-color);
                    border-radius: 5px;
                    font-size: 14px;
                    background: #fff;
                    transition: border 0.2s ease-in-out;
                }

                .input-field:focus {
                    outline: none;
                    border: 2px solid var(--primary-color);
                    box-shadow: 0 0 5px var(--primary-color);
                }

                .form-group {
                    margin-bottom: 15px;
                }

                @media (max-width: 768px) {
                    .dashboard-container {
                        padding: 10px;
                    }

                    section {
                        padding: 15px;
                    }
                }
                `}
            </style>

            <div className="dashboard-container">
                {newCompany !== "" ? (
                    <article>
                        <h1>Dashboard</h1>
                        <section>
                            {getUserDetails.role === "sales manager" || getUserDetails.role === "sales head" ? (
                                <Report newCompany={newCompany} activeDeals={activeDeals} />
                            ) : null}
                        </section>
                        <section>
                            {getUserDetails.role === "sales manager" || getUserDetails.role === "sales head" ? (
                                <CompanyInfo newCompany={newCompany} />
                            ) : null}
                        </section>
                        <section>
                            {getUserDetails.role === "sales manager" || getUserDetails.role === "sales head" ? (
                                <ContactsInfo newCompany={newCompany} />
                            ) : null}
                        </section>
                        <section>
                            <Opportunities
                                saleChat={saleChat}
                                dealsFuncReportCount={dealsFuncReportCount}
                                salesFuncReportCount={salesFuncReportCount}
                                newCompany={newCompany}
                            />
                        </section>
                        <section>
                            <Cases newCompany={newCompany} />
                        </section>
                    </article>
                ) : getUserDetails.role === "sales manager" || getUserDetails.role === "sales head" ? (
                    <section>
                        <h2>Welcome to Your Dashboard</h2>
                        <p>Click on any account to view detailed information, including:</p>
                        <ul>
                            <li>
                                <strong>Company Info:</strong> Overview of the company, including size, location, and revenue.
                            </li>
                            <li>
                                <strong>Contacts:</strong> Key decision-makers and contact details within the company.
                            </li>
                            <li>
                                <strong>Opportunities:</strong> Current sales opportunities or partnership possibilities.
                            </li>
                            <li>
                                <strong>Cases:</strong> Any related cases or events tied to the company.
                            </li>
                        </ul>

                        <Link to="/">
                            <button className="cta-button">Click an Account to Start Exploring</button>
                        </Link>
                    </section>
                ) : getUserDetails.role === "sales rep" ? (
                    <section>
                        <Opportunities
                            saleChat={saleChat}
                            dealsFuncReportCount={dealsFuncReportCount}
                            salesFuncReportCount={salesFuncReportCount}
                            newCompany={newCompany}
                        />
                    </section>
                ) : getUserDetails.role === "cust support eng" ? (
                    <section>
                        <Cases newCompany={newCompany} />
                    </section>
                ) : (
                    <article>
                        <section>
                            <Opportunities
                                saleChat={saleChat}
                                dealsFuncReportCount={dealsFuncReportCount}
                                salesFuncReportCount={salesFuncReportCount}
                                newCompany={newCompany}
                            />
                        </section>
                        <section>
                            <Cases newCompany={newCompany} />
                        </section>
                    </article>
                )}
            </div>
        </>
    );
}

export default Dashboard;
