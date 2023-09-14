import { Outlet, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Header from "../components/Header";
import { ToastContainer } from "react-toastify";
import {useEffect} from 'react'
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = () => {
  const { auth, loading} = useAuth();
  const { username, avatar_url } = auth;
  const navigate = useNavigate();

  console.log(username)

  return (
    <>
      {!loading && username?(
        <div>
          <Header username={username} avatar_url={avatar_url} />
          <main className="mt-20">
            <Outlet />
          </main>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </div>
      ):(navigate("/"))}
    </>
  );
};

export default ProtectedRoute;
