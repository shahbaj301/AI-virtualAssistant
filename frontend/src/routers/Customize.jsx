import React, { useContext, useRef, useState } from "react";
import Card from "../components/Card";
import image1 from "../assets/image1.png"
import image2 from "../assets/image2.jpg"
import image3 from "../assets/authBg.png"
import image4 from "../assets/image4.png"
import image5 from "../assets/image5.png"
import image6 from "../assets/image6.jpeg"
import image7 from "../assets/image7.jpeg"
import { LuImageUp } from "react-icons/lu";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { FaBackward } from "react-icons/fa6";
function Customize() {
    const {serverUrl,userData,setUserData,frontImage ,setFrontImage,backImage,setBackImage,selectImage,setSelectImage}=useContext(userDataContext);
    const navigate=useNavigate();
    const inputImage=useRef();
    const Navigate=useNavigate();
    

    const handleImage=(e)=>{
        const file=e.target.files[0];
        setBackImage(file);
        setFrontImage(URL.createObjectURL(file));

    }

    return (
        <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#020236] flex justify-center items-center flex-col p-[20px] gap-[20px]">
            <FaBackward className="absolute top-[30px] left-[30px] text-white cursor-pointer w-[25px] h-[25px]" onClick={()=>Navigate("/")}/>
            <h1 className="text-white text-[30px] text-center ">Select Your Assistant Image</h1>
            <div className="w-full max-w-[900px] flex justify-center items-center flex-wrap gap-[15px]">
                <Card image={image1} />
                <Card image={image2} />
                <Card image={image3} />
                <Card image={image4} />
                <Card image={image5} />
                <Card image={image6} />
                <Card image={image7} />
                <div className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[250px] bg-[#030326] border-2 border-[blue] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 hover:border-white flex items-center justify-center ${selectImage=="input"?"border-4 border-white shadow-2xl shadow-blue-950":null}`} onClick={()=>{
                    inputImage.current.click() 
                    setSelectImage("input")} }>

                    {!frontImage && <LuImageUp className="text-white w-[25px] h-[25px]"/>}
                    {frontImage && <img src={frontImage} className="h-full object-cover"/>}


                </div>
                <input type="file" accept="image/*" ref={inputImage} hidden onChange={handleImage}/>
            </div>
            {selectImage && <button className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white rounded-full text-[19px]"onClick={()=>navigate("/customize2")}>Next</button>}
            

        </div>
    )
}

export default Customize