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
  const [arrivalMessage, setArrivalMessage] = useState(null);
  

  const scrollRef = useRef();


  useEffect(() => {
    setloading(true)
    const func = async () => {
      const chatData = await getMessages(props.chat.chatId);
      setloading(false)

      chatData.map(msg => {
          msg.writer === props.user._id ? msg.fromSelf = true : msg.fromSelf = false
          msg.nickname = props.myFriends.find(user => user._id === msg.writer).nickname
          msg.timestamp = new Date(msg.timestamp).toDateString()
          msg.message = symDecrypt(msg.message, props.symChatKey)
          msg.id = uuidv4()
      })
      setMessages(chatData);
      setFilteresMessages(chatData)
    }
    func()
  }, [props.chat]);


  const sendMessage = async (msg) => {
      const encryptedMsg = symEncrypt(msg, props.symChatKey)
      // props.socket.current.emit("send-msg", {
      //   to: props.chat.chatId,
      //   message: { chatId: props.chat.chatId, msg: encryptedMsg, sender: props.user._id, writer: props.user._id },
      // });

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg, nickname: props.user.nickname, timestamp: new Date().toDateString() });
    setMessages(msgs);
    setFilteresMessages(msgs)
    props.sendMessage({message: encryptedMsg, writer: props.user._id, timestamp: new Date().toDateString()})
    addTransaction(props.user._id, props.chat.chatId, msg, props.symChatKey, createSignature(encryptedMsg, props.privKey))
    postRequestCookie(updateChatRoute, { chatId: props.chat.chatId })
    
    
  };


  useEffect(() => {
    props.socket.current.off("msg-receive")
      props.socket.current.on("msg-receive", async (msg) => {
        console.log('receive')
          const decryptedPub = await getPublicKey(msg.writer)
          const isValid = verifySignature(msg.message, msg.sign, decryptedPub.publicKey)
          const nick = props.myFriends.find(sender => sender._id == msg.writer).nickname
          if (isValid) {
            // setArrivalMessage({ fromSelf: false, message: symDecrypt(msg.msg, symKey), id: uuidv4()});
            setArrivalMessage({ nickname: nick, fromSelf: false, message: symDecrypt(msg.message, props.symChatKey), id: uuidv4(), timestamp: msg.timestamp});
          }
        }
      );
  }, [])

  // useEffect(()=> {
  //   const func = async () => {
  //     setloading(true)
  //     const response = await getMessages(props.chat.chatId);
  //     console.log(response)
  //     // getSomeUsers(props.chat.chatId).then((res)=>{
  //       const decryptedMessages = response.map(msg => {
  //         msg.writer === props.user._id ? msg.fromSelf = true : msg.fromSelf = false
  //         // msg.nickname = res.foundUsers.find(user => user._id === msg.writer).nickname
  //         msg.nickname = props.myFriends.find(user => user._id === msg.writer).nickname
  //         msg.timestamp = new Date(msg.timestamp).toDateString()
  //         msg.message = symDecrypt(msg.message, props.symChatKey)
  //         msg.id = uuidv4()
  //         return msg
  //       })
  //       setMessages(decryptedMessages);
  //       // setUsersInfo(res.foundUsers)
  //       setloading(false)
  //     // })
  //   }
  //   func()
  // }, [props.chat])


  // useEffect(()=> {
  //   props.socket.current.on("msg-receive", async (msg) => {

  //     const messageReceived = { fromSelf: false, message: symDecrypt(msg.message, props.symChatKey) , writer: msg.writer, timestamp: msg.timestamp, id:uuidv4(),
  //        nickname: props.myFriends.find(user => user._id === msg.writer).nickname}
  //     const otherUserKey = await getPublicKey(msg.writer);
  //     const ifThisUser = verifySignature(msg.writer, msg.sign, otherUserKey.publicKey)
  //     if (ifThisUser) {
  //       // setMessages([...messages, messageReceived])
  //       setArrivalMessage(messageReceived);
  //     }
  //   });
  // })



  // const sendMessage = async (text) => {
  //   const encryptedMsg = symEncrypt(text, props.symChatKey)
  //   postRequestCookie(updateChatRoute, { chatId: props.chat.chatId })
  //   addTransaction(props.user._id, props.chat.chatId, text, props.symChatKey, createSignature(encryptedMsg, props.privKey))
  //   setMessages([...messages, {message: text, writer: props.user._id, timestamp: new Date().toDateString(), nickname: props.user.nickname, id:uuidv4()}])
  //   props.sendMessage({message: encryptedMsg, writer: props.user._id, timestamp: new Date().toDateString()})
  // }



    useEffect(() => {
    if (search.length < 1) {
      setFilteresMessages(messages);
    } else {
      const searchedMessages = messages.filter(msg => msg.message.toLowerCase().includes(search.toLowerCase()))
      setFilteresMessages(searchedMessages)
    }
  }, [search])


  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
    arrivalMessage && setFilteresMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);


  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
                <div ref={scrollRef} className={message.fromSelf? 'message sended' : 'message recieved'} key={uuidv4()} onClick={() => goToMessage(message.id)} id={message.id}>
                {/* <div ref={scrollRef} className={message.writer === props.user._id ? 'message sended' : 'message recieved'} key={uuidv4()} onClick={() => goToMessage(message.id)} id={message.id}> */}
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

