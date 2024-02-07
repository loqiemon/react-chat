
import {Container, MainContainer} from "./ChatList.styles";
import Navbar from "../../components/Navbar/Navbar";
import ChatListWithSearch from "../../components/ChatListWithSearch/ChatListWithSearch";
import {getAllFriends, postRequestCookie} from "../../utils/requests";
import {getChatDataRoute, host} from "../../utils/APIRoutes";
import {asymDecrypt, createSignature} from "../../utils/crypto";
import {toast} from "react-toastify";
import {toastOptions} from "../../utils/toastOptions";
import {useEffect, useRef, useState} from "react";
import {io} from "socket.io-client";
import {useNavigate} from "react-router-dom";


export const ChatList = (props) => {
    const [selectedChat, setSelectedChat] = useState(undefined);
    const [symChatKey, setSymChatKey] = useState();
    const [loading, setLoading] = useState(false)
    const [createCommonChat, setCreateCommonChat] = useState(false)
    const [updateChats, setUpdateChats] = useState(0)
    const [myFriends, setMyFriends] = useState([])
    const [notice, setNotice] = useState([]);


    const socket = useRef();
    const navigate = useNavigate()

    const changeChat = async (chat) => {
        if (selectedChat) {
            socket.current.emit("disconnect-from-chat", selectedChat.chatId)
        }
        setSelectedChat(chat)
        socket.current.emit("connect-to-chat", chat.chatId);
        setLoading(true)
        const data = await postRequestCookie(getChatDataRoute, { 'chatId': chat._id, sign: createSignature(chat._id, props.privKey) })
        setLoading(false)
        if (!data.success) {
            toast.error("Ошибка", toastOptions)
        } else {
            const decryptedSymKey = asymDecrypt(data.symKey, props.privKey)
            setSymChatKey(decryptedSymKey)
        }
    }

    useEffect(() => {
        if (!props.user) {
            navigate('/login')
        } else {
            socket.current = io(host);
            socket.current.emit("add-user", props.user._id);
            socket.current.on("update-chats", async (chatId) => {

                setUpdateChats(prevCount => prevCount + 1)
                setNotice(prevState => {
                    const index = prevState.findIndex(elem => elem.chatId === chatId);

                    // Если объект не найден, добавляем новый
                    if (index === -1) {
                        if (localStorage.getItem(chatId)) {
                            return [...prevState, { chatId, messageCount: localStorage.getItem(chatId) }];
                        }else {
                            localStorage.setItem(chatId, 1)
                            return [...prevState, { chatId, messageCount: 1 }];
                        }
                    }

                    // Если объект найден, обновляем его и возвращаем новый массив
                    return prevState.map((elem, i) => {
                        if (i === index) {
                            localStorage.setItem(chatId, +elem.messageCount + 1)
                            return { chatId, messageCount: +elem.messageCount + 1 };
                        }
                        return elem;
                    });
                });
            });

            const func = async () => {
                const resp = await getAllFriends(1)
                setMyFriends([...resp.myFriends, props.user])
            }
            func()
        }
    }, [props.user])


    const deleteNotice = async (chatId) => {
        localStorage.removeItem(chatId)
        setNotice(prevState => prevState.filter(chat => chat.chatId !== chatId))
    }

    return (
        <Container>
            <Navbar user={props.user}  setDarkTheme={props.setDarkTheme} theme={props.theme}  handleUserSet={props.handleUserSet}/>
            <MainContainer>
                <ChatListWithSearch
                    notice={notice}
                    deleteNotice={deleteNotice}
                    changeChat={changeChat}
                    user={props.user}
                    selectedChat={selectedChat}
                    createCommonChat={setCreateCommonChat}
                    updateChats={updateChats}
                    privKey={props.privKey}
                    theme={props.theme}
                />
            </MainContainer>
        </Container>
    )
}

