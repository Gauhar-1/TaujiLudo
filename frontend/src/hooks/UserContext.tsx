import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define the structure of the UserContext
interface UserContextType {
  profile: object;
  setProfile: (id: object) => void;
  id: string;
  setId: (id: string) => void;
  userId: string;
  setUserId: (id: string) => void;
  paymentId: string;
  setPaymentId: (id: string) => void;
  battleId: string;
  setBattleId: (id: string) => void;
  name: string;
  setName: (name: string) => void;
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  login: boolean;
  setLogin: (phone: boolean) => void;
  opponentFound: boolean;
  setOpponentFound: (phone: boolean) => void;
  adminClicked: boolean;
  setAdminClicked: (phone: boolean) => void;
  amount: number;
  setAmount: (phone: number) => void;
}

// Helper function to safely parse JSON
const safeParse = (value: string | null) => {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};


// Helper function to initialize state from localStorage
const getInitialValue = <T extends string | number | boolean  | object>(
  key: string,
  defaultValue: T
): T => {
  const storedValue = localStorage.getItem(key);
  if (storedValue !== null) {
    try {
      const parsedValue = JSON.parse(storedValue);
      if (typeof parsedValue === typeof defaultValue) {
        return parsedValue;
      }
    } catch {
      return defaultValue // Ignore parsing errors and return the default value
    }
  }
  return defaultValue;
};



// Helper function to ensure the phone number starts with +91
// const formatPhoneNumber = (phone: string | undefined | null): string => {
//   if (!phone || typeof phone !== "string") {
//     console.error("Invalid phone number");
//     return "+91";
//   }
//   if (!phone.startsWith("+91")) {
//     return `+91${phone}`;
//   }
//   return phone;
// };

// Context creation
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider Component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State with localStorage initialization
  const [userId, setUserId] = useState<string>(() => getInitialValue("userId", "") as string);
  const [paymentId, setPaymentId] = useState<string>(() => getInitialValue("paymentId", "") as string);
  const [id, setId] = useState<string>(() => getInitialValue("id", "") as string);
const [phoneNumber, setPhoneNumber] = useState<string>(() => getInitialValue("phoneNumber", "") as string);
const [name, setName] = useState<string>(() => getInitialValue("name", "") as string);
const [battleId, setBattleId] = useState<string>(() => getInitialValue("battleId", "") as string);
const [login, setLogin] = useState<boolean>(() => getInitialValue("login", false) as boolean);
const [adminClicked, setAdminClicked] = useState<boolean>(() => getInitialValue("login", false) as boolean);
const [opponentFound, setOpponentFound] = useState<boolean>(() => getInitialValue("opponentFound", false) as boolean);
const [amount, setAmount] = useState<number>(() => getInitialValue("amount", 5) as number);
const [profile, setProfile] = useState<object>(() => getInitialValue("profile",{}) as object);


  

  // Wrapper to enforce +91 prefix in setPhoneNumber
  // const setPhoneNumber = (phone: string) => {
  //   const formattedPhone = formatPhoneNumber(phone);
  //   setPhoneNumberState(formattedPhone);
  // };

  // Update localStorage when state changes
  useEffect(() => {
    const updateLocalStorage = (key: string , value: string | boolean | number) => {
      const existingValue = safeParse(localStorage.getItem(key));
      if (existingValue !== value) {
        localStorage.setItem(key, JSON.stringify(value));
      }
    };

    updateLocalStorage("userId", userId);
    updateLocalStorage("phoneNumber", phoneNumber); // Ensures the +91 prefix is saved as a string
    updateLocalStorage("name", name);
    updateLocalStorage("battleId", battleId);
    updateLocalStorage("login", login);
    updateLocalStorage("opponentFound", opponentFound);
    updateLocalStorage("amount", amount);
    updateLocalStorage("id", id);
    updateLocalStorage("paymentId", paymentId);
    updateLocalStorage("adminClicked", adminClicked);
  }, [userId, phoneNumber, name, battleId,login, opponentFound,amount]);

  // Context value
  const contextValue: UserContextType = {
    id,
    setId,
    userId,
    setUserId,
    phoneNumber,
    setPhoneNumber,
    name,
    setName,
    battleId,
    setBattleId,
    login,
    setLogin,
    opponentFound,
    setOpponentFound,
    amount,
    setAmount,
    paymentId,
    setPaymentId,
    profile,
    setProfile,
    adminClicked,
    setAdminClicked
  };

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

// Custom hook to usze the UserContext
export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
