import React, {useState, useEffect} from 'react'
import {Routes, Route} from 'react-router-dom';
import Register from './pages/Register';
import SetAvatar from './pages/SetAvatar';
import Chat from './pages/Chat';
import Login from './pages/Login';
import SearchUser from './pages/SearchUser';
import axios from "axios";
import {checkAuthRoute, saveChatsRoute} from './utils/APIRoutes';
import { useNavigate } from 'react-router-dom';
import {genAsymKeys, asymDecrypt, symDecrypt, asymEncrypt} from './utils/crypto';
import {postRequestCookie} from './utils/requests';
import { useLocation } from 'react-router-dom';


function App() {
  const [user, setUser] = useState(undefined);
  const [serverKeys, setServerKeys] = useState(undefined);
  const [clientKey, setClientKeys] = useState(undefined);
  const [privKey, setPrivKey] = useState(undefined);
  const navigate = useNavigate()
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      postRequestCookie(saveChatsRoute);
    };

    fetchData();
  }, [location.pathname]);


  useEffect(() => {
    checkAuth();
  }, []);


  useEffect(() => {
    const func = async () => {
      const data = await postRequestCookie(checkAuthRoute, {publicKey: clientKey.publicKey})
      console.log(data, 'data.privateKey')
      if (!data.success) {
        setUser(undefined)
        navigate("/login");
      } else {
        setUser(data)
        const symKey = asymDecrypt(data.encryptedSymKey, clientKey.privateKey)
        console.log(symKey, 'decripted symKey')
        setPrivKey(symDecrypt(data.privateKey, symKey))
        navigate("/");
      }
    }
    func()
  }, [clientKey]);

  const checkAuth = async () => {
    const asymKeys = genAsymKeys()
    setClientKeys(asymKeys)
    console.log(asymKeys, 'asymKeys')
  }


  return (
    <>
      <Routes>
        <Route path='/register' element={<Register user={user} handleUserSet={setUser} checkAuth={checkAuth} />} />
        <Route path='/login' element={<Login user={user} handleUserSet={setUser} checkAuth={checkAuth}/>} />
        <Route path='/setAvatar' element={<SetAvatar user={user}/>} />
        <Route path='/searchUser' element={<SearchUser user={user}/>} />
        <Route path='/' element={<Chat user={user} handleUserSet={setUser} privKey={privKey} />} />
      </Routes>
    </>
  )
}

export default App;
