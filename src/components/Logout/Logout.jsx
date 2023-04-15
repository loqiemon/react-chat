import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { logoutRoute } from "../../utils/APIRoutes";
import {getRequestCookie} from '../../utils/requests'
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import './logout.scss'

export default function Logout(props) {
  const navigate = useNavigate();
  const handleClick = async () => {
    // const data = await axios.get(`${logoutRoute}`);
    localStorage.clear();
    // props.handleUserSet(undefined)
    navigate("/login");
    const data = await getRequestCookie(logoutRoute);
    
    // if (data.status === 200) {

    // }
  };
  return (
    <div className="navbar_quit" onClick={handleClick}>
      <span>Выход</span>
      <ExitToAppIcon />
    </div>
  );
}

