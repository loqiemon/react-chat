import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import searchIcon from "../../assets/search.svg";
import fileIcon from "../../assets/file.png";

import Loader from '../Loader/Loader';
import blankProfile from '../../assets/blankProfile.png';
import arrow from '../../assets/arrow.svg';
import ChatInput from "../ChatInput/ChatInput";
import {host, updateChatRoute} from "../../utils/APIRoutes";
import {
  getMessages,
  addTransaction,
  postRequestCookie,
  getSomeUsers,
  getPublicKey,
  sendFile
} from '../../utils/requests';
import { createSignature, symDecrypt, symEncrypt, verifySignature } from "../../utils/crypto";

import {
  Avatar, BackIcon,
  ChatName,
  ChatSearch,
  ChatSearchDiv,
  ChatSearchIcon,
  ChatSearchInput,
  Container, Content, Description, FileIcon, FileName, Flex2,
  Message, MessageFile, MessageName,
  Messages, MessageTime
} from "./ChatContainer.styles";


export default function ChatContainer(props) {
  const [search, setSearch] = useState('');
  const [filteresMessages, setFilteresMessages] = useState([]);
  const [messages, setMessages] = useState([]);
  const [usersInfo, setUsersInfo] = useState([]);
  const [loading, setloading] = useState(false);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [searchMessageState, setSearchMessageState] = useState(false)

  const scrollRef = useRef();

  const {chat} = props


  useEffect(() => {
    setloading(true)
    const func = async () => {
      const chatData = await getMessages(props.chat.chatId);
      setloading(false)

      chatData.map(msg => {
        msg.file = (msg.file === 'None' || !msg.file) ? null : msg.file
        msg.writer === props.user._id ? msg.fromSelf = true : msg.fromSelf = false
        msg.nickname = props.myFriends.find(user => user._id === msg.writer).nickname
        msg.timestamp = new Date(msg.timestamp).toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1").slice(0, 5);
        msg.message = symDecrypt(msg.message, props.symChatKey)
        msg.time = Math.round(parseFloat(msg.timestamp.slice(3)) / 5) * 5
        msg.id = uuidv4()
      })
      console.log(chatData)
      setMessages(chatData);
      setFilteresMessages(chatData)
    }
    func()
  }, [props.chat]);


  const sendMessage = async (msg1) => {
    const msg = msg1.msg
    const encryptedMsg = symEncrypt(msg, props.symChatKey)
    const msgs = [...messages];
    const filePath = Date.now().toString()
    const fullPath = msg1.file ? filePath + '/' + msg1?.file?.name : null
    msgs.push({ file: fullPath, fromSelf: true, message: msg, nickname: props.user.nickname, timestamp: new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1").slice(0, 5), id: uuidv4() });
    setMessages(msgs);
    setFilteresMessages(msgs)
    if (msg1.file) {
      await sendFile({ file: msg1?.file, fileName: msg1?.file?.name, filePath })
    }
    props.sendMessage({ fileName: msg1?.file?.name, filePath: filePath, file: fullPath, message: encryptedMsg, writer: props.user._id, timestamp: new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1").slice(0, 5) })
    addTransaction(props.user._id, props.chat.chatId, msg, props.symChatKey, createSignature(encryptedMsg, props.privKey), fullPath)
    postRequestCookie(updateChatRoute, { chatId: props.chat.chatId })
  };



  const getFileName = (file) => {
    try {
      const fileNameRegex = /[^/\\&\?]+\.\w{3,4}(?=([\?&].*$|$))/;
      const matches = file.match(fileNameRegex);
      return matches ? matches[0] : null;
    } catch {
      return ''
    }
  }

  useEffect(() => {
    props.socket.current.on("msg-receive", async (msg) => {
          const decryptedPub = await getPublicKey(msg.writer)
          // const isValid = verifySignature(msg.message, msg.sign, decryptedPub.publicKey)
          const nick = props.myFriends.find(sender => sender._id == msg.writer).nickname
          // if (isValid) {
            // setArrivalMessage({ fromSelf: false, message: symDecrypt(msg.msg, symKey), id: uuidv4()});
            setArrivalMessage({
              file: msg.file,
              nickname: nick, fromSelf: false, message: symDecrypt(msg.message, props.symChatKey), id: uuidv4(), timestamp: msg.timestamp,
              time: Math.round(parseFloat(msg.timestamp.slice(3)) / 5) * 5
            });
          // }
        }
    );
    return _ => props.socket.current.off("msg-receive")
  }, [])


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
      document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
    return () => clearTimeout(timeoutId);
  }

  const handleSearchShow = () => {
    setSearchMessageState(prev => prev == false ? true : false)
  }

  return (
      <>
        {props.chat ? <>
          {loading ?
              <div className="loader_div" style={props.theme === "light" ? { color: 'black', backgroundColor: '#fff', heigh: '100vh', width: "77vw", display: 'flex', flexDirection: 'column', justifyContent: "center", alignItems:'center'} : { color: 'white', heigh: '100vh', width: "77vw", display: 'flex', flexDirection: 'column', justifyContent: "center", alignItems:'center'}}>
                <Loader/>
              </div>
              :
              <Container>
                <ChatSearch>
                  <Flex2>
                    <BackIcon src={arrow} onClick={_ => props.changeChat(null)}/>
                    <ChatName>{chat.chatname}</ChatName>
                  </Flex2>
                  <ChatSearchDiv>
                    <ChatSearchInput
                        placeholder="Поиск..."
                        value={search}
                        onChange={handleSearchChange}
                    />
                    <ChatSearchIcon src={searchIcon} onClick={handleSearchShow} />
                  </ChatSearchDiv>
                </ChatSearch>
                <Messages>
                  {filteresMessages.map((message, index) => {
                    return (
                        <Message
                            ref={scrollRef}
                            onClick={() => goToMessage(message.id)}
                            id={message.id}
                            className={message.fromSelf ? 'sended' : 'recieved'}
                            key={uuidv4()}
                        >
                          <Avatar
                              src={props.chat.avatarImage ? `data:image/svg+xml;base64, ${props.chat.avatarImage}` : blankProfile}
                          />
                          <Description>
                            <MessageName>{message.fromSelf ? 'Вы' : message.nickname}</MessageName>
                            <Content>
                                {message.message}
                                {message.file &&
                                    <MessageFile href={`${host}/static/${message.file}`} download target="_blank" rel="noreferrer">
                                      <FileIcon src={fileIcon}/>
                                      <FileName>{getFileName(message.file)}</FileName>
                                    </MessageFile>
                                }
                                <MessageTime>{message.timestamp}</MessageTime>
                            </Content>
                          </Description>
                        </Message>
                    )
                  })}
                </Messages>
                <ChatInput sendMessage={sendMessage} theme={props.theme}/>
              </Container>}
        </> : null}
      </>
  );
}

