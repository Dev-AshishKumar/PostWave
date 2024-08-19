import { useDispatch } from "react-redux";
import authServices from "../../appwrite/auth";
import { logout } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";

function LogoutBtn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logoutHandler = () => {
    authServices.logout().then(() => {
      dispatch(logout());
      navigate("/login")
    });
  };

  return (
    <button onClick={logoutHandler} className="hover:text-yellow-300">
      Logout
    </button>
  );
}

export default LogoutBtn;
