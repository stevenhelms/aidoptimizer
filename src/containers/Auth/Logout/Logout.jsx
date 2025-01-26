import { useNavigate } from "react-router-dom";

import * as auth from "../../../features/authSlice";

const Logout = () => {
  const navigate = useNavigate();
  auth.logout();
  navigate("/auth");
};

export default Logout;
