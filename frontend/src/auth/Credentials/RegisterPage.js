import axios from "axios";
import { useState } from "react";

const RegisterPage = () => {
    const initialErrorsState = {name:{required:false},email:{required:false},role:{required:false},password:{required:false}}
    
    const [userInputs,setUserInputs] = useState({name:"",email:"",role:"",password:""});
    const [userErrors,setUserErrors] = useState(initialErrorsState);
    const [foundError,setFoundError] = useState(true);

    function handleChange(e){
        const {name,value} = e.target;
        setUserInputs({...userInputs,[name] : value})
    }

    function handleSubmit(e){
        e.preventDefault();
        let errors = {...initialErrorsState};
        let hasError = false;

        Object.entries(errors).forEach(([name])=>{
            if(userInputs[name] === ""){
                errors[name].required = true;
                hasError = true;
            }
        })

        setUserErrors(errors);
        setFoundError(hasError);

        if(!hasError){
            axios.post('https://sales-force.onrender.com/api/user/register',{
                username : userInputs.name,
                email : userInputs.email,
                role: userInputs.role,
                password : userInputs.password
            },
            {
                method : 'POST',
                headers : {
                    "Content-Type" : "application/json"
                }
            })
            .then((res)=>{
                if(res){
                    setTimeout(()=>setFoundError(true),2000);
                    setUserInputs({name:"",email:"",role:"",password:""});
                    alert(res.data.message);
                }
            })
            .catch((err)=>{
                alert(err.response.data.message)
                setTimeout(()=>setFoundError(true),1000);
                setUserInputs({name:"",email:"",role:"",password:""});
                console.log("register error : ", err);
            })
        }
    }

    return(
        <section style={styles.container}>
            <h1 style={styles.heading}>Register Page</h1>
            <form onSubmit={handleSubmit} style={styles.form}>
                <label htmlFor="name" style={styles.label}>Name</label>
                <input type="text" id="name" name="name" value={userInputs.name} placeholder="Enter your name" onChange={handleChange} style={styles.input} />
                {userErrors.name.required && <span style={styles.error}>Enter your name</span>}

                <label htmlFor="email" style={styles.label}>Email</label>
                <input type="email" id="email" name="email" value={userInputs.email} placeholder="Enter your email" onChange={handleChange} style={styles.input} />
                {userErrors.email.required && <span style={styles.error}>Enter your email</span>}

                <label htmlFor="role" style={styles.label}>Role</label>
                <select id="role" name="role" value={userInputs.role} onChange={handleChange} style={styles.input}>
                    <option value="">Select</option>
                    <option value="sales head">Sales Head</option>
                    <option value="sales manager">Sales Manager</option>
                    <option value="sales lead">Sales Lead</option>
                    <option value="sales rep">Sales Rep</option>
                    <option value="cust support eng">Cust Support Eng</option>
                </select>
                {userErrors.role.required && <span style={styles.error}>Enter your role</span>}

                <label htmlFor="password" style={styles.label}>Password</label>
                <input type="password" id="password" name="password" value={userInputs.password} placeholder="Enter your password" onChange={handleChange} style={styles.input} />
                {userErrors.password.required && <span style={styles.error}>Enter your password</span>}

                <button disabled={!foundError} style={{...styles.button, opacity: foundError ? 1 : 0.5}}>Submit</button>
            </form>
        </section>
    );
}

const styles = {
    container: {
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
    },
    heading: {
        fontSize: "24px",
        marginBottom: "20px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },
    label: {
        fontSize: "16px",
        fontWeight: "bold",
        textAlign: "left",
    },
    input: {
        padding: "10px",
        fontSize: "14px",
        borderRadius: "5px",
        border: "1px solid #ccc",
        outline: "none",
    },
    error: {
        color: "red",
        fontSize: "12px",
    },
    button: {
        padding: "10px 15px",
        fontSize: "16px",
        borderRadius: "5px",
        border: "none",
        backgroundColor: "#007bff",
        color: "white",
        cursor: "pointer",
        transition: "background 0.3s ease",
    },
};

export default RegisterPage;
