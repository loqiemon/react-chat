import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"
import axios from 'axios';
import Loader from '../components/Loader';
import { setAvatarRoute } from '../utils/APIRoutes.js'
import { Buffer } from "buffer";

export default function SetAvatar(props) {
  const api = 'https://api.multiavatar.com/45678945';
  const navigate = useNavigate();

  useEffect(() => {
    if (!props.user)
      navigate("/login");
  }, [navigate]);

  useEffect(() => {
    if (props.user)
      navigate("/login");
  }, [navigate]);


  const [avatars, setAvatars] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAvatar, setSelectedAvatar] = useState(undefined)

  const toastOptions = {
    position: 'bottom-center',
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark'
  }


  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Выберите аватар", toastOptions);
    } else {
      // const { data } = await axios.post(setAvatarRoute, {
      //   avatarImage: avatars[selectedAvatar],
      // });
      const response = await fetch(setAvatarRoute, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        credentials: 'include',
        body: JSON.stringify({ 'avatarImage': avatars[selectedAvatar] })
      })
      const data = await response.json()
      if (data.isSet) {
        navigate("/");
      } else {
        toast.error("Ошибка при выборе аватара", toastOptions);
      }
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      const data = [];
      for (let i = 0; i < 4; i++) {
        const image = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`);
        // const image = await fetch(`${api}/${Math.round(Math.random() * 1000)}`);
        const buffer = new Buffer(image.data);
        data.push(buffer.toString("base64"));
      }
      setAvatars(data);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  return (
    <>
      <Container>
        {isLoading ?
          <Loader /> : <>
            <div className="title-container">
              <h1>Выберите фото профиля</h1>
            </div>
            <div className="avatars">
              {avatars.map((avatar, index) => {
                return (
                  <div className={`avatar ${selectedAvatar === index ? "selected" : ""}`}>
                    <img
                      src={`data:image/svg+xml;base64,${avatar}`}
                      alt="avatar"
                      key={avatar}
                      onClick={() => setSelectedAvatar(index)}
                    />
                  </div>
                );
              })}
            </div>
            <button onClick={setProfilePicture} className="submit-btn">
              Выбрать
            </button>
          </>}
        <ToastContainer />
      </Container>
    </>
  )
}


const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;
  .loader {
    max-inline-size: 100%;
  }
  .title-container {
    h1 {
      color: white;
    }
  }
  .avatars {
    display: flex;
    gap: 2rem;
    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  .submit-btn {
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
`;