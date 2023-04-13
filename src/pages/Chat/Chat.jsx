import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Welcome from '../../components/Welcome';
import ChatContainer from '../../components/ChatContainer/ChatContainer';
import FriendsForCommonChat from '../../components/FriendsForCommonChat/FriendsForCommonChat';
import { getMyChatsRoute, getChatDataRoute, host, saveChatsRoute } from "../../utils/APIRoutes"
import ChatListWithSearch from '../../components/ChatListWithSearch/ChatListWithSearch';
import { io } from "socket.io-client";
import styled from 'styled-components';
import { postRequestCookie } from '../../utils/requests'
import { asymDecrypt } from '../../utils/crypto'
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"
import safe from '../../assets/safe.png'
import axios from 'axios'
import { addBlockRoute } from "../../utils/APIBlochain"
import backd from '../../assets/backd.jpg'
import './chat.scss'
import { toastOptions } from '../../utils/toastOptions'


function Chat(props) {
  const navigate = useNavigate()
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [symKey, setSymKey] = useState();
  // const [symIv, setSymIv] = useState();
  const [friendForChat, setFriendForChat] = useState([])
  const [loading, setLoading] = useState(false)

  const socket = useRef();


  useEffect(() => {
    if (props.user) {
      socket.current = io(host);
      socket.current.emit("add-user", props.user._id);
      const func = async () => {
        if (props.user) {
          const data = await postRequestCookie(getMyChatsRoute)
          setChats(data.data)
        }
      }
      socket.current.on("msg-recieve", async (msg) => {
          const data = await postRequestCookie(getMyChatsRoute)
          setChats(data.data)
      });
      func();
    } else {
      navigate('/login')
    }
  }, [props.user]);





  const handleChatChange = async (chat) => {
    console.log(chat, 'selected chat')
    setFriendForChat([]);
    await postRequestCookie(saveChatsRoute);
    const resp = await postRequestCookie(getMyChatsRoute);
    setChats(resp.data);
    const data = await postRequestCookie(getChatDataRoute, { chatId: chat._id });
    if (!data.success) {
      toast.error("Ошибка", toastOptions);
    } else {
      const decryptedSymKey = asymDecrypt(data.symKey, props.privKey);
      setSymKey(decryptedSymKey);
    }
    console.log(currentChat, 'currentChat before')
    setCurrentChat(chat);
    await postRequestCookie(saveChatsRoute);
  };



  return (
    <>
      {props.user && <Navbar user={props.user} handleUserSet={props.handleUserSet} />}
      <div className="chat_page">
        <ChatListWithSearch chats={chats} changeChat={handleChatChange} setFriendForChat={setFriendForChat} />
        {friendForChat.length > 0 ? (
          <FriendsForCommonChat friends={friendForChat} setFriendForChat={setFriendForChat} setChats={setChats} />
        ) : (
          <>
            {currentChat === undefined ? (
              <Welcome />
            ) : (
              <ChatContainer currentChat={currentChat} socket={socket} user={props.user} symKey={symKey} setChats={setChats} clientKeys={props.clientKeys} />
            )}
          </>
        )}
      </div>
      <ToastContainer />
    </>
  );
}


export default Chat
