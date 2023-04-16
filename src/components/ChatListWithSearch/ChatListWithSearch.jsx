import React, { useState, useEffect } from 'react';
import PushPinIcon from '@mui/icons-material/PushPin';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import axios from 'axios';


import './chatlist.scss';
import blankProfile from '../../assets/blankProfile.png';
import { getChats } from '../../utils/requests';
import { addBlockRoute } from '../../utils/APIBlochain';
import { createSignature } from '../../utils/crypto';


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
    getSetChats()
    props.createCommonChat(false)
    axios.post(addBlockRoute, {segment_id: chat.chatId, block: null})
    setSelectedChatId(chat.chatId);
    props.changeChat(chat);
  }



  return (
    <>
      <div className="chatlist">
        <div className="chatlist_header">
          <input
            type="text"
            placeholder="Поиск..."
            value={search}
            onChange={handleSearchChange}
          />
          <IconButton aria-label="delete" onClick={handleCreateCommonChat}>
            <AddIcon style={{ color: '#fff' }} />
          </IconButton>
        </div>
        {filteredChats.map(chat => {
          return (
            <div className={`chatlist_item ${selectedChatId==chat.chatId ? 'selected' : ''}`} key={chat.chatId} onClick={() => handleChatClick(chat)}>
            <div className="chatlist_item_image">
              <img
                src={chat.avatarImage ? `data:image/svg+xml;base64,${chat.avatarImage}` : blankProfile}
                alt="chat avatar"
              />
            </div>
            <div className="chatlist_item_descr">
              <div className="descr_header">
                <div className="chatlist_item_name">{chat.chatname}</div>
                <div className="chatlist_item_time">{chat.lastActivity}</div>
              </div>
              <div className="descr_footer">
                <div className="chatlist_last">last message...</div>
                <div className="descr_footer_end">
                  {/* <div className="chatlist_count">5</div> */}
                  {/* <PushPinIcon /> */}
                </div>
              </div>
            </div>
          </div>
          )
        })}
      </div>
    </>
  );
};


export default ChatListWithSearch;
