import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Alert } from "../components/Alert";
import { AxiosResponse } from "axios";
interface AlertType {
  msg: string;
  error: boolean;
}
interface ApiResponse {
  msg: string;
}


const ConfirmAccount = () => {
  const [alert, setAlert] = useState<AlertType>({ msg: "", error: false });
  const [confirmedAccount, setConfirmedAccount] = useState(false);

  const params = useParams();
  const { id } = params;

  useEffect(() => {
    const confirmAccount = async () => {
      try {
        const url = `${process.env.REACT_APP_BACKEND_URL}/confirm-account/${id}`;
        const response: AxiosResponse<ApiResponse> = await axios.get(url);

        setAlert({
          msg: response.data.msg,
          error: false,
        });
        setConfirmedAccount(true);
      } catch (error:any) {

        setAlert({
          msg: error.response?.data?.message || "Unvalid token",
          error: true,
        });
      }
    };
    
    confirmAccount();
    console.log('confirmo cuenta')
  }, []);

  const { msg } = alert;

  return (
    <>
      <h1 className="text-sky-500 font-black text-2xl">
        Confirm your account,{" "}
        <span className="text-slate-400">start managing your PRs</span>
      </h1>
      <div>
        {/* if alert exists, then the component alert shows */}
        {msg && <Alert alert={alert} />}

        {confirmedAccount && (
          <Link
            className="block text-center my-5 text-slate-500 uppercase text-sm"
            to="/"
          >
            Log In
          </Link>
        )}
      </div>
    </>
  );
};

export default ConfirmAccount;
