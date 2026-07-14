// app.js - Core logic for FIFA 2026 GenAI Hub

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initThemeToggle();
  initCharts();
  initAI();
});

/* --- UI Navigation --- */
function initNavigation() {
  const navBtns = document.querySelectorAll('.nav-btn');
  const sections = document.querySelectorAll('.view-section');
  const pageTitle = document.getElementById('pageTitle');

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update title
      pageTitle.textContent = btn.textContent.trim();

      // Show section
      const targetId = `view-${btn.dataset.target}`;
      sections.forEach(sec => {
        sec.classList.remove('active');
        if(sec.id === targetId) sec.classList.add('active');
      });
    });
  });
}

/* --- Theme Management --- */
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggle');
  const htmlEl = document.documentElement;
  
  // Check local storage or system preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    htmlEl.setAttribute('data-theme', 'dark');
  } else if (!savedTheme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    htmlEl.setAttribute('data-theme', 'dark');
  }

  toggleBtn.addEventListener('click', () => {
    const isDark = htmlEl.getAttribute('data-theme') === 'dark';
    if (isDark) {
      htmlEl.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      htmlEl.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
    
    // Update chart colors on theme switch
    if (window.flowChartInstance) {
      const isD = htmlEl.getAttribute('data-theme') === 'dark';
      const color = isD ? '#27272a' : '#e4e4e7';
      const textColor = isD ? '#a1a1aa' : '#71717a';
      window.flowChartInstance.options.scales.x.grid.color = color;
      window.flowChartInstance.options.scales.y.grid.color = color;
      window.flowChartInstance.options.scales.x.ticks.color = textColor;
      window.flowChartInstance.options.scales.y.ticks.color = textColor;
      window.flowChartInstance.update();
    }
  });
}

/* --- Chart.js Minimalist Integration --- */
function initCharts() {
  const ctx = document.getElementById('flowChart');
  if (!ctx) return;

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const gridColor = isDark ? '#27272a' : '#e4e4e7';
  const textColor = isDark ? '#a1a1aa' : '#71717a';

  window.flowChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30', '13:45', '14:00 (Now)'],
      datasets: [
        {
          label: 'MetLife Stadium (pax/min)',
          data: [120, 150, 280, 450, 800, 1200, 1350, 950, 600],
          borderColor: '#10b981',
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 0,
          pointHitRadius: 10
        },
        {
          label: 'SoFi Stadium (pax/min)',
          data: [80, 95, 120, 200, 310, 450, 800, 1100, 1400],
          borderColor: document.documentElement.getAttribute('data-theme') === 'dark' ? '#fafafa' : '#18181b',
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 0,
          pointHitRadius: 10,
          borderDash: [5, 5]
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: isDark ? '#18181b' : '#ffffff',
          titleColor: isDark ? '#fafafa' : '#18181b',
          bodyColor: isDark ? '#a1a1aa' : '#71717a',
          borderColor: isDark ? '#27272a' : '#e4e4e7',
          borderWidth: 1,
          padding: 12,
          displayColors: false,
        }
      },
      scales: {
        x: {
          grid: { color: gridColor, drawBorder: false },
          ticks: { color: textColor, font: { family: 'Inter', size: 11 } }
        },
        y: {
          grid: { color: gridColor, drawBorder: false },
          ticks: { color: textColor, font: { family: 'Inter', size: 11 } },
          beginAtZero: true
        }
      }
    }
  });
}

/* --- GenAI Assistant & Settings --- */
function initAI() {
  const modal = document.getElementById('settingsModal');
  const openBtn = document.getElementById('openSettingsBtn');
  const closeBtn = document.getElementById('closeModalBtn');
  const saveBtn = document.getElementById('saveSettingsBtn');
  const keyInput = document.getElementById('apiKeyInput');

  // Load saved key
  const savedKey = localStorage.getItem('geminiApiKey');
  if (savedKey) keyInput.value = savedKey;

  // Modal logic
  openBtn.addEventListener('click', () => modal.classList.add('active'));
  closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  saveBtn.addEventListener('click', () => {
    localStorage.setItem('geminiApiKey', keyInput.value.trim());
    modal.classList.remove('active');
    addChatMessage('Settings saved. ' + (keyInput.value ? 'GenAI active.' : 'Using local fallback engine.'), 'ai');
  });

  // Chat logic
  const chatInput = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendBtn');

  const sendMessage = async () => {
    const text = chatInput.value.trim();
    if (!text) return;

    addChatMessage(text, 'user');
    chatInput.value = '';

    const typingId = 'typing-' + Date.now();
    addChatMessage('...', 'ai', typingId);

    const apiKey = localStorage.getItem('geminiApiKey');
    if (apiKey) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `You are an AI Operations Assistant for FIFA 2026. Be concise, professional, and minimalist. User asks: ${text}` }] }]
          })
        });
        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Error parsing response.";
        updateChatMessage(typingId, reply);
      } catch (e) {
        updateChatMessage(typingId, "API Error. Check your key in Settings.");
      }
    } else {
      // Local fallback
      setTimeout(() => {
        updateChatMessage(typingId, getFallbackResponse(text));
      }, 800);
    }
  };

  sendBtn.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
}

function addChatMessage(text, type, id = null) {
  const chatBody = document.getElementById('chatBody');
  const msg = document.createElement('div');
  msg.className = `message ${type}`;
  msg.textContent = text;
  if (id) msg.id = id;
  chatBody.appendChild(msg);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function updateChatMessage(id, newText) {
  const msg = document.getElementById(id);
  if (msg) {
    // format simple bold text (**text**)
    msg.innerHTML = newText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  }
}

function getFallbackResponse(query) {
  const lower = query.toLowerCase();
  if (lower.includes('crowd') || lower.includes('density')) {
    return "Zone 3 (Fanzone South) is currently elevated at **4.8 p/m²**. Redirecting flow to North Gate recommended.";
  }
  if (lower.includes('transport') || lower.includes('bus') || lower.includes('train')) {
    return "JFK Airport Express is on time. Stadium Shuttle Loop C is experiencing a 12-minute delay due to heavy traffic.";
  }
  if (lower.includes('match') || lower.includes('score')) {
    return "Live match data is currently running locally. MetLife Stadium attendance: 84,291.";
  }
  return "I am the NexGen AI Operations Assistant. Please enter a valid API key in Settings for advanced GenAI reasoning.";
}
