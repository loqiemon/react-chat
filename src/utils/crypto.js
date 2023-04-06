import CryptoJS from 'crypto-js';
import JSEncrypt from 'jsencrypt';




function genSymKey(){
    const key = window.crypto.getRandomValues(new Uint8Array(32));
    console.log(key);
    return key
}


function symEncrypt(text, key, iv){
    // const ciphertext = CryptoJS.AES.encrypt(text, key).toString();
    // console.log(ciphertext);
    // return ciphertext
    console.log(text, key, iv)
    const encryptedMessage = CryptoJS.AES.encrypt(
        text,
        CryptoJS.enc.Utf8.parse(key),
        {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        }
      );
      console.log(encryptedMessage, 'encryptedMessage symEncrypt')
      return encryptedMessage
}


function symDecrypt(text, key, iv){
    // const bytes = CryptoJS.AES.decrypt(text, key);
    // const decryptedPlaintext = bytes.toString(CryptoJS.enc.Utf8);
    // console.log(decryptedPlaintext);
    // return decryptedPlaintext
    const decryptedMessage = CryptoJS.AES.decrypt(
        text,
        CryptoJS.enc.Utf8.parse(key),
        {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        }
      );
    
    return decryptedMessage
}



function genAsymKeys(){
    const encryptor = new JSEncrypt();
    const keySize = 2048; 
    const keys = encryptor.getKey(keySize);
    const publicKey = keys.getPublicKey();
    const privateKey = keys.getPrivateKey();
    return {publicKey, privateKey}
}

function asymEncrypt(text, publicKey){
    const encryptor = new JSEncrypt();
    encryptor.setPublicKey(publicKey);
    const encryptedData = encryptor.encrypt(text);
    return encryptedData
}


function asymDecrypt(text, privateKey){
    // console.log(privateKey, 'keykeykey')
    console.log(text, 'text text text text')
    const decryptor = new JSEncrypt();
    // decryptor.setPrivateKey(privateKey);
    decryptor.setPrivateKey(decryptor.getKey(privateKey));
    console.log(privateKey)
    const decryptedData = decryptor.decrypt(text);
    console.log(decryptedData, 'decryptedData')
    return decryptedData
}


export {genAsymKeys, genSymKey, asymDecrypt, asymEncrypt, symDecrypt, symEncrypt}


