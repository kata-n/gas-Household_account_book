const Spreadsheet = SpreadsheetApp.getActive()

function test () {
  // insertTemplate('2021-01')//シートを追加する
  // onPost({
  //   item: {
  //     date: '2021-02-01',
  //     title: '支出テスト',
  //     category: '食費',
  //     tags: 'タグ1,タグ2',
  //     income: null,
  //     outgo: 3000,
  //     memo: 'テスト'
  //   }
  // })
  const result = onDelete({
    yearMonth: '2021-11'
  })
  console.log(result)
}

function onPost ({ item }) {
  if (!isValid(item)) {
    return {
      error: '正しい形式で入力してください'
    }
  }else{
    console.log("バリデーション通過");    
  }
  const { date, title, category, tags, income, outgo, memo } = item  

  const yearMonth = date.slice(0, 7)
  const sheet = Spreadsheet.getRangeByName(yearMonth) || insertTemplate(yearMonth)

  const id = Utilities.getUuid().slice(0, 8)　//IDを生成するメソッドがgoogleにあるのでそれを使っている
  const row = ["'" + id, "'" + date, "'" + title, "'" + category, "'" + tags, income, outgo, "'" + memo]
  console.log(row)
  sheet.appendRow(row)

  return { id, date, title, category, tags, income, outgo, memo}
}

function onGet ({ yearMonth }) {
  // 1234-01
  const ymReg = /^[0-9]{4}-(0[1-9]|1[0-2])$/

  if (!ymReg.test(yearMonth)) {
    return {
      error: '正しい形式で入力してください'
    }
  }

  const sheet = Spreadsheet.getSheetByName(yearMonth)
  const lastRow = sheet ? sheet.getLastRow() : 0

  if (lastRow < 7) {
    return []
  }

  const list = sheet.getRange('A7:H' + lastRow).getValues().map(row=>{
    const [id, date, title, category, tags, income, outgo, memo] = row
    return {
      id,
      date,
      title,
      category,
      tags,
      income,
      outgo,
      memo
    }
  })
  return list
}

function onDelete ({ yearMonth, id}) {
  const ymReg = /^[0-9]{4}-(0[1-9]|1[0-2])$/
  const sheet = Spreadsheet.getSheetByName(yearMonth)

  if (!ymReg.test(yearMonth) || sheet === null) {
    return {
      error: "指定のシートは存在しません"
    }
  }

  const lastRow = sheet.getLastRow()
  const index = sheet.getRange('A7:A', lastRow).getValues().flat().findIndex(v => v === id)

  if(index === -1){
    return {
      error: '指定のデータは存在しません'
    }
  }

  sheet.deleteRow(index + 7)
  return {
    message: '削除しました'
  }
}

function insertTemplate(yaerMonth) {
  const { SOLID_MEDIUM, DOUBLE } = SpreadsheetApp.BorderStyle

  const sheet = Spreadsheet.insertSheet(yaerMonth, 0) 
  const [year, month] = yaerMonth.split('-')

  sheet.getRange('A1:B1')
   .merge()
   .setValue(`${year}年 ${parseInt(month)}月`)
   .setHorizontalAlignment('center')
   .setBorder(null, null, true, null, null, null, 'black', SOLID_MEDIUM)

  sheet.getRange('A2:A4')
   .setValues([['収入：'], ['支出：'], ['収支差：']])
   .setFontWeight('bold')
   .setHorizontalAlignment('right')

  sheet.getRange('B2:B4')
    .setFormulas([['=SUM(F7:F)'], ['=SUM(G7:G)'], ['=B2-B3']])
    .setNumberFormat('#,##0')

  sheet.getRange('A4:B4')
    .setBorder(true, null, null, null, null, null, 'black', DOUBLE)

  //ヘッダー部分
  sheet.getRange('A6:H6')
    .setValues([['id', '日付', 'タイトル', 'カテゴリ', 'タグ', '収入', '支出', 'メモ']])
    .setFontWeight('bold')
    .setBorder(null, null, true, null, null, null, 'black', SOLID_MEDIUM)

  sheet.getRange('F7:G')
    .setNumberFormat('#,##0')

  // カテゴリ別支出
  sheet.getRange('J1')
    .setFormula('=QUERY(B7:H, "select D, sum(G), sum(G) / "&B3&"  where G > 0 group by D order by sum(G) desc label D \'カテゴリ\', sum(G) \'支出\'")')

  sheet.getRange('J1:L1')
    .setFontWeight('bold')
    .setBorder(null, null, true, null, null, null, 'black', SOLID_MEDIUM)

  sheet.getRange('L1')
    .setFontColor('white')

  sheet.getRange('k2:K')
    .setNumberFormat('#,##0')

  sheet.getRange('L2:L')
   .setNumberFormat('0.0%')

  sheet.setColumnWidth(9,21)

  return sheet
}

//バリデーション
function isValid (item = {}) {
  const strKeys = ['date', 'title', 'category', 'tags', 'memo']
  const keys = [...strKeys, 'income', 'outgo']

  //すべてのキーが存在するか
  for (const key of keys) {
    if (item[key] === undefined) {
      return false
    } else {
      // console.log("キーは全部入力されていてOKだわ")
    }
  }

  // 収支以外が文字列になっているか
  for (const key of strKeys) {
    if (typeof item[key] !== 'string') {
      return false
    }else {
      // console.log("収支はOKだわ")
    }
  }

  // 日付のバリデーション
  const dateReg = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/
  if (!dateReg.test(item.date)) {
    return false
  }else {
    // console.log("日付はOKだわ")
  }

  // 収入のどちらかが入力されているか
  const { income: i, outgo: o } = item
  if ((i === null && o === null) || (i !== null && o !== null)) {
     return false
   }  else {
    //  console.log("支出と入金のどちらかに値があります")    
   }

  //入力された収支が数字であるか
  if (i !== null && typeof i !== 'number') return false
  if (o !== null && typeof o !== 'number') return false

  return true
}

