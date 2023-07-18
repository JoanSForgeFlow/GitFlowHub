import { Link } from "react-router-dom"
const NewPassword = () => {
  return (
    <>
    <h1 className="text-sky-600 font-black text-4xl">
     Reset your password,{" "}
      <span className="text-slate-700">PRs are waiting for you</span>
    </h1>
    <form className="my-10 bg-white shadow rounded-lg p-5">


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
        />

        
      </div>

      <input
          type="submit"
          value="Reset your password"
          className="bg-sky-700 w-full py-3 text-white uppercase rounded-lg font-bold mt-5 hover:cursor-pointer hover:bg-sky-950 transition-colors"
        />

      
    </form>

  
  </>
  )
}

export default NewPassword