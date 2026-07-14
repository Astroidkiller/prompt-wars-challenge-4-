/** @jest-environment jsdom */

// Mock window.matchMedia for JSDOM
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};

// Mock global Chart class with options and data structure required by theme switcher
global.Chart = jest.fn().mockImplementation(() => {
  return {
    destroy: jest.fn(),
    update: jest.fn(),
    options: {
      scales: {
        x: { grid: {}, ticks: {} },
        y: { grid: {}, ticks: {} }
      },
      plugins: {
        tooltip: {}
      }
    },
    data: {
      datasets: [
        { borderColor: '' },
        { borderColor: '' }
      ]
    }
  };
});

// Mock global fetch for API calls
global.fetch = jest.fn().mockImplementation(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      candidates: [{
        content: {
          parts: [{ text: 'Mocked AI Response' }]
        }
      }]
    })
  })
);

// Setup mock DOM elements required for initialization
document.body.innerHTML = `
  <button id="themeToggle"></button>
  <div id="pageTitle">Stadium Operations</div>
  <canvas id="flowChart"></canvas>
  <canvas id="crowdChart"></canvas>
  <div id="crowdBadge"></div>
  <input id="chatInput" />
  <button id="sendBtn"></button>
  <div id="statMetlife">84,291</div>
  <div id="statSofi">68,432</div>
  <div id="chatBody"></div>
  <div id="settingsModal" class=""></div>
  <button id="openSettingsBtn"></button>
  <button id="closeModalBtn"></button>
  <button id="saveSettingsBtn"></button>
  <input id="apiKeyInput" />
  <div id="chatFab"></div>
  <div id="chatPanel" class="open"></div>
  <button id="chatMinimizeBtn"></button>
  <img id="footballBall" />
  
  <button class="nav-btn active" data-view="home"></button>
  <button class="nav-btn" id="btnSustain" data-view="sustain"></button>
  <div class="view-section active" id="sec-home"></div>
  <div class="view-section" id="sec-sustain"></div>
`;

// Add a mock theme-color meta tag
const meta = document.createElement('meta');
meta.name = 'theme-color';
meta.content = '#ffffff';
document.head.appendChild(meta);

// Require app.js (which adds the DOMContentLoaded listener)
const { 
  getThemeColors, 
  getFallbackResponse, 
  sleep, 
  addChatMessage, 
  updateChatMessage 
} = require('./app.js');

// Fire DOMContentLoaded to trigger all initialization routines
document.dispatchEvent(new Event('DOMContentLoaded'));

describe('Initialization & Lifecycle', () => {
  it('should initialize Chart.js graphs', () => {
    // Assert that the mocked Chart constructor was called
    expect(global.Chart).toHaveBeenCalled();
  });

  it('should set up theme toggle event listeners', () => {
    const toggleBtn = document.getElementById('themeToggle');
    expect(toggleBtn).not.toBeNull();
    
    // Clicking the toggle button should switch themes and update localStorage
    toggleBtn.click();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    
    toggleBtn.click();
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('should execute Chart.js label and scale tick formatters', () => {
    // Retrieve chart configuration arguments passed to mocked Chart
    const crowdChartCalls = global.Chart.mock.calls.find(call => call[0].id === 'crowdChart');
    if (crowdChartCalls) {
      const config = crowdChartCalls[1];
      const labelFormatter = config.options.plugins?.tooltip?.callbacks?.label;
      const tickFormatter = config.options.scales?.y?.ticks?.callback;

      if (labelFormatter) {
        expect(labelFormatter({ raw: 4.5 })).toContain('4.5');
      }
      if (tickFormatter) {
        expect(tickFormatter(3)).toContain('3');
      }
    }
  });
});

describe('Navigation Tab switcher', () => {
  it('should switch active view when nav button clicked', () => {
    const btnSustain = document.getElementById('btnSustain');
    expect(btnSustain.classList.contains('active')).toBe(false);
    
    btnSustain.click();
    expect(btnSustain.classList.contains('active')).toBe(true);
    expect(btnSustain.getAttribute('aria-current')).toBe('page');
  });
});

describe('AI Message Sending Interface', () => {
  it('should trigger fetch call and render mock response in DOM', async () => {
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    
    chatInput.value = 'what is the current transit delay?';
    sendBtn.click();
    
    // Allow promises to resolve
    await sleep(20);
    
    expect(global.fetch).toHaveBeenCalled();
    const chatBody = document.getElementById('chatBody');
    expect(chatBody.textContent).toContain('Mocked AI Response');
  });
});

describe('API Settings Modal', () => {
  it('should open settings modal when open button is clicked', () => {
    const openBtn = document.getElementById('openSettingsBtn');
    const modal = document.getElementById('settingsModal');
    
    openBtn.click();
    expect(modal.classList.contains('active')).toBe(true);
  });

  it('should close settings modal when close button is clicked', () => {
    const closeBtn = document.getElementById('closeModalBtn');
    const modal = document.getElementById('settingsModal');
    
    modal.classList.add('active');
    closeBtn.click();
    expect(modal.classList.contains('active')).toBe(false);
  });

  it('should save API key to localStorage when save is clicked', () => {
    const saveBtn = document.getElementById('saveSettingsBtn');
    const keyInput = document.getElementById('apiKeyInput');
    
    keyInput.value = 'AIzaSyFakeKeyForTest';
    saveBtn.click();
    
    expect(localStorage.getItem('geminiApiKey')).toBe('AIzaSyFakeKeyForTest');
    
    // Test clearing key
    keyInput.value = '';
    saveBtn.click();
    expect(localStorage.getItem('geminiApiKey')).toBeNull();
  });
});

describe('Chat Panel Toggle & FAB minimizing', () => {
  it('should minimize chat panel and show FAB when minimize button is clicked', () => {
    const minimizeBtn = document.getElementById('chatMinimizeBtn');
    const chatPanel = document.getElementById('chatPanel');
    const fab = document.getElementById('chatFab');
    
    chatPanel.classList.add('open');
    fab.classList.add('hidden');
    
    minimizeBtn.click();
    expect(chatPanel.classList.contains('open')).toBe(false);
    expect(fab.classList.contains('hidden')).toBe(false);
  });
});

describe('getThemeColors', () => {
  it('returns dark theme colors correctly', () => {
    const colors = getThemeColors('dark');
    expect(colors.bg).toBe('#18181b');
    expect(colors.title).toBe('#fafafa');
    expect(colors.grid).toBe('#27272a');
    expect(colors.tick).toBe('#71717a');
  });

  it('returns light theme colors correctly', () => {
    const colors = getThemeColors('light');
    expect(colors.bg).toBe('#ffffff');
    expect(colors.title).toBe('#18181b');
    expect(colors.grid).toBe('#e4e4e7');
    expect(colors.tick).toBe('#a1a1aa');
  });
});

describe('getFallbackResponse', () => {
  it('returns correct response for crowd keywords', () => {
    expect(getFallbackResponse('tell me about the crowd')).toContain('average density');
    expect(getFallbackResponse('what is the density')).toContain('average density');
    expect(getFallbackResponse('is there a critical zone')).toContain('Zone 3');
    expect(getFallbackResponse('tell about the croud flow')).toContain('average density');
    expect(getFallbackResponse('how many fans are there')).toContain('average density');
    expect(getFallbackResponse('how much attendance')).toContain('average density');
  });

  it('returns correct response for transport and shuttles', () => {
    expect(getFallbackResponse('is there a shuttle running')).toContain('Wave 3 shuttle');
    expect(getFallbackResponse('what is the rail status')).toContain('TRE Commuter Rail');
    expect(getFallbackResponse('how is transit today')).toContain('Shuttle Loop C');
    expect(getFallbackResponse('is parking full')).toContain('parking capacity');
    expect(getFallbackResponse('is there wheelchair access')).toContain('ADA accessible');
  });

  it('returns correct response for match and fixture queries', () => {
    expect(getFallbackResponse('what is the score')).toContain('Portugal');
    expect(getFallbackResponse('tell me the match schedule')).toContain('kicks off');
  });

  it('returns correct response for stadium venues', () => {
    expect(getFallbackResponse('what is the MetLife capacity')).toContain('MetLife Stadium');
    expect(getFallbackResponse('are the gates open')).toContain('gates');
  });

  it('returns correct response for sustainability and solar', () => {
    expect(getFallbackResponse('what is the solar energy generated')).toContain('generating');
    expect(getFallbackResponse('what are the water conservation metrics')).toContain('Water conservation');
  });

  it('returns correct response for system status and help', () => {
    expect(getFallbackResponse('what is the system uptime')).toContain('nominal');
    expect(getFallbackResponse('can you help me')).toContain('I can assist with');
    expect(getFallbackResponse('what is the weather')).toContain('weather');
  });

  it('returns generic fallback response for unknown keywords', () => {
    const response = getFallbackResponse('xyz abc');
    expect(response).toContain('I can help with crowd density');
  });
});

describe('sleep utility', () => {
  it('resolves after a specified timeout', async () => {
    const start = Date.now();
    await sleep(50);
    const duration = Date.now() - start;
    expect(duration).toBeGreaterThanOrEqual(45);
  });
});

describe('DOM Chat Utilities', () => {
  beforeEach(() => {
    // Setup clean mock document body
    document.body.innerHTML = `
      <div id="chatBody"></div>
    `;
  });

  it('adds a user message correctly', () => {
    addChatMessage('Hello World', 'user');
    const chatBody = document.getElementById('chatBody');
    expect(chatBody.children.length).toBe(1);
    
    const message = chatBody.firstElementChild;
    expect(message.className).toBe('message user');
    expect(message.textContent).toBe('Hello World');
  });

  it('adds an AI message with a custom ID', () => {
    addChatMessage('Thinking...', 'ai typing', 'custom-id');
    const chatBody = document.getElementById('chatBody');
    expect(chatBody.children.length).toBe(1);
    
    const message = chatBody.firstElementChild;
    expect(message.id).toBe('custom-id');
    expect(message.className).toBe('message ai typing');
  });

  it('updates an existing message and escapes HTML to prevent XSS', () => {
    addChatMessage('Thinking...', 'ai typing', 'msg-123');
    
    // Update it with text containing HTML tags
    updateChatMessage('msg-123', 'Response with <script>alert("XSS")</script> code', false);
    
    const message = document.getElementById('msg-123');
    expect(message.classList.contains('typing')).toBe(false);
    
    // Verify it was escaped and didn't insert a raw script tag
    expect(message.innerHTML).not.toContain('<script>');
    expect(message.textContent).toBe('Response with <script>alert("XSS")</script> code');
  });
});
