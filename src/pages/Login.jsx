import React, { useState, useEffect } from 'react'
import { Link, json, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"
import axios from 'axios';
import { loginRoute } from '../utils/APIRoutes.js'
import TextField from '@mui/material/TextField';
import {postRequestCookie} from '../utils/requests'


function Login(props) {

  const navigate = useNavigate()
  const [values, setValues] = useState({
    username: '',
    password: ''
  })


  useEffect(() => {
    if (props.user)
      navigate("/");
  }, [navigate]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleValidation()) {
      const { password, username } = values
      const data = await postRequestCookie(loginRoute, { "username":username, "password":password })

      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      } else if (data.status === true) {
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

  const toastOptions = {
    position: 'bottom-center',
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark'
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
      <FormContainer>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="company">
            <h1>WebChat</h1>
          </div>
          {/* <TextField id="outlined-basic" label="Логин" variant="outlined" onChange={(e) => handleChange(e)} />
                    <TextField id="outlined-basic" label="Пароль" variant="outlined" onChange={(e) => handleChange(e)} type="password" /> */}
          <input min='3' type="text" placeholder='Username' name='username' onChange={(e) => handleChange(e)} />
          <input type="password" placeholder='Password' name='password' onChange={(e) => handleChange(e)} />
          <button type='submit'>Войти</button>
          <span>Нет аккаунта? <Link to="/register">Регистрация</Link></span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  )
}


const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
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
  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
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
