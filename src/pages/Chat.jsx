import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';
import {getMyChatsRoute, getChatDataRoute, host} from "../utils/APIRoutes"
import ChatListWithSearch from '../components/ChatListWithSearch';
import { io } from "socket.io-client";
import styled from 'styled-components';


function Chat(props) {
  const navigate = useNavigate()
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const socket = useRef();

  useEffect(() => {
    if (props.user) {
      socket.current = io(host);
      socket.current.emit("add-user", props.user._id);
    }
  }, [props.user]);


  useEffect(()=>{
    if (!props.user ){
      navigate('/login')
  }
  }, [props.user])

  useEffect(() => {
    const func = async () => {
      if (props.user) {
        if (props.user) {
          //get chats
          const response = await fetch(getMyChatsRoute, {
            method: 'POST',
            credentials: 'include'
          })
          const data = await response.json()
          console.log(data, 'chats')
          setChats(data)
        } else {
          // navigate("/setAvatar");
        }
      }
    }
    func();
  }, [props.user]);


  const handleChatChange = async (chat) => {
    const privateChat = chat.nickname ? true : false

    // const response = await axios.post(getChatMessagesRoute, { userId: currentUser._id, chatId: chat._id, privateChat: privateChat});
    const response = await fetch(getChatDataRoute, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      credentials: 'include',
      body: JSON.stringify({ 'chatId': chat._id })
    })
    const data = await response.json();
    console.log(data, 'ifChatExistRoute')
    setCurrentChat(chat);
  };

  

  return (
    <>
      {props.user && <Navbar user={props.user} handleUserSet={props.handleUserSet} />}
      <Container>
        <ChatListWithSearch chats={chats} changeChat={handleChatChange}/>
          {currentChat === undefined ? (
                <Welcome />
              ) : (
                <ChatContainer currentChat={currentChat} socket={socket} user={props.user} />
                // <></>
              )}
      </Container>
    </>
  )
}


const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;

export default Chat
