import { useNavigate } from "react-router-dom";


const Header = () => {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/my-profile");
      };
  return (
    <div>

        <div>
            {/* <img src={avatar_url} alt={`${username}'s avatar`} /> */}
        </div>
    </div>
  )
}

export default Header