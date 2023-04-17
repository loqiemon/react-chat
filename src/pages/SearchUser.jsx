
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import { searchUserRoute, createChatIfNotExistRoute } from '../utils/APIRoutes';
import axios from 'axios';
import Loader from '../components/Loader/Loader';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"
import { addSegmentBlockchain, postRequestCookie, postSearchUser } from '../utils/requests'
import blankProfile from '../assets/blankProfile.png';
import { toastOptions } from '../utils/toastOptions'
import { createSignature, asymDecrypt, asymEncrypt } from '../utils/crypto';

const SearchUser = (props) => {
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate()


  useEffect(() => {
    if (!props.user) {
      navigate('/login')
    }
  }, [props.user])


  const handleSearch = async (e) => {
    setLoading(true)
    // const data = await postRequestCookie(searchUserRoute, { 'searchInput': searchTerm });
    const data = await postSearchUser(createSignature(props.user._id, props.privKey), searchTerm);
    setLoading(false)
    setSearchResults(data)
  };


  const handleAddUser = async (user) => {
    const data = await postRequestCookie(createChatIfNotExistRoute, { 'userId': user._id, 'sign': createSignature(props.user._id, props.privKey) });
    if (data.alreadyExist) {
      toast.error("Уже добавлен", toastOptions)
    } else if (data.success) {
      const sign = createSignature(data.chatId, props.privKey)
      // const chatKey = asymDecrypt(data.chatSymKey,props.privKey)
      // const encryptedChatKey = asymEncrypt(chatKey, props.blockchainKey)

      addSegmentBlockchain(sign, data.chatId, '')
      toast.success("Успешно", toastOptions)
    } else {
      toast.error("Ошибка", toastOptions)
    }
  }

  return (
    <>
      {props.user && <Navbar user={props.user} handleUserSet={props.handleUserSet} />}
      <SearchUserWrapper>
        <SearchPageContainer>
          <SearchBarContainer>
            <SearchInput
              type="text"
              placeholder="Введите имя..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchButton onClick={() => handleSearch()}>
              <FaSearch />
            </SearchButton>
          </SearchBarContainer>
          <UsersList>
            {loading ? <Loader /> : <>          {searchResults.length > 0 ? searchResults.map((user) => (
              <UserItem key={user._id}>
                <img
                  src={user.avatarImage ? `data:image/svg+xml;base64,${user.avatarImage}` : blankProfile}
                  alt=""
                />
                <UserName>{user.nickname}</UserName>
                <Button variant="contained" onClick={() => handleAddUser(user)} id={user._id}>
                  Добавить
                </Button>
              </UserItem>
            )) : <h2>Нет подходящих пользователей</h2>}</>}

          </UsersList>
        </SearchPageContainer>
        <ToastContainer />
      </SearchUserWrapper>
    </>
  );
};

export default SearchUser;

const SearchUserWrapper = styled.div`
  padding-top: 60px;
  // background-color: #131324;
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



