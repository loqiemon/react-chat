import React, { useState, useEffect, useRef } from "react";
import styled from 'styled-components';
import axios from 'axios';
import { v4 as uuidv4 } from "uuid";
import { getMyChatsRoute, updateChatRoute } from "../utils/APIRoutes";
import { addTransactionRoute, getShardRoute } from "../utils/APIBlochain";
import ChatInput from './ChatInput';
import { postRequestCookie } from '../utils/requests'
import { symDecrypt, symEncrypt } from '../utils/crypto'
import Welcome from '../components/Welcome';
import blankProfile from '../assets/blankProfile.png';


export default function ChatContainer({ currentChat, socket, user, symKey, setChats }) {
  const [messages, setMessages] = useState([]);
  const [searchMessage, setSearchMessage] = useState(undefined);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  // console.log(user, 'useruseruseruser')
  useEffect(() => {
    const func = async () => {
      const data = await axios.post(getShardRoute, {
        "segment_id": currentChat.chatId,
        "numShard": "-1",
        "convertMessages": true
      })
      console.log(data, 'get message')
      const chatsData = data.data.blocks.map(msg => {
        msg.writer === user._id ? msg.fromSelf = true : msg.fromSelf = false
        msg.message = symDecrypt(msg.message, symKey)
      })
      console.log(chatsData)
      setMessages(data.data.blocks);
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
        msg: symEncrypt(msg, symKey),
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
      socket.current.on("msg-recieve", async (msg) => {
        console.log(msg, 'msg')
        
        setArrivalMessage({ fromSelf: false, message: symDecrypt(msg, symKey) });
        // const data = await postRequestCookie(getMyChatsRoute)
        // setChats(data.data)
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  const handleSearchMessageChange = async (e) => {
    setSearchMessage(e.target.value);
  }

  // useEffect(()=> {
  //   console.log(searchMessage, 'searchMessage')
  //   if (searchMessage){
  //     const filtered = messages.filter(msg => msg.message.search(searchMessage) > -1)
  //     setFilteredMessages(filtered)
  //   }else {
  //     setFilteredMessages(messages)
  //   }
  // }, [searchMessage])


  return (
    <Container>
      {currentChat ? (
        <>
            <div className="chat-header">
              <div className="user-details">
                <div className="avatar">
                  {currentChat.avatarImage.length > 0 ?                   <img
                    src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                    alt=""
                  /> : <img
                  src={blankProfile}
                  alt=""
                /> 
                }
                </div>
                <div className="username">
                  <h3>{currentChat.chatname}</h3>
                </div>
                <ChatSearchMessage
        type="text"
        placeholder="Поиск..."
        value={searchMessage}
        onChange={handleSearchMessageChange}
      />

              </div>
              {/* <Logout /> */}
            </div>
            <div className="chat-messages">
              {/* {filteredMessages.map((message) => { */}
                {messages.map((message) => {
                return (
                  <div ref={scrollRef} key={uuidv4()}>
                    <div
                      className={`message ${message.fromSelf ? "sended" : "recieved"
                        }`}
                    >
                      <div className="content ">
                        <p>{message.message}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <ChatInput handleSendMsg={handleSendMsg} />
        </>
      ): (
        <Welcome />
      )
      }
    </Container>
  );
}

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
`;

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
