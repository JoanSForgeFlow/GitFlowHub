import { Outlet,Navigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"

const ProtectedRoute = () => {
    const {auth,loading}=useAuth()

    const{email}=auth

    //TODO: añadir un spinner de carga

  return (

    <>
    {!loading ? <Outlet/>:<Navigate to="/"/>}
    </>
  )
}

export default ProtectedRoute