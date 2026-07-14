/** @jest-environment jsdom */
const { getThemeColors } = require('./app.js');

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

describe('DOM Initialization', () => {
  it('should have a clean document body', () => {
    expect(document.body.innerHTML).toBe('');
    
    // Simulate setting up a basic DOM element
    const div = document.createElement('div');
    div.id = 'app';
    document.body.appendChild(div);
    
    expect(document.getElementById('app')).not.toBeNull();
  });
});
