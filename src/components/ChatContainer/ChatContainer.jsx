import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { v4 as uuidv4 } from "uuid";


import './ChatContainer.scss';
import Loader from '../Loader/Loader';
import blankProfile from '../../assets/blankProfile.png';
import ChatInput from "../ChatInput";
import { updateChatRoute } from "../../utils/APIRoutes";
import {getMessages, addTransaction, postRequestCookie, getSomeUsers, getPublicKey} from '../../utils/requests';
import { createSignature, symDecrypt, symEncrypt, verifySignature } from "../../utils/crypto";

export default function ChatContainer(props) {
  const [search, setSearch] = useState('');
  const [filteresMessages, setFilteresMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [usersInfo, setUsersInfo] = useState([]);
  const [loading, setloading] = useState(false);
  
  const scrollRef = useRef();

  useEffect(()=> {
    const func = async () => {
      setloading(true)
      const response = await getMessages(props.chat.chatId);
      console.log(response)
      getSomeUsers(props.chat.chatId).then((res)=>{
        const decryptedMessages = response.map(msg => {
          msg.writer === props.user._id ? msg.fromSelf = true : msg.fromSelf = false
          // msg.nickname = res.foundUsers.find(user => user._id === msg.writer).nickname
          msg.nickname = props.myFriends.find(user => user._id === msg.writer).nickname
          msg.timestamp = new Date(msg.timestamp).toDateString()
          msg.message = symDecrypt(msg.message, props.symChatKey)
          msg.id = uuidv4()
          return msg
        })
        setMessages(decryptedMessages);
        setUsersInfo(res.foundUsers)
        setloading(false)
      })


    }
    func()

  }, [props.chat])


  useEffect(() => {
    if (search.length < 1) {
      setFilteresMessages(messages);
    } else {
      const searchedMessages = messages.filter(msg => msg.message.toLowerCase().includes(search.toLowerCase()))
      setFilteresMessages(searchedMessages)
    }
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: 'start'});
  }, [messages, search])


  useEffect(()=> {
    props.socket.current.on("msg-receive", async (msg) => {

      const messageReceived = { fromSelf: false, message: symDecrypt(msg.message, props.symChatKey) , writer: msg.writer, timestamp: msg.timestamp, id:uuidv4(),
         nickname: props.myFriends.find(user => user._id === msg.writer).nickname}
      const otherUserKey = await getPublicKey(msg.writer);
      const ifThisUser = verifySignature(msg.writer, msg.sign, otherUserKey.publicKey)
      if (ifThisUser) {
        setMessages([...messages, messageReceived])
      }
    });
  })

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: 'start'});
  }, [messages]);


  const sendMessage = async (text) => {
    const encryptedMsg = symEncrypt(text, props.symChatKey)
    postRequestCookie(updateChatRoute, { chatId: props.chat.chatId })
    addTransaction(props.user._id, props.chat.chatId, text, props.symChatKey, createSignature(encryptedMsg, props.privKey))
    setMessages([...messages, {message: text, writer: props.user._id, timestamp: new Date().toDateString(), nickname: props.user.nickname, id:uuidv4()}])
    props.sendMessage({message: encryptedMsg, writer: props.user._id, timestamp: new Date().toDateString()})
 
  }

  const handleSearchChange = async (e) => {
    setSearch(e.target.value)
  }

  const goToMessage = (id) => {
    setSearch('')
    const timeoutId = setTimeout(() => {
      document.getElementById(id).scrollIntoView( { behavior: 'smooth', block: 'start' } );
    }, 150);
    return () => clearTimeout(timeoutId);
}

  return (
    <>
      {props.chat ? <>
        {loading ? <Loader/> :         <div className="chat_messages_container">
        <input
            type="text"
            placeholder="Поиск..."
            value={search}
            onChange={handleSearchChange}
          />
          <div className="messages">
            {filteresMessages.map(message => {
              return (
                <div ref={scrollRef} className={message.writer === props.user._id ? 'message sended' : 'message recieved'} key={uuidv4()} onClick={() => goToMessage(message.id)} id={message.id}>
                  <div className="message_left">
                    <img
                      src={props.chat.avatarImage ? `data:image/svg+xml;base64,${props.chat.avatarImage}` : blankProfile}
                      alt=""
                    />
                  </div>
                  <div className="message_right">
                    <span className="message_nickname">{message.nickname}</span>
                    <div className="message_right_content">
                      {message.message}
                    </div>
                    <div className="message_right_footer">
                      {message.timestamp}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <ChatInput sendMessage={sendMessage} />
        </div>}
      </> : null}
    </>
  );
}

