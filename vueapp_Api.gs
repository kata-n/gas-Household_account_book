const Spreadsheet = SpreadsheetApp.getActive()

function test () {
  insertTemplate('2021-01')
}

function insertTemplate(yaerMonth) {
  const { SOLID_MEDIUM, DOUBLE } = SpreadsheetApp.BorderStyle

  const sheet = Spreadsheet.insertSheet(yaerMonth, 0) 
}

