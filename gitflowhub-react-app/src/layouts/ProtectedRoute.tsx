import { Outlet, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Header from "../components/Header";

const ProtectedRoute = () => {
  const { auth, loading } = useAuth();

  const { username,avatar_url } = auth;

  console.log(avatar_url)
  //TODO: añadir un spinner de carga
  

  return (
    <>
      {!loading ? (
        <div>
          <Header username={username} avatar_url={avatar_url}/>
          <main className="mt-20">
            <Outlet />
          </main>
        </div>
      ) : (
        <Navigate to="/main-page" />
      )}
    </>
  );
};

export default ProtectedRoute;
