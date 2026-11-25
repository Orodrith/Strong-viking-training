// 1. AFTELKLOK (1 april 2027)
const targetDate = new Date("2027-04-01T09:00:00").getTime();

function updateCountdown() {
  const distance = targetDate - new Date().getTime();
  if (distance < 0) return;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / 1000 / 60) % 60);

  document.getElementById("days").innerText = days;
  document.getElementById("hours").innerText = hours;
  document.getElementById("minutes").innerText = minutes;
}
setInterval(updateCountdown, 1000);
updateCountdown();

// 2. WEEKSCHEMA & OPSLAG
const taskIds = ['task-ma', 'task-di', 'task-do', 'task-vr'];

function loadTasks() {
  const saved = JSON.parse(localStorage.getItem('sv_tasks')) || {};
  let completed = 0;

  taskIds.forEach(id => {
    const isChecked = !!saved[id];
    document.getElementById(id).checked = isChecked;
    if (isChecked) completed++;
  });

  document.getElementById('progress-text').innerText = `${completed} / 4 voltooid`;
}

function saveTasks() {
  const state = {};
  let completed = 0;

  taskIds.forEach(id => {
    const isChecked = document.getElementById(id).checked;
    state[id] = isChecked;
    if (isChecked) completed++;
  });

  localStorage.setItem('sv_tasks', JSON.stringify(state));
  document.getElementById('progress-text').innerText = `${completed} / 4 voltooid`;
}

// 3. STAAFGRAFIEK & INVOERVELDEN
const daysOfWeek = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];
let kmData = JSON.parse(localStorage.getItem('sv_km')) ||;

// Genereer de 7 invulvakjes automatisch
const inputContainer = document.getElementById('km-inputs');
daysOfWeek.forEach((day, index) => {
  inputContainer.innerHTML += `
    <div>
      <label class="block text-xs text-slate-400 mb-1">${day}</label>
      <input type="number" step="0.1" min="0" id="km-${index}" 
        oninput="updateKm(${index}, this.value)" 
        class="w-full bg-slate-900 border border-slate-700 rounded-lg p-1 text-center text-sm">
    </div>`;
});

const ctx = document.getElementById('runningChart').getContext('2d');
const runningChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: daysOfWeek,
    datasets: [{
      data: kmData,
      backgroundColor: '#f59e0b',
      borderRadius: 6
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: '#334155' }, ticks: { color: '#94a3b8' } },
      x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
    }
  }
});

function updateKm(index, value) {
  kmData[index] = parseFloat(value) || 0;
  localStorage.setItem('sv_km', JSON.stringify(kmData));
  updateChart();
}

function updateChart() {
  runningChart.data.datasets[0].data = kmData;
  runningChart.update();
  const total = kmData.reduce((a, b) => a + b, 0);
  document.getElementById('total-km').innerText = `Totaal: ${total.toFixed(1)} km`;
}

function resetWeek() {
  localStorage.removeItem('sv_tasks');
  localStorage.removeItem('sv_km');
  loadTasks();
  kmData =;
  kmData.forEach((_, i) => document.getElementById(`km-${i}`).value = '');
  updateChart();
}

// Opstarten
loadTasks();
kmData.forEach((val, i) => {
  if (val > 0) document.getElementById(`km-${i}`).value = val;
});
updateChart();
