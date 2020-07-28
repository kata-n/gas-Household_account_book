//Lineの設定
var CHANNEL_ACCESS_TOKEN = "";
var headers = {
   "Content-Type": "application/json; charset=UTF-8",
   "Authorization": "Bearer " + CHANNEL_ACCESS_TOKEN 
};

//返信する関数
function SendingMessageReply(token, replyText) {
  var url = "https://api.line.me/v2/bot/message/reply";
  var headers = {
   "Content-Type": "application/json; charset=UTF-8",
   "Authorization": "Bearer " + CHANNEL_ACCESS_TOKEN
  };
  var postData = {
    "replyToken": token,
    "messages": [{
      "type": "text",
      "text": replyText
    }]
  };
};
