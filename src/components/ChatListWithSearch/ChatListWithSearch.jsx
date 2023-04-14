import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';

import blankProfile from '../../assets/blankProfile.png';
import { postRequestCookie } from '../../utils/requests';
import { getAllFriendsRoute } from "../../utils/APIRoutes"
import './style.scss'


const ChatListWithSearch = (props) => {
  const [search, setSearch] = useState('');
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [filteredChats, setFilteredChats] = useState([]);


  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };


  useEffect(() => {
    if (props.chats.length > 0 && search.length > 0) {
      const filtered = props.chats.filter((chat) => chat.chatname.toLowerCase().includes(search.toLowerCase()))
      setFilteredChats(filtered)
    } else if (props.chats.length > 0) {
      setFilteredChats(props.chats)
    } else {
      setFilteredChats([])
    }
  }, [search, props.chats])


  const changeCurrentChat = (chat) => {
    //Добавить подсветку выбранного чата
    console.log('list with search 1424234')
    setCurrentSelected(chat._id);
    props.changeChat(chat);
  };


  const handleCreateCommonChat = async () => {
    const myFriends = await postRequestCookie(getAllFriendsRoute)
    props.setFriendForChat(myFriends.myFriends)
  }

  return (
    <div className='chat_page-chatlist'>
      <div className="chatlist_search">
        <input
          className='chatlist_search-input'
          type="text"
          placeholder="Поиск..."
          value={search}
          onChange={handleSearchChange}
        />
        <IconButton aria-label="delete" onClick={handleCreateCommonChat}>
          <AddIcon className='chatlist_search-createicon' />
        </IconButton>
      </div>
      {filteredChats.map((chat) => (
        <div className='chatlist_item' key={chat._id} onClick={() => { changeCurrentChat(chat) }}  >
          {chat.avatarImage ?
            <img className='chatlist_item-img' src={`data:image/svg+xml;base64,${chat.avatarImage}`} alt={chat.chatname} />
            : <img className='chatlist_item-img' src={blankProfile} alt={chat.chatname} />}
          <div className='chatlist_item-info'>
            <span className='chatlist_item-chatname'>{chat.chatname}</span>
            {/* <div className='chatlist_item-lastMessage'>{chat.lastMessage}</div> */}
          </div>
          <div className='chatlist_item-time'>{chat.lastActivity}</div>
        </div>
      ))}
    </div>
  );
};


export default ChatListWithSearch;
