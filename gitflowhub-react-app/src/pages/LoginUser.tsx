import { Link, useNavigate } from "react-router-dom";
import { useState, FormEvent } from "react";
import { Alert } from "../components/Alert";
import axiosClient from "../config/axiosClient";
import { AxiosResponse } from "axios";
import useAuth from "../hooks/useAuth";

interface AlertType {
  msg: string;
  error: boolean;
}
interface ApiResponse {
  msg: string;
  token: string;
  email: string;
  username: string;
  github_user: string;
}

const LoginUser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState<AlertType>({ msg: "", error: false });
  const { auth, setAuth, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //Check that all fields are not empty

    if ([email, password].includes("")) {
      setAlert({
        msg: "All fields are needed to login",
        error: true,
      });
      return;
    }

    try {
      const response: AxiosResponse<ApiResponse> = await axiosClient.post(
        "/login",
        {
          email,
          password,
        }
      );

      const data: ApiResponse = response.data;
      const { username, token, github_user } = data;

      localStorage.setItem("token", data.token);
      setAuth({ email, username, token, github_user });
      navigate("/main-page");
    } catch (error: any) {
      console.log(error);
      setAlert({
        msg: error.response?.data?.msg || "Unvalid credentials",
        error: true,
      });
    }

    //axios request to validate user
  };

  const { msg } = alert;

  return (
    <>
      <h1 className="text-sky-600 font-black text-4xl">
        Log In,{" "}
        <span className="text-slate-700">PR are waiting to be managed</span>
      </h1>
      {msg && <Alert alert={alert} />}
      <form
        className="my-10 bg-white shadow rounded-lg p-5"
        onSubmit={handleSubmit}
      >
        <div className="my-5">
          <label
            className="uppercase text-gray-600 font-bold block text-xl"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="User email"
            className="w-full my-2 p-3 border rounded-xl bg-gray-50"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="my-5">
          <label
            className="uppercase text-gray-600 font-bold block text-xl"
            htmlFor="password"
          >
            password
          </label>
          <input
            id="password"
            type="password"
            placeholder="User password"
            className="w-full my-2 p-3 border rounded-xl bg-gray-50"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="submit"
            value="Log In"
            className="bg-sky-700 w-full py-3 text-white uppercase rounded-lg font-bold mt-5 hover:cursor-pointer hover:bg-sky-950 transition-colors"
          />
        </div>
      </form>

      <nav className="lg:flex lg:justify-between">
        <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm"
          to="sign-in"
        >
          You don't have an account? Sign in
        </Link>
        <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm "
          to="forget-password"
        >
          I forgot my password
        </Link>
      </nav>
    </>
  );
};

export default LoginUser;
