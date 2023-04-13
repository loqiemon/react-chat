import { getPublicKeyRoute } from "./APIRoutes"; 


export const postRequestCookie = async (url, data={}) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        credentials: 'include',
        body: JSON.stringify(data)
      })
    const responseJson = await response.json();
    return responseJson;
}

export const getRequestCookie = async (url) => {
    const response = await fetch(url, {credentials: 'include'})
    const responseJson = await response.json();
    return responseJson;
}


export const getPublicKey = async (userId) => {
  const response = await fetch(getPublicKeyRoute, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({'userId': userId})
  })
const responseJson = await response.json();
return responseJson;
}