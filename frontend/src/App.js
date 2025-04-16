import { Route, Routes } from "react-router-dom";
import RegisterPage from "./auth/Credentials/RegisterPage";
import Layout from "./Layout";
import LoginPage from "./auth/Credentials/LoginPage";
import Home from "./features/Home";
import Dashboard from "./features/Dashboard";
import { useEffect, useState } from "react";
import AccountForn from "./features/AccountForm";
import Email from "./Email";
import Conversation from "./Conversation";

function App() {

  const [company,setCompany] = useState([]);
  const [dealCount,setDealCount] = useState(0);
  const [saleCount,setSaleCount] = useState(0);
  const [activeDeals,setActiveDeals] = useState(0);

  const [chatSale,setChatSale] = useState("");


  const getCompany = (newCompany)=>{
    setCompany(newCompany)
  }

  const dealsFuncReportCount = (storeDealsCount) => {
    console.log("storeDealsCount",storeDealsCount)
    setDealCount(storeDealsCount)
  }

  const salesFuncReportCount = (storeSalesCount) => {
    console.log("storeSalesCount",storeSalesCount)
    setSaleCount(storeSalesCount)
  }

  const saleChat = (saleName) => {
    console.log(saleName)
    setChatSale(saleName)
  }
  console.log('App : ', chatSale)
  useEffect(()=>{
    setActiveDeals(dealCount+saleCount);
  },[dealCount,saleCount])


  return (
    <>
    <Layout>
      <Routes>
        <Route path="/register" element={<RegisterPage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/" element={<Home getCompany={getCompany} />} />
        <Route path="/dashboard" element={<Dashboard saleChat={saleChat} activeDeals={activeDeals} dealsFuncReportCount={dealsFuncReportCount} salesFuncReportCount={salesFuncReportCount} company={company} />} />
        <Route path="/acc/form" element={<AccountForn />} />
        <Route path="/email" element={<Email />} />
        <Route path="/conversation" element={<Conversation chatSale={chatSale} />} />
      </Routes>
    </Layout>
    </>
  );
}

export default App;
