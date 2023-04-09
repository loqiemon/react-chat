import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import blankProfile from '../../assets/blankProfile.png';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import { postRequestCookie } from '../../utils/requests';
import {getAllFriendsRoute} from "../../utils/APIRoutes"
import './style.scss'


const ChatListWithSearch = (props) => {
  const [search, setSearch] = useState('');
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [filteredChats, setFilteredChats] = useState([]);

  

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  useEffect(()=> {
    if (props.chats.length > 0 && search.length > 0 ){
      const filtered = props.chats.filter((chat) => chat.chatname.toLowerCase().includes(search.toLowerCase()))
      setFilteredChats(filtered)
    }else if (props.chats.length > 0){
      setFilteredChats(props.chats)
    }else {
      setFilteredChats([])
    }
  }, [search, props.chats])
//   const filteredChats = props.chats.data.length > 0 ? props.chats.data.filter((chat) =>
//   chat.chatname.toLowerCase().includes(search.toLowerCase())
// ) : []
// console.log(props.chats.data, 'props.chats.data')

  const changeCurrentChat = (chat) => {
    setCurrentSelected(chat._id);
    props.changeChat(chat);
  };


  const handleCreateCommonChat = async () => {
    const myFriends = await postRequestCookie(getAllFriendsRoute)
    console.log(myFriends)
    props.setFriendForChat(myFriends.myFriends)
  }

  return (
    <ChatList>
      <div className="top-men">
        <ChatSearch
          type="text"
          placeholder="Поиск..."
          value={search}
          onChange={handleSearchChange}
        />
        <IconButton aria-label="delete" onClick={handleCreateCommonChat}>
          <AddIcon  style={{ color: '#fff' }}/>
        </IconButton>
      </div>
      {filteredChats.map((chat) => (
        <ChatItem key={chat._id} onClick={() => {changeCurrentChat(chat)}}>
          {chat.avatarImage ? <ChatAvatar src={`data:image/svg+xml;base64,${chat.avatarImage}`} alt={chat.chatname} /> : <ChatAvatar src={blankProfile} alt={chat.chatname} />}
          <ChatInfo>
            <ChatName>{chat.chatname}</ChatName>
            <ChatLastMessage>{chat.lastMessage}</ChatLastMessage>
          </ChatInfo>
          <ChatTime>{chat.lastActivity}</ChatTime>
        </ChatItem>
      ))}
    </ChatList>
  );
};

const ChatList = styled.div`
  background-color: #1c1e26;
  color: #fff;
  height: 100vh;
  width: 25vw;
  padding: 20px;
  padding-top: 6rem;
`;

const ChatItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: #2d303e;
  }
`;

const ChatAvatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
`;

const ChatInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ChatName = styled.span`
  font-weight: bold;
`;

const ChatLastMessage = styled.span`
  font-size: 12px;
`;

const ChatTime = styled.span`
  font-size: 12px;
  margin-left: auto;
`;

const ChatSearch = styled.input`
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



export default ChatListWithSearch;
