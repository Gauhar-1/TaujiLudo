import { useEffect, useState } from "react";
import { BettingCard } from "./bettingCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../utils/url";
import { useUserContext } from "../hooks/UserContext";
import { io } from "socket.io-client";



export const socket = io("https://api.taujiludo.in",{
  path: '/socket.io/',

});

export const HomePage = () => {
    const navigate = useNavigate();
  const { userId, name } = useUserContext(); // Access userId from the context
  const [amount, setAmount] = useState<number>(0);
  const [ info , setInfo ] = useState("");

  const getLocalStorageValue = (key: string, defaultValue: any) => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
      console.error(`Error parsing ${key}:`, error);
      return defaultValue;
    }
  };
  

  const [setClicked, ] = useState(() => getLocalStorageValue("setClicked", false));
  
  const [battleCreated, ] = useState(() => getLocalStorageValue("battleCreated", false));
  
  const [id] = useState(() => getLocalStorageValue("userId", userId));
  
  const [userName] = useState(() => getLocalStorageValue("name", "Noobie"));
  
  const [onGoingB, setOnGoingB] = useState([]);

  // Centralized LocalStorage Setter
  const updateLocalStorage = (key: string, value: any) => {
    const existingValue = JSON.parse(localStorage.getItem(key) || "null");
    if (existingValue !== value) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  };

  useEffect(() => {
    updateLocalStorage("setClicked", setClicked);
    updateLocalStorage("battleCreated", battleCreated);
  }, [setClicked, battleCreated]);
  

  // Synchronize userId with localStorage
  useEffect(() => {
    updateLocalStorage("userId", id);
  }, [id]);

  // Synchronize name with localStorage
  useEffect(() => {
    const stored = localStorage.getItem("name");
    if(userName !== "false"){
        if(stored !== userName){
        updateLocalStorage("name", userName);
    }}
  }, [userName]);

  // Info Bar
  useEffect(()=>{
    const handleInfoBar = async()=>{
      try{
        const response = await axios.get(`${API_URL}/api/auth/getAdmin`);
        if(!response.data){
          return console.log( "InfoBAr response not found ");
        }
        const { adminSetting } = response.data.admin[0];
        setInfo(adminSetting.content);
      }
      catch(err){
        console.log("Error: "+ err);
      }
    }

    handleInfoBar();
  },[])

  // Fetch ongoing battles
  useEffect(() => {
    const fetchOngoingBattles = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/battles/pending`);
        if (response?.data) {
          setOnGoingB(response.data);
        }

      } catch (error) {
        console.error("Error fetching ongoing battles:", error);
      }
    };

    fetchOngoingBattles();

    const interval = setInterval( fetchOngoingBattles, 1000);

    // Cleanup on component unmount
    return () => clearInterval(interval);
  }, []);

  const createBattle = () => {
    if (!amount) {
      alert("Please provide both amount and LudoCode.");
      return;
    }
    if(amount%50 !== 0){
      alert("Amount shpould be multiple of 50");
      return;
    }
    const battleData = {
      name, 
      userId, 
      amount,
    };
    socket.emit("createBattle", battleData);
    console.log("Battle Created:", battleData);
    
  };

  


    return (
        <div className="max-w-sm bg-gray-300 min-h-screen">
            <div className="flex flex-col pt-12">
                <div className="bg-gray-300 pb-16">
                  <div className="bg-yellow-500 px-4 pt-3 pb-1 shadow-md   text-sm font-mono text-center text-white">Commision 5% | Referal 2%</div>
                        <div>
                          <div className="p-6 shadow-md text-center bg-purple-700 border border-black mx-6 mt-4 rounded-lg font-semibold text-gray-200 text-xs  ">{info}</div>
                            <div className="font-serif text-center pt-4">CREATE A BATTLE!</div>
                            <div className="flex gap-2 ml-12 pl-2 mx-4 py-2">
                                <input
                                    type="text"
                                    placeholder="Amount"
                                    className="p-2 rounded-md"
                                    onChange={(e) => {
                                        const newValue = parseInt(e.target.value, 10);
                                        setAmount(newValue > 0 ? newValue : 0);
                                    }}
                                />
                                    <button
                                        className="bg-green-600 w-16 rounded p-2 font-bold"
                                        onClick={() => {
                                          createBattle();
                                        }}
                                    >
                                        Set
                                    </button>
                            </div>
                            <div className="flex flex-col text-xs text-gray-500 font-semibold">
                            <div className="px-16">Minimun Amount :- 50</div>
                            <div className="px-16"> Amount should be multiples of 50</div>
                            </div>
                           
                        </div>
                    
                    <div className="bg-white mt-2 h-2"></div>
                    <div className="bg-gray-300">
                        <div className="flex justify-between">
                            <div className="flex">
                                <img src="../../battleIcon.png" alt="" className="size-6 m-2" />
                                <div className="m-2 font-semibold">Open Battle</div>
                            </div>
                            <div className="flex" onClick={() => navigate("/rules")}>
                                <div className="my-2 font-semibold">Rules</div>
                                <img src="../../info.png" alt="" className="size-6 m-2" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            {onGoingB && onGoingB.map((battle: any) => (
                                <BettingCard key={battle._id} battle={battle} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
