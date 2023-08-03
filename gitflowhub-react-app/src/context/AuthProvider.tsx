import {
  useState,
  useEffect,
  createContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

import { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import axiosClient from "../config/axiosClient";

interface AuthContextType {
  auth: AuthData;
  setAuth: Dispatch<SetStateAction<AuthData>>;
  loading: Boolean;
  optionUsers: Function;
  fetchPulls: Function;
}

interface AuthData {
  username: string;
  email: string;
  token: string;
  github_user: string;
}

interface User {
  user_id: number;
  username: string;
}

interface Pull {
  id: number;
  title: string;
  description: string;
  state: string;
  created_at: string;
  html_url: string;
  repo_name: string;
  user_id: number;
  User: User;
  number: number;
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
  optionUsers: () => {},
  fetchPulls: () => {},
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
  const { github_user } = auth;

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

  const optionUsers = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      //Find users of the same company in db
      const response: AxiosResponse<User[]> = await axiosClient(
        "/prs/users",
        config
      );
      const users: User[] = response.data;

      //transform data according to component
      const userOptions = users.map((user) => ({
        label: user.username,
        value: user.user_id,
      }));
      return userOptions;
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPulls = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    console.log("fetchPulls is running");
    const githubUser = github_user;

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      try {
        await axiosClient(`/update-avatar/${githubUser}`, config);
        console.log("Attempted to update avatar URL for user", githubUser);
      } catch (error) {
        console.error("Failed to update avatar URL for user", githubUser);
      }

      const url = `/prs?github_user=${githubUser}`;
      const { data: prs } = await axiosClient(url, config);

      // Registro de seguimiento
      console.log("Data received from API:", prs);

      if (prs && prs.length > 0) {
        const newPulls: Record<number, Pull> = {};
        for (let pull of prs) {
          const urlSegments = pull.html_url.split("/");
          const repoName = urlSegments
            .slice(urlSegments.length - 4, urlSegments.length - 2)
            .join("/");
          newPulls[pull.id] = { ...pull, repo_name: repoName };
        }
        // setPulls(newPulls);
        // Registro de seguimiento
        console.log("Updated pulls:", newPulls);

        return newPulls;
      }
    } catch (error: any) {
      console.error("Error:", error.message);
      console.error("Error response:", error.response);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        loading,
        optionUsers,
        fetchPulls,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };

export default AuthContext;
