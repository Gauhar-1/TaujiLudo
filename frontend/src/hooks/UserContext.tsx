import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// --- Types ---
interface Profile {
  userId?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  [key: string]: any;
}

interface UserContextType {
  profile: Profile;
  setProfile: (profile: Profile) => void;
  id: string;
  setId: (id: string) => void;
  ludoSet: boolean;
  setLudoSet: (status: boolean) => void;
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
  tempotp: string;
  settempotp: (otp: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

/**
 * Custom Hook: useStorageState
 * Automatically syncs React state with localStorage or sessionStorage.
 */
function useStorageState<T>(key: string, defaultValue: T, storage: Storage = sessionStorage) {
  const [state, setState] = useState<T>(() => {
    try {
      const storedValue = storage.getItem(key);
      if (storedValue !== null) {
        return JSON.parse(storedValue);
      }
    } catch (error) {
      console.error(`Error parsing storage for key "${key}":`, error);
    }
    return defaultValue;
  });

  useEffect(() => {
    storage.setItem(key, JSON.stringify(state));
  }, [key, state, storage]);

  return [state, setState] as const;
}

// --- Provider Component ---
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Auth & Critical Info (Use localStorage to stay logged in on reload)
  const [login, setLogin] = useStorageState<boolean>("login", false, localStorage);
  const [profile, setProfile] = useStorageState<Profile>("profile", {}, localStorage);
  const [userId, setUserId] = useStorageState<string>("userId", "");
  const [name, setName] = useStorageState<string>("name", "");
  const [phoneNumber, setPhoneNumber] = useStorageState<string>("phoneNumber", "");

  // 2. Session/Game Info (Use sessionStorage - clears when tab closes)
  const [id, setId] = useStorageState<string>("id", "");
  const [paymentId, setPaymentId] = useStorageState<string>("paymentId", "");
  const [ludoSet, setLudoSet] = useStorageState<boolean>("ludoSet", false);
  const [event, setEvent] = useStorageState<string>("event", "");
  const [details, setDetails] = useStorageState<string>("details", "");
  const [phone, setPhone] = useStorageState<string>("phone", "");
  const [battleId, setBattleId] = useStorageState<string>("battleId", "");
  const [adminClicked, setAdminClicked] = useStorageState<boolean>("adminClicked", false);
  const [opponentFound, setOpponentFound] = useStorageState<boolean>("opponentFound", false);
  const [amount, setAmount] = useStorageState<number>("amount", 0);
  const [tempotp, settempotp] = useStorageState<string>("otp", "");

  const contextValue: UserContextType = {
    profile, setProfile,
    id, setId,
    ludoSet, setLudoSet,
    userId, setUserId,
    paymentId, setPaymentId,
    battleId, setBattleId,
    name, setName,
    phoneNumber, setPhoneNumber,
    phone, setPhone,
    login, setLogin,
    opponentFound, setOpponentFound,
    adminClicked, setAdminClicked,
    amount, setAmount,
    event, setEvent,
    details, setDetails,
    tempotp, settempotp,
  };

  return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};

/**
 * Custom hook to use the UserContext
 */
export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};