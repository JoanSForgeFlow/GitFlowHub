import { useNavigate } from "react-router-dom";

const Header = ({ username, avatar_url }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/my-profile");
  };
  return (
    <div className="flex flex-row items-center bg-gray-900">
      <div className="w-10 h-10 mx-2 ">
        <img
          src={avatar_url}
          alt={`${username}'s avatar`}
          className="rounded-full border-2 border-cyan-950 hover:border-white hover:transition-all hover:duration-500"
        />
      </div>

      <div className="bg-gray-900 text-white p-1 rounded-lg  border-cyan-950 border-2 hover:border-white hover:transition-all hover:duration-500 ">
        Main Page
      </div>
    </div>
  );
};

export default Header;
