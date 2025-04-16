import axios from "axios";
import { useEffect, useRef, useState } from "react"


const Cases = ({newCompany}) => {
    console.log("cases : ",newCompany)

    const userDetails = JSON.parse(localStorage.getItem('userDetails'));

    const [engDatas,setEngDatas] = useState({description:"",eng:"",priority:"low",date:"",status:"initiated"});
    const [supportEng,setSupportEng] = useState([]);

    const [casesInfo,setCasesInfo] = useState([]);
    const [caseStatusUpdate,setCaseStatusUpdate] = useState(false);

    const [casesCustInfo,setCasesCustInfo] = useState([]);


    // priority array & status array
    let priorityArr = ['High','Medium','Low'];
    let statusArr = ['Initiated','On progress','Completed'];

    useEffect(()=>{
        function supportEng(){
            axios.get(`https://sales-force.onrender.com/api/user/support-eng/${"cust support eng"}`)
            .then((res)=>{
                if(res){
                    console.log(res.data.message)
                    setSupportEng(res.data.message);
                }
            })
            .catch((err)=>console.log(err))
        }

        supportEng();
     },[])


     function handleChange(e){
        setEngDatas({...engDatas,[e.target.name] : e.target.value});
     }

    function handleSubmit(e){
        e.preventDefault();

        axios.post('https://sales-force.onrender.com/api/cases/v3/requests',
            {
                companyName : newCompany.company_name,
                description : engDatas.description,
                support : engDatas.eng,
                priority : engDatas.priority,
                date : engDatas.date,
                status : engDatas.status
            },
            {
                method : "POST",
                headers : {
                    'Content-Type' : "application/json"
                }
            }
        )
        .then((res)=> {
            if(res){
                alert(res.data.message)
                setEngDatas({description:"",eng:"",priority:"low",date:"",status:"initiated"})
            }
        })
        .catch((err)=> alert(err.response.data.message))
    }

    useEffect(()=>{
        async function fetchCasesOfCompany(){
            const response = await axios.get(`https://sales-force.onrender.com/api/cases/v3/cases/info/${newCompany.company_name}`,{
                method : 'GET'
            });

            const data = response.data.message;
            console.log("case details : ", data)
            setCasesInfo(data)
        }

        if(newCompany){
            fetchCasesOfCompany()
        }
    },[newCompany, newCompany.company_name, caseStatusUpdate])

    useEffect(()=>{
        async function fetchCustCases(){
            const response = await axios.get(`https://sales-force.onrender.com/api/cases/v3/cases/cust/info/${userDetails.username.toLowerCase()}`,{
                method : 'GET'
            });

            const data = response.data.message;
            console.log("case details : ", data)
            setCasesCustInfo(data)
        }

        if(userDetails.username){
            fetchCustCases()
        }
    },[userDetails.username, caseStatusUpdate])


    const saleRef = useRef();

    saleRef.current = casesCustInfo.find((Case)=> Case.status === "completed" ? Case : "");
    console.log("saleRef.current : ", saleRef.current)

    useEffect(()=>{
        closedCase();
    },[saleRef.current])


    const closedCase = async () =>{
        if(saleRef.current){
            console.log("saleRef.current", saleRef.current)

            const reportResponse = await axios.post('https://sales-force.onrender.com/api/report/v5/case/duration',{
                companyName : saleRef.current.companyName,
                date : saleRef.current.date,
                description : saleRef.current.description,
                priority : saleRef.current.priority,
                status : saleRef.current.status,
                support : saleRef.current.support
            })

            const reportData = await reportResponse.data.message
            console.log(reportData)

            const response = await axios.delete(`https://sales-force.onrender.com/api/cases/v3/cases/info/${saleRef.current._id}`);

            const data = await response.data.message;
            console.log(data)

            setTimeout(()=>{
                saleRef.current = null
            },1000)

        }else{
            console.log('No closed case found')
        }
    }


    function handleDiscuss(custSupport){
        if(custSupport){
            axios.post('https://sales-force.onrender.com/api/cases/v3/notify/email',{
                custname : custSupport === 'sales manager'? 'sales manager' : custSupport
            },{
                headers : {
                    'Content-Type' : "application/json"
                }
            }).then((res)=>{
                if(res){
                    alert(res.data.message)
                }
            }).catch((err)=>{
                console.log('discuss error frontend : ', err);
            })
        }
    }


    async function handleCaseStatus(Case,caseStatus){
        const response = axios.put(`https://sales-force.onrender.com/api/cases/v3/status/update/${Case._id}`,{
            status_of_case : caseStatus
        })

        const updatedData = await response.data;
        if(updatedData) alert(updatedData.message)
        setCaseStatusUpdate(true)

        setTimeout(()=>setCaseStatusUpdate(false),1000)
    }

    return(
        <>
            { userDetails.role === "sales manager" || userDetails.role === "sales lead" || userDetails.role === "sales head" ? 
            (
                <>
                <h2
    style={{
      fontSize: "24px",
      fontWeight: "bold",
      textAlign: "center",
      color: "#333",
      marginBottom: "20px",
      textTransform: "uppercase",
    }}
  >
    Cases
  </h2>
  {userDetails.role === "sales manager" && (
    <section
      style={{
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#fff",
        boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <label
          htmlFor="description"
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            color: "#555",
          }}
        >
          Description
        </label>
        <input
          type="text"
          name="description"
          id="description"
          value={engDatas.description}
          className="description"
          onChange={handleChange}
          placeholder="Description"
          required
          style={{
            padding: "8px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <br />
        <br />
        <label
          htmlFor="eng"
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            color: "#555",
          }}
        >
          Support eng
        </label>
        <select
          className="eng"
          id="eng"
          value={engDatas.eng}
          name="eng"
          onChange={handleChange}
          required
          style={{
            padding: "8px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          {supportEng.map((eng) => (
            <option key={eng._id} value={eng.username.toLowerCase()}>
              {eng.username}
            </option>
          ))}
        </select>
        <br />
        <br />
        <label
          htmlFor="priority"
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            color: "#555",
          }}
        >
          Priority
        </label>
        <select
          className="priority"
          id="priority"
          value={engDatas.priority}
          name="priority"
          onChange={handleChange}
          required
          style={{
            padding: "8px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          {priorityArr.map((priority) => (
            <option key={priority} value={priority.toLowerCase()}>
              {priority}
            </option>
          ))}
        </select>
        <br />
        <br />
        <label
          htmlFor="date"
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            color: "#555",
          }}
        >
          Date
        </label>
        <input
          type="date"
          name="date"
          className="date"
          id="date"
          value={engDatas.date}
          onChange={handleChange}
          required
          style={{
            padding: "8px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        <br />
        <br />
        <label
          htmlFor="status"
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            color: "#555",
          }}
        >
          Status
        </label>
        <select
          className="status"
          id="status"
          value={engDatas.status}
          name="status"
          onChange={handleChange}
          required
          style={{
            padding: "8px",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          {statusArr.map((status) => (
            <option key={status} value={status.toLowerCase()}>
              {status}
            </option>
          ))}
        </select>
        <br />
        <br />
        <button
          style={{
            padding: "10px 15px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Submit
        </button>
      </form>
    </section>
  )}
            <br/>
            <section style={{ padding: "20px", backgroundColor: "#f9f9f9", border: "1px solid #ddd", borderRadius: "8px", marginBottom: "20px" }}>
  <ul style={{ listStyle: "none", margin: "0", padding: "0" }}>
    {
      userDetails.role === "sales manager" || userDetails.role === "sales lead" || userDetails.role === "sales head" ? 
        (casesInfo && casesInfo.length > 0 ?   
          casesInfo.map((info) => (
            <li key={info._id} style={{ padding: "10px", marginBottom: "10px", borderBottom: "1px solid #eee" }}>
              <h3 style={{ margin: "5px 0", color: "#333", fontSize: "16px" }}>Id : {info._id}</h3>
              <h3 style={{ margin: "5px 0", color: "#333", fontSize: "16px" }}>Description : {info.description}</h3>
              <h3 style={{ margin: "5px 0", color: "#333", fontSize: "16px" }}>Cust support : {info.support}</h3>
              <h3 style={{ margin: "5px 0", color: "#333", fontSize: "16px" }}>Priority : {info.priority}</h3>
              <h3 style={{ margin: "5px 0", color: "#333", fontSize: "16px" }}>Assigned date : {info.date.slice(0, info.date.indexOf('T'))}</h3>
              {userDetails.username.toLowerCase() === info.support ? 
                <>
                  <label htmlFor="status" style={{ fontWeight: "bold", marginRight: "5px" }}>Status</label>
                  <select className="status" id="status" name="status" value={info.status} onChange={(e) => handleCaseStatus(info, e.target.value)} required style={{ padding: "5px", border: "1px solid #ccc", borderRadius: "4px" }}>
                    {statusArr.map((status) => (
                      <option key={status} value={status.toLowerCase()}>{status}</option>
                    ))}
                  </select>
                </>
                :
                <h3 style={{ margin: "5px 0", color: "#333", fontSize: "16px" }}>Status : {info.status.charAt(0).toUpperCase() + info.status.slice(1)}</h3>
              }
              &nbsp;
              <button onClick={() => handleDiscuss(info.support)} style={{ padding: "8px 12px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>Discuss</button>
            </li>
          ))
          : "No cases found !"
        )
        : "No cases found !"
    }
  </ul>
</section></>  ) : (
  userDetails.role === "cust support eng" ? (
    <section style={{ padding: "20px", backgroundColor: "#f9f9f9", border: "1px solid #ddd", borderRadius: "8px", marginBottom: "20px" }}>
      <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#333", marginBottom: "15px" }}>Cases</h3> 
      <ul style={{ listStyle: "none", margin: "0", padding: "0" }}>
        {casesCustInfo && casesCustInfo.length ? 
          casesCustInfo.map((info) => (
            <li key={info._id} style={{ padding: "10px", marginBottom: "10px", borderBottom: "1px solid #eee" }}>
              <h3 style={{ margin: "5px 0", fontSize: "16px", color: "#333" }}>Id : {info._id}</h3>
              <h3 style={{ margin: "5px 0", fontSize: "16px", color: "#333" }}>Company_name : {info.companyName}</h3>
              <h3 style={{ margin: "5px 0", fontSize: "16px", color: "#333" }}>Description : {info.description}</h3>
              <h3 style={{ margin: "5px 0", fontSize: "16px", color: "#333" }}>Cust support : {info.support}</h3>
              <h3 style={{ margin: "5px 0", fontSize: "16px", color: "#333" }}>Priority : {info.priority}</h3>
              <h3 style={{ margin: "5px 0", fontSize: "16px", color: "#333" }}>
                Assigned date : {info.date.slice(0, info.date.indexOf('T'))}
              </h3>
              {userDetails.username.toLowerCase() === info.support ? 
                <>
                  <label htmlFor="status" style={{ fontWeight: "bold", marginRight: "5px" }}>Status</label>
                  <select className="status" id="status" name="status" value={info.status} onChange={(e) => handleCaseStatus(info, e.target.value)} required style={{ padding: "5px", border: "1px solid #ccc", borderRadius: "4px" }}>
                    {statusArr.map((status) => (
                      <option key={status} value={status.toLowerCase()}>{status}</option>
                    ))}
                  </select>
                </>
                :
                <h3 style={{ margin: "5px 0", fontSize: "16px", color: "#333" }}>
                  Status : {info.status.charAt(0).toUpperCase() + info.status.slice(1)}
                </h3>
              }
              &nbsp;
              <button onClick={() => handleDiscuss("sales manager")} style={{ padding: "8px 12px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                Discuss
              </button>
            </li>
          ))
          : "No cases found !"
        }
      </ul>
    </section>
  ) : "No cases found !"
)

        }

        </>
    )
}


export default Cases;