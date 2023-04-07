import React from "react";
import { useNavigate } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import styled from "styled-components";
import axios from "axios";
import { logoutRoute } from "../utils/APIRoutes";
import {getRequestCookie} from '../utils/requests'


export default function Logout(props) {
  const navigate = useNavigate();
  const handleClick = async () => {
    // const data = await axios.get(`${logoutRoute}`);
    const data = await getRequestCookie(logoutRoute);
    
    // if (data.status === 200) {
      localStorage.clear();
      props.handleUserSet(undefined)
      navigate("/login");
    // }
  };
  return (
    <Button onClick={handleClick}>
      <BiLogOut />
    </Button>
  );
}

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #9a86f3;
  border: none;
  cursor: pointer;
  svg {
    font-size: 1.3rem;
    color: #ebe7ff;
  }
  margin-left: 0.5rem;
`;