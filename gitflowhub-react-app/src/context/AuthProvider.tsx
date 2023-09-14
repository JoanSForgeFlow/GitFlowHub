import {
  useState,
  useEffect,
  createContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { toast } from "react-toastify";

import { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import axiosClient from "../config/axiosClient";

interface AuthContextType {
  auth: AuthData;
  setAuth: Dispatch<SetStateAction<AuthData>>;
  authPulls: Record<number,Pull>
  setAuthPulls: Dispatch<SetStateAction<Record<number,Pull>>>
  loading: Boolean;
  spinner: Boolean;
  optionUsers: Function;
  fetchPulls: Function;
  assignUser: Function;
  getPR: Function;
  fetchUserInfo: Function;
  fetchCompanies: Function;
  updateUserProfile: Function;
  getUserMultiplePRs: Function;
  getAssignedPRs: Function;
  changePRStatus: Function;
  signOut: Function;
  changePRPriority: Function;
}

interface AuthData {
  username: string;
  email: string;
  avatar_url: string;
  token: string;
  github_user: string;
}

interface User {
  id: number;
  user_id: number;
  email: string;
  username: string | null;
  password: string;
  token: string | null;
  confirmed: boolean;
  location: string | null;
  language: string | null;
  timeZone: string | null;
  image: string | null;
  github_user: string;
  login: string;
  avatar_url: string;
  company_id: number;
}

enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
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
  asigned_user: User;
  review_status: string;
  priority: Priority;
}

interface Company {
  id: number;
  name: string;
}

const AuthContext = createContext<AuthContextType>({
  auth: {
    username: "",
    email: "",
    avatar_url: "",
    token: "",
    github_user: "",
  },
  authPulls:[],
  setAuth: () => {},
  setAuthPulls:()=>{},
  loading: true,
  spinner: true,
  optionUsers: () => {},
  fetchPulls: () => {},
  assignUser: () => {},
  getPR: () => {},
  fetchUserInfo: () => {},
  fetchCompanies: () => {},
  updateUserProfile: () => {},
  getUserMultiplePRs: () => {},
  getAssignedPRs: () => {},
  changePRStatus: () => {},
  signOut: () => {},
  changePRPriority: () => {},
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthData>({
    username: "",
    email: "",
    avatar_url: "",
    token: "",
    github_user: "",
  });

  const [authPulls,setAuthPulls]=useState([])

  const [loading, setLoading] = useState(true);
  const [spinner, setSpinner] = useState(true);
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
        // navigate("/main-page");
      } catch (error) {
        setAuth({
          username: "",
          email: "",
          avatar_url: "",
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

  const assignUser = async (data) => {
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

      await axiosClient.put("/pr/assign", data, config);
      console.log(data)
      toast.success(`Pull request assigned to ${data.username}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      return;
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const getPR = async (id) => {
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

      const response = await axiosClient(`/pr/${id}`, config);

      return response.data;
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const fetchPulls = async () => {
    setSpinner(true);

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
        setSpinner(false);
        return newPulls;
      }
    } catch (error: any) {
      console.error("Error:", error.message);
      console.error("Error response:", error.response);
    } finally {
      setSpinner(false);
    }
  };

  const fetchUserInfo = async () => {
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
      const response = await axiosClient.get<User>(
        `/${auth.github_user}`,
        config
      );
      console.log(`Fetch User Data Response: ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user data: ${error.message}`);
      if (error.response) {
        console.error(`Response status: ${error.response.status}`);
      }
    }
  };

  const fetchCompanies = async () => {
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
      const response = await axiosClient.get<Company[]>("/companies", config);
      return response.data;
    } catch (error) {
      console.error(`Error fetching companies: ${error.message}`);
      if (error.response) {
        console.error(`Response status: ${error.response.status}`);
      }
    }
  };

  const updateUserProfile = async (
    github_user: string,
    updateData: { company_id: number | null; username: string }
  ) => {
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
      const response = await axiosClient.put(
        `/${github_user}`,
        updateData,
        config
      );
      console.log(`Update Profile Response: ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error) {
      console.error(`Error updating profile: ${error.message}`);
      if (error.response) {
        console.error(`Response status: ${error.response.status}`);
        console.error(`Response data: ${JSON.stringify(error.response.data)}`);
      }
      throw error;
    }
  };

  const getUserMultiplePRs = async () => {
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
      const multiplePRs = await axiosClient("/pr-user-info", config);
      return multiplePRs.data;
    } catch (error) {
      console.error(`Error getting User's PR: ${error.message}`);
      if (error.response) {
        console.error(`Response status: ${error.response.status}`);
        console.error(`Response data: ${JSON.stringify(error.response.data)}`);
      }
      throw error;
    }
  };

  const getAssignedPRs = async () => {
    setSpinner(true);
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
      const assignedPRs = await axiosClient("/pr-user-assigned", config);
      setSpinner(false);
      return assignedPRs.data;
    } catch (error) {
      console.error(`Error getting User's PR: ${error.message}`);
      if (error.response) {
        console.error(`Response status: ${error.response.status}`);
        console.error(`Response data: ${JSON.stringify(error.response.data)}`);
      }
      throw error;
    }
  };

  const changePRStatus = async ({ id, status }) => {
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
      const changedPR = await axiosClient.put(
        "/pr-update-status",
        { id, status },
        config
      );
      return;
    } catch (error) {
      console.log(error);
    }
  };

  const signOut = () => {
    setAuth({
      username: "",
      email: "",
      avatar_url: "",
      token: "",
      github_user: "",
    });
  };

  const changePRPriority = async (id: number, priority: Priority) => {
    console.log("Sending request to change priority for id:", id, "with priority:", priority);
  
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found, returning early.");
      return;
    }
  
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
  
    try {
      const updatedPR = await axiosClient.put(
        "/pr-update-priority",
        { id, priority },
        config
      );
      console.log("Successfully changed priority, server responded with:", updatedPR.data);
      return updatedPR.data;
    } catch (error) {
      console.error("An error occurred while changing PR priority:", error);
      return null;
    }
  };


  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        authPulls,
        setAuthPulls,
        loading,
        spinner,
        optionUsers,
        fetchPulls,
        assignUser,
        getPR,
        fetchUserInfo,
        fetchCompanies,
        updateUserProfile,
        getUserMultiplePRs,
        getAssignedPRs,
        changePRStatus,
        signOut,
        changePRPriority,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider };

export default AuthContext;
