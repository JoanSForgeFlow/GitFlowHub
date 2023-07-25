import {
  useState,
  useEffect,
  createContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

import axiosClient from "../config/axiosClient";

interface AuthContextType {
  setAuth: Dispatch<SetStateAction<AuthData>>;
}

interface AuthData {
  username: string;
  email:string;
  token: string;
}

const AuthContext = createContext<AuthContextType>({ setAuth: () => {} });


const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthData>({ username: "", email:"",token: "" });

  useEffect(()=>{

    const authenticateUser=async ()=>{
      const token=localStorage.getItem('token')
      if (!token) {
        return       
      }

      const config = {
        headers:{
          "Content-Type":"application/json",
          Authorization : `Bearer ${token}`

        }
      }
      try {

        const {data} =await axiosClient("/profile",config)
        setAuth(data)
      } catch (error) {
        
      }
  

    }

    authenticateUser()

  },[])

  return (
    <AuthContext.Provider
      value={{
        setAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };

export default AuthContext;
