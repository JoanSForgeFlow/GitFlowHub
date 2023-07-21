import { useState } from "react"
import { Link } from "react-router-dom"

const SignInUser = () => {
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [repeatPassword,setRepeatPassword]=useState('')
  return (
    <>
      <h1 className="text-sky-600 font-black text-4xl">
       Create your account,{" "}
        <span className="text-slate-700">start managing your PRs</span>
      </h1>
      <form className="my-10 bg-white shadow rounded-lg p-5">

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
            onChange={e=> setName(e.target.value)}
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
            onChange={e=> setEmail(e.target.value)}
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
            onChange={e=> setPassword(e.target.value)}
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
            onChange={e=> setRepeatPassword(e.target.value)}
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
  )
}

export default SignInUser