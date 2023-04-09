import React, { useState, useEffect, useRef } from "react";
import styled from 'styled-components';
import axios from 'axios';
import { v4 as uuidv4 } from "uuid";
import { getMyChatsRoute, updateChatRoute, getSomeUsersRoute } from "../utils/APIRoutes";
import { addTransactionRoute, getShardRoute } from "../utils/APIBlochain";
import ChatInput from './ChatInput';
import { postRequestCookie } from '../utils/requests'
import { symDecrypt, symEncrypt } from '../utils/crypto'
import './ChatContainer.scss'


export default function ChatContainer({ currentChat, socket, user, symKey, setChats }) {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [searchForMessage, setSearchForMessage] = useState('');
  const scrollRef = useRef();
  const [usersInfo, setUsersInfo] = useState([])
  const [arrivalMessage, setArrivalMessage] = useState(null);
  // console.log(user, 'useruseruseruser')
  useEffect(() => {
    const func = async () => {
      const data = await axios.post(getShardRoute, {
        "segment_id": currentChat.chatId,
        "numShard": "-1",
        "convertMessages": true
      })
      console.log(data, 'data data data')
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
      console.log(currentChat, 'currentChat for....')
      if (currentChat.users.length > 1) {
        const response = await postRequestCookie(getSomeUsersRoute, { usersToFind: [...currentChat.users, user._id] })
        console.log(response, 'response response')
        response.success ? setUsersInfo(response.foundUsers) : console.log()
      }


      chatData.map(msg => {
        // msg.nickname = usersInfo.length > 0 ? usersInfo.find(nick => nick._id == msg.writer)
        msg.writer === user._id ? msg.fromSelf = true : msg.fromSelf = false
        msg.message = symDecrypt(msg.message, symKey)
      })
      console.log(chatData, 'chatData chatData')
      setMessages(chatData);
      setFilteredMessages(chatData)




    }
    func()
  }, [currentChat]);
  ////

  const handleSendMsg = async (msg) => {
    currentChat.users.forEach(us => {
      console.log(currentChat._id)
      socket.current.emit("send-msg", {
        to: us,
        from: user._id,
        msg: { chatId: currentChat.chatId, msg: symEncrypt(msg, symKey) },
        // msg: symEncrypt(msg, symKey),
      });
    })
    // console.log(currentChat._id, 'currentChat._id')

    await axios.post(addTransactionRoute, {
      "segment_id": currentChat.chatId,
      "writer": user._id,
      "reader": currentChat.chatId,
      "message": symEncrypt(msg, symKey),
      "file": 'None'
    }).then(res => console.log(res))

    const resp = await postRequestCookie(updateChatRoute, { chatId: currentChat.chatId })


    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
    setFilteredMessages(msgs)

    const data = await postRequestCookie(getMyChatsRoute)
    setChats(data.data)
  };

  ////
  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        console.log(msg.chatId, 'msg.chatId')
        console.log(currentChat, 'currentChat.chatId')
        // debugger
        if (msg.chatId === currentChat.chatId) {
          console.log('tre true rue');
          console.log('setArrivalMessage setArrivalMessage setArrivalMessage');
          setArrivalMessage({ fromSelf: false, message: symDecrypt(msg.msg, symKey) });
          console.log('setArrivalMessage setArrivalMessage setArrivalMessage')
        }

        const func = async () => {
          const data = await postRequestCookie(getMyChatsRoute)
          setChats(data.data)
        }
        func()
      });
    }
    console.log(messages, ' messages messages messages messages')
  }, [currentChat]);

  useEffect(() => {
    console.log('arrivalMessage && setMessages')
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
      let data = messages.filter(msg => msg.message.search(searchForMessage) > -1)
      setFilteredMessages(data)
    }else {
      setFilteredMessages(messages)
    }

  }, [searchForMessage])

  return (
    <Container>
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
        <ChatSearchMessage className="search_messsage"
            type="text"
            placeholder="Поиск..."
            value={searchForMessage}
          onChange={handleSearchMessage}
          />
      </div>
      <div className="chat-messages">
        {filteredMessages.map((message) => {
          return (
            <div ref={scrollRef} key={uuidv4()}>
              {/* {currentChat.users.length > 1 && user._id !== message.writer && message.nickname.nickname } */}
              <div className={`message bubble ${message.fromSelf ? "sended" : "recieved"} `}>
                {message.fromSelf ? <></> : <div className="message_nickname"></div>}
                <div className="content ">
                  <p>{message.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  );
}

const Container = styled.div`
    display: grid;
    height: 100vh;
    // padding: 0 1rem;
    padding-top: 6rem;
    background-color: rgba(121, 199, 197, 0.8) ;
    grid-template-rows: 10% 80% 10%;
    // gap: 0.1rem;
    overflow: hidden;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-rows: 15% 70% 15%;
    }
    .chat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 2rem;
      .user-details {
        display: flex;
        align-items: center;
        gap: 1rem;
        .avatar {
          img {
            height: 3rem;
          }
        }
        .username {
          h3 {
            // color: white;
            color: black;
          }
        }

      }
    }
    .chat-messages {
      padding: 1rem 2rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      overflow: auto;
      &::-webkit-scrollbar {
        width: 0.2rem;
        &-thumb {
          // background-color: #ffffff39;
          background-color: black;
          width: 0.1rem;
          border-radius: 1rem;
        }
      }
      .message {
        display: flex;
        align-items: center;
        .content {
          max-width: 40%;
          overflow-wrap: break-word;
          padding: 1rem;
          font-size: 1.1rem;
          border-radius: 1rem;
          // color: #d1d1d1;
          color: #fff;
          @media screen and (min-width: 720px) and (max-width: 1080px) {
            max-width: 70%;
          }
        }
      }
      .sended {
        justify-content: flex-end;
        .content {
          // background-color: #4f04ff21;
          background-color: #A1E2D9;
        }
      }
      .recieved {
        justify-content: flex-start;
        .content {
          // background-color: #9900ff20;
          background-color: #9900ff20;
        }
      }
    }
  `;

const ChatSearchMessage = styled.input`
  background-color: transparent;
  color: #fff;
  // color: #000;
  border: none;
  border-bottom: 2px solid #fff;
  padding: 5px;
  width: 50%;
  margin-bottom: 20px;
  font-size: 16px;
  &:focus {
    outline: none;
  }
  margin: 0 auto;
`;
