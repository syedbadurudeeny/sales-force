import { useEffect, useMemo, useState } from "react";
import AccDetails from '../jsonData/accountDatas.json';
import { Link } from "react-router-dom";

function Home({ getCompany }) {
    const [datas, setDatas] = useState(AccDetails.industries);
    const [query, setQuery] = useState("");
    const [accDetails, setAccDetails] = useState({ industry: "", region: "", revenue: "" });
    const [stateChanged, setStateChanged] = useState(false);
    const [stateQueryChanged, setStateQueryChanged] = useState(false);
    const [aloneCompany, setAloneCompany] = useState([]);

    function handleSearch(e) {
        setStateChanged(true);
        setAccDetails({ ...accDetails, [e.target.name]: e.target.value });
    }

    const accountFiltering = useMemo(() => {
        let results = datas;

        if (accDetails.industry) {
            results = results.filter(data => data.industry.toLowerCase().includes(accDetails.industry.toLowerCase()));
        }

        if (accDetails.region) {
            results = results.map(data => {
                const filteredCompanies = data.companies.filter(company =>
                    company.region.toLowerCase().includes(accDetails.region.toLowerCase())
                );
                return { ...data, companies: filteredCompanies };
            });
        }

        if (accDetails.revenue) {
            results = results.map(data => {
                const filteredCompanies = data.companies.filter(company =>
                    company.potential_revenue.toLowerCase().includes(accDetails.revenue.toLowerCase())
                );
                return { ...data, companies: filteredCompanies };
            });
        }

        return results.filter(data => data.companies.length > 0);
    }, [accDetails, datas]);

    useEffect(() => {
        if (query) {
            setStateQueryChanged(true);
            let company = datas.map(data => {
                const searchCompany = data.companies.filter(company =>
                    company.company_name.toLowerCase().includes(query.toLowerCase())
                );
                return { ...data, searchCompany };
            });
            setAloneCompany(company);
        }
    }, [datas, query]);

    function handleFilterAccounts(industry) {
        getCompany(industry);
    }

    return (
        <>
            <article style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
                <section>
                    <label htmlFor="search-acc" style={{ fontWeight: "bold", marginRight: "10px" }}>Acc</label>
                    <input
                        type="text"
                        id="search-acc"
                        name="search-acc"
                        style={{ padding: "8px", width: "200px", border: "1px solid #ccc", borderRadius: "4px" }}
                        placeholder="Search account"
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </section>
                <br />

                <section>
                    <select style={{ padding: "8px", marginRight: "10px" }} id="industry" name="industry" onChange={handleSearch}>
                        <option value="">Select industry</option>
                        {datas.map((data, index) => (
                            <option key={index} value={data.industry}>{data.industry}</option>
                        ))}
                    </select>

                    <select style={{ padding: "8px", marginRight: "10px" }} id="region" name="region" onChange={handleSearch}>
                        <option value="">Select region</option>
                        {datas.map((data) => data.companies).flat().map((company, index) => (
                            <option key={index} value={company.region}>{company.region}</option>
                        ))}
                    </select>

                    <select style={{ padding: "8px" }} id="revenue" name="revenue" onChange={handleSearch}>
                        <option value="">Select potential revenue</option>
                        {datas.map((data) => data.companies).flat().map((company, index) => (
                            <option key={index} value={company.potential_revenue}>{company.potential_revenue}</option>
                        ))}
                    </select>
                </section>

                {stateChanged && (
                    <section>
                        <h3>Filtered Accounts</h3>
                        {accountFiltering.map((industry, index) => (
                            <Link to='/dashboard' key={index} style={{ textDecoration: "none" }}>
                                <div style={{ border: "1px solid #ddd", padding: "10px", margin: "10px 0", borderRadius: "5px" }}>
                                    <h4>{industry.industry}</h4>
                                    <ul>
                                        {industry.companies.map((company, idx) => (
                                            <li key={idx} onClick={() => handleFilterAccounts(company)}>
                                                <h5>{company.company_name}</h5>
                                                <p>Region: {company.region}</p>
                                                <p>Revenue: {company.potential_revenue}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </Link>
                        ))}
                    </section>
                )}

                {stateQueryChanged && (
                    <section>
                        <h3>Query Accounts</h3>
                        {aloneCompany.map((companies, index) => (
                            companies.searchCompany.map((company, idx) => (
                                <Link to='/dashboard' key={Math.random()} style={{ textDecoration: "none" }}>
                                    <div onClick={() => handleFilterAccounts(company)} style={{ border: "1px solid #ddd", padding: "10px", margin: "10px 0", borderRadius: "5px" }}>
                                        <h4>{company.industry}</h4>
                                        <ul>
                                            <li>
                                                <h5>{company.company_name}</h5>
                                                <p>Region: {company.region}</p>
                                                <p>Revenue: {company.potential_revenue}</p>
                                                <p>Size : {company.size}</p>
                                            </li>
                                        </ul>
                                    </div>
                                </Link>
                            ))
                        ))}
                    </section>
                )}
            </article>
        </>
    );
}

export default Home;
