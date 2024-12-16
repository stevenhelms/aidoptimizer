import { useNavigate } from "react-router-dom";

import { logout } from "../../../features/authSlice";

const Logout = () => {
  const navigate = useNavigate();
  logout();
  navigate("/auth");
};

export default Logout;
