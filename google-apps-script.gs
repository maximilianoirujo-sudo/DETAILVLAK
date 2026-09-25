/**
 * ============================================================================
 * DETAILVLAK - BACKEND DE PERSISTENCIA EN GOOGLE SHEETS (WEB APP)
 * ============================================================================
 * INSTRUCCIONES DE INSTALACIÓN (1 SOLA VEZ):
 * 1. Abrí tu planilla de Google Sheets:
 *    https://docs.google.com/spreadsheets/d/1CCKm7B1q3YtC85SUp5Ub25u4t1DRhZ_0rlyHWCRurgg/edit
 * 2. En el menú superior, hacé clic en "Extensiones" > "Apps Script".
 * 3. Borrá cualquier código que aparezca y pegá TODO este archivo.
 * 4. Tocá el ícono del disquete (Guardar) arriba.
 * 5. Tocá el botón azul "Implementar" (arriba a la derecha) > "Nueva implementación".
 * 6. En "Seleccionar tipo" (el engranaje), elegí "Aplicación web".
 * 7. Configurá:
 *    - Descripción: DetailVlak Sync API
 *    - Ejecutar como: "Yo" (tu cuenta de Google)
 *    - Quién tiene acceso: "Cualquier persona"
 * 8. Tocá "Implementar", autorizá los permisos y copiá la "URL de la aplicación web".
 * 9. Pegá esa URL en el botón de Configuración (⚙️) dentro de la app DetailVlak.
 *    ¡Listo! Ya podés poner la hoja de Google Sheets en modo Privado/Restringido.
 * ============================================================================
 */

const SHEET_NAMES = {
  TASACIONES: "Tasaciones",
  TARIFARIO: "Tarifario",
  STOCK: "Stock",
  MOVIMIENTOS_STOCK: "MovimientosStock",
  GASTOS: "Gastos",
  COMISIONES: "Comisiones",
  CONFIGURACION: "Configuracion"
};

function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    ensureSheetsExist(ss);

    const formResponses = readFormResponses(ss);
    const data = {
      ok: true,
      timestamp: new Date().toISOString(),
      formResponses: formResponses,
      leads: readJsonCollection(ss, SHEET_NAMES.TASACIONES),
      tariffs: readJsonCollection(ss, SHEET_NAMES.TARIFARIO),
      stock: readJsonCollection(ss, SHEET_NAMES.STOCK),
      stockMovements: readJsonCollection(ss, SHEET_NAMES.MOVIMIENTOS_STOCK),
      expenses: readJsonCollection(ss, SHEET_NAMES.GASTOS),
      commissions: readJsonCollection(ss, SHEET_NAMES.COMISIONES),
      config: readConfigObject(ss)
    };

    return ContentService
      .createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    ensureSheetsExist(ss);

    const rawBody = e.postData ? e.postData.contents : "{}";
    const payload = JSON.parse(rawBody);

    if (payload.leads && Array.isArray(payload.leads)) {
      writeTasaciones(ss, payload.leads);
    }
    if (payload.tariffs && Array.isArray(payload.tariffs)) {
      writeTarifario(ss, payload.tariffs);
    }
    if (payload.stock && Array.isArray(payload.stock)) {
      writeStock(ss, payload.stock);
    }
    if (payload.stockMovements && Array.isArray(payload.stockMovements)) {
      writeMovimientosStock(ss, payload.stockMovements);
    }
    if (payload.expenses && Array.isArray(payload.expenses)) {
      writeGastos(ss, payload.expenses);
    }
    if (payload.commissions && Array.isArray(payload.commissions)) {
      writeComisiones(ss, payload.commissions);
    }
    if (payload.config && typeof payload.config === "object") {
      writeConfigObject(ss, payload.config);
    }

    const formResponses = readFormResponses(ss);

    return ContentService
      .createTextOutput(JSON.stringify({
        ok: true,
        savedAt: new Date().toISOString(),
        formResponses: formResponses
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function ensureSheetsExist(ss) {
  createSheetIfMissing(ss, SHEET_NAMES.TASACIONES, [
    "ID", "Fecha", "Cliente", "Teléfono", "Vehículo", "Categoría",
    "Servicios", "Total ($UYU)", "Estado", "Atendido Por", "Fecha Completado", "JSON_DATA"
  ]);
  createSheetIfMissing(ss, SHEET_NAMES.STOCK, [
    "ID", "Nombre", "Categoría", "Unidad", "Cantidad Actual",
    "Stock Mínimo", "Costo Unitario ($UYU)", "Valor Total ($UYU)", "Proveedor", "JSON_DATA"
  ]);
  createSheetIfMissing(ss, SHEET_NAMES.MOVIMIENTOS_STOCK, [
    "ID", "Fecha", "Producto", "Tipo", "Cantidad", "Unidad", "Operador", "Nota", "JSON_DATA"
  ]);
  createSheetIfMissing(ss, SHEET_NAMES.GASTOS, [
    "ID", "Fecha", "Categoría", "Descripción", "Monto ($UYU)", "Medio de Pago", "Registrado Por", "JSON_DATA"
  ]);
  createSheetIfMissing(ss, SHEET_NAMES.COMISIONES, [
    "ID", "Lead ID", "Fecha", "Cliente", "Vehículo", "Total Trabajo ($UYU)",
    "% Comisión", "Monto Comisión ($UYU)", "Estado", "Fecha Pago", "JSON_DATA"
  ]);
  createSheetIfMissing(ss, SHEET_NAMES.TARIFARIO, [
    "ID", "Servicio", "Chico", "Mediano", "SUV", "Pickup", "Moto", "JSON_DATA"
  ]);
  createSheetIfMissing(ss, SHEET_NAMES.CONFIGURACION, [
    "Clave", "Valor"
  ]);
}

function createSheetIfMissing(ss, name, headers) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length)
      .setFontWeight("bold")
      .setBackground("#1E2B31")
      .setFontColor("#FFFFFF");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function readJsonCollection(ss, sheetName) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() < 2) return [];
  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];
  const jsonCol = headers.indexOf("JSON_DATA");
  if (jsonCol === -1) return [];

  const result = [];
  for (let i = 1; i < rows.length; i++) {
    const raw = rows[i][jsonCol];
    if (raw) {
      try {
        result.push(JSON.parse(raw));
      } catch (e) {}
    }
  }
  return result;
}

function writeTasaciones(ss, items) {
  const sheet = ss.getSheetByName(SHEET_NAMES.TASACIONES);
  clearDataRows(sheet);
  if (!items.length) return;
  const rows = items.map(item => [
    item.id || "",
    item.timestamp || "",
    item.name || "",
    item.phone || "",
    item.vehicle || "",
    item.category || "",
    (item.quotedServices && item.quotedServices.length ? item.quotedServices : (item.requestedServices || [])).join(", "),
    item.quotedTotal || 0,
    item.status || "NUEVO",
    item.assignedTo || "Maximiliano",
    item.completedAt || "",
    JSON.stringify(item)
  ]);
  sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
}

function writeStock(ss, items) {
  const sheet = ss.getSheetByName(SHEET_NAMES.STOCK);
  clearDataRows(sheet);
  if (!items.length) return;
  const rows = items.map(item => [
    item.id || "",
    item.name || "",
    item.category || "",
    item.unit || "unidades",
    Number(item.quantity) || 0,
    Number(item.minStock) || 0,
    Number(item.unitCost) || 0,
    (Number(item.quantity) || 0) * (Number(item.unitCost) || 0),
    item.supplier || "",
    JSON.stringify(item)
  ]);
  sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
}

function writeMovimientosStock(ss, items) {
  const sheet = ss.getSheetByName(SHEET_NAMES.MOVIMIENTOS_STOCK);
  clearDataRows(sheet);
  if (!items.length) return;
  const rows = items.map(item => [
    item.id || "",
    item.date || "",
    item.productName || "",
    item.type || "",
    Number(item.quantity) || 0,
    item.unit || "",
    item.operator || "",
    item.note || "",
    JSON.stringify(item)
  ]);
  sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
}

function writeGastos(ss, items) {
  const sheet = ss.getSheetByName(SHEET_NAMES.GASTOS);
  clearDataRows(sheet);
  if (!items.length) return;
  const rows = items.map(item => [
    item.id || "",
    item.date || "",
    item.category || "",
    item.description || "",
    Number(item.amount) || 0,
    item.paymentMethod || "Efectivo",
    item.operator || "",
    JSON.stringify(item)
  ]);
  sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
}

function writeComisiones(ss, items) {
  const sheet = ss.getSheetByName(SHEET_NAMES.COMISIONES);
  clearDataRows(sheet);
  if (!items.length) return;
  const rows = items.map(item => [
    item.id || "",
    item.leadId || "",
    item.date || "",
    item.clientName || "",
    item.vehicle || "",
    Number(item.jobTotal) || 0,
    Number(item.rate) || 30,
    Number(item.commissionAmount) || 0,
    item.status || "PENDIENTE",
    item.paidAt || "",
    JSON.stringify(item)
  ]);
  sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
}

function writeTarifario(ss, items) {
  const sheet = ss.getSheetByName(SHEET_NAMES.TARIFARIO);
  clearDataRows(sheet);
  if (!items.length) return;
  const rows = items.map(item => [
    item.id || "",
    item.shortName || item.name || "",
    (item.prices && item.prices.chico) || 0,
    (item.prices && item.prices.mediano) || 0,
    (item.prices && item.prices.suv) || 0,
    (item.prices && item.prices.pickup) || 0,
    (item.prices && item.prices.moto) || 0,
    JSON.stringify(item)
  ]);
  sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
}

function readConfigObject(ss) {
  const sheet = ss.getSheetByName(SHEET_NAMES.CONFIGURACION);
  if (!sheet || sheet.getLastRow() < 2) return null;
  const rows = sheet.getDataRange().getValues();
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === "APP_CONFIG") {
      try {
        return JSON.parse(rows[i][1]);
      } catch (e) {}
    }
  }
  return null;
}

function writeConfigObject(ss, configObj) {
  const sheet = ss.getSheetByName(SHEET_NAMES.CONFIGURACION);
  clearDataRows(sheet);
  sheet.getRange(2, 1, 1, 2).setValues([["APP_CONFIG", JSON.stringify(configObj)]]);
}

function clearDataRows(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow >= 2) {
    sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
  }
}

function readFormResponses(ss) {
  const allSheets = ss.getSheets();
  let formSheet = null;

  for (let i = 0; i < allSheets.length; i++) {
    const s = allSheets[i];
    if (s.getSheetId() === 2130104281 || s.getName().toLowerCase().indexOf("respuesta") !== -1 || s.getName().toLowerCase().indexOf("form") !== -1) {
      formSheet = s;
      break;
    }
  }
  if (!formSheet) formSheet = allSheets[0];
  if (!formSheet || formSheet.getLastRow() < 2) return [];

  return formSheet.getDataRange().getDisplayValues();
}
