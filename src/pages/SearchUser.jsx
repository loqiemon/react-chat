
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
      {props.user && <Navbar user={props.user} handleUserSet={props.handleUserSet} setDarkTheme={props.setDarkTheme} theme={props.theme} />}
      <SearchUserWrapper style={props.theme === "light" ? { backgroundColor: '#fafafa' } : null}>
        <SearchPageContainer>
        <h2 className='header_text' style={props.theme === "light" ? {color: "black"} : {color: "white"}} >Поиск сотрудников</h2>
          <SearchBarContainer>
            <SearchInput
              type="text"
              placeholder="Введите имя..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={props.theme === "light" ? {backgroundColor: "#f5f5f5", color: "black"} : {backgroundColor: "#3e393d", color: "white"}}
            />
            <SearchButton onClick={() => handleSearch()} style={props.theme === "light" ? {backgroundColor: "#f5f5f5", color: "black"} : {backgroundColor: "#3e393d", color: "white"}}>
              <FaSearch />
            </SearchButton>
          </SearchBarContainer>
          <UsersList>
            {loading ? <Loader /> : <>          {searchResults.length > 0 ? searchResults.map((user) => (
              <UserItem key={user._id} style={props.theme === "light" ? { backgroundColor: '#fff', color: '#000' } : { backgroundColor: '#39373a',   color: '#fff' }}>
                <img
                  src={user.avatarImage ? `data:image/svg+xml;base64,${user.avatarImage}` : blankProfile}
                  alt=""
                />
                <div className="flq">
                  <UserName style={props.theme === "light" ? {color: "black"} : {color: "white"}} >{user.nickname}</UserName>
                  <Button variant="contained" style={{color: "white", backgroundColor: '#166e48'}} onClick={() => handleAddUser(user)} id={user._id}>
                    Добавить
                  </Button>
                </div>
              </UserItem>
            )) : <h2 style={props.theme === "light" ? {color: "black"} : {color: "white"}} >Нет подходящих пользователей</h2>}</>}

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
  height: 100vh;
  // background-color: #131324;
  background-color: #343542;
  width: 94vw;
  position: relative;
  margin-left: 6vw;
  z-index: 200;
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
  margin-top: 1.5rem;
`;

const SearchInput = styled.input`
  outline: none;
  flex: 1;
  border: none;
  // border-bottom: 2px solid #ccc;
  padding: 10px;
  font-size: 16px;
  // &:focus {
  //   outline: none;
  //   border-bottom-color: #2ecc71;
  // }
  background-color: #3e393d;
  color: white;
  height: 3rem;
`;

const SearchButton = styled.button`
  border: none;
  // background-color: #2ecc71;
    background-color: #3e393d;
  color: white;
  height: 3rem;
  padding: 10px 20px;
  font-size: 16px;
  // margin-left: 10px;
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
  background-color: #3d3e4b;
  // border: 1px solid #ccc;
  display: flex;
  border-radius: 4px;
  padding: 10px;
  gap: 1rem;
  margin-bottom: 10px;
  img {
    width: 90px;
    height: 90px;
  }
  button {
    width: 5.5rem;
  }
  .flq {
    display: flex;
    flex-direction: column;
    gap: 1rem ;
  }
`;

const UserName = styled.h3`
  margin: 0 0 5px 0;
  font-size: 18px;
  text-align: center;
`;



