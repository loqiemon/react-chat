import React, {useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import { io } from "socket.io-client";
import {toast, ToastContainer} from 'react-toastify';

import Navbar from '../../components/Navbar/Navbar';
import Loader from '../../components/Loader/Loader';
import ChatListWithSearch from '../../components/ChatListWithSearch/ChatListWithSearch';
import ChatContainer from '../../components/ChatContainer/ChatContainer';
import {host, getChatDataRoute} from "../../utils/APIRoutes";
import {toastOptions} from '../../utils/toastOptions';
import {asymDecrypt} from '../../utils/crypto';
import { postRequestCookie } from '../../utils/requests';
import { symEncrypt, createSignature } from "../../utils/crypto";
import FriendsForCommonChat from '../../components/FriendsForCommonChat/FriendsForCommonChat'
import './chat.scss'


export default function Chat (props) {
  const [selectedChat, setSelectedChat] = useState(undefined);
  const [symChatKey, setSymChatKey] = useState();
  const [loading, setLoading] = useState(false)
  const [createCommonChat, setCreateCommonChat] = useState(false)
  const [updateChats, setUpdateChats] = useState(0)

  const socket = useRef();
  const navigate = useNavigate()


  useEffect(() => {
    if (!props.user) {
      navigate('/login')
    }else {
      socket.current = io(host);
      socket.current.emit("add-user", props.user._id);
      socket.current.on("update-chats", async () => {
        setUpdateChats(updateChats+1)
      });
    }
  }, [props.user])


  const changeChat = async (chat) => {
    if (selectedChat) {
      socket.current.emit("disconnect-from-chat", selectedChat.chatId)
    }
    setSelectedChat(chat)
    socket.current.emit("connect-to-chat", chat.chatId);
    setLoading(true)
    const data = await postRequestCookie(getChatDataRoute, { 'chatId': chat._id, sign: createSignature(chat._id, props.privKey) })
    setLoading(false)
    if (!data.success){
      toast.error("Ошибка", toastOptions)
    }else{
      const decryptedSymKey = asymDecrypt(data.symKey, props.privKey)
      setSymChatKey(decryptedSymKey)
    }
  }


  const sendMessage = async (message) => {
    socket.current.emit("send-msg", {
      to: selectedChat.chatId,
      sign: createSignature(message, props.privKey),
      message: message
    });
    socket.current.emit('update-chats', selectedChat.users)
  }


  return (
    <>
      {
        props.user ? <>
        <Navbar user={props.user}/>
        <div className="main">
          <ChatListWithSearch changeChat={changeChat} user={props.user} selectedChat={selectedChat} createCommonChat={setCreateCommonChat} updateChats={updateChats} privKey={props.privKey}/>
          {createCommonChat ? <FriendsForCommonChat setCreateCommonChat={setCreateCommonChat}/> : selectedChat ?  loading ? <Loader/> : <ChatContainer chat={selectedChat} sendMessage={sendMessage} symChatKey={symChatKey} user={props.user} socket={socket}/> : <></>}
        </div>
        </> : <Loader/>
      }
    </>
  )
}