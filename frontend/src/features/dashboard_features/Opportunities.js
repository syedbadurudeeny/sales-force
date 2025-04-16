import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";


const Opportunities = ({newCompany,dealsFuncReportCount,salesFuncReportCount,saleChat}) => {

    console.log("newCompany : ", newCompany)

    const userDetails = JSON.parse(localStorage.getItem('userDetails'));

     //deal
     const dealstates = ["Prospecting","Qualification","Proposal","Negotiation","Closed"];
     //sale
     const salestates = ["initiated","On progress","Completed"];
     // sales rep

     const [salesReps,setSalesReps] = useState([]);
     const [repTasks,setRepTasks] = useState([]);

     useEffect(()=>{
        function salesRep(){
            axios.get(`http://localhost:8080/api/user/salesrep/${"sales rep"}`)
            .then((res)=>{
                if(res){
                    console.log(res.data.message)
                    setSalesReps(res.data.message);
                }
            })
            .catch((err)=>console.log(err))
        }

        salesRep()
     },[])

     //
     useEffect(()=>{
        function repTasks(){
            axios.get(`http://localhost:8080/api/user/salesrep/tasks/${userDetails.username}`)
            .then((res)=>{
                if(res){
                    console.log(res.data.message)
                    setRepTasks(res.data.message);
                }
            })
            .catch((err)=>console.log(err))
        }

        repTasks()
     },[userDetails.username])

    //  console.log("newCompany : ",newCompany)

    function handleDiscuss(saleName,rep){
        saleChat(saleName);
        if(rep){
            axios.post('http://localhost:8080/api/store/v2/notify/email',{
                repname : rep === 'sales manager'? 'sales manager' : rep
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

       //deal
    const [deal,setDeal] = useState({dealName:"",dealState:"prospecting",companyName: newCompany.company_name});
    const [storeDeals,setStoreDeals] = useState([]);
    const [closedDeals,setClosedDeals] = useState({});
    const [dealStateActivated,setDealStateActivated] = useState(false);

    
    const [closedDeatils,setClosedDetails] = useState({dealName: "",companyName:"",saleState:"initiated",location:"",amount:0,date:"",time:"",email:""})
    const [storeSales,setStoreSales] = useState([]);
    const [saleClosed,setSaleClosed] = useState({});
    const [saleStateActivated,setSaleStateActivated] = useState(false);

    useEffect(()=>{
        dealsFuncReportCount(storeDeals.length);
        salesFuncReportCount(storeSales.length);
    },[storeDeals,storeSales])

    function handleDealChange(e){
        setDeal({...deal,[e.target.name]:e.target.value})
    }

    const handleDeal = (e) => {
        e.preventDefault();

        if(deal.dealName === "" || deal.companyName === "" || deal.dealState === ""){
            alert("Add deal")
        }else{
            axios.post("http://localhost:8080/api/store/v1/deals",{
                userDeal : deal
            })
            .then((res)=>console.log("res",res))
            .catch((err)=>console.log(err))
        }

        setTimeout(()=>{
            setDeal({dealName:"",dealState:"prospecting",companyName: newCompany.company_name});
        },500)
    }

    async function handleDealStateChange(Deal,dealState){

        const response = axios.put(`http://localhost:8080/api/store/v1/deals/${Deal._id}`,{
            state_of_deal : dealState
        })

        const updatedData = await response.data;
        setDealStateActivated(true)

        // setStoreDeals(updatedData)

        setTimeout(()=>setDealStateActivated(false),1000)

        // let changingDealstate = storeDeals.filter((deal)=> deal.dealName === Deal.dealName ? deal.dealState = dealState : deal);
        // setStoreDeals(changingDealstate)
    }

    const dealRef = useRef();

    dealRef.current = storeDeals.find((deal)=> deal.dealState === "closed" ? deal : "");
    

    useEffect(()=>{
        setClosedDeals(dealRef.current)
    },[dealRef.current])

    useEffect(() => {
        if (closedDeals?.dealName) {
            setClosedDetails({
                dealName: closedDeals?.dealName,
                companyName: closedDeals?.companyName,
                saleState: "initiated", // Default saleState
                location: "",
                amount: 0,
                date:"",
                time:"",
                rep : "",
                email:userDetails.email
            });
        }
    }, [closedDeals]);


    const closedDealsItem = async () =>{
        if(dealRef.current){

            const response = await axios.delete(`http://localhost:8080/api/store/v1/deals/${dealRef.current._id}`);

            const data = await response.data.message;
            console.log(data)

            setDealStateActivated(true);

            setTimeout(()=>{
                setDealStateActivated(false)
                dealRef.current = null
            },1000)

            // let removeClosedDealItem = storeDeals.filter((deal)=> deal !== dealRef.current);
            // setStoreDeals(removeClosedDealItem)
            // localStorage.setItem("companiesDeals", JSON.stringify(storeDeals))
        }else{
            console.log('No closed deal found')
        }
    }


    useEffect(()=>{
        async function fetchDeals() {
            // console.log(newCompany)
            if(newCompany){
                let response  = await axios.get(`http://localhost:8080/api/store/v1/deals/${newCompany.company_name}`);
                let data = await response.data;
                setStoreDeals(data.message)
            }
        }

        fetchDeals();
    },[newCompany,deal,dealStateActivated])


    //sale section

    const handleSaleChange = (e) => {
        setClosedDetails({...closedDeatils,[e.target.name] : e.target.value})
    }

    const handleSale = (e) => {
        e.preventDefault();
        console.log("Rep : ",closedDeatils)

        if(closedDeatils.dealName === "" || closedDeatils.companyName === "" || closedDeatils.location === "" || closedDeatils.amount === "" || closedDeatils.date === "" || closedDeatils.time === "" || closedDeatils.rep === ""){
            alert("Enter sale details")
        }else{
            axios.post("http://localhost:8080/api/store/v2/sales",{
                userSale : closedDeatils
            })
            .then((res)=>{
                if(res){
                    closedDealsItem();
                }
            })
            .catch((err)=>console.log(err))
        }

        // setStoreSales([...storeSales, {dealName:closedDeatils.dealName,companyName:closedDeatils.companyName,location:closedDeatils.location,amount:closedDeatils.amount,date:closedDeatils.date,time:closedDeatils.time,rep:closedDeatils.rep,saleState:"initiated"}]);

        setTimeout(()=>{
            setClosedDetails({dealName: "",companyName:"",saleState:"initiated",location:"",amount:0,date:"",time:"",rep:"",email:""});
        },500)
        // console.log("sale : ",closedDeatils)
    }

    const handleSaleStateChange = async (Sale,Salestate) => {
        const response = axios.put(`http://localhost:8080/api/store/v2/sales/${Sale._id}`,{
            state_of_sale : Salestate
        })

        const updatedData = await response.data;
        setSaleStateActivated(true)

        // setStoreDeals(updatedData)

        setTimeout(()=>setSaleStateActivated(false),1000)
        // let changingSaleState = storeSales.filter((sale)=> sale.companyName === Sale.companyName ? sale.saleState = Salestate : sale)
        // setStoreSales(changingSaleState);
    }

    const saleRef = useRef();

    saleRef.current = storeSales.find((sale)=> sale.saleState === "completed" ? sale : "");

    useEffect(()=>{
        setSaleClosed(saleRef.current)
        closedSalesItem();
    },[saleRef.current])


    const closedSalesItem = async () =>{
        if(saleRef.current){

            const response = await axios.delete(`http://localhost:8080/api/store/v2/sales/${saleRef.current._id}`);

            const data = await response.data.message;
            console.log(data)

            setSaleStateActivated(true);

            setTimeout(()=>{
                setSaleStateActivated(false)
                saleRef.current = null
            },1000)

            // let removeClosedDealItem = storeDeals.filter((deal)=> deal !== dealRef.current);
            // setStoreDeals(removeClosedDealItem)
            // localStorage.setItem("companiesDeals", JSON.stringify(storeDeals))
        }else{
            console.log('No closed deal found')
        }
    }

    useEffect(()=>{
        async function fetchSales() {
            // console.log(newCompany)
            if(newCompany){
                let response  = await axios.get(`http://localhost:8080/api/store/v2/sales/${newCompany.company_name}`);
                let data = await response.data;
                console.log("sales :", data)
                setStoreSales(data.message)
            }
        }

        fetchSales();
    },[newCompany,closedDeatils,saleStateActivated])


    return(
        <>
            {(userDetails.role === "sales manager" || userDetails.role === "sales head" || userDetails.role === "sales lead") && (
                <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9', width: '100%' }}>
                    <h2 style={{ color: '#333' }}>Opportunities</h2>
                    <br />
                    <p style={{ fontWeight: 'bold' }}>In Deal...</p>
                    {(userDetails.role === "sales manager" || userDetails.role === "sales head") && (
                        <form onSubmit={handleDeal} style={{ marginBottom: '20px' }}>
                            <label htmlFor="dealName">Deal name</label>&nbsp;
                            <input 
                                type="text" 
                                className="dealName" 
                                value={deal.dealName} 
                                id="dealName" 
                                name="dealName" 
                                onChange={handleDealChange} 
                                style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />&nbsp;
                            <button style={{ padding: '5px 10px', borderRadius: '4px', backgroundColor: '#007bff', color: '#fff', border: 'none' }}>Add Deal</button>
                        </form>
                    )}
                    <br />
                    {userDetails.username !== "cust support eng" && (
                        <section>
                            <h3 style={{ color: '#444' }}>Ongoing progress</h3>
                            <ul style={{ listStyleType: 'none', padding: '0' }}>
                                {storeDeals.length > 0 ? (
                                    storeDeals.map((deal) => (
                                        <li key={deal.dealName} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#fff' }}>
                                            <h3>{deal.dealName}</h3>
                                            {userDetails.role === "sales manager" ? (
                                                <select 
                                                    className="default" 
                                                    id="default" 
                                                    value={deal.dealState} 
                                                    name="default" 
                                                    onChange={(e) => handleDealStateChange(deal, e.target.value)}
                                                    style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
                                                >
                                                    {dealstates.map((state) => (
                                                        <option key={state} value={state.toLowerCase()}>{state}</option>
                                                    ))}
                                                </select>
                                            ) : deal.dealState}&nbsp;
                                        </li>
                                    ))
                                ) : (
                                    <p>No deals found</p>
                                )}
                            </ul>
                        </section>
                    )}
                </div>
            )}
            <br/>
            <br/>
            <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px", background: "#f9f9f9" }}>
  {userDetails.role === "sales manager" || userDetails.role === "sales lead" || userDetails.role === "sales head" ? (
    <>
      <h3 style={{ color: "#333", marginBottom: "10px" }}>In Sale...</h3>
      {(userDetails.role === "sales manager" || userDetails.role === "sales head") && (
        <form onSubmit={handleSale} style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <label htmlFor="saleName">Sale name</label>
          <input type="text" className="saleName" value={closedDeatils?.dealName} id="saleName" name="saleName" onChange={handleSaleChange} style={{ padding: "5px", border: "1px solid #ccc", borderRadius: "4px" }} />

          <label htmlFor="companyName">Company name</label>
          <input type="text" className="companyName" value={closedDeatils?.companyName} id="companyName" name="companyName" onChange={handleSaleChange} style={{ padding: "5px", border: "1px solid #ccc", borderRadius: "4px" }} />

          <label htmlFor="location">Location</label>
          <input type="text" className="location" value={closedDeatils.location} id="location" name="location" onChange={handleSaleChange} style={{ padding: "5px", border: "1px solid #ccc", borderRadius: "4px" }} />

          <label htmlFor="amount">Amount</label>
          <input type="number" className="amount" id="amount" value={closedDeatils.amount} name="amount" onChange={handleSaleChange} style={{ padding: "5px", border: "1px solid #ccc", borderRadius: "4px" }} />

          <label htmlFor="date">Date</label>
          <input type="date" className="date" id="date" value={closedDeatils.date} name="date" onChange={handleSaleChange} style={{ padding: "5px", border: "1px solid #ccc", borderRadius: "4px" }} />

          <label htmlFor="time">Time</label>
          <input type="time" className="time" id="time" value={closedDeatils.time} name="time" onChange={handleSaleChange} style={{ padding: "5px", border: "1px solid #ccc", borderRadius: "4px" }} />

          <select className="rep" id="rep" value={closedDeatils.rep} name="rep" onChange={handleSaleChange} style={{ padding: "5px", border: "1px solid #ccc", borderRadius: "4px" }}>
            {salesReps.map((rep) => (
              <option key={rep._id} value={rep.username.toLowerCase()}>{rep.username}</option>
            ))}
          </select>

          <button style={{ padding: "7px 15px", background: "#007bff", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>
            Add Sale
          </button>
        </form>
      )}
    </>
  ) : null}

  <br />

  {(userDetails.role === "sales rep" || userDetails.role === "sales manager" || userDetails.role === "sales lead" || userDetails.role === "sales head") && (
    <section>
      <h3 style={{ color: "#333", marginBottom: "10px" }}>Ongoing progress</h3>
      <ul style={{ listStyle: "none", padding: "0" }}>
        {userDetails.role === "sales manager" || userDetails.role === "sales lead" || userDetails.role === "sales head" ? (
          storeSales.length > 0 ? (
            storeSales.map((detail) => (
              <li key={detail.dealName} style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px", borderRadius: "5px", background: "#fff" }}>
                <h3>Sale_name: {detail.dealName}</h3>
                <h3>Sale_amount: {detail.amount}</h3>
                <h3>Sale_rep: {detail.rep}</h3>
                {userDetails.username.toLowerCase() === detail.rep.toLowerCase() ? (
                  <select id="saleDefault" className="saleDefault" name="saleDefault" value={detail.saleState} onChange={(e) => handleSaleStateChange(detail, e.target.value)}
                    style={{ padding: "5px", border: "1px solid #ccc", borderRadius: "4px" }}>
                    {salestates.map((sale) => (
                      <option key={sale} value={sale.toLowerCase()}>{sale}</option>
                    ))}
                  </select>
                ) : (
                  detail.saleState.charAt(0).toUpperCase() + detail.saleState.slice(1)
                )}
                &nbsp;
                {userDetails.role !== "sales lead" && (
                  <button onClick={() => handleDiscuss(detail.dealName, detail.rep)}
                    style={{ padding: "7px 15px", background: "#28a745", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", marginLeft: "10px" }}>
                    <Link to='/conversation' style={{ color: "#fff", textDecoration: "none" }}>Discuss</Link>
                  </button>
                )}
              </li>
            ))
          ) : (
            'No sale found'
          )
        ) : (
          <ul>
            {repTasks.length > 0 ? (
              repTasks.map((task) => (
                <li key={task._id} style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px", borderRadius: "5px", background: "#fff" }}>
                  <h3>{task.dealName}</h3>
                  <h3>{task.companyName}</h3>
                  <h3>{task.location}</h3>
                  <h3>{task.amount}</h3>
                  <select id="saleDefault" className="saleDefault" name="saleDefault" value={task.saleState} onChange={(e) => handleSaleStateChange(task, e.target.value)}
                    style={{ padding: "5px", border: "1px solid #ccc", borderRadius: "4px" }}>
                    {salestates.map((sale) => (
                      <option key={sale} value={sale.toLowerCase()}>{sale}</option>
                    ))}
                  </select>
                  &nbsp;
                  <button onClick={() => handleDiscuss(task.dealName, "sales manager")}
                    style={{ padding: "7px 15px", background: "#dc3545", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", marginLeft: "10px" }}>
                    <Link to='/conversation' style={{ color: "#fff", textDecoration: "none" }}>Discuss</Link>
                  </button>
                </li>
              ))
            ) : (
              "No tasks found"
            )}
          </ul>
        )}
      </ul>
    </section>
  )}
</div>

        </>
    )
}


export default Opportunities;