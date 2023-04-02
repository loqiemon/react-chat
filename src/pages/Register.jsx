import React, {useState, useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {toast, ToastContainer} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"
import axios from 'axios';
import {registerRoute} from '../utils/APIRoutes.js'

function Register(props) {
    const navigate = useNavigate()
    const [values, setValues] = useState({
        username: '',
        nickname: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    
    useEffect(() => {
      if (props.user)
        navigate("/");
    }, [navigate]);

          
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (handleValidation()){ 
            const {password, username, email, nickname} = values
            const {data} = await axios.post(registerRoute, {
                username,
                nickname,
                email,
                password
            })
            console.log(data)
            if (data.status===false){
                toast.error(data.msg, toastOptions);
            }else if (data.status===true) {
                props.handleUserSet(data.avatar)
                props.checkAuth()
                navigate('/')
            }

        }else {

        }
    }

    const handleChange = (e) => {
        setValues({...values, [e.target.name]:e.target.value})
    }
    const toastOptions = {
        position: 'bottom-center',
        autoClose: 8000, 
        pauseOnHover: true,
        draggable: true,
        theme: 'dark'
    }
    const handleValidation = () => {
        const {password, confirmPassword, username, email, nickname} = values
        if (password!==confirmPassword){
            toast.error("Пароли должны совпадать", toastOptions);
            return false
        }else if (username.length<3){
            toast.error("Логин не менее 3 символов", toastOptions);
            return false
        }else if (password.length<8){
            toast.error("Пароль не менее 8 символов", toastOptions);
            return false
        }else if (email===''){
            toast.error("Почта должна быть указана", toastOptions);
            return false
        }else if (nickname.length<3){
          toast.error("Имя пользователя не менее 3 символов", toastOptions);
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
                    <input type="text" placeholder='Username' name='username' onChange={(e) => handleChange(e)} />
                    <input type="text" placeholder='Nickname' name='nickname' onChange={(e) => handleChange(e)} />
                    <input type="email" placeholder='Email' name='email' onChange={(e) => handleChange(e)} />
                    <input type="password" placeholder='Password' name='password' onChange={(e) => handleChange(e)} />
                    <input type="password" placeholder='Confirm password' name='confirmPassword' onChange={(e) => handleChange(e)} />
                    <button type='submit'>Зарегистрироваться</button>
                    <span>Уже зарегистрированы? <Link to="/login">Войти</Link></span>
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
export default Register
