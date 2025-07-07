import React, { useState, useContext } from "react";
import bg from "../assets/authBg.png";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext";
import axios from "axios";

function SignUp() {
    const [showPassword, setshowPassword] = useState(false);
    const { serverUrl,userData,setUserData } = useContext(userDataContext);
    const navigate = useNavigate();
    const [name, setname] = useState("");
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    const handleSignUp = async (e) => {
        e.preventDefault();
        setErr("");
        setLoading(true); // Start loading

        try {
            console.log(serverUrl);

            const result = await axios.post(
                `${serverUrl}/api/auth/signup`,
                { name, email, password },
                { withCredentials: true }
            );

            setUserData(result.data);
            setLoading(false); // Stop loading on success

            // Redirect or show success
           
        } catch (error) {
            console.log(error);
            setUserData(null);

            setLoading(false);
            navigate("/customize");
            
             // Stop loading on error

            if (error.response && error.response.data && error.response.data.message) {
                setErr(error.response.data.message);
            } else {
                setErr("Something went wrong");
            }
        }
    };

    return (
        <div
            className="w-full h-[100vh] bg-cover flex justify-center items-center"
            style={{ backgroundImage: `url(${bg})` }}
        >
            <form
                className="w-[90%] h-[600px] max-w-[500px] bg-[#00000069] backdrop-blur shadow-lg shadow-black flex flex-col items-center justify-center gap-[20px] px-[20px]"
                onSubmit={handleSignUp}
            >
                <h1 className="text-white text-[30px] font-semibold mb-[30px]">
                    Register to<span className="text-blue-400"> Virtual Assistant</span>
                </h1>

                <input
                    type="text"
                    placeholder="Enter your Name"
                    className="w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[20px] rounded-full text-[18px]"
                    required
                    onChange={(e) => setname(e.target.value)}
                    value={name}
                />

                <input
                    type="email"
                    placeholder="Enter your Email"
                    className="w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[20px] rounded-full text-[18px]"
                    required
                    onChange={(e) => setemail(e.target.value)}
                    value={email}
                />

                <div className="w-full h-[60px] border-2 border-white bg-transparent text-white rounded-full text-[18px] relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your Password"
                        className="w-full h-full rounded-full outline-none bg-transparent placeholder-gray-300 px-[20px] py-[20px]"
                        required
                        onChange={(e) => setpassword(e.target.value)}
                        value={password}
                    />
                    {showPassword ? (
                        <IoEyeOff
                            className="absolute top-[18px] right-[20px] w-[25px] h-[25px] text-[white]"
                            onClick={() => setshowPassword(false)}
                        />
                    ) : (
                        <IoEye
                            className="absolute top-[18px] right-[20px] w-[25px] h-[25px] text-[white]"
                            onClick={() => setshowPassword(true)}
                        />
                    )}
                </div>

                {err.length > 0 && <p className="text-red-500 text-[16px]">*{err}</p>}

                <button
                    className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white rounded-full text-[19px]"
                    disabled={loading}
                >
                    {loading ? "Loading..." : "SignUp"}
                </button>

                <p
                    className="text-[white] text-[18px] cursor-pointer"
                    onClick={() => navigate("/signin")}
                >
                    Already have an account?
                    <span className="text-blue-500"> SignIn</span>
                </p>
            </form>
        </div>
    );
}

export default SignUp;
