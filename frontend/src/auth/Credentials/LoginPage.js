import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const initialErrorsState = { email: { required: false }, role: { required: false }, password: { required: false } };
    const [userInputs, setUserInputs] = useState({ email: "", role: "", password: "" });
    const [userErrors, setUserErrors] = useState(initialErrorsState);
    const [foundError, setFoundError] = useState(true);
    const navigate = useNavigate();

    function handleChange(e) {
        const { name, value } = e.target;
        setUserInputs({ ...userInputs, [name]: value });
    }

    function handleSubmit(e) {
        e.preventDefault();
        let errors = { ...initialErrorsState };
        let hasError = false;

        Object.entries(errors).forEach(([name]) => {
            if (userInputs[name] === "") {
                errors[name].required = true;
                hasError = true;
            }
        });

        setUserErrors(errors);
        setFoundError(hasError);

        if (!hasError) {
            axios.post(
                "http://localhost:8080/api/user/login",
                {
                    username: userInputs.name,
                    email: userInputs.email,
                    role: userInputs.role,
                    password: userInputs.password,
                },
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            )
                .then((res) => {
                    if (res) {
                        setTimeout(() => setFoundError(true), 2000);
                        setUserInputs({ email: "", role: "", password: "" });
                        localStorage.setItem("userAccessToken", res.data.user.accessToken);
                        localStorage.setItem("userDetails", JSON.stringify(res.data.user));
                        alert(res.data.message);
                        navigate("/dashboard");
                    }
                })
                .catch((err) => {
                    alert(err.response.data.message);
                    setTimeout(() => setFoundError(true), 1000);
                    setUserInputs({ email: "", role: "", password: "" });
                    console.log("login error : ", err);
                });
        }
    }

    return (
        <section
            style={{
                maxWidth: "400px",
                margin: "50px auto",
                padding: "20px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
                fontFamily: "Arial, sans-serif",
            }}
        >
            <h1 style={{ marginBottom: "20px", color: "#333" }}>Login Page</h1>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <label htmlFor="email" style={{ textAlign: "left" }}>Email</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={userInputs.email}
                    placeholder="Enter your email"
                    onChange={handleChange}
                    style={{
                        padding: "8px",
                        borderRadius: "5px",
                        border: "1px solid #aaa",
                    }}
                />
                {userErrors.email.required && <span style={{ color: "red", fontSize: "12px" }}>Enter your email</span>}

                <label htmlFor="role" style={{ textAlign: "left" }}>Role</label>
                <select
                    id="role"
                    name="role"
                    value={userInputs.role}
                    onChange={handleChange}
                    style={{
                        padding: "8px",
                        borderRadius: "5px",
                        border: "1px solid #aaa",
                    }}
                >
                    <option value="">Select</option>
                    <option value="sales head">Sales head</option>
                    <option value="sales manager">Sales manager</option>
                    <option value="sales lead">Sales lead</option>
                    <option value="sales rep">Sales rep</option>
                    <option value="cust support eng">Cust support eng</option>
                </select>
                {userErrors.role.required && <span style={{ color: "red", fontSize: "12px" }}>Enter your role</span>}

                <label htmlFor="password" style={{ textAlign: "left" }}>Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={userInputs.password}
                    placeholder="Enter your password"
                    onChange={handleChange}
                    style={{
                        padding: "8px",
                        borderRadius: "5px",
                        border: "1px solid #aaa",
                    }}
                />
                {userErrors.password.required && <span style={{ color: "red", fontSize: "12px" }}>Enter your password</span>}

                <button
                    type="submit"
                    disabled={!foundError}
                    style={{
                        padding: "10px",
                        backgroundColor: foundError ? "#28a745" : "#ccc",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: foundError ? "pointer" : "not-allowed",
                        marginTop: "10px",
                    }}
                >
                    Submit
                </button>
            </form>
        </section>
    );
};

export default LoginPage;
