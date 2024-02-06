
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import { createChatIfNotExistRoute } from '../../utils/APIRoutes';
import Loader from '../../components/Loader/Loader';
import Button from '@mui/material/Button';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"
import { addSegmentBlockchain, postRequestCookie, postSearchUser } from '../../utils/requests'
import blankProfile from '../../assets/blankProfile.png';
import { toastOptions } from '../../utils/toastOptions'
import { createSignature, asymDecrypt, asymEncrypt } from '../../utils/crypto';


import {
  Container,
  Title,
  ChatSearchDiv,
  ChatSearchIcon,
  ChatSearchInput,
  UserProfile,
  UserProfileName, UserAddButton, PageContainer, NotFound, UserList, Flex
} from "./SearchUser.styles";
import searchIcon from "../../assets/search.svg";
import {Avatar} from "../../shared/ui/Avatar/Avatar";

const SearchUser = (props) => {
  const { user, handleUserSet } = props
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate()


  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user])


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
    <Container>
      <Navbar
          user={user}
          handleUserSet={props.handleUserSet}
      />
        <PageContainer>
          <Title>Поиск сотрудников</Title>
            <ChatSearchDiv>
              <ChatSearchInput
                  placeholder="Поиск..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
              <ChatSearchIcon src={searchIcon} onClick={handleSearch} />
            </ChatSearchDiv>
                {searchResults.length > 0 ?
                  <UserList>
                    {
                      searchResults.map((user) =>
                          <UserProfile key={user._id}>
                            <Avatar src={user.avatarImage}/>
                            <Flex>
                              <UserProfileName>{user?.nickname}</UserProfileName>
                              <UserAddButton onClick={() => handleAddUser(user)} id={user._id}>
                                Добавить
                              </UserAddButton>
                            </Flex>
                          </UserProfile>
                      )
                    }
                  </UserList>
               : <NotFound>Нет подходящих пользователей</NotFound>}
            <ToastContainer />
        </PageContainer>
    </Container>
  );
};

export default SearchUser;







