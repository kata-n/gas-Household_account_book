const Spreadsheet = SpreadsheetApp.getActive()

function test () {
  insertTemplate('2021-01')
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
}

