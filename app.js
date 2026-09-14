/**
 * DetailVlak - Sistema de Tasación Automática & Gestión de Turnos
 * Estética Monocromática Oficial CarVlak (Instrument Sans + Piazzolla + Plus Jakarta Sans)
 * Diseñado para Maximiliano & Romina
 */

// ================= ESTADO GLOBAL =================
const DEFAULT_CONFIG = {
  shopName: "DetailVlak",
  shopAddress: "Av. Giannattasio y, 15000 Shangrilá, Canelones",
  sheetUrl: "https://docs.google.com/spreadsheets/d/1CCKm7B1q3YtC85SUp5Ub25u4t1DRhZ_0rlyHWCRurgg/edit?resourcekey=&gid=2130104281#gid=2130104281",
  activeUser: "Maximiliano"
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
    prices: { chico: 5000, mediano: 6200, suv: 7500, pickup: 9000, moto: 3500 }
  },
  {
    id: "ceramico",
    name: "Tratamiento Cerámico o Acrílico (Vidrio líquido / protección de larga duración)",
    shortName: "Tratamiento Cerámico (Vidrio Líquido)",
    description: "Aplicación de coating cerámico nanotecnológico con protección de 1 a 3 años, repelencia extrema y brillo hidrofóbico.",
    durationHours: 10,
    prices: { chico: 10000, mediano: 12500, suv: 15000, pickup: 18000, moto: 6500 }
  },
  {
    id: "llantas",
    name: "Limpieza y sellado de llantas y pasarruedas",
    shortName: "Sellado de llantas y pasarruedas",
    description: "Descontaminación férrica profunda y sellado térmico antiadherente de polvo de freno.",
    durationHours: 2,
    prices: { chico: 1200, mediano: 1200, suv: 1500, pickup: 1500, moto: 900 }
  }
];

const SAMPLE_LEADS = [
  {
    id: "lead-1",
    timestamp: "2026-09-09 14:22:10",
    name: "Federico Cabrera",
    phone: "099123456",
    vehicle: "Volkswagen Golf 1.4 TSI 2018",
    color: "Gris Platino",
    category: "chico",
    requestedServices: [
      "Limpieza profunda de interiores (Tapizados, alfombras, techo, paneles y desinfección)",
      "Lavado y detallado técnico de motor (Vapor / dieléctrico + acondicionador de plásticos)"
    ],
    customerNotes: "Tiene unas manchas de café en los asientos delanteros y un poco de barro en el piso del conductor.",
    preferredDate: "Esta semana / Lo antes posible",
    source: "Instagram Reels",
    status: "NUEVO",
    assignedTo: "Maximiliano",
    quotedServices: [],
    quotedTotal: 0,
    discountAmount: 0,
    timeEstimate: "",
    internalNotes: ""
  },
  {
    id: "lead-2",
    timestamp: "2026-09-09 15:45:00",
    name: "Mariana Silva",
    phone: "094987654",
    vehicle: "Toyota Hilux 4x4 2021",
    color: "Blanca",
    category: "pickup",
    requestedServices: [
      "Limpieza profunda de interiores (Tapizados, alfombras, techo, paneles y desinfección)",
      "Tratamiento Cerámico o Acrílico (Vidrio líquido / protección de larga duración)",
      "Lavado y detallado técnico de motor (Vapor / dieléctrico + acondicionador de plásticos)"
    ],
    customerNotes: "Uso la camioneta para ir al campo. El interior está con polvo y quiero proteger la pintura porque duerme afuera.",
    preferredDate: "Próximas 2 semanas",
    source: "TikTok",
    status: "COTIZADO",
    assignedTo: "Romina",
    quotedServices: ["interior", "motor", "ceramico"],
    quotedTotal: 23400,
    discountAmount: 2600,
    timeEstimate: "2 días de trabajo",
    internalNotes: "Le ofrecí 10% de descuento combo interior + cerámico."
  },
  {
    id: "lead-3",
    timestamp: "2026-09-09 16:10:35",
    name: "Gonzalo Méndez",
    phone: "098555123",
    vehicle: "Chevrolet Tracker Premier 2022",
    color: "Azul Eclipse",
    category: "suv",
    requestedServices: [
      "Pulido y restauración de ópticas / faros (Lijado + pulido + protección UV)",
      "Pulido / Corrección de pintura (Eliminación de microrayones / swirls)"
    ],
    customerNotes: "Tiene rayas suaves en el capot y una óptica opaca.",
    preferredDate: "Lo antes posible",
    source: "YouTube Shorts",
    status: "NUEVO",
    assignedTo: "Maximiliano",
    quotedServices: [],
    quotedTotal: 0,
    discountAmount: 0,
    timeEstimate: "",
    internalNotes: ""
  }
];

// Variables en memoria
let appState = {
  config: { ...DEFAULT_CONFIG },
  tariffs: [...DEFAULT_TARIFFS],
  leads: [],
  activeFilter: "ALL",
  activeOpFilter: "ALL",
  currentLead: null,
  currentTemplateKey: "formal"
};

// ================= INICIALIZACIÓN =================
document.addEventListener("DOMContentLoaded", () => {
  loadStoredData();
  applyActiveUserUI();
  renderLeads();
  updateStats();

  // Intentar sincronización inicial silenciosa
  syncGoogleSheets(true);
});

// Guardar / Cargar en LocalStorage
function loadStoredData() {
  try {
    const savedConfig = localStorage.getItem("detailvlak_config");
    if (savedConfig) {
      appState.config = { ...DEFAULT_CONFIG, ...JSON.parse(savedConfig) };
      // Migración automática si la URL guardada en el dispositivo corresponde a la pestaña anterior
      if (appState.config.sheetUrl && (appState.config.sheetUrl.includes("1975903270") || !appState.config.sheetUrl.includes("2130104281"))) {
        appState.config.sheetUrl = DEFAULT_CONFIG.sheetUrl;
        saveConfig();
      }
    } else {
      appState.config = { ...DEFAULT_CONFIG };
      saveConfig();
    }

    const savedTariffs = localStorage.getItem("detailvlak_tariffs");
    if (savedTariffs) appState.tariffs = JSON.parse(savedTariffs);

    const savedLeads = localStorage.getItem("detailvlak_leads");
    if (savedLeads) {
      appState.leads = JSON.parse(savedLeads);
    } else {
      appState.leads = [...SAMPLE_LEADS];
      saveLeads();
    }
  } catch (e) {
    console.error("Error al cargar localStorage:", e);
    appState.leads = [...SAMPLE_LEADS];
  }
}

function saveConfig() {
  localStorage.setItem("detailvlak_config", JSON.stringify(appState.config));
}

function saveTariffs() {
  localStorage.setItem("detailvlak_tariffs", JSON.stringify(appState.tariffs));
}

function saveLeads() {
  localStorage.setItem("detailvlak_leads", JSON.stringify(appState.leads));
}

// ================= OPERADORES (MAXIMILIANO / ROMINA) =================
function setActiveUser(userName) {
  appState.config.activeUser = userName;
  saveConfig();
  applyActiveUserUI();
  showToast(`Operador activo: ${userName}`);
  if (appState.currentLead) {
    updatePreviewMessage();
  }
}

function applyActiveUserUI() {
  const isMaxi = appState.config.activeUser === "Maximiliano";
  const isRomi = appState.config.activeUser === "Romina";

  // Cambiar tema de la app: "romina" (negro y rosa) o "maxi" (monocromático blanco y negro)
  document.documentElement.setAttribute("data-operator", isRomi ? "romina" : "maxi");

  const btnMaxi = document.getElementById("btn-user-maxi");
  const btnRomi = document.getElementById("btn-user-romi");

  if (btnMaxi && btnRomi) {
    btnMaxi.classList.toggle("active", isMaxi);
    btnRomi.classList.toggle("active", isRomi);
  }

  // Re-renderizar lista para actualizar chips y acentos
  renderLeads();
}

// ================= SINCRONIZACIÓN CON GOOGLE SHEETS =================
async function syncGoogleSheets(isSilent = false) {
  const icon = document.getElementById("icon-sync");
  if (icon) icon.classList.add("animate-spin");

  const sheetUrl = appState.config.sheetUrl;
  const noticeBanner = document.getElementById("sheet-notice-banner");
  const statusText = document.getElementById("sheet-status-text");

  // Extraer Spreadsheet ID y GID
  const idMatch = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
  const gidMatch = sheetUrl.match(/[#&?]gid=([0-9]+)/);

  const spreadsheetId = idMatch ? idMatch[1] : null;
  const gid = gidMatch ? gidMatch[1] : "0";

  if (!spreadsheetId) {
    if (!isSilent) showToast("Enlace de Google Sheets inválido", "error");
    if (icon) icon.classList.remove("animate-spin");
    return;
  }

  // Endpoints públicos de exportación CSV de Google Sheets
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
    } catch (err) {
      // Intentar el siguiente endpoint
    }
  }

  if (icon) icon.classList.remove("animate-spin");

  if (csvText && csvText.trim().length > 0) {
    parseGoogleSheetsCSV(csvText);
    if (noticeBanner) noticeBanner.classList.add("hidden");
    if (!isSilent) showToast("¡Respuestas de Google Forms sincronizadas!");
    renderLeads();
    updateStats();
  } else {
    if (noticeBanner && statusText) {
      noticeBanner.classList.remove("hidden");
      statusText.innerHTML = `La hoja de Google Sheets está en modo <strong>Restringido</strong>. Para sincronizar en vivo con un clic, configurala como <em>"Cualquier persona con el vínculo puede ser Lector"</em>.`;
    }
    if (!isSilent) {
      openSheetGuideModal();
    }
  }
}

function parseGoogleSheetsCSV(csvText) {
  const rows = parseCSVToArray(csvText);
  if (rows.length < 2) return;

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
    if (!row || row.length === 0 || !row[colName] || row[colName].trim() === "") continue;

    const name = (row[colName] || "").trim();
    const phone = (row[colPhone] || "").trim();
    const vehicle = (colVehicle !== -1 ? row[colVehicle] : "Vehículo no especificado").trim();
    const timestamp = (colTimestamp !== -1 ? row[colTimestamp] : new Date().toISOString()).trim();

    const leadId = "lead-" + btoa(encodeURIComponent(name + phone + timestamp)).replace(/[^a-zA-Z0-9]/g, "").slice(0, 16);
    const existingLead = appState.leads.find(l => l.id === leadId);

    const rawCategory = colCategory !== -1 ? (row[colCategory] || "") : "";
    const category = normalizeCarCategory(rawCategory);

    const rawServices = colServices !== -1 ? (row[colServices] || "") : "";
    const requestedServices = rawServices.split(/[,;\n]/).map(s => s.trim()).filter(s => s.length > 0);

    const customerNotes = colNotes !== -1 ? (row[colNotes] || "").trim() : "";
    const preferredDate = colDate !== -1 ? (row[colDate] || "").trim() : "";
    const source = colSource !== -1 ? (row[colSource] || "").trim() : "Google Form";
    const color = colColor !== -1 ? (row[colColor] || "").trim() : "";

    if (!existingLead) {
      newCount++;
      appState.leads.unshift({
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
        internalNotes: ""
      });
    }
  }

  saveLeads();
  if (newCount > 0) {
    showToast(`Se incorporaron ${newCount} nuevas consultas.`);
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

// ================= RENDERIZADO DE LEADS & FILTROS =================
function setStatusFilter(status) {
  appState.activeFilter = status;
  document.querySelectorAll(".filter-pill").forEach(pill => {
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

function renderLeads() {
  const container = document.getElementById("leads-container");
  const emptyState = document.getElementById("empty-state");
  const searchInput = document.getElementById("search-input").value.toLowerCase().trim();

  if (!container) return;

  const filtered = appState.leads.filter(lead => {
    if (appState.activeFilter !== "ALL" && lead.status !== appState.activeFilter) return false;
    if (appState.activeOpFilter !== "ALL" && lead.assignedTo !== appState.activeOpFilter) return false;

    if (searchInput) {
      const matchName = lead.name.toLowerCase().includes(searchInput);
      const matchVehicle = lead.vehicle.toLowerCase().includes(searchInput);
      const matchPhone = lead.phone.toLowerCase().includes(searchInput);
      const matchServices = lead.requestedServices.join(" ").toLowerCase().includes(searchInput);
      if (!matchName && !matchVehicle && !matchPhone && !matchServices) return false;
    }

    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = "";
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  container.innerHTML = filtered.map(lead => {
    const isNew = lead.status === "NUEVO";
    const statusBadge = getStatusBadge(lead.status);
    const categoryBadge = getCategoryBadge(lead.category);

    return `
      <div class="lead-card rounded-2xl p-4 flex flex-col justify-between gap-3 border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all">
        
        <!-- Header Tarjeta -->
        <div>
          <div class="flex items-start justify-between gap-2 mb-2">
            <div>
              <div class="flex items-center gap-1.5 mb-0.5">
                <span class="text-[9px] font-display font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${lead.source && lead.source.includes('Presencial') ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 border border-slate-200'}">
                  ${lead.source && lead.source.includes('Presencial') ? '🏬 Taller' : '📋 Form'}
                </span>
                ${isNew ? '<span class="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>' : ''}
              </div>
              <h3 class="font-display font-bold text-slate-900 text-sm">
                ${lead.name}
              </h3>
              <p class="text-[11px] font-mono text-slate-500 mt-0.5">${formatPhoneForDisplay(lead.phone)}</p>
            </div>
            ${statusBadge}
          </div>

          <!-- Info Vehículo -->
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

          <!-- Chips de Servicios Solicitados -->
          <div class="space-y-1 mt-2">
            <span class="text-[9px] font-display uppercase font-extrabold text-slate-400 tracking-wider">Servicios solicitados:</span>
            <div class="flex flex-wrap gap-1">
              ${lead.requestedServices.map(s => `
                <span class="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-sans text-slate-800 font-medium">
                  ${cleanServiceName(s)}
                </span>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Footer Tarjeta -->
        <div class="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          
          <div class="flex items-center gap-2 text-[11px] font-display">
            <span class="w-2 h-2 rounded-full ${lead.assignedTo === 'Romina' ? 'bg-[#E11D48]' : 'bg-slate-900'}"></span>
            <span class="font-bold text-slate-700">${lead.assignedTo || 'Sin asignar'}</span>
            ${lead.quotedTotal > 0 ? `<span class="font-serif font-black text-slate-900 ml-1 text-sm">$${lead.quotedTotal.toLocaleString('es-UY')}</span>` : ''}
          </div>

          <!-- Botón de Acción dinámico -->
          <button onclick="openModalCotizador('${lead.id}')" class="btn-action-primary px-3.5 py-1.5 active:scale-95 font-display font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition">
            <i data-lucide="calculator" class="w-3.5 h-3.5"></i>
            <span>${lead.quotedTotal > 0 ? 'Ver Cotización' : 'Cotizar'}</span>
          </button>

        </div>

      </div>
    `;
  }).join('');

  lucide.createIcons();
}

function cleanServiceName(name) {
  return name.replace(/\([^)]*\)/g, "").trim();
}

function getStatusBadge(status) {
  switch (status) {
    case "NUEVO":
      return `<span class="px-2.5 py-0.5 rounded-full text-[9px] font-display font-extrabold uppercase tracking-widest bg-amber-50 text-amber-800 border border-amber-200">Por Cotizar</span>`;
    case "COTIZADO":
      return `<span class="px-2.5 py-0.5 rounded-full text-[9px] font-display font-extrabold uppercase tracking-widest bg-purple-50 text-purple-800 border border-purple-200">Cotizado</span>`;
    case "TURNO":
      return `<span class="brand-badge px-2.5 py-0.5 rounded-full text-[9px] font-display font-extrabold uppercase tracking-widest font-black shadow-sm">Turno Agendado</span>`;
    case "FINALIZADO":
      return `<span class="px-2.5 py-0.5 rounded-full text-[9px] font-display font-extrabold uppercase tracking-widest bg-slate-100 text-slate-700 border border-slate-200">Finalizado</span>`;
    case "CANCELADO":
      return `<span class="px-2.5 py-0.5 rounded-full text-[9px] font-display font-extrabold uppercase tracking-widest bg-slate-100 text-slate-400 border border-slate-200">Cancelado</span>`;
    default:
      return `<span class="px-2.5 py-0.5 rounded-full text-[9px] font-display font-bold uppercase bg-slate-100 text-slate-700">${status}</span>`;
  }
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
  const totalMonto = appState.leads.reduce((acc, curr) => acc + (curr.quotedTotal || 0), 0);

  document.getElementById("stat-total").innerText = total;
  document.getElementById("stat-nuevos").innerText = nuevos;
  document.getElementById("stat-cotizados").innerText = cotizados;
  document.getElementById("stat-turnos").innerText = turnos;
  document.getElementById("stat-monto").innerText = "$" + totalMonto.toLocaleString("es-UY");
}

// ================= MODAL DE COTIZACIÓN & MOTOR DE TASACIÓN =================
function openNewManualQuote() {
  const newLead = {
    id: "manual-" + Date.now(),
    timestamp: new Date().toLocaleString("es-UY"),
    name: "",
    phone: "",
    vehicle: "",
    color: "",
    category: "chico",
    requestedServices: ["Limpieza profunda de interiores (Tapizados, alfombras, techo, paneles y desinfección)"],
    customerNotes: "",
    preferredDate: "A coordinar",
    source: "Presencial / Taller",
    status: "COTIZADO",
    assignedTo: appState.config.activeUser,
    quotedServices: ["interior"],
    quotedTotal: 0,
    discountAmount: 0,
    timeEstimate: "",
    internalNotes: ""
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
            <span class="font-serif font-black text-slate-900 text-xs">$${price.toLocaleString('es-UY')}</span>
          </div>
          <p class="font-sans text-[10px] text-slate-500 line-clamp-1 mt-0.5">${tariff.description}</p>
        </div>
      </label>
    `;
  }).join('');
}

function detectServicesFromLead(lead) {
  const matched = [];
  const reqText = lead.requestedServices.join(" ").toLowerCase();

  appState.tariffs.forEach(tariff => {
    const key = tariff.shortName.toLowerCase();
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
    `Subtotal: $${subtotal.toLocaleString('es-UY')} ${discountAmount > 0 ? `(-$${discountAmount.toLocaleString('es-UY')})` : ''} ${surcharge > 0 ? `(+$${surcharge.toLocaleString('es-UY')})` : ''}`;
  document.getElementById("modal-total-display").innerHTML = `$${total.toLocaleString('es-UY')} <span class="font-sans text-xs text-mono-400 font-medium">UYU</span>`;

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
    return `• *${tariff.shortName}:* $${price.toLocaleString('es-UY')} UYU`;
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
💰 *Total Final:* *${total > 0 ? '$' + total.toLocaleString('es-UY') + ' UYU' : 'A confirmar'}*
💳 *Formas de pago:* Efectivo, Transferencia o Tarjetas de Crédito / Débito.

📍 *Ubicación del taller:* ${address}

¿Te gustaría que veamos disponibilidad de días para agendar tu turno esta semana?`;
      break;

    case "promo":
      message =
`¡Hola ${lead.name}! 👋 Te saluda ${operator} de *${shopName}* (Shangrilá).

Para tu *${lead.vehicle}*, el paquete completo de *${itemsSummary}* queda en un total de *$${total.toLocaleString('es-UY')} UYU*.

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
💰 *Presupuesto acordado:* $${total.toLocaleString('es-UY')} UYU
📍 *Dirección:* ${address}

⚠️ *Recomendación:* Por favor retirar objetos personales de valor antes de ingresar el vehículo al taller.

¡Muchas gracias por confiar en nosotros! Nos vemos pronto.`;
      break;
  }

  document.getElementById("modal-whatsapp-preview").value = message;
}

// ================= ACCIONES DE ENVÍO Y COPIADO =================
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

  lead.name = nameVal || (appState.isCreatingNewManual ? "Cliente en Taller" : "Cliente");
  lead.phone = phoneVal;
  lead.vehicle = vehicleVal || "Vehículo en Taller";
  lead.customerNotes = notesVal;
  lead.source = sourceVal;
  lead.category = document.getElementById("modal-car-category").value;
  lead.status = overrideStatus || document.getElementById("modal-lead-status").value;
  lead.assignedTo = document.getElementById("modal-assigned-operator").value;
  lead.timeEstimate = document.getElementById("modal-time-estimate").value;

  // Si es una tasación manual creada desde el botón, agregarla al tablero
  if (appState.isCreatingNewManual) {
    appState.leads.unshift(lead);
    appState.isCreatingNewManual = false;
  }

  saveLeads();
  renderLeads();
  updateStats();
  showToast("Tasación guardada en el tablero");
}

function sanitizePhoneForWhatsApp(phoneRaw) {
  if (!phoneRaw) return "";
  let digits = phoneRaw.replace(/\D/g, "");

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
  return phoneRaw.trim();
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
  showToast("Tarifario guardado correctamente");
  if (appState.currentLead) recalculateQuote();
}

function resetDefaultTarifario() {
  if (confirm("¿Deseas restablecer las tarifas sugeridas originales?")) {
    appState.tariffs = JSON.parse(JSON.stringify(DEFAULT_TARIFFS));
    saveTariffs();
    openTarifarioModal();
    showToast("Tarifas restablecidas");
  }
}

// ================= MODAL AJUSTES Y NEGOCIO =================
function openSettingsModal() {
  document.getElementById("setting-sheet-url").value = appState.config.sheetUrl;
  document.getElementById("setting-shop-name").value = appState.config.shopName;
  document.getElementById("setting-shop-address").value = appState.config.shopAddress;
  document.getElementById("modal-settings").classList.remove("hidden");
}

function closeModalSettings() {
  document.getElementById("modal-settings").classList.add("hidden");
}

function saveSettings() {
  appState.config.sheetUrl = document.getElementById("setting-sheet-url").value.trim();
  appState.config.shopName = document.getElementById("setting-shop-name").value.trim();
  appState.config.shopAddress = document.getElementById("setting-shop-address").value.trim();

  saveConfig();
  closeModalSettings();
  showToast("Configuración guardada");
  syncGoogleSheets();
}

function openSheetGuideModal() {
  openSettingsModal();
}

function loadSampleData() {
  appState.leads = JSON.parse(JSON.stringify(SAMPLE_LEADS));
  saveLeads();
  renderLeads();
  updateStats();
  closeModalSettings();
  showToast("5 consultas de prueba cargadas");
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
  }, 2800);
}
