import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import axios from 'axios';
import RateReviewOutlinedIcon from '../../assets/create-chat.svg';


import { getChats } from '../../utils/requests';
import { addBlockRoute } from '../../utils/APIBlochain';
import { createSignature } from '../../utils/crypto';

import {
  Container,
  Title,
  HeaderText,
  ChatSearch,
  Header,
  ChatItem,
  ChatImg,
  ChatList,
  ChatInfo, ChatHeader, ChatName, ChatTime, ChatMessage
} from "./ChatList.styles";
import {Svg} from "../../shared/ui/Svg/Svg";
import avatar from "../../assets/avatar.svg";


const ChatListWithSearch = (props) => {
  const [chats, setChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedChatId, setSelectedChatId] = useState(null);


  useEffect(() => {
    setFilteredChats(chats);
    if (search.length < 1) {
      setFilteredChats(chats);
    } else {
      const searchedChats = chats.filter(chat => chat.chatname.toLowerCase().includes(search.toLowerCase()))
      setFilteredChats(searchedChats)
    }
  }, [search, chats])


  useEffect(()=>{
    getSetChats()
  },[props.updateChats])


  const getSetChats = async () => {
    const response = await getChats(createSignature(props.user._id, props.privKey));
    setChats(response.data);
  }


  const handleSearchChange = (e) => {
    setSearch(e.target.value)
  }


  const handleCreateCommonChat = async () => {
    props.createCommonChat(true)
  }

  const handleChatClick = (chat) => {
    props.deleteNotice(chat.chatId)
    getSetChats()
    props.createCommonChat(false)
    axios.post(addBlockRoute, {segment_id: chat.chatId, block: null})
    setSelectedChatId(chat.chatId);
    props.changeChat(chat);
  }


  const avatarSet = (image) => {
    return image ? `data:image/svg+xml;base64,${image}` : avatar;
  }


  return (
    <>
      <Container className={props.classes}>
        <Header className="chatlist_header">
          <HeaderText>
            <Title>Мессенджер</Title>
            <IconButton onClick={handleCreateCommonChat}>
              <Svg path={RateReviewOutlinedIcon} />
            </IconButton>
          </HeaderText>
            <ChatSearch
              placeholder="Поиск..."
              value={search}
              onChange={handleSearchChange}
            />
        </Header>
        <ChatList>
          {filteredChats.map(chat => {
            // {chatsss.map(chat => {
            return (
                <ChatItem
                    className={`${selectedChatId == chat.chatId ? 'selected' : ''}`}
                    key={chat.chatId}
                    onClick={() => handleChatClick(chat)}
                >
                  <ChatImg src={avatarSet(chat.avatarImage)} alt="аватар чата" />
                  <ChatInfo>
                    <ChatHeader>
                      <ChatName>{chat.chatname}</ChatName>
                      <ChatTime>{chat.lastActivity}</ChatTime>
                    </ChatHeader>
                    <ChatMessage>Последнее сооб...
                      {/*<div className="descr_footer_end">*/}
                      {/*  { localStorage.getItem(chat.chatId) ? <div className="chatlist_count" style={props.theme === "light" ? {color: "#fff"} : null}>{localStorage.getItem(chat.chatId)}</div> : null}*/}
                      {/*</div>*/}
                    </ChatMessage>
                  </ChatInfo>
                </ChatItem>
            )
          })}
        </ChatList>
      </Container>
    </>
  );
};


export default ChatListWithSearch;
