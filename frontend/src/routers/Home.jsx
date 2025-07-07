import React, { useContext, useEffect, useRef, useState } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import userImg from "../assets/user.gif"
import { RiMenu3Fill } from "react-icons/ri";
import { RxCross2 } from "react-icons/rx";
import aiImg from "../assets/Voice.gif"



function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } = useContext(userDataContext);
  const navigate = useNavigate();
  const [listening, setListening] = useState(false);
  const [usertext, setUsertext] = useState("");
  const [aitext, setAitext] = useState("");
  const isSpeakingref = useRef(false);
  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false);
  const synth = window.speechSynthesis;


  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true });
      setUserData(null);
      navigate("/signin");
    } catch (error) {
      setUserData(null);
      console.log(error);
    }
  };

  const startRecognition = () => {
    try {
      recognitionRef.current?.start();
      setListening(true);
    } catch (error) {
      if (!error.message.includes("start")) {
        console.error("Recognition error:", error);
      }
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    const voices = window.speechSynthesis.getVoices();

    const hindiVoice = voices.find(v => v.lang === 'hi-IN');
    if (hindiVoice) {
      utterance.voice = hindiVoice;

    }
    isSpeakingref.current = true;
    utterance.onend = () => {
      setAitext("");

      isSpeakingref.current = false;
      startRecognition();
    };

    synth.speak(utterance);
  };

  const handleCommand = (data) => {
    const { type, userinput, response } = data;
    speak(response);
    if (type === "google-search") {
      const query = encodeURIComponent(userinput);
      window.open(`https://www.google.com/search?q=${query}`, '_blank');
    }
    if (type === "calculator-open") {
      window.open(`https://www.google.com/search?q=calculator`, '_blank');
    }
    if (type === "instagram-open") {
      window.open(`https://www.instagram.com/`, '_blank');
    }
    if (type === "facebook-open") {
      window.open(`https://www.facebook.com/`, '_blank');
    }
    if (type === "weather-show") {
      window.open(`https://www.google.com/search?q=weather`, '_blank');
    }
    if (type === 'youtube-search' || type === 'youtube-play') {
      const query = encodeURIComponent(userinput);
      window.open(`https://www.youtube.com/results?search_query=${query}`, '_blank');
    }
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'en-US';

    recognitionRef.current = recognition;


    const safeRecognition = () => {
      if (!isSpeakingref.current && !isRecognizingRef.current) {
        try {
          recognition.start();
          console.log("Recognition requested to start");
        } catch (err) {
          if (err.name !== "InvalidStateError") {
            console.log("Start error:", err);
          }
        }
      }
    };

    recognition.onstart = () => {
      console.log("Recognition Started");
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      console.log("Recognition ended");
      isRecognizingRef.current = false;
      setListening(false);

      if (!isSpeakingref.current) {
        setTimeout(() => {
          safeRecognition();
        }, 1000);
      }
    };

    recognition.onerror = (event) => {
      console.warn("Recognition error:", event.error);
      isRecognizingRef.current = false;
      setListening(false);
      if (event.error !== "aborted" && !isSpeakingref.current) {
        setTimeout(() => {
          safeRecognition();
        }, 1000);
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log("Speech result:", transcript);
      if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
        setAitext("");
        setUsertext(transcript);
        recognition.stop();
        isRecognizingRef.current = false;
        setListening(false);

        const data = await getGeminiResponse(transcript);
        console.log(data);

        handleCommand(data);
        setAitext(data.response);
        setUsertext("");
      }
    };

    const fallback = setInterval(() => {
      if (!isSpeakingref.current && !isRecognizingRef.current) {
        safeRecognition();
      }
    }, 10000);

    safeRecognition();

    return () => {
      recognition.stop();
      setListening(false);
      isRecognizingRef.current = false;
      clearInterval(fallback);
    };
  }, []);

  return (

    <div className="w-full h-[100vh] bg-gradient-to-t from-black to-[#020236] flex justify-center items-center flex-col gap-[20px]">
      {/* <RiMenu3Fill className="lg:hidden text-white absolute top-[20px] right-[20px] w-[25px] h-[25px] " />
      <div className="absolute top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] flex flex-col gap-[20px] items-start">
        <RxCross2 className="text-white absolute top-[20px] right-[20px] w-[25px] h-[25px] " />
        <button
          className="min-w-[150px] h-[60px] text-black font-semibold bg-white rounded-full cursor-pointer text-[19px] "
          onClick={handleLogout}
        >
          Logout
        </button>
        <button
          className="min-w-[150px] h-[60px]  text-black font-semibold bg-white  rounded-full text-[19px] px-[20px] py-[10px] cursor-pointer"
          onClick={() => navigate("/customize")}
        >
          Customize Your Assistant
        </button>
      </div> */}

      <button
        className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white absolute hidden lg:block top-[20px] right-[20px] rounded-full text-[19px] cursor-pointer"
        onClick={handleLogout}
      >
        Logout
      </button>
      <button
        className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white absolute hidden lg:block top-[100px] right-[20px] rounded-full text-[19px] px-[20px] py-[10px] cursor-pointer"
        onClick={() => navigate("/customize")}
      >
        Customize Your Assistant
      </button>
      <div className="w-[300px] h-[400px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg">
        <img src={userData?.assistantImage} alt="Assistant" className="h-full object-cover" />
      </div>
      <h1 className="text-white text-[18px] font-semibold">I'm {userData?.assistantName}</h1>
      {!aitext && <img src={userImg} className="w-[200px]" />}
      {aitext && <img src={aiImg} className="w-[200px]" />}
      <h1 className="text-white text-[18px] font-semibold text-wrap">{usertext ? usertext : aitext ? aitext : null}</h1>
    </div>
  );
}

export default Home;




