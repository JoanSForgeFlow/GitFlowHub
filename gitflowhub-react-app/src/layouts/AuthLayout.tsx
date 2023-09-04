import { Outlet } from "react-router-dom";
import "../css/Layout.css";
import Logo from "../components/Logo";
import 'react-toastify/dist/ReactToastify.css';

const AuthLayout = () => {
  return (
    <>
      <main className="container mx-auto mt-5 md:mt-20 p-5 md:flex md:justify-center bg-gray-800 h-screen bg-cover bg-no-repeat bg-center">
        <div className="md:w-2/3 lg:w-3/ h-full">
          <div className="flex flex-row items-center justify-center mb-5">
            <Logo />

            <p className="title-company">GitFlowHub</p>
          </div>
          <Outlet />
        </div>
      </main>
    </>
  );
};

export default AuthLayout;
