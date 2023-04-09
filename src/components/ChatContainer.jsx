import React, { useState, useEffect, useRef } from "react";
import styled from 'styled-components';
import axios from 'axios';
import { v4 as uuidv4 } from "uuid";
import { getMyChatsRoute, updateChatRoute, getSomeUsersRoute} from "../utils/APIRoutes";
import { addTransactionRoute, getShardRoute } from "../utils/APIBlochain";
import ChatInput from './ChatInput';
import { postRequestCookie } from '../utils/requests'
import { symDecrypt, symEncrypt } from '../utils/crypto'
import './ChatContainer.scss'


export default function ChatContainer({ currentChat, socket, user, symKey, setChats }) {
  const [messages, setMessages] = useState([]);

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

      for (let i = 0; i < shardCount; i++ ){
        for (let j = 0; j < data.data.listShards[i].length; j++){
          const response = await axios.post(getShardRoute, {
            "segment_id": currentChat.chatId,
            "numShard": j,
            "convertMessages": true
          })
          chatData = [...chatData, ...response.data]
        }
      }
      console.log(currentChat, 'currentChat for....')



      chatData.map(msg => {
        msg.writer === user._id ? msg.fromSelf = true : msg.fromSelf = false
        msg.message = symDecrypt(msg.message, symKey)
      })
      console.log(chatData, 'chatData chatData')
      setMessages(chatData);


      if (currentChat.users.length > 1){
        const response = await postRequestCookie(getSomeUsersRoute, {usersToFind: currentChat.users})
        response.success ?  setUsersInfo(response) : console.log()
      }

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
        msg: {chatId: currentChat.chatId, msg: symEncrypt(msg, symKey)},
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
    console.log(resp, 'resp')



    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
    

    const data = await postRequestCookie(getMyChatsRoute)
    setChats(data.data)
  };

  ////
  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        console.log(msg, 'msg')
        console.log(currentChat.chatId, 'currentChat.chatId')
        if (msg.chatId == currentChat.chatId){
          setArrivalMessage({ fromSelf: false, message: symDecrypt(msg.msg, symKey) });
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
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


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
          <ChatSearchMessage className="search_messsage"
              type="text"
              placeholder="Поиск..."
              // value={search}
              // onChange={handleSearchChange}
            />
        </div>
        {/* <Logout /> */}
      </div>
      <div className="chat-messages">
        {messages.map((message) => {
          return (
            <div ref={scrollRef} key={uuidv4()}>
              <div className={`message ${message.fromSelf ? "sended" : "recieved"}`}>
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
    padding-top: 6rem;
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
            color: white;
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
          background-color: #ffffff39;
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
          color: #d1d1d1;
          @media screen and (min-width: 720px) and (max-width: 1080px) {
            max-width: 70%;
          }
        }
      }
      .sended {
        justify-content: flex-end;
        .content {
          background-color: #4f04ff21;
        }
      }
      .recieved {
        justify-content: flex-start;
        .content {
          background-color: #9900ff20;
        }
      }
    }
  `;

  const ChatSearchMessage = styled.input`
  background-color: transparent;
  color: #fff;
  border: none;
  border-bottom: 2px solid #fff;
  padding: 5px;
  width: 90%;
  margin-bottom: 20px;
  font-size: 16px;
  &:focus {
    outline: none;
  }
  self-justify: center;
`;
