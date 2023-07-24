import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FormEvent } from "react";
import axios from "axios";
import { AxiosResponse } from "axios";
import { useParams } from "react-router-dom";
import { Alert } from "../components/Alert";

interface AlertType {
  msg: string;
  error: boolean;
}
interface ApiResponse {
  msg: string;
}

const NewPassword = () => {
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [validatedToken, setValidatedToken] = useState(false);
  const [alert, setAlert] = useState<AlertType>({ msg: "", error: false });

  const params = useParams();
  const { token } = params;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Check taht all variables are not empty
    if ([password, repeatPassword].includes("")) {
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

    // If all validations have passed then we generate the post request
    setAlert({ msg: "", error: false });
    try {
      const data: AxiosResponse<ApiResponse> = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/forget-password/${token}`,
        { password: password }
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
  };

  useEffect(() => {
    const checkToken = async () => {
      try {
        const response: AxiosResponse<ApiResponse> = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/forget-password/${token}`
        );
        setValidatedToken(true);
      } catch (error: any) {
        setAlert({
          msg: error.response?.data?.message || "Unvalid token",
          error: true,
        });
      }
    };

    checkToken();
  }, []);

  const { msg } = alert;

  return (
    <>
      <h1 className="text-sky-600 font-black text-4xl">
        Reset your password,{" "}
        <span className="text-slate-700">PRs are waiting for you</span>
      </h1>

      {validatedToken ? (
        <form
          className="my-10 bg-white shadow rounded-lg p-5"
          onSubmit={handleSubmit}
        >
          <div>{msg && <Alert alert={alert} />}</div>

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
          </div>

          <input
            type="submit"
            value="Reset your password"
            className="bg-sky-700 w-full py-3 text-white uppercase rounded-lg font-bold mt-5 hover:cursor-pointer hover:bg-sky-950 transition-colors"
          />
        </form>
      ) : (
        <Alert alert={alert} />
      )}

      <nav className="lg:flex lg:justify-between">
        <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm"
          to="/sign-in"
        >
          You don't have an account? Sign in
        </Link>
        <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm "
          to="/forget-password"
        >
          I forgot my password
        </Link>
      </nav>
    </>
  );
};

export default NewPassword;
