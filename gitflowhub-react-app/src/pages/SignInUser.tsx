import { useState } from "react";
import { Link } from "react-router-dom";
import { Alert } from "../components/Alert";
import { FormEvent } from "react";
import axios, { AxiosResponse } from "axios";
import axiosClient from "../config/axiosClient";
// import dotenv from "dotenv"

//Types of Alert component and axios response
interface AlertType {
  msg: string;
  error: boolean;
}
interface ApiResponse {
  msg: string;
}

const SignInUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gitHubUser, setGitHubUser] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [alert, setAlert] = useState<AlertType>({ msg: "", error: false });

  // Fucntion that validates the form, if all it's ok then an API request is generated
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check taht all variables are not empty
    if ([name, email, -gitHubUser, password, repeatPassword].includes("")) {
      setAlert({ msg: "Please enter required information.", error: true });
      return;
    }

    // check that repeated password is ok
    if (password !== repeatPassword) {
      setAlert({
        msg: "Password and repeat password are not the same",
        error: true,
      });
      return;
    }

    // check the length of the password
    if (password.length < 6) {
      setAlert({
        msg: "Password needs to have at least 6 characters ",
        error: true,
      });
      return;
    }

    //TODO: check that the github user exists
    try {
      const searchedGitHubUser = await axios.get(
        `https://api.github.com/users/${gitHubUser}`
      );

      if (!searchedGitHubUser) {
        setAlert({
          msg: "GitHubUser doesn not exist",
          error: true,
        });
      }

    } catch (error) {
      setAlert({
        msg: "GitHubUser does not exist ",
        error: true,
      });
      return
    }

    // If all validations have passed then we generate the post request
    setAlert({ msg: "", error: false });
    try {
      const data: AxiosResponse<ApiResponse> = await axiosClient.post(
        `/sign-in`,
        { email: email, username: name, password: password, github_user:gitHubUser }
      );

      setAlert({
        msg: data.data.msg,
        error: false,
      });
    } catch (error: any) {
      setAlert({
        msg: error.response?.data.type || "An error ocurred",
        error: true,
      });
    }

    setName("");
    setEmail("");
    setGitHubUser("");
    setPassword("");
    setRepeatPassword("");
  };

  const { msg } = alert;

  return (
    <>
      <h1 className="text-sky-600 font-black text-4xl">
        Create your account,{" "}
        <span className="text-slate-700">start managing your PRs</span>
      </h1>

      {/* if alert exists, then the component alert shows */}
      {msg && <Alert alert={alert} />}

      <form
        className="my-10 bg-white shadow rounded-lg p-5"
        onSubmit={handleSubmit}
      >
        <div className="my-5">
          <label
            className="uppercase text-gray-600 font-bold block text-xl"
            htmlFor="name"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Your name"
            className="w-full my-2 p-3 border rounded-xl bg-gray-50"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="my-5">
          <label
            className="uppercase text-gray-600 font-bold block text-xl"
            htmlFor="name"
          >
            GitHub user
          </label>
          <input
            id="github_user"
            type="text"
            placeholder="Your GitHub user name"
            className="w-full my-2 p-3 border rounded-xl bg-gray-50"
            value={gitHubUser}
            onChange={(e) => setGitHubUser(e.target.value)}
          />
        </div>

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
            placeholder="User Password"
            className="w-full my-2 p-3 border rounded-xl bg-gray-50"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="my-5">
          <label
            className="uppercase text-gray-600 font-bold block text-xl"
            htmlFor="password"
          >
            Repeat password
          </label>
          <input
            id="password2"
            type="password"
            placeholder="Repeat your password"
            className="w-full my-2 p-3 border rounded-xl bg-gray-50"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
          />

          <input
            type="submit"
            value="Register now"
            className="bg-sky-700 w-full py-3 text-white uppercase rounded-lg font-bold mt-5 hover:cursor-pointer hover:bg-sky-950 transition-colors"
          />
        </div>
      </form>

      <nav className="lg:flex lg:justify-between">
        <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm"
          to="/"
        >
          Do you have an account? Log in
        </Link>
        <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm "
          to="/forget-password"
        >
          I Forgot my password
        </Link>
      </nav>
    </>
  );
};

export default SignInUser;
