/* eslint-disable no-useless-escape */
import jsSHA from "jssha"

export default function getAuthorizationHeader() {
  let AppID = 'bb649fde8fde4ee78df6234c4ab31951';
  let AppKey = 'Msej2rLjc43rcCWEmq_HsZDfgzg';
  let GMTString = new Date().toGMTString();
  let ShaObj = new jsSHA('SHA-1', 'TEXT');
  ShaObj.setHMACKey(AppKey, 'TEXT');
  ShaObj.update('x-date: ' + GMTString);
  let HMAC = ShaObj.getHMAC('B64');
  let Authorization = 'hmac username=\"' + AppID + '\", algorithm=\"hmac-sha1\", headers=\"x-date\", signature=\"' + HMAC + '\"';
  return { 'Authorization': Authorization, 'X-Date': GMTString }; 
}