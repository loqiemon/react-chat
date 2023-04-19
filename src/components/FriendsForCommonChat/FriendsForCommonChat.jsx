
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import Button from '@mui/material/Button';
import "react-toastify/dist/ReactToastify.css";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Switch from '@mui/material/Switch';
import Checkbox from '@mui/material/Checkbox';


import Loader from '../Loader/Loader';
import { createCommonChatRoute, getMyChatsRoute } from '../../utils/APIRoutes';
import { postRequestCookie, getAllFriends, addSegmentBlockchain } from '../../utils/requests'
import blankProfile from '../../assets/blankProfile.png';
import { toastOptions } from '../../utils/toastOptions';
import { createSignature } from '../../utils/crypto';


export default function FriendsForCommonChat(props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [chatName, setchatName] = useState('');
  const [usersToAdd, setUsersToAdd] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [friends, setFriends] = useState([]);
  const [userStates, setUserStates] = useState({});


  useEffect(() => {
    const func = async () => {
      const response = await getAllFriends();
      setFriends(response.myFriends)
    }
    func()
  }, [])


  useEffect(() => {
    if (friends.length > 0 && searchTerm.length > 0) {
      const filtered = friends.filter((user) => user.nickname.toLowerCase().includes(searchTerm.toLowerCase()))
      setFilteredUsers(filtered)
    } else if (friends.length > 0) {
      setFilteredUsers(friends)
    } else {
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
        const sign = createSignature(response.chatId, props.privKey)
        // const chatKey = asymDecrypt(data.chatSymKey,props.privKey)
        // const encryptedChatKey = asymEncrypt(chatKey, props.blockchainKey)

        addSegmentBlockchain(sign, response.chatId, '')
        const resp = await postRequestCookie(getMyChatsRoute);
        // props.setChats(resp.data);
      } else {
        toast.error('Не удалось создать чат...', toastOptions)
      }
    }
    func()
  }


  const handleSwitch = (e, userId) => {
    setUserStates({ ...userStates, [userId]: e.target.checked })
  }

  useEffect(()=> {
    const usersTo = Object.keys(userStates).filter((userid) => userStates[userid]);
    setUsersToAdd(usersTo)
  },[userStates])


  return (
    <>
      <SearchUserWrapper style={props.theme === "light" ? { backgroundColor: '#fafafa' } : null}>
        <SearchPageContainer>
          {/* <div className="close-common-chat">
                <IconButton style={{ position: 'absolute', top: '5rem', right: '2rem'}} onClick={closeMenu}>
                    <CloseIcon style={{ color: 'red' }}/>
                </IconButton>
            </div> */}
          <SearchBarContainer style={props.theme === "light" ? { backgroundColor: '#fff' } : { backgroundColor: '#242424' }}>
            <SearchInput
              style={props.theme === "light" ? { color: 'black' } : { color: 'white' }}
              type="text"
              placeholder="Введите название чата"
              value={chatName}
              onChange={(e) => setchatName(e.target.value)}
            />
            {/* <SearchInput
              type="text"
              placeholder="Введите имя..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            /> */}
            <Button onClick={createCommonChat} style={ {color: '#166e48'} }>
              Создать
            </Button>
          </SearchBarContainer>
          {loading ? <Loader /> : (<>          <UsersList>

            {filteredUsers.length > 0 ? filteredUsers.map((user) => (
              user._id === props.user._id ? null : <UserItem key={user._id} style={props.theme === "light" ? { backgroundColor: '#fff', color: '#000' } : { backgroundColor: '#39373a',   color: '#fff' }}>
              <img
                src={user.avatarImage ? `data:image/svg+xml;base64,${user.avatarImage}` : blankProfile}
                alt=""
              />
              <div className="descr">
                <UserName>{user.nickname}</UserName>
                <span className='user-descr'>Описание...</span>
              </div>
              {/* <Button variant="contained" onClick={() => handleAddUser(user)}>
                Добавить
              </Button> */}
              <Checkbox
                // checked={userStates[user._id]}
                style={props.theme === "light" ? { color: 'black' } : { color: 'white' }}
                onChange={(e) => handleSwitch(e, user._id)}
                color="primary"
              />
            </UserItem>
            )) : <h2 style={{ color: 'white' }}>Нет подходящих пользователей</h2>}
          </UsersList>
            {/* <div className="create-common-chat">
            </div> */}
          </>)}

        </SearchPageContainer>
        <ToastContainer />
      </SearchUserWrapper>
    </>
  )
}


const SearchUserWrapper = styled.div`
  // padding-top: 60px;
  // background-color: #131324;
  // background-color: #131324;
  width: 77vw;
  height: 100vh;

`;


const SearchPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  // padding: 20px;
  // width: 100%
`;

const SearchBarContainer = styled.div`
  background-color: #242424;
  display: flex;
  align-items: center;
  padding: 20px;
  width: 100%;
  // max-width: 500px;
  margin-bottom: 20px;
  gap: 1rem;
`;

const SearchInput = styled.input`
  // flex: 1;
  width: 30%;
  border: none;
  background-color: transparent;
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
  padding: 20px;
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
  // border: 1px solid #ccc;
  // background-color: #39373a;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 10px;
  display: flex;
  gap: 0.75rem;
  color: #fff;
  img {
    width: 3rem;
    height: 3rem;
  }
  button {
    width: 5.5rem;
  }
  .descr {
    display: flex;
    flex-direction: column;
    align-items: start;
  }
  input {
    border: none;
  }
  
`;

const UserName = styled.h3`
  margin: 0 0 5px 0;
  font-size: 18px;
  text-align: center;
`;