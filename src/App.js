import React, {useState, useEffect, createContext, useContext,} from 'react'
import {Routes, Route} from 'react-router-dom';
import Register from './pages/Register';
import SetAvatar from './pages/SetAvatar';
import Chat from './pages/Chat/Chat';
import Login from './pages/Login';
import SearchUser from './pages/SearchUser';
import axios from "axios";
import {checkAuthRoute, saveChatsRoute} from './utils/APIRoutes';
import { useNavigate } from 'react-router-dom';
import {genAsymKeys, asymDecrypt, symDecrypt, asymEncrypt} from './utils/crypto';
import {postRequestCookie, getBlockchainPublicKey} from './utils/requests';
import { useLocation } from 'react-router-dom';
import './app.scss'


function App() {
  const [user, setUser] = useState(undefined);
  const [serverKeys, setServerKeys] = useState(undefined);
  // const [blockchainKey, setBlockchainKey] = useState(undefined);
  const [clientKey, setClientKeys] = useState({publicKey: '', privateKey: ''});
  const [privKey, setPrivKey] = useState(undefined);
  const [loadingAuth, setLoadingAuth] = useState(false)
  const [darkTheme, setDarkTheme] = useState('light')


  useEffect(()=> {
    const theme = localStorage.getItem('theme');
    console.log(theme)
    if (!theme) {
        localStorage.setItem('theme', 'light')
        setDarkTheme('light')
    }else {
        setDarkTheme(theme)
    }
  })


  const toggleTheme = () => {
    const them = darkTheme === 'light' ? 'dark' : 'light'
    setDarkTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    localStorage.setItem('theme', them)
  };

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
    // const getBlockchainKey = async () => {
    //   const response = await getBlockchainPublicKey();
    //   setBlockchainKey(response)
    // };
    // getBlockchainKey()
  }, []);


  useEffect(() => {
    const func = async () => {
      setLoadingAuth(true)
      const data = await postRequestCookie(checkAuthRoute, {publicKey: clientKey.publicKey})
      setLoadingAuth(false)
      if (!data.success) {
        setUser(undefined)
        navigate("/login");
      } else {
        setUser(data)

        const symKey = asymDecrypt(data.encryptedSymKey, clientKey.privateKey)
        setPrivKey(symDecrypt(data.privateKey, symKey))
        navigate("/");
      }
    }
    func()
  }, [clientKey]);

  const checkAuth = async () => {
    const asymKeys = genAsymKeys()
    setClientKeys(asymKeys)
  }


  return (
    <>
      <Routes>
        <Route path='/register' element={<Register user={user} handleUserSet={setUser} checkAuth={checkAuth} />} />
        {/* <Route path='/register' element={<Register user={user} handleUserSet={handleUserSet} />} /> */}
        <Route path='/login' element={<Login user={user} handleUserSet={setUser} checkAuth={checkAuth}/>} />
        <Route path='/setAvatar' element={<SetAvatar user={user}/>} />
        <Route path='/searchUser' element={<SearchUser user={user} privKey={privKey} setDarkTheme={toggleTheme} theme={darkTheme}/>} />
        <Route path='/' element={<Chat user={user} handleUserSet={setUser} privKey={privKey} clientKeys={clientKey} loadingAuth={loadingAuth}  setDarkTheme={toggleTheme} theme={darkTheme}/>} />
      </Routes>
    </>
  )
}

export default App;
