import {
  useState,
  useEffect,
  createContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

import { useNavigate } from "react-router-dom";
import axiosClient from "../config/axiosClient";

interface AuthContextType {
  auth: AuthData;
  setAuth: Dispatch<SetStateAction<AuthData>>;
  loading: Boolean;
}

interface AuthData {
  username: string;
  email: string;
  token: string;
  github_user: string;
}

const AuthContext = createContext<AuthContextType>({
  auth: {
    username: "",
    email: "",
    token: "",
    github_user: "",
  },
  setAuth: () => {},
  loading: true,
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthData>({
    username: "",
    email: "",
    token: "",
    github_user: "",
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const authenticateUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        const { data } = await axiosClient("/profile", config);
        setAuth(data);
        navigate("/main-page");
      } catch (error) {
        setAuth({
          username: "",
          email: "",
          token: "",
          github_user: "",
        });
      }

      setLoading(false);
    };

    authenticateUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };

export default AuthContext;
