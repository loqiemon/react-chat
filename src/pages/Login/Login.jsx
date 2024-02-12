import React, { useState, useEffect } from 'react';
import { Link, json, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from '../../utils/APIRoutes.js';
import TextField from '@mui/material/TextField';
import {finalAuth, postRequestCookie} from '../../utils/requests';
import {toastOptions} from '../../utils/toastOptions.js';
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
    if (props.user) navigate("/");
  }, [navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleValidation()) {
      const { password, username } = values
      setLoading(true);
      const data = await postRequestCookie(loginRoute, { "username":username, "password":password })
      setLoading(false);
      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      } else if (data.status === true) {
        setModal(true);
      }
    } else {

    }
  }
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (handleValidation()) {
  //     const { password, username } = values
  //     setLoading(true);
  //     const data = await postRequestCookie(loginRoute, { "username":username, "password":password })
  //     setLoading(false);
  //     if (data.status === false) {
  //       toast.error(data.msg, toastOptions);
  //     } else if (data.status === true) {
  //       props.handleUserSet(data.avatar)
  //       props.checkAuth()
  //       navigate('/')
  //     }
  //   } else {
  //
  //   }
  // }

  const twoFactorCode = async (login, password, code) => {
    const response = await finalAuth(login, password, code);
    if (!response.status) {
      toast.error(response.msg, toastOptions);
      return
    }
    props.handleUserSet(response.avatar)
    props.checkAuth()
    setModal(false);
    navigate('/');
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
        {modal && <Modal closeModal={setModal} handleSubmit={twoFactorCode} values={values}/>}
        {/*{loading ? <Loader/> :*/}
            <Form onSubmit={(e) => handleSubmit(e)}>
              <h1>Войти</h1>
              <input min='3' type="text" placeholder='Логин' name='username' onChange={(e) => handleChange(e)} />
              <input type="password" placeholder='Почта' name='password' onChange={(e) => handleChange(e)} />
              <button type='submit'>Войти</button>
              <span>Нет аккаунта? <Link2 to="/register">Регистрация</Link2></span>
            </Form>
        {/*}*/}
      </Container>
      <ToastContainer />
    </>
  )
}

export default Login
