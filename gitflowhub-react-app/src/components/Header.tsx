import { useNavigate } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import { useEffect, useState } from "react";
import LogOutModal from "./LogOutModal";
import "../css/LayoutProtectedRoute.css";
import useAuth from "../hooks/useAuth";

type Anchor = "left";

interface User {
  id: number;
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

const Header = ({ username, avatar_url }) => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    left: false,
  });
  
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const { fetchPulls, fetchUserInfo } = useAuth();

  const handleClickMain = () => {
    navigate("/main-page");
    setState({ ...state, ["left"]: false });
  };
  const handleClickProfile = () => {
    navigate("/my-profile");
    setState({ ...state, ["left"]: false });
  };
  const handleClickBoard = () => {
    navigate("/my-board");
    setState({ ...state, ["left"]: false });
  };

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

    useEffect(()=>{
      const getUserInfoAndPulls = async () => {
        const userData = await fetchUserInfo();
        setUserInfo(userData);

      };
  
      getUserInfoAndPulls();

    },[])
  return (
    <div className="flex flex-row items-center bg-gray-900 py-1 border-b border-gray-600">
      <div className="w-10 h-10 mx-2 ">
        <img
          src={userInfo?.avatar_url}
          alt={`${username}'s avatar`}
          className="rounded-full border-2 border-cyan-950 hover:border-white hover:transition-all hover:duration-500 cursor-pointer"
          onClick={toggleDrawer("left", true)}
        />
        <Drawer
          anchor={"left"}
          open={state["left"]}
          onClose={toggleDrawer("left", false)}
          PaperProps={{
            sx: {
              width: 240,
              backgroundColor: "rgb(17, 24, 39)",
            },
            
          }}
          ModalProps={{
            disablePortal: true,
          }}

        >
          <div className="px-3">
            <div className="mt-3 mb-3 bg-gray-900 border-b border-gray-600 text-gray-300 flex">
              <img
                src={userInfo?.avatar_url}
                alt={`${username}'s avatar`}
                className="rounded-full border-2 border-cyan-950 w-10 mb-2"
              />

              <p className="ml-3 mt-2">{username}</p>
            </div>

            <div
              className="flex items-center p-0.5 text-gray-300 mb-1 border-2 rounded-lg border-cyan-950 hover:border-white hover:transition-all hover:duration-500 cursor-pointer"
              onClick={handleClickMain}
            >
              <span className="material-symbols-outlined mr-2">
                home_app_logo
              </span>
              Home
            </div>

            <div
              className="flex items-center p-0.5 text-gray-300 mb-1 border-2 rounded-lg border-cyan-950 hover:border-white hover:transition-all hover:duration-500 cursor-pointer"
              onClick={handleClickProfile}
            >
              <span className="material-symbols-outlined mr-2">person</span>
              Your Profile
            </div>

            <div
              className="flex items-center p-0.5 text-gray-300 mb-1 border-2 rounded-lg border-cyan-950 hover:border-white hover:transition-all hover:duration-500 cursor-pointer"
              onClick={handleClickBoard}
            >
              <span className="material-symbols-outlined mr-2">dashboard</span>
              Your Board
            </div>

            <div className="w-full border-b border-gray-600 mt-2 mb-2"></div>

            <div>
              <LogOutModal/>
            </div>
          </div>
        </Drawer>
      </div>

      <div
        className="bg-gray-900 text-white px-1 rounded-lg  border-cyan-950 border-2 hover:border-white hover:transition-all hover:duration-500 cursor-pointer home-button "
        onClick={handleClickMain}
      >
        <span className="material-symbols-outlined ">home_app_logo</span>
      </div>
    </div>
  );
};

export default Header;
