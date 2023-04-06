export const host = "http://localhost:5001";
// export const host = "http://192.168.0.100:5001";


//user
export const loginRoute = `${host}/api/auth/login`;
export const logoutRoute = `${host}/api/auth/logout`;
export const registerRoute = `${host}/api/auth/register`;
export const checkAuthRoute = `${host}/api/auth/checkAuth`;
export const setAvatarRoute = `${host}/api/auth/setavatar`;
export const searchUserRoute = `${host}/api/auth/searchUser`;


//messages
export const getMyChatsRoute = `${host}/api/messages/getmychats`;
export const getChatDataRoute = `${host}/api/messages/getChatData`;
export const createChatIfNotExistRoute = `${host}/api/messages/createChatIfNotExist`;
export const recieveMessageRoute = `${host}/api/messages/getmsg`;
export const updateChatRoute = `${host}/api/messages/updateChat`;