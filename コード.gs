//CHANNEL_ACCESS_TOKENを設定
//LINE developerで登録をした、CHANNEL_ACCESS_TOKENを入力する
//var CHANNEL_ACCESS_TOKEN = "channel_access_token"; 
var CHANNEL_ACCESS_TOKEN = "";
var line_endpoint = "https://api.line.me/v2/bot/message/reply";

//SpreadSheetの取得
var SS = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/d/1eMQABDKfFt9cLXQBdndeM428TNof_mQVUYCiRH4vN14/edit#gid=0"); //SpreadsheetのURL
var sheet = SS.getSheetByName("リスト"); //Spreadsheetのシート名（タブ名）
var lastrow = sheet.getLastRow();
var lastcol = sheet.getLastColumn();
var sheetdata = sheet.getSheetValues(1, 1, lastrow, lastcol);

//POSTデータ取得、JSONをパースする
function doPost(e) {
  var json = JSON.parse(e.postData.contents);

  //返信するためのトークン取得
  var reply_token= json.events[0].replyToken;
  if (typeof reply_token === 'undefined') {
    return;
  }

  //送られたLINEメッセージを取得
  var user_message = json.events[0].message.text;  

  //登録内容のリストを取得
  var list = sheet.getRange("B1").getValue();
  
  //今日すべきことを取得
  //リストの対象が増えたら数字を修正
  var row = Math.floor(Math.random() * 9);
  Logger.log(row);
  var todo = sheetdata[row][0];
  
  //返信する内容を作成
  var reply_messages;
  if ('リスト' == user_message) {
    //リストと入力された際
    reply_messages = ["現在の登録内容は、こちら！\n" + list,];

  } else {
    //リスト以外が入力されたときの処理
    reply_messages = [ todo + "すべし！"];
  }

  // メッセージを返信
  var messages = reply_messages.map(function (v) {
    return {'type': 'text', 'text': v};    
  });    
  UrlFetchApp.fetch(line_endpoint, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify({
      'replyToken': reply_token,
      'messages': messages,
    }),
  });
  return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
}