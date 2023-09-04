import { Outlet, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Header from "../components/Header";
import { ToastContainer } from "react-toastify";

const ProtectedRoute = () => {
  const { auth, loading } = useAuth();

  const { username, avatar_url } = auth;

  console.log(avatar_url);
  //TODO: añadir un spinner de carga

  return (
    <>
      {!loading ? (
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
      ) : (
        <Navigate to="/main-page" />
      )}
    </>
  );
};

export default ProtectedRoute;
