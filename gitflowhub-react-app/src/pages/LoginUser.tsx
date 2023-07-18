import { Link } from "react-router-dom";

const LoginUser = () => {
  return (
    <>
      <h1 className="text-sky-600 font-black text-4xl">
        Log In,{" "}
        <span className="text-slate-700">PR are waiting to be managed</span>
      </h1>
      <form className="my-10 bg-white shadow rounded-lg p-5">
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
