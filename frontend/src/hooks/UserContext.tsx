import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define the structure of the Profile type (Update this as per your needs)
interface Profile {
  userId?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  [key: string]: any; // Allows additional properties
}

// Define the structure of the UserContext
interface UserContextType {
  profile: Profile;
  setProfile: (profile: Profile) => void;
  id: string;
  setId: (id: string) => void;
  ludoSet: boolean;
  setLudoSet: (id: boolean) => void;
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
  phone: string;
  setPhone: (phone: string) => void;
  login: boolean;
  setLogin: (status: boolean) => void;
  opponentFound: boolean;
  setOpponentFound: (status: boolean) => void;
  adminClicked: boolean;
  setAdminClicked: (status: boolean) => void;
  amount: number;
  setAmount: (amount: number) => void;
  event: string;
  setEvent: (event: string) => void;
  details: string;
  setDetails: (details: string) => void;
}


// Helper function to initialize state from sessionStorage
const getInitialValue = <T,>(key: string, defaultValue: T): T => {
  const storedValue = sessionStorage.getItem(key);
  if (storedValue !== null) {
    try {
      const parsedValue = JSON.parse(storedValue);
      if (typeof parsedValue === typeof defaultValue) {
        return parsedValue as T;
      }
    } catch {
      return defaultValue; // Ignore parsing errors and return the default value
    }
  }
  return defaultValue;
};
// Helper function to initialize state from sessionStorage
const getInitialValueL = <T,>(key: string, defaultValue: T): T => {
  const storedValue = localStorage.getItem(key);
  if (storedValue !== null) {
    try {
      const parsedValue = JSON.parse(storedValue);
      if (typeof parsedValue === typeof defaultValue) {
        return parsedValue as T;
      }
    } catch {
      return defaultValue; // Ignore parsing errors and return the default value
    }
  }
  return defaultValue;
};

// Context creation
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider Component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState(() => getInitialValue("userId", ""));
  const [paymentId, setPaymentId] = useState(() => getInitialValue("paymentId", ""));
  const [id, setId] = useState(() => getInitialValue("id", ""));
  const [ludoSet, setLudoSet] = useState(() => getInitialValue("ludoSet", false));
  const [event, setEvent] = useState(() => getInitialValue("event", ""));
  const [details, setDetails] = useState(() => getInitialValue("details", ""));
  const [phoneNumber, setPhoneNumber] = useState(() => getInitialValue("phoneNumber", ""));
  const [phone, setPhone] = useState(() => getInitialValue("phone", ""));
  const [name, setName] = useState(() => getInitialValue("name", ""));
  const [battleId, setBattleId] = useState(() => getInitialValue("battleId", ""));
  const [login, setLogin] = useState(() => getInitialValueL("login", false));
  const [adminClicked, setAdminClicked] = useState(() => getInitialValue("adminClicked", false));
  const [opponentFound, setOpponentFound] = useState(() => getInitialValue("opponentFound", false));
  const [amount, setAmount] = useState(() => getInitialValue("amount", 0));
  const [profile, setProfile] = useState<Profile>(() => getInitialValue("profile", {}));
 
  // Update sessionStorage when state changes
  useEffect(() => {
    const updateSessionStorage = (key: string, value: any) => {
      sessionStorage.setItem(key, JSON.stringify(value));
    };
    const updateLocalStorage = (key: string, value: any) => {
      localStorage.setItem(key, JSON.stringify(value));
    };

    updateSessionStorage("userId", userId);
    updateSessionStorage("phoneNumber", phoneNumber);
    updateSessionStorage("phone", phone);
    updateSessionStorage("name", name);
    updateSessionStorage("battleId", battleId);
    updateLocalStorage("login", login);
    updateSessionStorage("opponentFound", opponentFound);
    updateSessionStorage("amount", amount);
    updateSessionStorage("id", id);
    updateSessionStorage("paymentId", paymentId);
    updateSessionStorage("adminClicked", adminClicked);
    updateSessionStorage("details", details);
    updateSessionStorage("event", event);
    updateSessionStorage("profile", profile);
    updateSessionStorage("ludoSet", ludoSet);
  }, [
    userId,
    phoneNumber,
    phone,
    name,
    battleId,
    login,
    opponentFound,
    amount,
    id,
    paymentId,
    adminClicked,
    details,
    event,
    profile,
    ludoSet
  ]);

  // Context value
  const contextValue: UserContextType = {
    id,
    setId,
    userId,
    setUserId,
    phoneNumber,
    setPhoneNumber,
    phone,
    setPhone,
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
    setAdminClicked,
    event,
    setEvent,
    details,
    setDetails,
    ludoSet,
    setLudoSet
  };

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

// Custom hook to use the UserContext
export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
