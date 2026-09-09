/**
 * DETAILVLAK - Google Apps Script para Google Sheets
 * 
 * Si querés consultar las respuestas en formato JSON limpio desde cualquier lugar:
 * 1. En tu Google Sheet, andá a Extensiones > Apps Script.
 * 2. Pegá este código y guardalo.
 * 3. Clic en Implementar > Nueva implementación > Tipo: "Aplicación web".
 * 4. Quién tiene acceso: "Cualquier persona".
 */

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  
  if (data.length < 2) {
    return ContentService.createTextOutput(JSON.stringify({ status: "empty", rows: [] }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var headers = data[0];
  var rows = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }
    rows.push(obj);
  }

  var response = {
    status: "ok",
    shop: "DetailVlak",
    count: rows.length,
    leads: rows
  };

  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}
