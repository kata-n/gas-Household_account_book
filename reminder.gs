//変数
var spreadsheet = SpreadsheetApp.openById("1eMQABDKfFt9cLXQBdndeM428TNof_mQVUYCiRH4vN14");
var Settingsheet = spreadsheet.getSheetByName("Setting");
var CHANNEL_ACCESS_TOKEN = Settingsheet.getRange('B2');
    
function doPost(e) {
  var webhookData = JSON.parse(e.postData.contents).events[0];
  var message,replyToken;
  message = webhookData.message.text;
  replyToken = webhookData.replyToken;
  return sendLineMessageFromReplyToken(replyToken,message);
 }
  
function sendLineMessageFromReplyToken(token,replyText){
 var url = "https://api.line.me/v2/bot/message/reply";
 var headers = {
   "Content-Type" : "application/json; charset=UTF-8",
   "Authorization" : "Bearer " + CHANNEL_ACCESS_TOKEN
 };
 var postData = {
   "replyToken" : token,
   "messages" : [{
     "type" : "text",
     "text" : replyText
   }]
 };
 var options = {
   "method" : "POST",
   "headers" : headers,
   "payload" : JSON.stringify(postData)
 };
 return UrlFetchApp.fetch(url, options);  
}
 
var spreadsheet = SpreadsheetApp.openById("1eMQABDKfFt9cLXQBdndeM428TNof_mQVUYCiRH4vN14");
function appendToSheet(text){
 var sheet = spreadsheet.getSheetByName('webhook');
 sheet.appendRow([text]);
}

function doGet(e) {
 appendToSheet()
}