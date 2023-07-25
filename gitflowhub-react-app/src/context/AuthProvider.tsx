import {
  useState,
  useEffect,
  createContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

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
