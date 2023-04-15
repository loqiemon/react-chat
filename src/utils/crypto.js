import CryptoJS from 'crypto-js';
import JSEncrypt from 'jsencrypt';




function genSymKey() {
  const keySize = 256 / 32; // 256 бит = 32 байта
  const key = CryptoJS.lib.WordArray.random(keySize);
  console.log(key);
  return key.toString()
}


function symEncrypt(text, key, iv) {
  const encryptedMessage = CryptoJS.AES.encrypt(text, key).toString();
  return encryptedMessage
}


function symDecrypt(text, key, iv) {
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
  var jsencrypt = new JSEncrypt();
  jsencrypt.setPrivateKey(privateKey);
  var decrypted = jsencrypt.decrypt(text);
  console.log("Decrypted (JSEncrypt): ", decrypted);
  return decrypted
}


// Функция для создания цифровой подписи
function createSignature(message, privateKey) {
  const sign = new JSEncrypt();
  sign.setPrivateKey(privateKey);
  return sign.sign(message, CryptoJS.SHA256, 'sha256');
}

// Функция для проверки цифровой подписи
function verifySignature(message, signature, publicKey) {
  const verify = new JSEncrypt();
  verify.setPublicKey(publicKey);
  return verify.verify(message, signature, CryptoJS.SHA256);
}


export { genAsymKeys, genSymKey, asymDecrypt, asymEncrypt, symDecrypt, symEncrypt, createSignature,  verifySignature}


