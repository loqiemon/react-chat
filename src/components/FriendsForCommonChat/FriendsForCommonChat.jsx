
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';
import {toast, ToastContainer} from 'react-toastify';
import Button from '@mui/material/Button';
import "react-toastify/dist/ReactToastify.css"; 
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

import Loader from '../Loader/Loader';
import { createCommonChatRoute, getMyChatsRoute } from '../../utils/APIRoutes';
import {postRequestCookie, getAllFriends} from '../../utils/requests'
import blankProfile from '../../assets/blankProfile.png';
import {toastOptions} from '../../utils/toastOptions';


export default function FriendsForCommonChat(props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [chatName, setchatName] = useState('');
    const [usersToAdd, setUsersToAdd] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [friends, setFriends] = useState([]);


    useEffect(()=> {
      const func = async () => {
        const response = await getAllFriends();
        setFriends(response.myFriends)
      }
      func()
    }, [])


    useEffect(()=> {
        if (friends.length > 0 && searchTerm.length > 0 ){
          const filtered = friends.filter((user) => user.nickname.toLowerCase().includes(searchTerm.toLowerCase()))
            setFilteredUsers(filtered)
        }else if (friends.length > 0){
            setFilteredUsers(friends)
        }else {
            setFilteredUsers([])
        }
      }, [searchTerm, friends])

      const handleAddUser = async (user) => {
        setUsersToAdd([...usersToAdd, user])
      }


      const closeMenu = () => {

      }


      const createCommonChat = async () => {
        const func = async () => {
          setLoading(true)
          const response = await postRequestCookie(createCommonChatRoute, {
              userIds: usersToAdd,
              chatName: chatName
          })
          setLoading(false)
          props.setCreateCommonChat(false)
          if (response.success) {
            // props.setFriendForChat([])
            const resp = await postRequestCookie(getMyChatsRoute);
            // props.setChats(resp.data);
          }else {
            toast.error('Не удалось создать чат...', toastOptions)
          }
        }
        func()
      }

  return (
    <>
      <SearchUserWrapper>
        <SearchPageContainer>
            <div className="close-common-chat">
                <IconButton style={{ position: 'absolute', top: '5rem', right: '2rem'}} onClick={closeMenu}>
                    <CloseIcon style={{ color: 'red' }}/>
                </IconButton>
            </div>
          <SearchBarContainer>
            <SearchInput
              type="text"
              placeholder="Введите имя..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchInput
              type="text"
              placeholder="Введите название чата"
              value={chatName}
              onChange={(e) => setchatName(e.target.value)}
            />
          </SearchBarContainer>
          {loading ? <Loader /> : (<>          <UsersList>
            
            {filteredUsers.length > 0 ? filteredUsers.map((user) => (
              <UserItem key={user._id}>
                  <img
                    src={user.avatarImage ? `data:image/svg+xml;base64,${user.avatarImage}` : blankProfile}
                    alt=""
                  />
                <UserName>{user.nickname}</UserName>
                <Button variant="contained" onClick={() => handleAddUser( user)}>
                  Добавить
                </Button>
              </UserItem>
            )) : <h2 style={{color: 'white'}}>Нет подходящих пользователей</h2>}
          </UsersList>
          <div className="create-common-chat">
                <Button style={{ position: 'absolute', bottom: '0' }} onClick={createCommonChat}>
                    Создать
                </Button>
            </div></>) }

        </SearchPageContainer>
        <ToastContainer />
      </SearchUserWrapper>
    </>
  )
}


const SearchUserWrapper = styled.div`
  padding-top: 60px;
  // background-color: #131324;
    width: 75vw;
  height: 90vh;
`;


const SearchPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  // width: 100%
`;

const SearchBarContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 500px;
  margin-bottom: 20px;
  gap: 1rem;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  border-bottom: 2px solid #ccc;
  padding: 10px;
  font-size: 16px;
  &:focus {
    outline: none;
    border-bottom-color: #2ecc71;
  }
`;

const SearchButton = styled.button`
  border: none;
  background-color: #2ecc71;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  margin-left: 10px;
  cursor: pointer;
`;

const UsersList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
  // max-width: 500px;
  display: flex;
  gap: 1rem;
  h2 {
    text-align: center;
    margin: 0 auto;
  }
`;

const UserItem = styled.li`
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;
  color: #fff;
  img {
    width: 90px;
    height: 90px;
  }
  button {
    width: 5.5rem;
  }
`;

const UserName = styled.h3`
  margin: 0 0 5px 0;
  font-size: 18px;
  text-align: center;
`;