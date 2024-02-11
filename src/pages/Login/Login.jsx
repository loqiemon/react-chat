import React, { useState, useEffect } from 'react';
import { Link, json, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from '../../utils/APIRoutes.js';
import TextField from '@mui/material/TextField';
import {postRequestCookie} from '../../utils/requests';
import {toastOptions} from '../../utils/toastOptions.js';
import Loader from '../../components/Loader/Loader.jsx';
import {Container, Form, Link2} from "./Login.styles";
import {Modal} from "../../shared/ui/Modal/Modal";

function Login(props) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState();
  const [modal, setModal] = useState(false);
  const [values, setValues] = useState({
    username: '',
    password: ''
  })


  useEffect(() => {
    if (props.user)
      navigate("/");
  }, [navigate]);

  useEffect(() => {
     console.log('12', modal)
  }, [modal]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleValidation()) {
      const { password, username } = values
      setLoading(true);
      const data = await postRequestCookie(loginRoute, { "username":username, "password":password })
      setLoading(false);
      console.log(data)
      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      } else if (data.status === true) {
        setModal(true);
        console.log(111, modal)
        /////111
        props.handleUserSet(data.avatar)
        props.checkAuth()
        navigate('/')
      }
    } else {

    }
  }


  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }


  const handleValidation = () => {
    const { password, username } = values
    if (username === '') {
      toast.error("Логин должен быть заполнен", toastOptions);
      return false
    } else if (password === '') {
      toast.error("Пароль должен быть заполнен", toastOptions);
      return false
    }
    return true

  }

  return (
    <>
      <Container>
        {modal && <Modal/>}
        {loading ? <Loader/> :
            <Form onSubmit={(e) => handleSubmit(e)}>
              <h1>Войти</h1>
              {/* <TextField id="outlined-basic" label="Логин" variant="outlined" onChange={(e) => handleChange(e)} />
                        <TextField id="outlined-basic" label="Пароль" variant="outlined" onChange={(e) => handleChange(e)} type="password" /> */}
              <input min='3' type="text" placeholder='Логин' name='username' onChange={(e) => handleChange(e)} />
              <input type="password" placeholder='Почта' name='password' onChange={(e) => handleChange(e)} />
              <button type='submit'>Войти</button>
              <span>Нет аккаунта? <Link2 to="/register">Регистрация</Link2></span>
            </Form>
        }
      </Container>
      <ToastContainer />
    </>
  )
}


const FormContainer = styled.div`
  .company {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;
export default Login
