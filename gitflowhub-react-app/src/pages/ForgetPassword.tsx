import { Link } from "react-router-dom";
import { useState, FormEvent } from "react";
import axios from "axios";
import { Alert } from "../components/Alert";
import axiosClient from "../config/axiosClient";
interface AlertType {
  msg: string;
  error: boolean;
}

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [alert, setAlert] = useState<AlertType>({ msg: "", error: false });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email === "") {
      setAlert({
        msg: "You have to write an email",
        error: true,
      });
      return;
    }

    try {
      const response = await axiosClient.post(
        `/forget-password`,
        { email: email }
      );
      setAlert({
        msg: response.data.msg,
        error: false,
      });
    } catch (error: any) {
      setAlert({
        msg: error.response?.data.type || "An error ocurred",
        error: true,
      });
    }
  };
  const { msg } = alert;
  return (
    <>
      <h1 className="text-sky-600 font-black text-4xl">
        Recover your acess,{" "}
        <span className="text-slate-700">we are waiting for you</span>
      </h1>
        <div>{msg && <Alert alert={alert} />}</div>
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
            placeholder="Register Email"
            className="w-full my-2 p-3 border rounded-xl bg-gray-50"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <input
          type="submit"
          value="Send instructions"
          className="bg-sky-700 w-full py-3 text-white uppercase rounded-lg font-bold mt-5 hover:cursor-pointer hover:bg-sky-950 transition-colors"
        />
      </form>

      <nav className="lg:flex lg:justify-between">
        <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm"
          to="/"
        >
          ¿Dou you hace an account? Login
        </Link>
        <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm"
          to="/sign-in"
        >
          ¿You don't have an account? Sign in
        </Link>
      </nav>
    </>
  );
};

export default ForgetPassword;
