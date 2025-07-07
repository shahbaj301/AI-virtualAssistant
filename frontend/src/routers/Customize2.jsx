import React, { useContext, useState } from "react";
import { userDataContext } from "../context/UserContext";
import axios from "axios"
import { FaBackward } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

function Customize2(){
    const {userData,backImage,selectImage,serverUrl,setUserData}=useContext(userDataContext);
    const [assistantName, setAssistantName]=useState(userData?.AssistantName || "");
    const [loading,setLoading]=useState(false);
    const Navigate=useNavigate();

    const handleUpdateAssistant=async()=>{
        setLoading(true);
        try{
            let formData=new FormData();
            formData.append("assistantName",assistantName);
            if(backImage){
                formData.append("assistantImage",backImage);
            }
            else{
                formData.append("imageUrl",selectImage);

            }
            const result=await axios.post(`${serverUrl}/api/user/update`,formData,{withCredentials:true});
            setLoading(false);
            console.log(result.data);
            setUserData(result.data);
            Navigate("/");
        }
        catch(error){
            setLoading(false);
            console.log(error);
        }
    }
    return(
        <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#020236] flex justify-center items-center flex-col p-[20px] gap-[20px] relative">
            <FaBackward className="absolute top-[30px] left-[30px] text-white cursor-pointer w-[25px] h-[25px]" onClick={()=>Navigate("/customize")}/>

            <h1 className="text-white text-[30px] text-center ">Enter your <span className="text-blue-200">Assistant Name..</span></h1>

            <input type="text" placeholder="Enter your Name" className="w-full max-w-[600px] h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[20px] rounded-full text-[18px] " required onChange={(e)=>setAssistantName(e.target.value)} value={assistantName}/>
            {assistantName&&<button className="min-w-[300px] h-[60px] mt-[30px] text-black font-semibold bg-white rounded-full text-[19px]" disabled={loading} onClick={()=>handleUpdateAssistant()}>{!loading?"Finally Create Your Assistant":"Loading..."}</button>}
        </div>
    )

    
}

export default Customize2

