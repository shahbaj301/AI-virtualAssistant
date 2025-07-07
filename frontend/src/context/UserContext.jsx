import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import axios from "axios";
export const userDataContext=createContext();

function UserContext({children}){
    const serverUrl="http://localhost:8000"
    const [userData,setUserData]=useState(null);
    const [frontImage ,setFrontImage]=useState(null);
    const [backImage,setBackImage]=useState(null);
    const [selectImage,setSelectImage]=useState(null);
   



    const handleCurrentUser=async ()=>{
        try{
            const result=await axios.get(`${serverUrl}/api/user/current`,{withCredentials:true});
            setUserData(result.data);
            console.log(result.data);
        }
        catch(error){
            // setUserData(null);
            console.log(error);
        }
        
    }

    const getGeminiResponse=async (command) =>{
        try{
            const result=await axios.post(`${serverUrl}/api/user/asktoassistant`,{command},{withCredentials:true});
            return result.data;

        }
        catch(error){
            
            console.log(error);

        }

    }


    useEffect(()=>{
        handleCurrentUser();

    },[]);

    const value={
        serverUrl,userData,setUserData,frontImage ,setFrontImage,backImage,setBackImage,selectImage,setSelectImage,getGeminiResponse
    }

    
    return (
        <div>
            <userDataContext.Provider value={value}>
                {children}
            </userDataContext.Provider>

        </div>
    )
}


export default UserContext;