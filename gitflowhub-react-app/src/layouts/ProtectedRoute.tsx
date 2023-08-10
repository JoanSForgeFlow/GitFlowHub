import { Outlet, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Header from "../components/Header";

const ProtectedRoute = () => {
  const { auth, loading } = useAuth();

  const { email } = auth;

  console.log(auth);

  //TODO: añadir un spinner de carga

  return (
    <>
      {!loading ? (
        <div>
          <Header/>
          <main>
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
