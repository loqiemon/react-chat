import CryptoJS from 'crypto-js';
import JSEncrypt from 'jsencrypt';




function genSymKey() {
  // const key = window.crypto.getRandomValues(new Uint8Array(32));
  const keySize = 256 / 32; // 256 бит = 32 байта
  const key = CryptoJS.lib.WordArray.random(keySize);
  console.log(key);
  return key.toString()
}


function symEncrypt(text, key, iv) {
  // const ciphertext = CryptoJS.AES.encrypt(text, key).toString();
  // console.log(ciphertext);
  // return ciphertext
  // console.log(text, key, iv)
  // const encryptedMessage = CryptoJS.AES.encrypt(
  //     text,
  //     CryptoJS.enc.Utf8.parse(key),
  //     {
  //       iv: iv,
  //       mode: CryptoJS.mode.CBC,
  //       padding: CryptoJS.pad.Pkcs7
  //     }
  //   );
  //   console.log(encryptedMessage, 'encryptedMessage symEncrypt')
  console.log(text, key, 'sym cipher')
  const encryptedMessage = CryptoJS.AES.encrypt(text, key).toString();
  return encryptedMessage
}


function symDecrypt(text, key, iv) {
  // const bytes = CryptoJS.AES.decrypt(text, key);
  // const decryptedPlaintext = bytes.toString(CryptoJS.enc.Utf8);
  // console.log(decryptedPlaintext);
  // return decryptedPlaintext
  // const decryptedMessage = CryptoJS.AES.decrypt(
  //     text,
  //     CryptoJS.enc.Utf8.parse(key),
  //     {
  //       iv: iv,
  //       mode: CryptoJS.mode.CBC,
  //       padding: CryptoJS.pad.Pkcs7
  //     }
  //   );
  const bytes = CryptoJS.AES.decrypt(text, key);
  const decryptedMessage = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedMessage
}



function genAsymKeys() {
  const encryptor = new JSEncrypt();
  const keySize = 2048;
  const keys = encryptor.getKey(keySize);
  const publicKey = keys.getPublicKey();
  const privateKey = keys.getPrivateKey();
  return { publicKey, privateKey }
}

function asymEncrypt(text, publicKey) {
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(publicKey);
  const encryptedData = encryptor.encrypt(text);
  return encryptedData
}


function asymDecrypt(text, privateKey) {
  // console.log(privateKey, 'keykeykey')
  // console.log(text, 'text for asym decrypt')
  // const decryptor = new JSEncrypt();
  // decryptor.setPrivateKey(privateKey);
  // // decryptor.setPrivateKey(decryptor.getKey(privateKey));
  // // console.log(privateKey)
  // const decryptedData = decryptor.decrypt(text);
  // console.log(decryptedData, 'decryptedData')
  // return decryptedData
  var jsencrypt = new JSEncrypt();
  jsencrypt.setPrivateKey(privateKey);
  var decrypted = jsencrypt.decrypt(text);
  console.log("Decrypted (JSEncrypt): ", decrypted);
  return decrypted
}


export { genAsymKeys, genSymKey, asymDecrypt, asymEncrypt, symDecrypt, symEncrypt }


