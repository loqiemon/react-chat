import React, { useState, useEffect, useRef } from "react";
import styled from 'styled-components';
import axios from 'axios';
import { v4 as uuidv4 } from "uuid";

import { getMyChatsRoute, updateChatRoute, getSomeUsersRoute } from "../../utils/APIRoutes";
import { addTransactionRoute, getShardRoute } from "../../utils/APIBlochain";
import ChatInput from '../ChatInput';
import { postRequestCookie } from '../../utils/requests'
import { symDecrypt, symEncrypt, createSignature,  verifySignature } from '../../utils/crypto'
import './ChatContainer.scss'
import Loader from '../Loader/Loader'


export default function ChatContainer({ currentChat, socket, user, symKey, setChats, clientKeys }) {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [searchForMessage, setSearchForMessage] = useState('');
  const scrollRef = useRef();
  const [usersInfo, setUsersInfo] = useState([])
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [curChat, setCurChat] = useState(undefined);




  useEffect(() => {
    setCurChat(currentChat)
    const func = async () => {
      setLoading(true)
      const data = await axios.post(getShardRoute, {
        "segment_id": currentChat.chatId,
        "numShard": "-1",
        "convertMessages": true
      })

      let chatData = [];
      const shardCount = data.data.listShards.length;

      for (let i = 0; i < shardCount; i++) {
        for (let j = 0; j < data.data.listShards[i].length; j++) {
          const response = await axios.post(getShardRoute, {
            "segment_id": currentChat.chatId,
            "numShard": j,
            "convertMessages": true
          })
          chatData = [...chatData, ...response.data]
        }
      }


      if (currentChat.users.length > 1) {
        const response = await postRequestCookie(getSomeUsersRoute, { usersToFind: [...currentChat.users, user._id] })
        response.success ? setUsersInfo(response.foundUsers) : console.log()
      }

      setLoading(false)

      chatData.map(msg => {
        msg.nickname = usersInfo.length > 0 ? usersInfo.find(nick => nick._id == msg.writer).nickname : ''
        msg.writer === user._id ? msg.fromSelf = true : msg.fromSelf = false
        msg.message = symDecrypt(msg.message, symKey)
        msg.id = uuidv4()
      })

      setMessages(chatData);
      setFilteredMessages(chatData)

    }
    func()
  }, [currentChat]);
  ////

  const handleSendMsg = async (msg) => {
    currentChat.users.forEach(us => {
      console.log(currentChat._id)
      const encryptedMsg = symEncrypt(msg, symKey)
      const sign = createSignature(encryptedMsg, clientKeys.privateKey)
      const publicKey = symEncrypt(clientKeys.publicKey, symKey)
      socket.current.emit("send-msg", {
        to: us,
        from: user._id,
        msg: { chatId: currentChat.chatId, msg: encryptedMsg, sign: sign, publicKey: publicKey, sender: user._id },
      });
    })
    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
    setFilteredMessages(msgs)

    
    await axios.post(addTransactionRoute, {
      "segment_id": currentChat.chatId,
      "writer": user._id,
      "reader": currentChat.chatId,
      "message": symEncrypt(msg, symKey),
      "file": 'None'
    }).then(res => console.log(res))

    postRequestCookie(updateChatRoute, { chatId: currentChat.chatId })


    const data = await postRequestCookie(getMyChatsRoute)
    setChats(data.data)
  };


  useEffect(() => {
    const messages = filteredMessages.map(message => {
      message.nickname = usersInfo.find(userd => userd._id == message.writer).nickname
      return message
    })
    console.log(messages, 'messages')
    setFilteredMessages(messages)
  }, [usersInfo])


  if (socket.current) {
    socket.current.on("msg-recieve", (msg) => {
      if (msg.chatId === currentChat.chatId) {
        const msgText = msg.msg;
        const decryptedPub = symDecrypt(msg.publicKey, symKey);
        const isValid = verifySignature(msgText, msg.sign, decryptedPub)
        // const nick = usersInfo.find(sender => sender._id == msg.sender)
        if (isValid) {
          setArrivalMessage({ fromSelf: false, message: symDecrypt(msg.msg, symKey), id: uuidv4()});
          // setArrivalMessage({ nickname: nick.nickname, fromSelf: false, message: symDecrypt(msg.msg, symKey), id: uuidv4()});
        }
      }
      const func = async () => {
        const data = await postRequestCookie(getMyChatsRoute)
        setChats(data.data)
      }
      func()
    });
  }



  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
    arrivalMessage && setFilteredMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);


  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  const handleSearchMessage = (e) => {
    setSearchForMessage(e.target.value)
  }

  
  useEffect(() => {
    if (searchForMessage.length > 0){
      let data = messages.filter(msg => msg.message.toLowerCase().search(searchForMessage.toLowerCase()) > -1)
      setFilteredMessages(data)
    }else {
      setFilteredMessages(messages)
    }
  }, [searchForMessage])


  const goToMessage = (id) => {
      setSearchForMessage('')
      const timeoutId = setTimeout(() => {
        document.getElementById(id).scrollIntoView( { behavior: 'smooth', block: 'start' } );
      }, 150);
      return () => clearTimeout(timeoutId);
  }


  return (
    <div className="chat_container">
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img
              src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
              alt=""
            />
          </div>
          <div className="username">
            <h3>{currentChat.chatname}</h3>
          </div>
        </div>
        <input className="search_messsage"
            type="text"
            placeholder="Поиск..."
            value={searchForMessage}
          onChange={handleSearchMessage}
          />
      </div>
      {loading ? <Loader /> : <div className="chat-messages">
          {filteredMessages.map((message) => {
          return (
            <div ref={scrollRef} key={uuidv4()}>
              {currentChat.users.length > 1 && user._id !== message.writer && message.nickname }
              <div className={`message bubble ${message.fromSelf ? "sended" : "recieved"} `} onClick={() => goToMessage(message.id)} id={message.id}>
                {message.fromSelf ? <></> : <div className="message_nickname"></div>}
                <div className="content">
                  <p>{message.message}</p>
                </div>
                <p className="message-time">13:20</p>
              </div>
            </div>
          );
        })}
      </div>}
      <ChatInput handleSendMsg={handleSendMsg} />
    </div>
  );
}

