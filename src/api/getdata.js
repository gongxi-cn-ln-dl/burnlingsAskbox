import axios from 'axios';
import CryptoJS from "crypto-js";

const host = 'https://api.burnling.asia'

const getUserNameByUserId = async (userid) => {
  console.log("GET",userid)
  let result = '';
  await axios({
    mathod: "get",
    url: `${host}/vue-project/getUserNameFromUserId`,
    params: {
      'userId': userid
    },
    withCredentials: false
  }).then(res => {
    if (res.data.success) {
      result = res.data.others.username
    }
  })
  return result
}

const encodeString = (text) => {
  let bytes = CryptoJS.enc.Utf8.parse(text);
  let base64 = CryptoJS.enc.Base64.stringify(bytes);
  // console.log("ENC",text,bytes,base64)
  return base64
}

const decodeString = (text) => {
  let bytes = CryptoJS.enc.Base64.parse(text);
  let str = CryptoJS.enc.Utf8.stringify(bytes);
  // console.log("DEC",text,bytes,str)
  return str
}

export {
  getUserNameByUserId,
  encodeString,
  decodeString
}