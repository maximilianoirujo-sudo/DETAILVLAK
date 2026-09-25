/**
 * DetailVlak - Sistema Integral ERP & CRM Automotriz
 * Módulos: Tasaciones, Dashboard Financiero, Control de Stock, Gastos, Comisiones & Persistencia Google Sheets
 * Diseñado para Maximiliano & Romina (Shangrilá, Canelones, Uruguay)
 */

// ================= CONFIGURACIÓN Y ESTADO GLOBAL =================
const DEFAULT_CONFIG = {
  shopName: "DetailVlak",
  shopAddress: "Av. Giannattasio y, 15000 Shangrilá, Canelones",
  sheetUrl: "https://docs.google.com/spreadsheets/d/1CCKm7B1q3YtC85SUp5Ub25u4t1DRhZ_0rlyHWCRurgg/edit?resourcekey=&gid=2130104281#gid=2130104281",
  scriptUrl: "",
  activeUser: "Maximiliano",
  commissionRate: 30
};

const DEFAULT_TARIFFS = [
  {
    id: "interior",
    name: "Limpieza profunda de interiores (Tapizados, alfombras, techo, paneles y desinfección)",
    shortName: "Limpieza profunda de interior",
    description: "Inyección y extracción de tapizados, limpieza profunda a vapor, techo, alfombras y desinfección total.",
    durationHours: 5,
    prices: { chico: 3500, mediano: 4200, suv: 4900, pickup: 5800, moto: 2000 }
  },
  {
    id: "cuero",
    name: "Nutrición y restauración de tapizados de cuero",
    shortName: "Tratamiento de cuero",
    description: "Limpieza técnica de poros y nutrición profunda con acondicionadores mate de pH neutro.",
    durationHours: 3,
    prices: { chico: 2200, mediano: 2600, suv: 3200, pickup: 3800, moto: 1500 }
  },
  {
    id: "motor",
    name: "Lavado y detallado técnico de motor (Vapor / dieléctrico + acondicionador de plásticos)",
    shortName: "Detallado de motor",
    description: "Limpieza técnica segura con vapor, desengrasante dieléctrico y acondicionamiento satinado de mangueras y plásticos.",
    durationHours: 2.5,
    prices: { chico: 1800, mediano: 1800, suv: 2000, pickup: 2200, moto: 1500 }
  },
  {
    id: "opticas",
    name: "Pulido y restauración de ópticas / faros (Lijado + pulido + protección UV)",
    shortName: "Restauración de ópticas",
    description: "Lijado al agua en varios pasos, pulido de alta transparencia y sellado de protección contra rayos UV.",
    durationHours: 2,
    prices: { chico: 2000, mediano: 2000, suv: 2000, pickup: 2000, moto: 1200 }
  },
  {
    id: "lavado_exterior",
    name: "Lavado técnico exterior & descontaminado de pintura",
    shortName: "Lavado al detalle exterior",
    description: "Lavado con guante de microfibra en 2 baldes, descontaminado químico y mecánico con clay bar.",
    durationHours: 2.5,
    prices: { chico: 1800, mediano: 2200, suv: 2600, pickup: 3200, moto: 1400 }
  },
  {
    id: "pulido",
    name: "Pulido / Corrección de pintura (Eliminación de microrayones / swirls)",
    shortName: "Corrección de pintura / Pulido",
    description: "Corte, pulido y abrillantado técnico para devolver el brillo espejo y eliminar marcas de lavado.",
    durationHours: 8,
    prices: { chico: 6800, mediano: 7900, suv: 9200, pickup: 10800, moto: 3800 }
  },
  {
    id: "ceramico",
    name: "Tratamiento Acrílico o Cerámico (Sellado de alto brillo y protección)",
    shortName: "Sellado Cerámico / Acrílico",
    description: "Protección hidrofóbica de larga duración contra rayos UV, lluvia ácida y contaminación.",
    durationHours: 8,
    prices: { chico: 8500, mediano: 9800, suv: 11500, pickup: 13200, moto: 4500 }
  },
  {
    id: "llantas",
    name: "Detallado profundo de llantas, cálipers y pasarruedas",
    shortName: "Detallado de llantas y chasis",
    description: "Descontaminado férrico de llantas, limpieza de pasarruedas y sellado protector.",
    durationHours: 2,
    prices: { chico: 1600, mediano: 1800, suv: 2200, pickup: 2500, moto: 1200 }
  }
];

const DEFAULT_STOCK = [
  {
    id: "stk-shampoo",
    name: "Shampoo pH Neutro Concentrado",
    category: "Químicos",
    unit: "litros",
    quantity: 4.5,
    minStock: 2,
    unitCost: 850,
    supplier: "Detailing Pro UY",
    updatedAt: getTodayISO()
  },
  {
    id: "stk-apc",
    name: "APC Limpiador Multiuso (Interior/Motor)",
    category: "Químicos",
    unit: "litros",
    quantity: 1.5,
    minStock: 2,
    unitCost: 790,
    supplier: "Detailing Pro UY",
    updatedAt: getTodayISO()
  },
  {
    id: "stk-ceramico",
    name: "Coating Cerámico 9H (Frasco 30ml)",
    category: "Químicos",
    unit: "unidades",
    quantity: 1,
    minStock: 2,
    unitCost: 2400,
    supplier: "Importador CarCare",
    updatedAt: getTodayISO()
  },
  {
    id: "stk-microfibra",
    name: "Paños Microfibra Sin Costura 40x40 (400gsm)",
    category: "Paños/Microfibras",
    unit: "unidades",
    quantity: 16,
    minStock: 10,
    unitCost: 190,
    supplier: "Detailing Pro UY",
    updatedAt: getTodayISO()
  },
  {
    id: "stk-pad-corte",
    name: "Pad de Pulido Heavy Cut 5 pulgadas",
    category: "Pads",
    unit: "unidades",
    quantity: 4,
    minStock: 3,
    unitCost: 650,
    supplier: "Importador CarCare",
    updatedAt: getTodayISO()
  },
  {
    id: "stk-cuero",
    name: "Acondicionador & Nutrientes para Cuero Mate",
    category: "Químicos",
    unit: "litros",
    quantity: 2.0,
    minStock: 1,
    unitCost: 1150,
    supplier: "Detailing Pro UY",
    updatedAt: getTodayISO()
  }
];

const SAMPLE_LEADS = [
  {
    id: "lead-enzo-208",
    timestamp: "14/09/2026 16:56",
    name: "Enzo Eirin",
    phone: "094 037 225",
    vehicle: "Peugeot 208 2016",
    color: "",
    category: "chico",
    requestedServices: [
      "Lavado y detallado técnico de motor",
      "Limpieza profunda de interiores (Tapizados, alfombras, techo, paneles y desinfección)"
    ],
    customerNotes: "El auto se pintó y le quedó salpicón de pintura en interior de las ruedas (guardabarros) y ya aprovechar a lavar motor y limpieza general de tapizados y techo.",
    preferredDate: "Sin apuro / Solo estoy consultando presupuesto",
    source: "Instagram Reels",
    status: "NUEVO",
    assignedTo: "Maximiliano",
    quotedServices: ["motor", "interior"],
    quotedTotal: 5300,
    discountAmount: 0,
    timeEstimate: "Aprox. 1 jornada (6 a 8 horas)",
    completedAt: ""
  },
  {
    id: "lead-sample-1",
    timestamp: "22/09/2026 10:15",
    name: "Martín Rodríguez",
    phone: "099 412 883",
    vehicle: "Volkswagen Vento 2.0 TSI (Negro)",
    color: "Negro",
    category: "mediano",
    requestedServices: [
      "Pulido / Corrección de pintura",
      "Tratamiento Acrílico o Cerámico"
    ],
    customerNotes: "Tiene bastantes marcas circulares de lavadero y quiero dejarlo espejo y sellado.",
    preferredDate: "Esta semana",
    source: "Instagram / TikTok",
    status: "FINALIZADO",
    assignedTo: "Maximiliano",
    quotedServices: ["pulido", "ceramico"],
    quotedTotal: 15930,
    discountAmount: 1770,
    timeEstimate: "1 a 2 días de trabajo en taller",
    completedAt: getTodayISO()
  },
  {
    id: "lead-sample-2",
    timestamp: "23/09/2026 14:30",
    name: "Camila Fernández",
    phone: "098 331 904",
    vehicle: "Chevrolet Tracker Premier 2022 (Blanca)",
    color: "Blanca",
    category: "suv",
    requestedServices: [
      "Limpieza profunda de interiores",
      "Nutrición y restauración de tapizados de cuero"
    ],
    customerNotes: "Volcamos un café con leche en el asiento trasero y queremos desinfectar todo el interior.",
    preferredDate: "Próxima semana",
    source: "Recomendación",
    status: "TURNO",
    assignedTo: "Romina",
    quotedServices: ["interior", "cuero"],
    quotedTotal: 8100,
    discountAmount: 0,
    timeEstimate: "1 jornada completa (9:00 a 18:00 hs)",
    completedAt: ""
  }
];

let appState = {
  config: { ...DEFAULT_CONFIG },
  tariffs: JSON.parse(JSON.stringify(DEFAULT_TARIFFS)),
  leads: [],
  stock: [],
  stockMovements: [],
  expenses: [],
  commissions: [],
  activeMainTab: "tasaciones",
  activeFilter: "ALL",
  activeOpFilter: "ALL",
  activeStockCatFilter: "ALL",
  currentLead: null,
  isCreatingNewManual: false,
  currentTemplateKey: "formal",
  hasPendingSync: false
};

// ================= UTILIDADES DE FECHA Y MONEDA ($UYU) =================
function getTodayISO() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getCurrentYearMonth() {
  return getTodayISO().slice(0, 7); // YYYY-MM
}

function formatUYU(amount) {
  const num = Math.round(Number(amount) || 0);
  return "$" + num.toLocaleString("es-UY");
}

function extractYearMonthFromDateStr(str) {
  if (!str) return getCurrentYearMonth();
  const s = String(str).trim();
  // Formato ISO YYYY-MM-DD
  if (/^\d{4}-\d{2}/.test(s)) return s.slice(0, 7);
  // Formato DD/MM/YYYY
  const dmy = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
  if (dmy) {
    const day = Number(dmy[1]);
    const month = Number(dmy[2]);
    const year = dmy[3];
    // Si month > 12 es MM/DD/YYYY (como el Timestamp de Google Forms en inglés 9/14/2026)
    if (month > 12) {
      return `${year}-${String(day).padStart(2, "0")}`;
    }
    return `${year}-${String(month).padStart(2, "0")}`;
  }
  return getCurrentYearMonth();
}

function formatMonthLabel(ym) {
  if (!ym || ym === "ALL") return "Todo el Historial";
  const [y, m] = ym.split("-");
  const names = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  const idx = parseInt(m, 10) - 1;
  return `${names[idx] || m} ${y}`;
}

function formatReadableDate(dateStr) {
  if (!dateStr) return "-";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  }
  return dateStr;
}

// ================= INICIALIZACIÓN =================
document.addEventListener("DOMContentLoaded", () => {
  loadStoredData();
  reconcileCommissions(false);
  initDefaultDatesAndFilters();
  applyActiveUserUI();
  renderAllViews();

  // Sincronización silenciosa inicial con Google Sheets / Apps Script
  syncGoogleSheets(true);
});

function initDefaultDatesAndFilters() {
  const expDate = document.getElementById("exp-date");
  if (expDate && !expDate.value) expDate.value = getTodayISO();
  populateMonthSelectors();
}

function populateMonthSelectors() {
  const monthsSet = new Set();
  const currentYM = getCurrentYearMonth();
  monthsSet.add(currentYM);

  // Agregar últimos 6 meses por defecto
  const now = new Date();
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthsSet.add(ym);
  }

  // Agregar meses presentes en datos
  appState.leads.forEach(l => {
    if (l.completedAt) monthsSet.add(extractYearMonthFromDateStr(l.completedAt));
    if (l.timestamp) monthsSet.add(extractYearMonthFromDateStr(l.timestamp));
  });
  appState.expenses.forEach(e => {
    if (e.date) monthsSet.add(extractYearMonthFromDateStr(e.date));
  });
  appState.commissions.forEach(c => {
    if (c.date) monthsSet.add(extractYearMonthFromDateStr(c.date));
  });

  const sortedMonths = Array.from(monthsSet).filter(Boolean).sort().reverse();

  const selectors = ["dashboard-month-filter", "exp-filter-month", "comm-filter-month"];
  selectors.forEach(id => {
    const sel = document.getElementById(id);
    if (!sel) return;
    const prevVal = sel.value || currentYM;
    sel.innerHTML =
      sortedMonths.map(ym => `<option value="${ym}">${formatMonthLabel(ym)}${ym === currentYM ? " (Actual)" : ""}</option>`).join("") +
      `<option value="ALL">📅 Todo el Historial</option>`;
    sel.value = sortedMonths.includes(prevVal) || prevVal === "ALL" ? prevVal : currentYM;
  });
}

// ================= NAVEGACIÓN ENTRE PESTAÑAS =================
function switchMainTab(tabName) {
  appState.activeMainTab = tabName;

  const views = ["tasaciones", "dashboard", "stock", "gastos", "comisiones"];
  views.forEach(v => {
    const el = document.getElementById(`view-${v}`);
    if (el) el.classList.toggle("hidden", v !== tabName);
  });

  document.querySelectorAll("[data-main-tab]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.mainTab === tabName);
  });
  document.querySelectorAll("[data-mobile-tab]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.mobileTab === tabName);
  });

  populateMonthSelectors();
  renderAllViews();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderAllViews() {
  renderLeads();
  updateStats();
  renderDashboard();
  renderStock();
  renderExpenses();
  renderCommissions();
  updateNavigationBadges();
  lucide.createIcons();
}

function updateNavigationBadges() {
  const badgeTasaciones = document.getElementById("nav-badge-tasaciones");
  if (badgeTasaciones) badgeTasaciones.innerText = appState.leads.length;

  const lowStockCount = appState.stock.filter(item => Number(item.quantity) <= Number(item.minStock)).length;
  const badgeStock = document.getElementById("nav-badge-stock");
  const mobileBadgeStock = document.getElementById("mobile-badge-stock");
  if (badgeStock) {
    badgeStock.innerText = lowStockCount;
    badgeStock.classList.toggle("hidden", lowStockCount === 0);
  }
  if (mobileBadgeStock) {
    mobileBadgeStock.classList.toggle("hidden", lowStockCount === 0);
  }

  const pendingCommCount = appState.commissions.filter(c => c.status !== "PAGADA").length;
  const badgeComm = document.getElementById("nav-badge-comisiones");
  if (badgeComm) {
    badgeComm.innerText = pendingCommCount;
    badgeComm.classList.toggle("hidden", pendingCommCount === 0);
  }
}

// ================= PERSISTENCIA LOCAL & CLOUD (GOOGLE APPS SCRIPT) =================
function loadStoredData() {
  try {
    const savedConfig = localStorage.getItem("detailvlak_config");
    if (savedConfig) {
      appState.config = { ...DEFAULT_CONFIG, ...JSON.parse(savedConfig) };
      if (appState.config.sheetUrl && (appState.config.sheetUrl.includes("1975903270") || !appState.config.sheetUrl.includes("2130104281"))) {
        appState.config.sheetUrl = DEFAULT_CONFIG.sheetUrl;
      }
      if (appState.config.commissionRate === undefined || appState.config.commissionRate === null) {
        appState.config.commissionRate = 30;
      }
      saveConfigLocal();
    } else {
      appState.config = { ...DEFAULT_CONFIG };
      saveConfigLocal();
    }

    const savedTariffs = localStorage.getItem("detailvlak_tariffs");
    if (savedTariffs) appState.tariffs = JSON.parse(savedTariffs);

    const savedLeads = localStorage.getItem("detailvlak_leads");
    if (savedLeads) {
      appState.leads = JSON.parse(savedLeads);
    } else {
      appState.leads = JSON.parse(JSON.stringify(SAMPLE_LEADS));
    }

    const savedStock = localStorage.getItem("detailvlak_stock");
    if (savedStock) {
      appState.stock = JSON.parse(savedStock);
    } else {
      appState.stock = JSON.parse(JSON.stringify(DEFAULT_STOCK));
    }

    const savedMovements = localStorage.getItem("detailvlak_stock_movements");
    if (savedMovements) {
      appState.stockMovements = JSON.parse(savedMovements);
    } else {
      appState.stockMovements = [
        {
          id: "mov-init-1",
          date: getTodayISO() + " 09:00",
          productId: "stk-shampoo",
          productName: "Shampoo pH Neutro Concentrado",
          type: "ENTRADA",
          quantity: 4.5,
          unit: "litros",
          operator: "Maximiliano",
          note: "Inventario inicial de taller"
        }
      ];
    }

    const savedExpenses = localStorage.getItem("detailvlak_expenses");
    if (savedExpenses) {
      appState.expenses = JSON.parse(savedExpenses);
    } else {
      appState.expenses = [
        {
          id: "exp-init-1",
          date: getTodayISO(),
          amount: 2450,
          category: "Insumos",
          description: "Reposición microfibras y APC concentrado",
          paymentMethod: "Transferencia",
          operator: "Maximiliano"
        }
      ];
    }

    const savedCommissions = localStorage.getItem("detailvlak_commissions");
    if (savedCommissions) {
      appState.commissions = JSON.parse(savedCommissions);
    }

    saveAllLocalOnly();
  } catch (e) {
    console.error("Error al cargar almacenamiento local:", e);
    appState.leads = JSON.parse(JSON.stringify(SAMPLE_LEADS));
    appState.stock = JSON.parse(JSON.stringify(DEFAULT_STOCK));
  }
}

function saveConfigLocal() {
  localStorage.setItem("detailvlak_config", JSON.stringify(appState.config));
}

function saveAllLocalOnly() {
  localStorage.setItem("detailvlak_config", JSON.stringify(appState.config));
  localStorage.setItem("detailvlak_tariffs", JSON.stringify(appState.tariffs));
  localStorage.setItem("detailvlak_leads", JSON.stringify(appState.leads));
  localStorage.setItem("detailvlak_stock", JSON.stringify(appState.stock));
  localStorage.setItem("detailvlak_stock_movements", JSON.stringify(appState.stockMovements));
  localStorage.setItem("detailvlak_expenses", JSON.stringify(appState.expenses));
  localStorage.setItem("detailvlak_commissions", JSON.stringify(appState.commissions));
}

function saveLeads() {
  reconcileCommissions(false);
  saveAllLocalOnly();
  pushStateToCloud();
}

function saveTariffs() {
  saveAllLocalOnly();
  pushStateToCloud();
}

function saveConfig() {
  reconcileCommissions(false);
  saveAllLocalOnly();
  pushStateToCloud();
}

function saveAllAndSync() {
  reconcileCommissions(false);
  saveAllLocalOnly();
  pushStateToCloud();
}

function updateCloudStatusUI(status, text) {
  const dot = document.getElementById("cloud-status-dot");
  const label = document.getElementById("cloud-sync-text");
  const errorBanner = document.getElementById("sync-error-banner");

  if (label) label.innerText = text;

  if (status === "ok") {
    if (dot) dot.className = "inline-block w-2 h-2 rounded-full bg-emerald-400";
    if (errorBanner) errorBanner.classList.add("hidden");
    appState.hasPendingSync = false;
  } else if (status === "syncing") {
    if (dot) dot.className = "inline-block w-2 h-2 rounded-full bg-amber-400 animate-ping";
  } else if (status === "error") {
    if (dot) dot.className = "inline-block w-2 h-2 rounded-full bg-red-500";
    if (errorBanner) errorBanner.classList.remove("hidden");
    appState.hasPendingSync = true;
  }
}

async function pushStateToCloud() {
  const scriptUrl = (appState.config.scriptUrl || "").trim();
  if (!scriptUrl) {
    updateCloudStatusUI("ok", "Modo Local + Forms Activo");
    return;
  }

  updateCloudStatusUI("syncing", "Guardando en Google Sheets...");

  try {
    const payload = {
      leads: appState.leads,
      tariffs: appState.tariffs,
      stock: appState.stock,
      stockMovements: appState.stockMovements,
      expenses: appState.expenses,
      commissions: appState.commissions,
      config: appState.config
    };

    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error("HTTP " + response.status);
    const data = await response.json();
    if (data && data.ok) {
      if (data.formResponses && data.formResponses.length > 1) {
        parseFormRowsArray(data.formResponses);
      }
      updateCloudStatusUI("ok", "Sincronizado en Google Sheets");
    } else {
      throw new Error(data.error || "Respuesta inválida del Script");
    }
  } catch (err) {
    console.warn("Error sincronizando con Google Apps Script:", err);
    updateCloudStatusUI("error", "Sin conexión (Guardado en dispositivo)");
  }
}

// ================= SINCRONIZACIÓN COMPLETA CON GOOGLE SHEETS =================
async function syncGoogleSheets(isSilent = false) {
  const icon = document.getElementById("icon-sync");
  if (icon) icon.classList.add("animate-spin");

  const scriptUrl = (appState.config.scriptUrl || "").trim();
  let syncedViaScript = false;

  // 1. Si hay Web App de Google Apps Script configurado, sincronizar todas las hojas
  if (scriptUrl) {
    try {
      updateCloudStatusUI("syncing", "Sincronizando con Google Sheets...");
      const resp = await fetch(scriptUrl);
      if (resp.ok) {
        const cloud = await resp.json();
        if (cloud && cloud.ok) {
          syncedViaScript = true;

          if (Array.isArray(cloud.leads) && cloud.leads.length > 0) {
            appState.leads = mergeCollectionsById(appState.leads, cloud.leads);
          }
          if (Array.isArray(cloud.tariffs) && cloud.tariffs.length > 0) {
            appState.tariffs = cloud.tariffs;
          }
          if (Array.isArray(cloud.stock) && cloud.stock.length > 0) {
            appState.stock = cloud.stock;
          }
          if (Array.isArray(cloud.stockMovements) && cloud.stockMovements.length > 0) {
            appState.stockMovements = mergeCollectionsById(appState.stockMovements, cloud.stockMovements);
          }
          if (Array.isArray(cloud.expenses) && cloud.expenses.length > 0) {
            appState.expenses = mergeCollectionsById(appState.expenses, cloud.expenses);
          }
          if (Array.isArray(cloud.commissions) && cloud.commissions.length > 0) {
            appState.commissions = mergeCollectionsById(appState.commissions, cloud.commissions);
          }
          if (cloud.config && typeof cloud.config === "object") {
            const activeOp = appState.config.activeUser;
            appState.config = { ...appState.config, ...cloud.config, activeUser: activeOp };
          }
          if (Array.isArray(cloud.formResponses) && cloud.formResponses.length > 1) {
            parseFormRowsArray(cloud.formResponses);
          }

          reconcileCommissions(false);
          saveAllLocalOnly();
          await pushStateToCloud();
          renderAllViews();
          if (!isSilent) showToast("¡Sincronización completa con Google Sheets!");
        }
      }
    } catch (err) {
      console.warn("Error en GET de Apps Script:", err);
      updateCloudStatusUI("error", "Fallo de conexión con Google Sheets");
      if (!isSilent) showToast("No se pudo conectar con Google Sheets. Datos guardados en el dispositivo.", "error");
    }
  }

  // 2. Además (o como respaldo si aún no pegaron el Script URL), leer el CSV de Google Forms
  if (!syncedViaScript) {
    const sheetUrl = appState.config.sheetUrl;
    const noticeBanner = document.getElementById("sheet-notice-banner");

    const idMatch = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
    const gidMatch = sheetUrl.match(/[#&?]gid=([0-9]+)/);
    const spreadsheetId = idMatch ? idMatch[1] : null;
    const gid = gidMatch ? gidMatch[1] : "2130104281";

    if (spreadsheetId) {
      const csvUrls = [
        `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=${gid}`,
        `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&gid=${gid}`
      ];

      let csvText = null;
      for (const url of csvUrls) {
        try {
          const resp = await fetch(url);
          if (resp.ok) {
            csvText = await resp.text();
            break;
          }
        } catch (err) {}
      }

      if (csvText && csvText.trim().length > 0) {
        parseGoogleSheetsCSV(csvText);
        if (noticeBanner) noticeBanner.classList.add("hidden");
        updateCloudStatusUI("ok", "Forms Conectado (Falta URL Apps Script)");
        if (!isSilent) showToast("¡Respuestas de Google Forms sincronizadas!");
        renderAllViews();
      } else if (!scriptUrl) {
        if (!isSilent) {
          showToast("La hoja está privada. Configurá el Web App en Ajustes (⚙️).", "error");
        }
      }
    }
  }

  if (icon) icon.classList.remove("animate-spin");
}

function mergeCollectionsById(localArr, cloudArr) {
  const map = new Map();
  cloudArr.forEach(item => {
    if (item && item.id) map.set(item.id, item);
  });
  localArr.forEach(item => {
    if (item && item.id && !map.has(item.id)) {
      map.set(item.id, item);
    }
  });
  return Array.from(map.values());
}

function parseGoogleSheetsCSV(csvText) {
  const rows = parseCSVToArray(csvText);
  if (rows.length < 2) return;
  parseFormRowsArray(rows);
}

function parseFormRowsArray(rows) {
  if (!rows || rows.length < 2) return;

  const headers = rows[0].map(h => (h || "").trim().toLowerCase());

  const colTimestamp = headers.findIndex(h => h.includes("timestamp") || h.includes("marca temporal") || h.includes("marca de hora") || (h.includes("fecha") && !h.includes("turno") && !h.includes("coordinar")) || h.includes("time"));
  const colName = headers.findIndex(h => h.includes("nombre"));
  const colPhone = headers.findIndex(h => h.includes("whatsapp") || h.includes("tel") || h.includes("cel"));
  const colVehicle = headers.findIndex(h => (h.includes("vehículo") || h.includes("vehiculo") || h.includes("auto") || h.includes("modelo")) && !h.includes("categoría") && !h.includes("categoria") && !h.includes("tamaño") && !h.includes("tamano"));
  const colCategory = headers.findIndex(h => h.includes("categoría") || h.includes("categoria") || h.includes("tamaño") || h.includes("tamano"));
  const colColor = headers.findIndex(h => h.includes("color"));
  const colServices = headers.findIndex(h => h.includes("servicio") || h.includes("servicios") || h.includes("realizarle"));
  const colNotes = headers.findIndex(h => h.includes("detalle") || h.includes("prioridad") || h.includes("observ"));
  const colDate = headers.findIndex(h => h.includes("turno") || h.includes("cuándo") || h.includes("cuando") || (h.includes("fecha") && !h.includes("timestamp")));
  const colSource = headers.findIndex(h => h.includes("conociste") || h.includes("viste") || h.includes("origen"));

  let newCount = 0;

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0 || !row[colName] || String(row[colName]).trim() === "") continue;

    const name = String(row[colName] || "").trim();
    const phone = String(row[colPhone] || "").trim();
    const vehicle = (colVehicle !== -1 ? String(row[colVehicle] || "") : "Vehículo no especificado").trim();
    const timestamp = (colTimestamp !== -1 ? String(row[colTimestamp] || "") : getTodayISO()).trim();

    const leadId = "lead-" + btoa(encodeURIComponent(name + phone + timestamp)).replace(/[^a-zA-Z0-9]/g, "").slice(0, 16);
    const existingLead = appState.leads.find(l => l.id === leadId);

    const rawCategory = colCategory !== -1 ? String(row[colCategory] || "") : "";
    const category = normalizeCarCategory(rawCategory);

    const rawServices = colServices !== -1 ? String(row[colServices] || "") : "";
    const requestedServices = rawServices.split(/[,;\n]/).map(s => s.trim()).filter(s => s.length > 0);

    const customerNotes = colNotes !== -1 ? String(row[colNotes] || "").trim() : "";
    const preferredDate = colDate !== -1 ? String(row[colDate] || "").trim() : "";
    const source = colSource !== -1 ? String(row[colSource] || "").trim() : "Google Form";
    const color = colColor !== -1 ? String(row[colColor] || "").trim() : "";

    if (!existingLead) {
      newCount++;
      const tempLead = {
        id: leadId,
        timestamp,
        name,
        phone,
        vehicle: color ? `${vehicle} (${color})` : vehicle,
        color,
        category,
        requestedServices,
        customerNotes,
        preferredDate,
        source,
        status: "NUEVO",
        assignedTo: appState.config.activeUser,
        quotedServices: [],
        quotedTotal: 0,
        discountAmount: 0,
        timeEstimate: "",
        completedAt: ""
      };
      // Pre-calcular servicios sugeridos y monto inicial
      const matchedIds = detectServicesFromLead(tempLead);
      tempLead.quotedServices = matchedIds;
      tempLead.quotedTotal = matchedIds.reduce((sum, id) => {
        const t = appState.tariffs.find(x => x.id === id);
        return sum + (t && t.prices ? (t.prices[category] || 0) : 0);
      }, 0);

      appState.leads.unshift(tempLead);
    }
  }

  saveAllLocalOnly();
  if (newCount > 0) {
    showToast(`Se incorporaron ${newCount} nuevas consultas del formulario.`);
  }
}

function parseCSVToArray(text) {
  const result = [];
  let row = [];
  let inQuotes = false;
  let currentStr = "";

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      currentStr += '"';
      i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      row.push(currentStr);
      currentStr = "";
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      row.push(currentStr);
      result.push(row);
      row = [];
      currentStr = "";
    } else {
      currentStr += char;
    }
  }
  if (currentStr || row.length > 0) {
    row.push(currentStr);
    result.push(row);
  }
  return result;
}

function normalizeCarCategory(str) {
  const s = (str || "").toLowerCase();
  if (s.includes("moto")) return "moto";
  if (s.includes("pick") || s.includes("utilitario") || s.includes("camioneta grande") || s.includes("hilux") || s.includes("amarok") || s.includes("ranger")) return "pickup";
  if (s.includes("suv") || s.includes("tracker") || s.includes("compass") || s.includes("duster") || s.includes("compacta")) return "suv";
  if (s.includes("chico") || s.includes("hatchback")) return "chico";
  if (s.includes("sedán mediano") || s.includes("sedan") || s.includes("mediano") || s.includes("rural") || s.includes("vento") || s.includes("corolla") || s.includes("cruze") || s.includes("focus")) return "mediano";
  return "chico";
}

function getCategoryLabel(catKey) {
  switch (catKey) {
    case "chico": return "Hatchback / Chico";
    case "mediano": return "Sedán Mediano";
    case "suv": return "SUV / Rural";
    case "pickup": return "Pick-up / Camioneta";
    case "moto": return "Moto";
    default: return "Auto";
  }
}

// ================= OPERADORES (MAXIMILIANO / ROMINA) =================
function setActiveUser(userName) {
  appState.config.activeUser = userName;
  saveConfigLocal();
  applyActiveUserUI();
  showToast(`Operador activo: ${userName}`);
  if (appState.currentLead) {
    updatePreviewMessage();
  }
}

function applyActiveUserUI() {
  const isMaxi = appState.config.activeUser === "Maximiliano";
  const isRomi = appState.config.activeUser === "Romina";

  document.documentElement.setAttribute("data-operator", isRomi ? "romina" : "maxi");

  const btnMaxi = document.getElementById("btn-user-maxi");
  const btnRomi = document.getElementById("btn-user-romi");
  if (btnMaxi) btnMaxi.classList.toggle("active", isMaxi);
  if (btnRomi) btnRomi.classList.toggle("active", isRomi);

  const expOpLabel = document.getElementById("quick-expense-operator-label");
  if (expOpLabel) expOpLabel.innerText = appState.config.activeUser;
}

// ================= MOTOR AUTOMÁTICO DE COMISIONES (MAXIMILIANO 30%) =================
function reconcileCommissions(shouldSync = false) {
  const rate = Number(appState.config.commissionRate) || 30;
  const existingMap = new Map();
  appState.commissions.forEach(c => {
    if (c && c.leadId) existingMap.set(c.leadId, c);
  });

  const updatedCommissions = [];

  appState.leads.forEach(lead => {
    // Regla estricta: Solo Maximiliano cobra comisión cuando el trabajo está en estado FINALIZADO (✅ Trabajo Completado)
    if (lead.status === "FINALIZADO" && lead.assignedTo === "Maximiliano") {
      if (!lead.completedAt) {
        lead.completedAt = getTodayISO();
      }
      const jobTotal = Number(lead.quotedTotal) || 0;
      const commAmount = Math.round(jobTotal * (rate / 100));
      const prev = existingMap.get(lead.id);

      updatedCommissions.push({
        id: prev ? prev.id : `comm-${lead.id}`,
        leadId: lead.id,
        date: lead.completedAt || extractYearMonthFromDateStr(lead.timestamp) + "-01",
        clientName: lead.name || "Cliente",
        vehicle: lead.vehicle || "Vehículo",
        jobTotal: jobTotal,
        rate: rate,
        commissionAmount: commAmount,
        status: prev ? prev.status : "PENDIENTE",
        paidAt: prev ? prev.paidAt : ""
      });
    }
  });

  appState.commissions = updatedCommissions;

  // Actualizar etiquetas del porcentaje en UI
  const rateBadge = document.getElementById("comm-rate-badge");
  const thRate = document.getElementById("comm-th-rate");
  if (rateBadge) rateBadge.innerText = `${rate}%`;
  if (thRate) thRate.innerText = rate;

  if (shouldSync) {
    saveAllAndSync();
  }
}

// ================= MÓDULO 1: RENDERIZADO DE TASACIONES & FILTROS =================
function setStatusFilter(status) {
  appState.activeFilter = status;
  document.querySelectorAll(".filter-pill[data-filter]").forEach(pill => {
    pill.classList.toggle("active", pill.dataset.filter === status);
  });
  renderLeads();
}

function setOperatorFilter(op) {
  appState.activeOpFilter = op;
  document.querySelectorAll(".op-pill").forEach(pill => {
    pill.classList.toggle("active", pill.dataset.opFilter === op);
  });
  renderLeads();
}

function quickChangeLeadStatus(leadId, newStatus) {
  const lead = appState.leads.find(l => l.id === leadId);
  if (!lead) return;

  lead.status = newStatus;
  if (newStatus === "FINALIZADO" && !lead.completedAt) {
    lead.completedAt = getTodayISO();
  } else if (newStatus !== "FINALIZADO") {
    lead.completedAt = "";
  }

  // Asegurar que si no tenía monto calculado, se calcule con los servicios solicitados
  if (!lead.quotedTotal || lead.quotedTotal === 0) {
    const ids = lead.quotedServices && lead.quotedServices.length ? lead.quotedServices : detectServicesFromLead(lead);
    lead.quotedServices = ids;
    lead.quotedTotal = ids.reduce((acc, id) => {
      const t = appState.tariffs.find(x => x.id === id);
      return acc + (t && t.prices ? (t.prices[lead.category || "chico"] || 0) : 0);
    }, 0);
  }

  saveAllAndSync();
  renderAllViews();

  if (newStatus === "FINALIZADO" && lead.assignedTo === "Maximiliano") {
    const rate = Number(appState.config.commissionRate) || 30;
    const comm = Math.round((lead.quotedTotal || 0) * (rate / 100));
    showToast(`✅ Trabajo Completado • Comisión Maxi (${formatUYU(comm)}) generada`);
  } else {
    showToast(`Estado actualizado a: ${getStatusPlainText(newStatus)}`);
  }
}

function getStatusPlainText(status) {
  switch (status) {
    case "NUEVO": return "Por Cotizar";
    case "COTIZADO": return "Presupuesto Enviado";
    case "TURNO": return "Turno Agendado";
    case "FINALIZADO": return "Trabajo Completado";
    case "CANCELADO": return "Cancelado";
    default: return status;
  }
}

function renderLeads() {
  const container = document.getElementById("leads-container");
  const emptyState = document.getElementById("empty-state");
  const searchEl = document.getElementById("search-input");
  const searchInput = searchEl ? searchEl.value.toLowerCase().trim() : "";

  if (!container) return;

  const filtered = appState.leads.filter(lead => {
    if (appState.activeFilter !== "ALL" && lead.status !== appState.activeFilter) return false;
    if (appState.activeOpFilter !== "ALL" && lead.assignedTo !== appState.activeOpFilter) return false;

    if (searchInput) {
      const matchName = (lead.name || "").toLowerCase().includes(searchInput);
      const matchVehicle = (lead.vehicle || "").toLowerCase().includes(searchInput);
      const matchPhone = (lead.phone || "").toLowerCase().includes(searchInput);
      const matchServices = (lead.requestedServices || []).join(" ").toLowerCase().includes(searchInput);
      if (!matchName && !matchVehicle && !matchPhone && !matchServices) return false;
    }

    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = "";
    if (emptyState) emptyState.classList.remove("hidden");
    return;
  }

  if (emptyState) emptyState.classList.add("hidden");

  container.innerHTML = filtered.map(lead => {
    const isNew = lead.status === "NUEVO";
    const categoryBadge = getCategoryBadge(lead.category);

    return `
      <div class="lead-card rounded-2xl p-4 flex flex-col justify-between gap-3 border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all">
        
        <div>
          <div class="flex items-start justify-between gap-2 mb-2">
            <div>
              <div class="flex items-center gap-1.5 mb-0.5">
                <span class="text-[9px] font-display font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${lead.source && lead.source.includes('Presencial') ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 border border-slate-200'}">
                  ${lead.source && lead.source.includes('Presencial') ? '🏬 Taller' : '📋 Form'}
                </span>
                ${isNew ? '<span class="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>' : ''}
              </div>
              <h3 class="font-display font-bold text-slate-900 text-sm">${lead.name}</h3>
              <p class="text-[11px] font-mono text-slate-500 mt-0.5">${formatPhoneForDisplay(lead.phone)}</p>
            </div>

            <!-- Selector rápido de estado directo en la tarjeta -->
            <select onchange="quickChangeLeadStatus('${lead.id}', this.value)" class="text-[10px] font-display font-extrabold rounded-lg px-2 py-1 border cursor-pointer focus:outline-none ${getStatusSelectClasses(lead.status)}">
              <option value="NUEVO" ${lead.status === 'NUEVO' ? 'selected' : ''}>🟡 Por Cotizar</option>
              <option value="COTIZADO" ${lead.status === 'COTIZADO' ? 'selected' : ''}>🟣 Cotizado</option>
              <option value="TURNO" ${lead.status === 'TURNO' ? 'selected' : ''}>🟢 Turno</option>
              <option value="FINALIZADO" ${lead.status === 'FINALIZADO' ? 'selected' : ''}>✅ Completado</option>
              <option value="CANCELADO" ${lead.status === 'CANCELADO' ? 'selected' : ''}>⚪ Cancelado</option>
            </select>
          </div>

          <div class="bg-slate-50 border border-slate-200 rounded-xl p-3 my-2">
            <div class="flex items-center justify-between gap-2 text-xs">
              <span class="font-serif font-bold text-slate-900 truncate text-sm">${lead.vehicle}</span>
              ${categoryBadge}
            </div>
            ${lead.customerNotes ? `
              <p class="text-[11px] font-sans text-slate-600 italic line-clamp-2 mt-1.5 border-t border-slate-200 pt-1.5">
                "${lead.customerNotes}"
              </p>
            ` : ''}
          </div>

          <div class="space-y-1 mt-2">
            <span class="text-[9px] font-display uppercase font-extrabold text-slate-400 tracking-wider">Servicios:</span>
            <div class="flex flex-wrap gap-1">
              ${(lead.requestedServices || []).map(s => `
                <span class="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-sans text-slate-800 font-medium">
                  ${cleanServiceName(s)}
                </span>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div class="flex items-center gap-2 text-[11px] font-display">
            <span class="w-2 h-2 rounded-full ${lead.assignedTo === 'Romina' ? 'bg-[#E11D48]' : 'bg-slate-900'}"></span>
            <span class="font-bold text-slate-700">${lead.assignedTo || 'Maximiliano'}</span>
            ${lead.quotedTotal > 0 ? `<span class="font-serif font-black text-slate-900 ml-1 text-sm">${formatUYU(lead.quotedTotal)}</span>` : ''}
          </div>

          <button onclick="openModalCotizador('${lead.id}')" class="btn-action-primary px-3.5 py-1.5 active:scale-95 font-display font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition">
            <i data-lucide="calculator" class="w-3.5 h-3.5"></i>
            <span>${lead.quotedTotal > 0 ? 'Ver / Editar' : 'Cotizar'}</span>
          </button>
        </div>

      </div>
    `;
  }).join('');

  lucide.createIcons();
}

function getStatusSelectClasses(status) {
  switch (status) {
    case "NUEVO": return "bg-amber-50 text-amber-900 border-amber-300";
    case "COTIZADO": return "bg-purple-50 text-purple-900 border-purple-300";
    case "TURNO": return "bg-emerald-50 text-emerald-900 border-emerald-300";
    case "FINALIZADO": return "bg-slate-900 text-white border-slate-900";
    case "CANCELADO": return "bg-slate-100 text-slate-500 border-slate-200";
    default: return "bg-slate-100 text-slate-800 border-slate-200";
  }
}

function cleanServiceName(name) {
  return String(name || "").replace(/\([^)]*\)/g, "").trim();
}

function getCategoryBadge(cat) {
  const label = getCategoryLabel(cat);
  return `<span class="px-2 py-0.5 rounded text-[10px] font-display font-bold uppercase tracking-wider bg-slate-100 text-slate-800 border border-slate-200">${label}</span>`;
}

function updateStats() {
  const total = appState.leads.length;
  const nuevos = appState.leads.filter(l => l.status === "NUEVO").length;
  const cotizados = appState.leads.filter(l => l.status === "COTIZADO").length;
  const turnos = appState.leads.filter(l => l.status === "TURNO").length;
  const totalMonto = appState.leads.reduce((acc, curr) => acc + (Number(curr.quotedTotal) || 0), 0);

  const elTotal = document.getElementById("stat-total");
  const elNuevos = document.getElementById("stat-nuevos");
  const elCotizados = document.getElementById("stat-cotizados");
  const elTurnos = document.getElementById("stat-turnos");
  const elMonto = document.getElementById("stat-monto");

  if (elTotal) elTotal.innerText = total;
  if (elNuevos) elNuevos.innerText = nuevos;
  if (elCotizados) elCotizados.innerText = cotizados;
  if (elTurnos) elTurnos.innerText = turnos;
  if (elMonto) elMonto.innerText = formatUYU(totalMonto);
}

// ================= MÓDULO 2: DASHBOARD FINANCIERO & OPERATIVO =================
function renderDashboard() {
  const filterEl = document.getElementById("dashboard-month-filter");
  const selectedMonth = filterEl ? filterEl.value : getCurrentYearMonth();

  // 1. Filtrar trabajos completados del período
  const completedLeads = appState.leads.filter(l => {
    if (l.status !== "FINALIZADO") return false;
    if (selectedMonth === "ALL") return true;
    const ym = extractYearMonthFromDateStr(l.completedAt || l.timestamp);
    return ym === selectedMonth;
  });

  // 2. Filtrar gastos del período
  const periodExpenses = appState.expenses.filter(e => {
    if (selectedMonth === "ALL") return true;
    return extractYearMonthFromDateStr(e.date) === selectedMonth;
  });

  // 3. Filtrar comisiones del período
  const periodCommissions = appState.commissions.filter(c => {
    if (selectedMonth === "ALL") return true;
    return extractYearMonthFromDateStr(c.date) === selectedMonth;
  });

  const totalIncome = completedLeads.reduce((sum, l) => sum + (Number(l.quotedTotal) || 0), 0);
  const totalExpenses = periodExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const totalCommissions = periodCommissions.reduce((sum, c) => sum + (Number(c.commissionAmount) || 0), 0);
  const pendingCommissions = periodCommissions.filter(c => c.status !== "PAGADA").reduce((sum, c) => sum + (Number(c.commissionAmount) || 0), 0);

  // Resultado Neto = Ingresos - Gastos - Comisiones
  const netResult = totalIncome - totalExpenses - totalCommissions;
  const jobsCount = completedLeads.length;
  const avgTicket = jobsCount > 0 ? Math.round(totalIncome / jobsCount) : 0;

  const totalStockValue = appState.stock.reduce((sum, item) => sum + ((Number(item.quantity) || 0) * (Number(item.unitCost) || 0)), 0);
  const lowStockItems = appState.stock.filter(item => Number(item.quantity) <= Number(item.minStock));

  // Pintar KPIs
  setText("dash-income", formatUYU(totalIncome));
  setText("dash-income-sub", `${jobsCount} trabajo${jobsCount === 1 ? "" : "s"} completado${jobsCount === 1 ? "" : "s"}`);
  setText("dash-expenses", formatUYU(totalExpenses));
  setText("dash-expenses-sub", `${periodExpenses.length} gasto${periodExpenses.length === 1 ? "" : "s"} registrado${periodExpenses.length === 1 ? "" : "s"}`);
  setText("dash-commissions", formatUYU(totalCommissions));
  setText("dash-commissions-sub", `Pendientes de pago: ${formatUYU(pendingCommissions)}`);

  const netEl = document.getElementById("dash-net");
  if (netEl) {
    netEl.innerText = (netResult < 0 ? "-" : "") + formatUYU(Math.abs(netResult));
    netEl.className = `font-serif text-2xl sm:text-3xl font-black ${netResult >= 0 ? "text-emerald-700" : "text-red-600"}`;
  }

  setText("dash-jobs-count", jobsCount);
  setText("dash-avg-ticket", formatUYU(avgTicket));
  setText("dash-stock-value", formatUYU(totalStockValue));
  setText("dash-low-stock-count", lowStockItems.length);

  // Renderizar Gráfico de últimos 6 meses
  renderSixMonthChart();

  // Renderizar Servicios Más Vendidos del período
  renderTopServices(completedLeads);

  // Renderizar Alertas de Stock Bajo
  renderDashboardLowStock(lowStockItems);
}

function renderSixMonthChart() {
  const container = document.getElementById("dash-chart-6m");
  if (!container) return;

  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const shortNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    months.push({
      ym,
      label: `${shortNames[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`
    });
  }

  const statsPerMonth = months.map(m => {
    const inc = appState.leads
      .filter(l => l.status === "FINALIZADO" && extractYearMonthFromDateStr(l.completedAt || l.timestamp) === m.ym)
      .reduce((s, l) => s + (Number(l.quotedTotal) || 0), 0);

    const exp = appState.expenses
      .filter(e => extractYearMonthFromDateStr(e.date) === m.ym)
      .reduce((s, e) => s + (Number(e.amount) || 0), 0);

    const com = appState.commissions
      .filter(c => extractYearMonthFromDateStr(c.date) === m.ym)
      .reduce((s, c) => s + (Number(c.commissionAmount) || 0), 0);

    return { ...m, income: inc, outgoings: exp + com };
  });

  const maxVal = Math.max(10000, ...statsPerMonth.flatMap(x => [x.income, x.outgoings]));

  container.innerHTML = statsPerMonth.map(m => {
    const incPct = Math.max(4, Math.round((m.income / maxVal) * 100));
    const outPct = Math.max(4, Math.round((m.outgoings / maxVal) * 100));

    return `
      <div class="flex-1 flex flex-col items-center h-full justify-end group">
        <div class="text-[9px] font-mono font-bold text-slate-600 mb-1 text-center leading-tight">
          <div class="text-slate-900">${m.income > 0 ? formatUYU(m.income) : "$0"}</div>
          <div class="text-slate-400">${m.outgoings > 0 ? formatUYU(m.outgoings) : "$0"}</div>
        </div>
        <div class="w-full max-w-[54px] flex items-end justify-center gap-1.5 h-36">
          <div class="w-1/2 rounded-t-lg chart-bar-income" style="height: ${incPct}%" title="Ingresos ${m.label}: ${formatUYU(m.income)}"></div>
          <div class="w-1/2 rounded-t-lg chart-bar-expense" style="height: ${outPct}%" title="Gastos + Comisiones ${m.label}: ${formatUYU(m.outgoings)}"></div>
        </div>
        <div class="text-[10px] font-display font-bold text-slate-700 mt-2">${m.label}</div>
      </div>
    `;
  }).join("");
}

function renderTopServices(completedLeads) {
  const container = document.getElementById("dash-top-services");
  if (!container) return;

  const counts = {};
  completedLeads.forEach(lead => {
    const serviceIds = (lead.quotedServices && lead.quotedServices.length > 0)
      ? lead.quotedServices
      : detectServicesFromLead(lead);

    serviceIds.forEach(id => {
      const tariff = appState.tariffs.find(t => t.id === id);
      const name = tariff ? tariff.shortName : cleanServiceName(id);
      const price = tariff && tariff.prices ? (tariff.prices[lead.category || "chico"] || 0) : 0;
      if (!counts[name]) counts[name] = { count: 0, revenue: 0 };
      counts[name].count += 1;
      counts[name].revenue += price;
    });
  });

  const sorted = Object.entries(counts)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  if (sorted.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8 text-slate-400 text-xs">
        No hay servicios en estado "✅ Trabajo Completado" para este período.
      </div>
    `;
    return;
  }

  const maxCount = Math.max(1, sorted[0].count);

  container.innerHTML = sorted.map(item => {
    const pct = Math.round((item.count / maxCount) * 100);
    return `
      <div class="space-y-1">
        <div class="flex items-center justify-between text-xs">
          <span class="font-display font-bold text-slate-900 truncate pr-2">${item.name}</span>
          <span class="font-mono font-bold text-slate-700 shrink-0">${item.count}x • ${formatUYU(item.revenue)}</span>
        </div>
        <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div class="h-full chart-bar-income rounded-full" style="width: ${pct}%"></div>
        </div>
      </div>
    `;
  }).join("");
}

function renderDashboardLowStock(lowStockItems) {
  const container = document.getElementById("dash-low-stock-list");
  if (!container) return;

  if (lowStockItems.length === 0) {
    container.innerHTML = `
      <div class="col-span-full bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900 font-display font-bold flex items-center gap-2">
        <span>✅ Todo el inventario está por encima del stock mínimo.</span>
      </div>
    `;
    return;
  }

  container.innerHTML = lowStockItems.map(item => {
    const isZero = Number(item.quantity) <= 0;
    return `
      <div class="p-3.5 rounded-xl border ${isZero ? "bg-red-50 border-red-300" : "bg-amber-50 border-amber-300"} flex items-center justify-between gap-3">
        <div>
          <div class="flex items-center gap-1.5">
            <span class="px-1.5 py-0.5 rounded text-[9px] font-display font-extrabold uppercase ${isZero ? "bg-red-600 text-white" : "bg-amber-500 text-white"}">
              ${isZero ? "SIN STOCK" : "STOCK BAJO"}
            </span>
            <span class="text-[10px] font-display text-slate-600">${item.category}</span>
          </div>
          <div class="font-display font-bold text-slate-900 text-xs mt-1">${item.name}</div>
          <div class="text-[11px] font-mono text-slate-700">
            Quedan: <strong>${item.quantity} ${item.unit}</strong> (Mín: ${item.minStock})
          </div>
        </div>
        <button onclick="openStockMovementModal('${item.id}', 'ENTRADA')" class="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[11px] font-display font-bold shrink-0 hover:bg-slate-800">
          + Reponer
        </button>
      </div>
    `;
  }).join("");
}

// ================= MÓDULO 3: CONTROL DE STOCK (100% MANUAL) =================
function setStockCategoryFilter(cat) {
  appState.activeStockCatFilter = cat;
  document.querySelectorAll(".stock-cat-pill").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.stockCat === cat);
  });
  renderStock();
}

function renderStock() {
  const container = document.getElementById("stock-container");
  const movTbody = document.getElementById("stock-movements-tbody");
  if (!container) return;

  const totalValue = appState.stock.reduce((acc, item) => acc + ((Number(item.quantity) || 0) * (Number(item.unitCost) || 0)), 0);
  const alertCount = appState.stock.filter(item => Number(item.quantity) <= Number(item.minStock)).length;

  setText("stock-total-value", formatUYU(totalValue));
  setText("stock-total-items", appState.stock.length);
  setText("stock-alert-count", alertCount);

  const searchEl = document.getElementById("stock-search-input");
  const q = searchEl ? searchEl.value.toLowerCase().trim() : "";

  const filtered = appState.stock.filter(item => {
    if (appState.activeStockCatFilter === "LOW") {
      if (Number(item.quantity) > Number(item.minStock)) return false;
    } else if (appState.activeStockCatFilter !== "ALL" && item.category !== appState.activeStockCatFilter) {
      return false;
    }

    if (q) {
      const matchName = (item.name || "").toLowerCase().includes(q);
      const matchSup = (item.supplier || "").toLowerCase().includes(q);
      const matchCat = (item.category || "").toLowerCase().includes(q);
      if (!matchName && !matchSup && !matchCat) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full bg-white border border-slate-200 rounded-2xl p-10 text-center text-xs text-slate-500">
        No se encontraron productos con ese criterio.
      </div>
    `;
  } else {
    container.innerHTML = filtered.map(item => {
      const qty = Number(item.quantity) || 0;
      const min = Number(item.minStock) || 0;
      const cost = Number(item.unitCost) || 0;
      const val = qty * cost;

      const isCritical = qty <= 0;
      const isLow = !isCritical && qty <= min;

      let alertClass = "";
      let badgeHtml = `<span class="px-2 py-0.5 rounded-full text-[9px] font-display font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">🟢 Óptimo</span>`;

      if (isCritical) {
        alertClass = "stock-card-critical";
        badgeHtml = `<span class="px-2.5 py-0.5 rounded-full text-[9px] font-display font-extrabold uppercase bg-red-600 text-white shadow-sm">🔴 Sin Stock</span>`;
      } else if (isLow) {
        alertClass = "stock-card-warning";
        badgeHtml = `<span class="px-2.5 py-0.5 rounded-full text-[9px] font-display font-extrabold uppercase bg-amber-500 text-white shadow-sm">⚠️ Stock Bajo</span>`;
      }

      return `
        <div class="lead-card ${alertClass} rounded-2xl p-4 flex flex-col justify-between gap-3">
          <div>
            <div class="flex items-start justify-between gap-2">
              <div>
                <span class="text-[9px] font-display font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">${item.category}</span>
                <h4 class="font-display font-bold text-slate-900 text-sm mt-1.5">${item.name}</h4>
                ${item.supplier ? `<p class="text-[11px] text-slate-500">Proveedor: ${item.supplier}</p>` : ""}
              </div>
              ${badgeHtml}
            </div>

            <div class="bg-slate-50 border border-slate-200 rounded-xl p-3 my-3 grid grid-cols-3 gap-2 text-center">
              <div>
                <div class="text-[9px] font-display font-bold uppercase text-slate-400">Disponible</div>
                <div class="font-mono font-black text-base ${isCritical ? 'text-red-600' : isLow ? 'text-amber-700' : 'text-slate-900'}">${qty} <span class="text-[10px] font-normal">${item.unit}</span></div>
              </div>
              <div class="border-x border-slate-200">
                <div class="text-[9px] font-display font-bold uppercase text-slate-400">Mínimo</div>
                <div class="font-mono font-bold text-xs text-slate-700 mt-0.5">${min} ${item.unit}</div>
              </div>
              <div>
                <div class="text-[9px] font-display font-bold uppercase text-slate-400">Valor Stock</div>
                <div class="font-mono font-bold text-xs text-slate-900 mt-0.5">${formatUYU(val)}</div>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between gap-2 pt-1">
            <!-- Botones rápidos + Entrada y - Salida -->
            <div class="flex items-center gap-1.5 flex-1">
              <button onclick="openStockMovementModal('${item.id}', 'ENTRADA')" class="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-display font-extrabold flex items-center justify-center gap-1 shadow-sm transition">
                <span>+ Entrada</span>
              </button>
              <button onclick="openStockMovementModal('${item.id}', 'SALIDA')" class="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white rounded-xl text-xs font-display font-extrabold flex items-center justify-center gap-1 shadow-sm transition">
                <span>– Salida</span>
              </button>
            </div>

            <div class="flex items-center gap-1">
              <button onclick="openStockProductModal('${item.id}')" class="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl" title="Editar producto">
                <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
              </button>
              <button onclick="confirmDeleteStockProduct('${item.id}')" class="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl" title="Eliminar producto">
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  // Renderizar Historial de Movimientos
  if (movTbody) {
    if (appState.stockMovements.length === 0) {
      movTbody.innerHTML = `<tr><td colspan="6" class="py-6 text-center text-slate-400">Sin movimientos registrados todavía.</td></tr>`;
    } else {
      movTbody.innerHTML = appState.stockMovements.slice(0, 40).map(m => {
        const isIn = m.type === "ENTRADA";
        return `
          <tr class="hover:bg-slate-50">
            <td class="py-2.5 px-3 font-mono text-[11px] text-slate-600">${m.date || "-"}</td>
            <td class="py-2.5 px-3 font-display font-bold text-slate-900">${m.productName}</td>
            <td class="py-2.5 px-3">
              <span class="px-2 py-0.5 rounded-full text-[10px] font-display font-extrabold ${isIn ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-800 border border-amber-200"}">
                ${isIn ? "+ Entrada" : "– Salida"}
              </span>
            </td>
            <td class="py-2.5 px-3 font-mono font-bold ${isIn ? "text-emerald-700" : "text-slate-900"}">
              ${isIn ? "+" : "-"}${m.quantity} ${m.unit || ""}
            </td>
            <td class="py-2.5 px-3 font-display font-bold text-slate-700">${m.operator || "Maximiliano"}</td>
            <td class="py-2.5 px-3 text-slate-500">${m.note || "-"}</td>
          </tr>
        `;
      }).join("");
    }
  }

  lucide.createIcons();
}

function openStockProductModal(productId = null) {
  const modal = document.getElementById("modal-stock-product");
  const title = document.getElementById("stock-product-modal-title");

  if (productId) {
    const item = appState.stock.find(x => x.id === productId);
    if (!item) return;
    title.innerText = "Editar Producto de Stock";
    document.getElementById("stock-item-id").value = item.id;
    document.getElementById("stock-item-name").value = item.name;
    document.getElementById("stock-item-category").value = item.category;
    document.getElementById("stock-item-unit").value = item.unit;
    document.getElementById("stock-item-qty").value = item.quantity;
    document.getElementById("stock-item-min").value = item.minStock;
    document.getElementById("stock-item-cost").value = item.unitCost;
    document.getElementById("stock-item-supplier").value = item.supplier || "";
  } else {
    title.innerText = "Alta de Producto en Stock";
    document.getElementById("stock-item-id").value = "";
    document.getElementById("stock-item-name").value = "";
    document.getElementById("stock-item-category").value = "Químicos";
    document.getElementById("stock-item-unit").value = "litros";
    document.getElementById("stock-item-qty").value = "";
    document.getElementById("stock-item-min").value = "1";
    document.getElementById("stock-item-cost").value = "";
    document.getElementById("stock-item-supplier").value = "";
  }

  modal.classList.remove("hidden");
}

function closeStockProductModal() {
  document.getElementById("modal-stock-product").classList.add("hidden");
}

function saveStockProduct(e) {
  e.preventDefault();
  const id = document.getElementById("stock-item-id").value;
  const name = document.getElementById("stock-item-name").value.trim();
  const category = document.getElementById("stock-item-category").value;
  const unit = document.getElementById("stock-item-unit").value;
  const quantity = parseFloat(document.getElementById("stock-item-qty").value) || 0;
  const minStock = parseFloat(document.getElementById("stock-item-min").value) || 0;
  const unitCost = parseFloat(document.getElementById("stock-item-cost").value) || 0;
  const supplier = document.getElementById("stock-item-supplier").value.trim();

  if (id) {
    const existing = appState.stock.find(x => x.id === id);
    if (existing) {
      existing.name = name;
      existing.category = category;
      existing.unit = unit;
      existing.quantity = quantity;
      existing.minStock = minStock;
      existing.unitCost = unitCost;
      existing.supplier = supplier;
      existing.updatedAt = getTodayISO();
    }
    showToast("Producto actualizado");
  } else {
    const newItem = {
      id: "stk-" + Date.now(),
      name,
      category,
      unit,
      quantity,
      minStock,
      unitCost,
      supplier,
      updatedAt: getTodayISO()
    };
    appState.stock.unshift(newItem);
    appState.stockMovements.unshift({
      id: "mov-" + Date.now(),
      date: new Date().toLocaleString("es-UY"),
      productId: newItem.id,
      productName: newItem.name,
      type: "ENTRADA",
      quantity: quantity,
      unit: unit,
      operator: appState.config.activeUser,
      note: "Alta inicial de producto"
    });
    showToast("Producto agregado al inventario");
  }

  closeStockProductModal();
  saveAllAndSync();
  renderAllViews();
}

function openStockMovementModal(productId, type) {
  const item = appState.stock.find(x => x.id === productId);
  if (!item) return;

  document.getElementById("stock-move-product-id").value = item.id;
  document.getElementById("stock-move-type").value = type;
  document.getElementById("stock-move-title").innerText = type === "ENTRADA" ? "+ Entrada de Stock" : "– Salida de Stock";
  document.getElementById("stock-move-subtitle").innerText = `${item.name} (${formatUYU(item.unitCost)} / ${item.unit})`;
  document.getElementById("stock-move-unit-label").innerText = item.unit;
  document.getElementById("stock-move-current-qty").innerText = `${item.quantity} ${item.unit}`;
  document.getElementById("stock-move-qty").value = "1";
  document.getElementById("stock-move-note").value = "";

  const expenseBox = document.getElementById("stock-move-expense-box");
  const alsoExpenseCheck = document.getElementById("stock-move-also-expense");

  if (type === "ENTRADA" && Number(item.unitCost) > 0) {
    expenseBox.classList.remove("hidden");
    alsoExpenseCheck.checked = false;
    toggleMoveExpenseMethod();
    updateStockMoveCostPreview();
  } else {
    expenseBox.classList.add("hidden");
    alsoExpenseCheck.checked = false;
  }

  document.getElementById("modal-stock-movement").classList.remove("hidden");
  setTimeout(() => {
    const qtyInput = document.getElementById("stock-move-qty");
    if (qtyInput) {
      qtyInput.focus();
      qtyInput.select();
    }
  }, 80);
}

function closeStockMovementModal() {
  document.getElementById("modal-stock-movement").classList.add("hidden");
}

function adjustMoveQty(delta) {
  const input = document.getElementById("stock-move-qty");
  const curr = parseFloat(input.value) || 0;
  input.value = Math.max(0.1, Math.round((curr + delta) * 10) / 10);
  updateStockMoveCostPreview();
}

function toggleMoveExpenseMethod() {
  const checked = document.getElementById("stock-move-also-expense").checked;
  const wrap = document.getElementById("stock-move-payment-wrap");
  if (wrap) wrap.classList.toggle("hidden", !checked);
}

function updateStockMoveCostPreview() {
  const productId = document.getElementById("stock-move-product-id").value;
  const item = appState.stock.find(x => x.id === productId);
  if (!item) return;
  const qty = parseFloat(document.getElementById("stock-move-qty").value) || 0;
  const totalCost = Math.round(qty * (Number(item.unitCost) || 0));
  const preview = document.getElementById("stock-move-expense-preview");
  if (preview) preview.innerText = `Costo calculado: ${formatUYU(totalCost)} UYU`;
}

function submitStockMovement(e) {
  e.preventDefault();
  const productId = document.getElementById("stock-move-product-id").value;
  const type = document.getElementById("stock-move-type").value;
  const qty = parseFloat(document.getElementById("stock-move-qty").value) || 0;
  const note = document.getElementById("stock-move-note").value.trim();

  const item = appState.stock.find(x => x.id === productId);
  if (!item || qty <= 0) return;

  if (type === "ENTRADA") {
    item.quantity = Math.round((Number(item.quantity) + qty) * 100) / 100;
  } else {
    item.quantity = Math.max(0, Math.round((Number(item.quantity) - qty) * 100) / 100);
  }
  item.updatedAt = getTodayISO();

  appState.stockMovements.unshift({
    id: "mov-" + Date.now(),
    date: new Date().toLocaleString("es-UY"),
    productId: item.id,
    productName: item.name,
    type,
    quantity: qty,
    unit: item.unit,
    operator: appState.config.activeUser,
    note: note || (type === "ENTRADA" ? "Reposición de stock" : "Consumo en taller")
  });

  // Si es ENTRADA y pidió cargarlo también como gasto en categoría Insumos
  const alsoExpense = document.getElementById("stock-move-also-expense").checked;
  if (type === "ENTRADA" && alsoExpense && Number(item.unitCost) > 0) {
    const totalExpense = Math.round(qty * Number(item.unitCost));
    const paymentMethod = document.getElementById("stock-move-payment").value || "Efectivo";
    appState.expenses.unshift({
      id: "exp-" + Date.now(),
      date: getTodayISO(),
      amount: totalExpense,
      category: "Insumos",
      description: `Compra Stock: ${qty} ${item.unit} de ${item.name}${note ? " (" + note + ")" : ""}`,
      paymentMethod,
      operator: appState.config.activeUser
    });
    showToast(`Stock actualizado y Gasto de ${formatUYU(totalExpense)} registrado en Insumos`);
  } else {
    showToast(`Movimiento registrado (${type === "ENTRADA" ? "+" : "-"}${qty} ${item.unit})`);
  }

  closeStockMovementModal();
  saveAllAndSync();
  renderAllViews();
}

function confirmDeleteStockProduct(productId) {
  const item = appState.stock.find(x => x.id === productId);
  if (!item) return;

  openConfirmDeleteModal(
    `¿Eliminar "${item.name}"?`,
    "Se quitará este producto del inventario de DetailVlak.",
    () => {
      appState.stock = appState.stock.filter(x => x.id !== productId);
      saveAllAndSync();
      renderAllViews();
      showToast("Producto eliminado del stock");
    }
  );
}

// ================= MÓDULO 4: CONTROL DE GASTOS =================
function handleQuickExpenseSubmit(e) {
  e.preventDefault();
  const date = document.getElementById("exp-date").value || getTodayISO();
  const amount = parseFloat(document.getElementById("exp-amount").value) || 0;
  const category = document.getElementById("exp-category").value;
  const paymentMethod = document.getElementById("exp-payment").value;
  const description = document.getElementById("exp-desc").value.trim();

  if (amount <= 0 || !description) return;

  appState.expenses.unshift({
    id: "exp-" + Date.now(),
    date,
    amount: Math.round(amount),
    category,
    description,
    paymentMethod,
    operator: appState.config.activeUser
  });

  document.getElementById("exp-amount").value = "";
  document.getElementById("exp-desc").value = "";

  populateMonthSelectors();
  saveAllAndSync();
  renderAllViews();
  showToast(`Gasto de ${formatUYU(amount)} guardado`);
}

function renderExpenses() {
  const tbody = document.getElementById("expenses-tbody");
  if (!tbody) return;

  const monthFilter = document.getElementById("exp-filter-month")?.value || getCurrentYearMonth();
  const catFilter = document.getElementById("exp-filter-category")?.value || "ALL";

  const filtered = appState.expenses.filter(exp => {
    if (monthFilter !== "ALL" && extractYearMonthFromDateStr(exp.date) !== monthFilter) return false;
    if (catFilter !== "ALL" && exp.category !== catFilter) return false;
    return true;
  });

  const totalPeriod = filtered.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
  setText("exp-period-total", formatUYU(totalPeriod));
  setText("exp-period-count", `${filtered.length} registro${filtered.length === 1 ? "" : "s"}`);

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="py-8 text-center text-slate-400">No hay gastos registrados en este período.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(exp => `
    <tr class="hover:bg-slate-50 transition-colors">
      <td class="py-3 px-4 font-mono text-slate-600">${formatReadableDate(exp.date)}</td>
      <td class="py-3 px-4">
        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-display font-bold bg-slate-100 text-slate-800 border border-slate-200">
          ${exp.category}
        </span>
      </td>
      <td class="py-3 px-4 font-display font-bold text-slate-900">${exp.description}</td>
      <td class="py-3 px-4 text-slate-600">${exp.paymentMethod || "Efectivo"}</td>
      <td class="py-3 px-4 font-display text-slate-700">${exp.operator || "Maximiliano"}</td>
      <td class="py-3 px-4 text-right font-serif font-black text-slate-900 text-sm">${formatUYU(exp.amount)}</td>
      <td class="py-3 px-4 text-center">
        <div class="inline-flex items-center gap-1">
          <button onclick="openExpenseEditModal('${exp.id}')" class="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg" title="Editar">
            <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
          </button>
          <button onclick="confirmDeleteExpense('${exp.id}')" class="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg" title="Eliminar">
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join("");

  lucide.createIcons();
}

function openExpenseEditModal(expId) {
  const exp = appState.expenses.find(x => x.id === expId);
  if (!exp) return;

  document.getElementById("edit-exp-id").value = exp.id;
  document.getElementById("edit-exp-date").value = exp.date;
  document.getElementById("edit-exp-amount").value = exp.amount;
  document.getElementById("edit-exp-category").value = exp.category;
  document.getElementById("edit-exp-payment").value = exp.paymentMethod || "Efectivo";
  document.getElementById("edit-exp-desc").value = exp.description;

  document.getElementById("modal-expense-edit").classList.remove("hidden");
}

function closeExpenseEditModal() {
  document.getElementById("modal-expense-edit").classList.add("hidden");
}

function saveEditedExpense(e) {
  e.preventDefault();
  const id = document.getElementById("edit-exp-id").value;
  const exp = appState.expenses.find(x => x.id === id);
  if (!exp) return;

  exp.date = document.getElementById("edit-exp-date").value;
  exp.amount = Math.round(parseFloat(document.getElementById("edit-exp-amount").value) || 0);
  exp.category = document.getElementById("edit-exp-category").value;
  exp.paymentMethod = document.getElementById("edit-exp-payment").value;
  exp.description = document.getElementById("edit-exp-desc").value.trim();

  closeExpenseEditModal();
  saveAllAndSync();
  renderAllViews();
  showToast("Gasto actualizado");
}

function confirmDeleteExpense(expId) {
  const exp = appState.expenses.find(x => x.id === expId);
  if (!exp) return;

  openConfirmDeleteModal(
    `¿Eliminar gasto de ${formatUYU(exp.amount)}?`,
    `Descripción: "${exp.description}" (${formatReadableDate(exp.date)})`,
    () => {
      appState.expenses = appState.expenses.filter(x => x.id !== expId);
      saveAllAndSync();
      renderAllViews();
      showToast("Gasto eliminado");
    }
  );
}

// ================= MÓDULO 5: COMISIONES (MAXIMILIANO) =================
function renderCommissions() {
  const tbody = document.getElementById("commissions-tbody");
  if (!tbody) return;

  const monthFilter = document.getElementById("comm-filter-month")?.value || getCurrentYearMonth();

  const filtered = appState.commissions.filter(c => {
    if (monthFilter === "ALL") return true;
    return extractYearMonthFromDateStr(c.date) === monthFilter;
  });

  const totalMonth = filtered.reduce((sum, c) => sum + (Number(c.commissionAmount) || 0), 0);
  const totalPaid = filtered.filter(c => c.status === "PAGADA").reduce((sum, c) => sum + (Number(c.commissionAmount) || 0), 0);
  const totalPending = filtered.filter(c => c.status !== "PAGADA").reduce((sum, c) => sum + (Number(c.commissionAmount) || 0), 0);

  setText("comm-total-month", formatUYU(totalMonth));
  setText("comm-jobs-count", `${filtered.length} trabajo${filtered.length === 1 ? "" : "s"} completado${filtered.length === 1 ? "" : "s"} por Maxi`);
  setText("comm-total-paid", formatUYU(totalPaid));
  setText("comm-total-pending", formatUYU(totalPending));

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="py-8 text-center text-slate-400">
          No hay comisiones generadas en este período. Al marcar una tasación de Maximiliano como "✅ Trabajo Completado", aparecerá automáticamente aquí.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(c => {
    const isPaid = c.status === "PAGADA";
    return `
      <tr class="hover:bg-slate-50 transition-colors">
        <td class="py-3 px-4 font-mono text-slate-600">${formatReadableDate(c.date)}</td>
        <td class="py-3 px-4 font-display font-bold text-slate-900">${c.clientName}</td>
        <td class="py-3 px-4 font-serif text-slate-800">${c.vehicle}</td>
        <td class="py-3 px-4 text-right font-mono font-bold text-slate-700">${formatUYU(c.jobTotal)}</td>
        <td class="py-3 px-4 text-right font-serif font-black text-slate-900 text-sm">${formatUYU(c.commissionAmount)}</td>
        <td class="py-3 px-4 text-center">
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-display font-extrabold uppercase ${isPaid ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-800 border border-amber-300"}">
            ${isPaid ? "✅ Pagada" : "⏳ Pendiente"}
          </span>
        </td>
        <td class="py-3 px-4 text-center">
          <button onclick="toggleCommissionPaid('${c.id}')" class="px-3 py-1.5 rounded-xl text-[11px] font-display font-bold transition ${isPaid ? "bg-slate-100 text-slate-600 hover:bg-slate-200" : "btn-action-primary"}">
            ${isPaid ? "Pasar a Pendiente" : "Marcar Pagada"}
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

function toggleCommissionPaid(commId) {
  const comm = appState.commissions.find(c => c.id === commId);
  if (!comm) return;

  if (comm.status === "PAGADA") {
    comm.status = "PENDIENTE";
    comm.paidAt = "";
    showToast("Comisión marcada como Pendiente");
  } else {
    comm.status = "PAGADA";
    comm.paidAt = getTodayISO();
    showToast(`Comisión de ${formatUYU(comm.commissionAmount)} marcada como Pagada`);
  }

  saveAllAndSync();
  renderAllViews();
}

function payAllPendingCommissions() {
  const monthFilter = document.getElementById("comm-filter-month")?.value || getCurrentYearMonth();
  let count = 0;

  appState.commissions.forEach(c => {
    const matchMonth = monthFilter === "ALL" || extractYearMonthFromDateStr(c.date) === monthFilter;
    if (matchMonth && c.status !== "PAGADA") {
      c.status = "PAGADA";
      c.paidAt = getTodayISO();
      count++;
    }
  });

  if (count === 0) {
    showToast("No hay comisiones pendientes en este período");
    return;
  }

  saveAllAndSync();
  renderAllViews();
  showToast(`¡${count} comisiones marcadas como Pagadas!`);
}

// ================= MODAL DE COTIZACIÓN & MOTOR DE TASACIÓN =================
function openNewManualQuote() {
  const newLead = {
    id: "manual-" + Date.now(),
    timestamp: getTodayISO(),
    name: "",
    phone: "",
    vehicle: "",
    color: "",
    category: "chico",
    requestedServices: ["Tasación Presencial en Taller"],
    customerNotes: "",
    preferredDate: "En el día / A coordinar",
    source: "Presencial / Taller",
    status: "COTIZADO",
    assignedTo: appState.config.activeUser,
    quotedServices: ["interior"],
    quotedTotal: 0,
    discountAmount: 0,
    timeEstimate: "",
    completedAt: ""
  };

  appState.currentLead = newLead;
  appState.isCreatingNewManual = true;

  document.getElementById("modal-title-action").innerText = "Nueva Tasación Presencial";
  document.getElementById("modal-lead-name-display").innerText = "Nuevo Cliente";
  document.getElementById("modal-lead-car-subtitle").innerText = "Completá los datos del vehículo para calcular";

  document.getElementById("modal-lead-name-input").value = "";
  document.getElementById("modal-lead-phone-input").value = "";
  document.getElementById("modal-lead-vehicle-input").value = "";
  document.getElementById("modal-lead-notes-input").value = "";
  document.getElementById("modal-car-category").value = "chico";
  document.getElementById("modal-assigned-operator").value = appState.config.activeUser;
  document.getElementById("modal-lead-source").value = "Presencial / Taller";
  document.getElementById("modal-lead-status").value = "COTIZADO";
  document.getElementById("modal-lead-call-btn").href = "#";

  const delBtn = document.getElementById("btn-delete-lead");
  if (delBtn) delBtn.classList.add("hidden");

  renderModalServices();
  recalculateQuote();

  const modal = document.getElementById("modal-cotizador");
  modal.classList.remove("hidden");
  lucide.createIcons();

  setTimeout(() => {
    const input = document.getElementById("modal-lead-name-input");
    if (input) input.focus();
  }, 100);
}

function openModalCotizador(leadId) {
  const lead = appState.leads.find(l => l.id === leadId);
  if (!lead) return;

  appState.currentLead = lead;
  appState.isCreatingNewManual = false;

  document.getElementById("modal-title-action").innerText = "Tasación Oficial";
  document.getElementById("modal-lead-name-display").innerText = lead.name || "Cliente";
  document.getElementById("modal-lead-car-subtitle").innerText = `${lead.vehicle || "Vehículo"}`;

  document.getElementById("modal-lead-name-input").value = lead.name || "";
  document.getElementById("modal-lead-phone-input").value = lead.phone || "";
  document.getElementById("modal-lead-vehicle-input").value = lead.vehicle || "";
  document.getElementById("modal-lead-notes-input").value = lead.customerNotes || "";
  document.getElementById("modal-car-category").value = lead.category || "chico";
  document.getElementById("modal-assigned-operator").value = lead.assignedTo || appState.config.activeUser;
  document.getElementById("modal-lead-source").value = lead.source || "Google Form";
  document.getElementById("modal-lead-status").value = lead.status;

  const cleanPhone = sanitizePhoneForWhatsApp(lead.phone);
  document.getElementById("modal-lead-call-btn").href = cleanPhone ? `tel:${cleanPhone}` : "#";

  const delBtn = document.getElementById("btn-delete-lead");
  if (delBtn) delBtn.classList.remove("hidden");

  renderModalServices();
  recalculateQuote();

  const modal = document.getElementById("modal-cotizador");
  modal.classList.remove("hidden");
  lucide.createIcons();
}

function onLeadDataInput() {
  if (!appState.currentLead) return;

  const nameVal = document.getElementById("modal-lead-name-input").value.trim();
  const phoneVal = document.getElementById("modal-lead-phone-input").value.trim();
  const vehicleVal = document.getElementById("modal-lead-vehicle-input").value.trim();
  const notesVal = document.getElementById("modal-lead-notes-input").value.trim();

  appState.currentLead.name = nameVal || (appState.isCreatingNewManual ? "Cliente en Taller" : "Cliente");
  appState.currentLead.phone = phoneVal;
  appState.currentLead.vehicle = vehicleVal || "Vehículo a tasar";
  appState.currentLead.customerNotes = notesVal;

  document.getElementById("modal-lead-name-display").innerText = appState.currentLead.name;
  document.getElementById("modal-lead-car-subtitle").innerText = appState.currentLead.vehicle;

  const cleanPhone = sanitizePhoneForWhatsApp(phoneVal);
  document.getElementById("modal-lead-call-btn").href = cleanPhone ? `tel:${cleanPhone}` : "#";

  updatePreviewMessage();
}

function closeModalCotizador() {
  document.getElementById("modal-cotizador").classList.add("hidden");
  appState.currentLead = null;
  appState.isCreatingNewManual = false;
}

function renderModalServices() {
  const lead = appState.currentLead;
  const container = document.getElementById("modal-services-list");
  const category = document.getElementById("modal-car-category").value || "chico";

  let selectedIds = lead.quotedServices && lead.quotedServices.length > 0
    ? lead.quotedServices
    : detectServicesFromLead(lead);

  container.innerHTML = appState.tariffs.map(tariff => {
    const price = tariff.prices[category] || 0;
    const isChecked = selectedIds.includes(tariff.id);

    return `
      <label class="flex items-start gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 cursor-pointer transition">
        <input type="checkbox" value="${tariff.id}" onchange="recalculateQuote()" ${isChecked ? 'checked' : ''} class="mt-0.5 w-4 h-4 rounded focus:ring-0">
        <div class="flex-1">
          <div class="flex items-center justify-between">
            <span class="font-display font-bold text-slate-900 text-xs">${tariff.shortName}</span>
            <span class="font-serif font-black text-slate-900 text-xs">${formatUYU(price)}</span>
          </div>
          <p class="font-sans text-[10px] text-slate-500 line-clamp-1 mt-0.5">${tariff.description}</p>
        </div>
      </label>
    `;
  }).join('');
}

function detectServicesFromLead(lead) {
  const matched = [];
  const reqText = (lead.requestedServices || []).join(" ").toLowerCase();

  appState.tariffs.forEach(tariff => {
    if (
      (tariff.id === "interior" && (reqText.includes("interior") || reqText.includes("tapizado") || reqText.includes("alfombra"))) ||
      (tariff.id === "cuero" && reqText.includes("cuero")) ||
      (tariff.id === "motor" && reqText.includes("motor")) ||
      (tariff.id === "opticas" && (reqText.includes("óptica") || reqText.includes("optica") || reqText.includes("faro"))) ||
      (tariff.id === "lavado_exterior" && (reqText.includes("exterior") || reqText.includes("descontaminado"))) ||
      (tariff.id === "pulido" && (reqText.includes("pulido") || reqText.includes("corrección") || reqText.includes("correccion") || reqText.includes("swirl"))) ||
      (tariff.id === "ceramico" && (reqText.includes("cerámico") || reqText.includes("ceramico") || reqText.includes("acrílico") || reqText.includes("acrilico") || reqText.includes("vidrio"))) ||
      (tariff.id === "llantas" && (reqText.includes("llanta") || reqText.includes("pasarrueda")))
    ) {
      matched.push(tariff.id);
    }
  });

  return matched.length > 0 ? matched : ["interior"];
}

function recalculateQuote() {
  const category = document.getElementById("modal-car-category").value || "chico";
  const checkedBoxes = Array.from(document.querySelectorAll("#modal-services-list input[type='checkbox']:checked"));
  const selectedServiceIds = checkedBoxes.map(cb => cb.value);

  // Actualizar precios en las etiquetas del modal según tamaño
  document.querySelectorAll("#modal-services-list input[type='checkbox']").forEach(cb => {
    const t = appState.tariffs.find(x => x.id === cb.value);
    if (t) {
      const priceSpan = cb.parentElement.querySelector(".font-serif");
      if (priceSpan) priceSpan.innerText = formatUYU(t.prices[category] || 0);
    }
  });

  let subtotal = 0;
  let totalHours = 0;

  selectedServiceIds.forEach(id => {
    const tariff = appState.tariffs.find(t => t.id === id);
    if (tariff) {
      subtotal += (tariff.prices[category] || 0);
      totalHours += (tariff.durationHours || 2);
    }
  });

  const discountType = document.getElementById("modal-discount-type").value;
  const customDiscountInput = document.getElementById("modal-discount-custom");
  let discountAmount = 0;

  if (discountType === "10") {
    discountAmount = Math.round(subtotal * 0.10);
    customDiscountInput.classList.add("hidden");
  } else if (discountType === "15") {
    discountAmount = Math.round(subtotal * 0.15);
    customDiscountInput.classList.add("hidden");
  } else if (discountType === "custom") {
    customDiscountInput.classList.remove("hidden");
    discountAmount = parseFloat(customDiscountInput.value) || 0;
  } else {
    customDiscountInput.classList.add("hidden");
  }

  const surcharge = parseFloat(document.getElementById("modal-surcharge").value) || 0;
  const total = Math.max(0, subtotal - discountAmount + surcharge);

  const timeInput = document.getElementById("modal-time-estimate");
  if (!timeInput.value || timeInput.dataset.autocalc !== "false") {
    let calculatedTime = "";
    if (totalHours <= 3) calculatedTime = "Aprox. 2 a 3 horas";
    else if (totalHours <= 6) calculatedTime = "Aprox. 4 a 6 horas (en el día)";
    else if (totalHours <= 10) calculatedTime = "1 jornada completa (9:00 a 18:00 hs)";
    else calculatedTime = "1 a 2 días de trabajo en taller";

    timeInput.value = calculatedTime;
  }

  document.getElementById("modal-calc-breakdown").innerText =
    `Subtotal: ${formatUYU(subtotal)} ${discountAmount > 0 ? `(-${formatUYU(discountAmount)})` : ''} ${surcharge > 0 ? `(+${formatUYU(surcharge)})` : ''}`;
  document.getElementById("modal-total-display").innerHTML = `${formatUYU(total)} <span class="font-sans text-xs text-slate-500 font-medium">UYU</span>`;

  if (appState.currentLead) {
    appState.currentLead.quotedServices = selectedServiceIds;
    appState.currentLead.quotedTotal = total;
    appState.currentLead.discountAmount = discountAmount;
    appState.currentLead.category = category;
  }

  updatePreviewMessage();
}

function updateOperatorForLead() {
  if (appState.currentLead) {
    appState.currentLead.assignedTo = document.getElementById("modal-assigned-operator").value;
    updatePreviewMessage();
  }
}

function confirmDeleteLead() {
  const lead = appState.currentLead;
  if (!lead) return;

  openConfirmDeleteModal(
    `¿Eliminar tasación de ${lead.name}?`,
    "Se eliminará esta solicitud y, si tenía comisión asociada, también se quitará.",
    () => {
      appState.leads = appState.leads.filter(l => l.id !== lead.id);
      closeModalCotizador();
      saveAllAndSync();
      renderAllViews();
      showToast("Tasación eliminada");
    }
  );
}

// ================= PLANTILLAS DE WHATSAPP =================
function setMsgTemplate(templateKey) {
  appState.currentTemplateKey = templateKey;
  document.querySelectorAll(".template-tab").forEach(tab => {
    tab.classList.toggle("active", tab.dataset.templateBtn === templateKey);
  });
  updatePreviewMessage();
}

function updatePreviewMessage() {
  const lead = appState.currentLead;
  if (!lead) return;

  const operator = document.getElementById("modal-assigned-operator").value || appState.config.activeUser;
  const category = document.getElementById("modal-car-category").value || "chico";
  const checkedBoxes = Array.from(document.querySelectorAll("#modal-services-list input[type='checkbox']:checked"));
  const selectedServiceIds = checkedBoxes.map(cb => cb.value);

  const itemsDetail = selectedServiceIds.map(id => {
    const tariff = appState.tariffs.find(t => t.id === id);
    if (!tariff) return "";
    const price = tariff.prices[category] || 0;
    return `• *${tariff.shortName}:* ${formatUYU(price)} UYU`;
  }).filter(Boolean).join("\n");

  const itemsSummary = selectedServiceIds.map(id => {
    const tariff = appState.tariffs.find(t => t.id === id);
    return tariff ? tariff.shortName : "";
  }).filter(Boolean).join(" + ");

  const total = lead.quotedTotal || 0;
  const time = document.getElementById("modal-time-estimate").value || "A coordinar";
  const shopName = appState.config.shopName;
  const address = appState.config.shopAddress;

  let message = "";

  switch (appState.currentTemplateKey) {
    case "formal":
      message =
`¡Hola ${lead.name}! Te escribe ${operator} de *${shopName}* 🚗✨

Recibimos tu consulta para tu *${lead.vehicle}* y con gusto te pasamos la cotización detallada:

📋 *Servicios presupuestados:*
${itemsDetail}

⏱️ *Tiempo estimado de trabajo:* ${time}
💰 *Total Final:* *${total > 0 ? formatUYU(total) + ' UYU' : 'A confirmar'}*
💳 *Formas de pago:* Efectivo, Transferencia o Tarjetas de Crédito / Débito.

📍 *Ubicación del taller:* ${address}

¿Te gustaría que veamos disponibilidad de días para agendar tu turno esta semana?`;
      break;

    case "promo":
      message =
`¡Hola ${lead.name}! 👋 Te saluda ${operator} de *${shopName}* (Shangrilá).

Para tu *${lead.vehicle}*, el paquete completo de *${itemsSummary}* queda en un total de *${formatUYU(total)} UYU*.

🎁 *Beneficio exclusivo:* Si confirmamos el turno en las próximas 48hs, te bonificamos sin costo el sellado y acondicionado protector de gomas y plásticos exteriores.

¿Querés que te guardemos un lugar para esta semana?`;
      break;

    case "fotos":
      message =
`¡Hola ${lead.name}! ¿Cómo estás? Te escribe ${operator} de *${shopName}* 🚗

Estuvimos revisando tu solicitud para tu *${lead.vehicle}* (${itemsSummary}). 

Para darte el presupuesto más exacto y asesorarte con precisión:
📸 ¿Podrías enviarnos por acá 2 o 3 fotos o un video corto del estado actual?

Así lo evaluamos enseguida y te pasamos los números exactos. ¡Muchas gracias!`;
      break;

    case "seguimiento":
      message =
`¡Hola ${lead.name}! ¿Cómo estás? Te saluda ${operator} de *${shopName}* 🚗

Te escribo para saber si pudiste revisar el presupuesto que te enviamos para tu *${lead.vehicle}*.

Estamos cerrando la agenda de la semana y nos quedan los últimos cupos disponibles. ¿Querés que te reservemos un turno?`;
      break;

    case "turno":
      message =
`¡Excelente ${lead.name}! Turno confirmado con éxito en *${shopName}* 🗓️✅

🚗 *Vehículo:* ${lead.vehicle}
🛠️ *Trabajo a realizar:* ${itemsSummary}
💰 *Presupuesto acordado:* ${formatUYU(total)} UYU
📍 *Dirección:* ${address}

⚠️ *Recomendación:* Por favor retirar objetos personales de valor antes de ingresar el vehículo al taller.

¡Muchas gracias por confiar en nosotros! Nos vemos pronto.`;
      break;
  }

  document.getElementById("modal-whatsapp-preview").value = message;
}

function copyWhatsAppMessage() {
  const textarea = document.getElementById("modal-whatsapp-preview");
  textarea.select();
  document.execCommand("copy");

  const btnText = document.getElementById("copy-btn-text");
  btnText.innerText = "¡Copiado!";
  setTimeout(() => { btnText.innerText = "Copiar"; }, 1800);

  showToast("Mensaje copiado al portapapeles");
}

function sendViaWhatsApp() {
  const lead = appState.currentLead;
  if (!lead) return;

  const phone = sanitizePhoneForWhatsApp(lead.phone);
  const messageText = document.getElementById("modal-whatsapp-preview").value;
  const encodedText = encodeURIComponent(messageText);

  const newStatus = document.getElementById("modal-lead-status").value;
  saveLeadQuoteOnly(newStatus === "NUEVO" ? "COTIZADO" : newStatus);

  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodedText}`;
  window.open(whatsappUrl, "_blank");

  showToast("Abriendo WhatsApp...");
  closeModalCotizador();
}

function saveLeadQuoteOnly(overrideStatus) {
  const lead = appState.currentLead;
  if (!lead) return;

  const nameVal = document.getElementById("modal-lead-name-input").value.trim();
  const phoneVal = document.getElementById("modal-lead-phone-input").value.trim();
  const vehicleVal = document.getElementById("modal-lead-vehicle-input").value.trim();
  const notesVal = document.getElementById("modal-lead-notes-input").value.trim();
  const sourceVal = document.getElementById("modal-lead-source").value;
  const finalStatus = overrideStatus || document.getElementById("modal-lead-status").value;

  lead.name = nameVal || (appState.isCreatingNewManual ? "Cliente en Taller" : "Cliente");
  lead.phone = phoneVal;
  lead.vehicle = vehicleVal || "Vehículo en Taller";
  lead.customerNotes = notesVal;
  lead.source = sourceVal;
  lead.category = document.getElementById("modal-car-category").value;
  lead.status = finalStatus;
  lead.assignedTo = document.getElementById("modal-assigned-operator").value;
  lead.timeEstimate = document.getElementById("modal-time-estimate").value;

  if (finalStatus === "FINALIZADO" && !lead.completedAt) {
    lead.completedAt = getTodayISO();
  } else if (finalStatus !== "FINALIZADO") {
    lead.completedAt = "";
  }

  if (appState.isCreatingNewManual) {
    appState.leads.unshift(lead);
    appState.isCreatingNewManual = false;
  }

  saveAllAndSync();
  renderAllViews();
  showToast("Tasación guardada y sincronizada");
}

function sanitizePhoneForWhatsApp(phoneRaw) {
  if (!phoneRaw) return "";
  let digits = String(phoneRaw).replace(/\D/g, "");

  if (digits.startsWith("09") && digits.length === 9) {
    digits = "598" + digits.substring(1);
  } else if (digits.startsWith("9") && digits.length === 8) {
    digits = "598" + digits;
  }

  if (digits.length === 8 || digits.length === 9) {
    if (!digits.startsWith("598")) digits = "598" + digits;
  }

  return digits;
}

function formatPhoneForDisplay(phoneRaw) {
  if (!phoneRaw) return "Sin teléfono";
  return String(phoneRaw).trim();
}

// ================= CONFIGURACIÓN DE TARIFARIO =================
function openTarifarioModal() {
  const tbody = document.getElementById("tarifario-table-body");
  tbody.innerHTML = appState.tariffs.map(tariff => {
    return `
      <tr class="hover:bg-slate-50 transition-colors">
        <td class="py-3 px-3.5 border-b border-slate-200">
          <div class="font-display font-bold text-slate-900 text-xs">${tariff.shortName}</div>
          <div class="font-sans text-[10px] text-slate-500 mt-0.5">${tariff.description}</div>
        </td>
        <td class="py-2.5 px-1 text-center border-b border-slate-200">
          <input type="number" data-id="${tariff.id}" data-cat="chico" value="${tariff.prices.chico}" class="w-20 bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-center font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-slate-800">
        </td>
        <td class="py-2.5 px-1 text-center border-b border-slate-200">
          <input type="number" data-id="${tariff.id}" data-cat="mediano" value="${tariff.prices.mediano}" class="w-20 bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-center font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-slate-800">
        </td>
        <td class="py-2.5 px-1 text-center border-b border-slate-200">
          <input type="number" data-id="${tariff.id}" data-cat="suv" value="${tariff.prices.suv}" class="w-20 bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-center font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-slate-800">
        </td>
        <td class="py-2.5 px-1 text-center border-b border-slate-200">
          <input type="number" data-id="${tariff.id}" data-cat="pickup" value="${tariff.prices.pickup}" class="w-20 bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-center font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-slate-800">
        </td>
        <td class="py-2.5 px-1 text-center border-b border-slate-200">
          <input type="number" data-id="${tariff.id}" data-cat="moto" value="${tariff.prices.moto}" class="w-20 bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-center font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-slate-800">
        </td>
      </tr>
    `;
  }).join('');

  document.getElementById("modal-tarifario").classList.remove("hidden");
}

function closeModalTarifario() {
  document.getElementById("modal-tarifario").classList.add("hidden");
}

function saveTarifario() {
  const inputs = document.querySelectorAll("#tarifario-table-body input");
  inputs.forEach(input => {
    const id = input.dataset.id;
    const cat = input.dataset.cat;
    const val = parseFloat(input.value) || 0;

    const tariff = appState.tariffs.find(t => t.id === id);
    if (tariff && tariff.prices) {
      tariff.prices[cat] = val;
    }
  });

  saveTariffs();
  closeModalTarifario();
  showToast("Tarifario guardado y sincronizado");
  if (appState.currentLead) recalculateQuote();
}

function resetDefaultTarifario() {
  openConfirmDeleteModal(
    "¿Restablecer tarifas originales?",
    "Los precios base volverán a los valores iniciales sugeridos.",
    () => {
      appState.tariffs = JSON.parse(JSON.stringify(DEFAULT_TARIFFS));
      saveTariffs();
      openTarifarioModal();
      showToast("Tarifas restablecidas");
    }
  );
}

// ================= MODAL AJUSTES, PORCENTAJE DE COMISIÓN Y CLOUD =================
function openSettingsModal() {
  document.getElementById("setting-script-url").value = appState.config.scriptUrl || "";
  document.getElementById("setting-sheet-url").value = appState.config.sheetUrl || DEFAULT_CONFIG.sheetUrl;
  document.getElementById("setting-shop-name").value = appState.config.shopName || "DetailVlak";
  document.getElementById("setting-shop-address").value = appState.config.shopAddress || "";
  document.getElementById("setting-commission-rate").value = appState.config.commissionRate ?? 30;
  document.getElementById("modal-settings").classList.remove("hidden");
}

function closeModalSettings() {
  document.getElementById("modal-settings").classList.add("hidden");
}

function saveSettings() {
  appState.config.scriptUrl = document.getElementById("setting-script-url").value.trim();
  appState.config.sheetUrl = document.getElementById("setting-sheet-url").value.trim() || DEFAULT_CONFIG.sheetUrl;
  appState.config.shopName = document.getElementById("setting-shop-name").value.trim() || "DetailVlak";
  appState.config.shopAddress = document.getElementById("setting-shop-address").value.trim();
  appState.config.commissionRate = parseFloat(document.getElementById("setting-commission-rate").value) || 30;

  saveConfig();
  renderAllViews();
  closeModalSettings();
  showToast("Configuración guardada");
  syncGoogleSheets();
}

async function copyAppsScriptCode() {
  try {
    const resp = await fetch("google-apps-script.gs");
    const code = await resp.text();
    await navigator.clipboard.writeText(code);
    const btnText = document.getElementById("btn-copy-gas-text");
    if (btnText) {
      btnText.innerText = "¡Código Copiado al Portapapeles!";
      setTimeout(() => { btnText.innerText = "Copiar Código Google Apps Script"; }, 2500);
    }
    showToast("Código de Google Apps Script copiado");
  } catch (err) {
    showToast("Abrí el archivo google-apps-script.gs en la carpeta del proyecto", "error");
  }
}

function loadSampleData() {
  openConfirmDeleteModal(
    "¿Restaurar datos de muestra?",
    "Se cargarán las consultas y productos de ejemplo.",
    () => {
      appState.leads = JSON.parse(JSON.stringify(SAMPLE_LEADS));
      appState.stock = JSON.parse(JSON.stringify(DEFAULT_STOCK));
      saveAllAndSync();
      renderAllViews();
      closeModalSettings();
      showToast("Datos de muestra cargados");
    }
  );
}

// ================= MODAL UNIVERSAL DE CONFIRMACIÓN =================
let pendingDeleteCallback = null;

function openConfirmDeleteModal(title, desc, onConfirm) {
  setText("confirm-delete-title", title);
  setText("confirm-delete-desc", desc);
  pendingDeleteCallback = onConfirm;

  const btn = document.getElementById("btn-confirm-delete-action");
  if (btn) {
    btn.onclick = () => {
      if (typeof pendingDeleteCallback === "function") pendingDeleteCallback();
      closeConfirmDeleteModal();
    };
  }

  document.getElementById("modal-confirm-delete").classList.remove("hidden");
  lucide.createIcons();
}

function closeConfirmDeleteModal() {
  document.getElementById("modal-confirm-delete").classList.add("hidden");
  pendingDeleteCallback = null;
}

// ================= HELPERS UI =================
function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.innerText = val;
}

function showToast(message, type = "success") {
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toast-message");
  if (!toast || !toastMsg) return;

  toastMsg.innerText = message;
  toast.classList.remove("translate-y-20", "opacity-0");
  toast.classList.add("translate-y-0", "opacity-100");

  setTimeout(() => {
    toast.classList.remove("translate-y-0", "opacity-100");
    toast.classList.add("translate-y-20", "opacity-0");
  }, 3000);
}
