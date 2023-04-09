import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Welcome from '../components/Welcome';
import ChatContainer from '../components/ChatContainer';
import FriendsForCommonChat from '../components/FriendsForCommonChat';
import {getMyChatsRoute, getChatDataRoute, host, saveChatsRoute} from "../utils/APIRoutes"
import ChatListWithSearch from '../components/ChatListWithSearch/ChatListWithSearch';
import { io } from "socket.io-client";
import styled from 'styled-components';
import {postRequestCookie} from '../utils/requests'
import {asymDecrypt} from '../utils/crypto'
import {toast, ToastContainer} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"
import safe from '../assets/safe.png'


function Chat(props) {
  const navigate = useNavigate()
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [symKey, setSymKey] = useState();
  // const [symIv, setSymIv] = useState();
  const [friendForChat, setFriendForChat] = useState([])


  const socket = useRef();


  const toastOptions = {
    position: 'bottom-center',
    autoClose: 8000, 
    pauseOnHover: true,
    draggable: true,
    theme: 'dark'
}


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
          const data = await postRequestCookie(getMyChatsRoute)
          setChats(data.data)
      }
    }
    func();
  }, [props.user]);


  const handleChatChange = async (chat) => {
    const privateChat = chat.nickname ? true : false
    setFriendForChat([])
    postRequestCookie(saveChatsRoute);
    const data = await postRequestCookie(getChatDataRoute, { 'chatId': chat._id })
    if (!data.success){
      toast.error("Ошибка", toastOptions)
    }else{
      const decryptedSymKey = asymDecrypt(data.symKey, props.privKey)
      setSymKey(decryptedSymKey)
    }
    setCurrentChat(chat);
    const resp = await postRequestCookie(getMyChatsRoute)
    setChats(resp.data)
  };

  

  return (
    <>
      {props.user && <Navbar user={props.user} handleUserSet={props.handleUserSet} />}
      <Container>
        <ChatListWithSearch chats={chats} changeChat={handleChatChange} setFriendForChat={setFriendForChat}/>
        {friendForChat.length > 0 ? (
          <FriendsForCommonChat friends={friendForChat} setFriendForChat={setFriendForChat} />
        ) : (
          <>
            {currentChat === undefined ? (
              <Welcome />
            ) : (
              <ChatContainer currentChat={currentChat} socket={socket} user={props.user} symKey={symKey} setChats={setChats} />
            )}
          </>
        )}
      </Container>
      <ToastContainer />
    </>
  );
  
}


const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  // gap: 1rem;
  align-items: center;
  background-color: #131324;
  // background: url(${safe});
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
