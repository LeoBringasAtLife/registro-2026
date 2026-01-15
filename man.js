// Constantes
const STORAGE_KEY = 'year2026';
const YEAR = 2026;
const TOTAL_DAYS = 365;
const MONTH_NAMES = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic'
];
const DAY_LABELS = ['Jue', 'Vie', 'Sáb', 'Dom', 'Lun', 'Mar', 'Mié'];
const DATE_FORMAT_OPTIONS = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
};

// Data storage with localStorage
let yearData = {};
let currentEditingDate = null;

// Utilidades
function formatDate(date, options = DATE_FORMAT_OPTIONS) {
  return date.toLocaleDateString('es-ES', options);
}

function sanitizeHTML(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function validateDayData(level, note) {
  return {
    level: Math.min(Math.max(parseInt(level) || 0, 0), 4),
    note: (note || '').trim()
  };
}

function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Error al guardar datos en localStorage:', e);
    alert('No se pudo guardar los datos. Intenta nuevamente.');
    return false;
  }
}

function loadFromStorage() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch (e) {
    console.error('Error al cargar datos:', e);
    return {};
  }
}

// Initialize App
function initializeApp() {
  console.log('Cargando datos...');
  yearData = loadFromStorage();

  generateCalendar();
  updateCountdown();
  renderHistory();
  setupEventListeners();
}

// Setup event listeners with delegation
function setupEventListeners() {
  // Intensity selector delegation
  const intensityOptions = document.getElementById('intensityOptions');
  if (intensityOptions) {
    intensityOptions.addEventListener('click', (e) => {
      if (e.target.classList.contains('intensity-option')) {
        document.querySelectorAll('.intensity-option').forEach((opt) => {
          opt.classList.remove('selected');
        });
        e.target.classList.add('selected');
      }
    });
  }

  // Modal close on outside click
  const modal = document.getElementById('modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target.id === 'modal') {
        closeModal();
      }
    });
  }

  // Calendar event delegation
  const graph = document.getElementById('graph');
  if (graph) {
    graph.addEventListener('click', (e) => {
      if (e.target.classList.contains('day')) {
        openModal(e.target.dataset.date);
      }
    });
  }
}

// Generate calendar
function generateCalendar() {
  const graph = document.getElementById('graph');
  const monthsContainer = document.getElementById('months');

  if (!graph || !monthsContainer) {
    console.error('No se encontraron los contenedores del calendario');
    return;
  }

  graph.innerHTML = '';
  monthsContainer.innerHTML = '';

  // Agregar etiquetas de días
  DAY_LABELS.forEach((label) => {
    const dayLabel = document.createElement('div');
    dayLabel.className = 'day-label';
    dayLabel.textContent = label;
    graph.appendChild(dayLabel);
  });

  // Generar días y meses en una sola iteración
  let currentMonth = -1;
  const monthPositions = [];

  for (let i = 0; i < TOTAL_DAYS; i++) {
    const date = new Date(YEAR, 0, 1 + i);
    const month = date.getMonth();
    const day = date.getDate();
    const dateStr = `${YEAR}-${String(month + 1).padStart(2, '0')}-${String(
      day
    ).padStart(2, '0')}`;

    // Registrar cambios de mes
    if (month !== currentMonth) {
      currentMonth = month;
      monthPositions.push({ month, position: graph.children.length });
    }

    // Crear elemento del día
    const dayElement = document.createElement('div');
    dayElement.className = 'day';
    dayElement.dataset.date = dateStr;
    dayElement.dataset.level = yearData[dateStr]?.level || 0;
    dayElement.title = formatDate(date);

    graph.appendChild(dayElement);
  }

  // Agregar etiquetas de meses
  monthPositions.forEach(({ month }) => {
    const label = document.createElement('div');
    label.className = 'month-label';
    label.textContent = MONTH_NAMES[month];
    monthsContainer.appendChild(label);
  });
}

function openModal(dateStr) {
  currentEditingDate = dateStr;
  const modal = document.getElementById('modal');
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  document.getElementById('modalDate').textContent = formatDate(date);

  const dayOfYear =
    Math.floor((date - new Date(YEAR, 0, 1)) / (1000 * 60 * 60 * 24)) + 1;
  document.getElementById(
    'modalDayInfo'
  ).textContent = `Día ${dayOfYear} de ${TOTAL_DAYS}`;

  // Cargar datos existentes
  const data = yearData[dateStr] || { level: 0, note: '' };
  document.getElementById('noteText').value = data.note || '';

  // Establecer selección de intensidad
  document.querySelectorAll('.intensity-option').forEach((opt) => {
    opt.classList.remove('selected');
    if (parseInt(opt.dataset.level) === parseInt(data.level)) {
      opt.classList.add('selected');
    }
  });

  modal.classList.add('active');
}

function closeModal() {
  document.getElementById('modal').classList.remove('active');
  currentEditingDate = null;
}

function saveDay() {
  if (!currentEditingDate) return;

  const level =
    document.querySelector('.intensity-option.selected')?.dataset.level || 0;
  const note = document.getElementById('noteText').value;

  // Validar datos antes de guardar
  const dayData = validateDayData(level, note);

  // Guardar en localStorage
  yearData[currentEditingDate] = dayData;
  if (!saveToStorage(yearData)) {
    return; // Si falla el guardado, no continuar
  }

  // Actualizar visual
  const dayElement = document.querySelector(
    `[data-date="${currentEditingDate}"]`
  );
  if (dayElement) {
    dayElement.dataset.level = dayData.level;
  }

  closeModal();
  renderHistory();
}

function renderHistory() {
  const historyContainer = document.getElementById('activityHistory');
  if (!historyContainer) return;

  historyContainer.innerHTML = '';

  const entries = Object.entries(yearData)
    .filter(
      ([_, data]) => (data.note && data.note.trim() !== '') || data.level > 0
    )
    .sort((a, b) => b[0].localeCompare(a[0]));

  if (entries.length === 0) {
    const noActivityMsg = document.createElement('p');
    noActivityMsg.className = 'no-activity';
    noActivityMsg.textContent = 'Aún no hay actividades registradas.';
    historyContainer.appendChild(noActivityMsg);
    return;
  }

  entries.forEach(([dateStr, data]) => {
    // Parsear fecha manualmente para evitar problemas de zona horaria
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const formattedDate = formatDate(date);

    // Crear elemento de actividad de forma segura
    const item = document.createElement('div');
    item.className = 'activity-item';

    const header = document.createElement('div');
    header.className = 'activity-header';

    const dateSpan = document.createElement('span');
    dateSpan.className = 'activity-date';
    dateSpan.textContent = formattedDate;

    const badge = document.createElement('span');
    badge.className = 'activity-level-badge';
    badge.dataset.level = data.level;

    header.appendChild(dateSpan);
    header.appendChild(badge);

    const noteDiv = document.createElement('div');
    noteDiv.className = 'activity-note';

    if (data.note && data.note.trim() !== '') {
      noteDiv.innerHTML = sanitizeHTML(data.note).replace(/\n/g, '<br>');
    } else {
      const sinNota = document.createElement('span');
      sinNota.style.color = '#8b949e';
      sinNota.style.fontStyle = 'italic';
      sinNota.textContent = 'Sin nota';
      noteDiv.appendChild(sinNota);
    }

    item.appendChild(header);
    item.appendChild(noteDiv);
    historyContainer.appendChild(item);
  });
}

function updateCountdown() {
  const countdownEl = document.getElementById('countdown');
  if (!countdownEl) return;

  // Obtener fecha actual en UTC-3 (Argentina)
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const argentinaTime = new Date(utc - 3 * 60 * 60 * 1000);

  // Fin del año 2026 a las 23:59:59
  const endOfYear = new Date(YEAR, 11, 31, 23, 59, 59);

  // Calcular diferencia en milisegundos
  const diff = endOfYear - argentinaTime;

  // Convertir a días
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days > 1) {
    countdownEl.textContent = `Faltan ${days} días para finalizar el año`;
  } else if (days === 1) {
    countdownEl.textContent = '¡Mañana es el último día del año!';
  } else if (days === 0) {
    countdownEl.textContent = '¡Hoy es el último día del año!';
  } else {
    countdownEl.textContent = '¡Feliz año nuevo!';
  }
}

// Initialize
console.log('Iniciando aplicación...');
initializeApp();
