window.Activity = class Activity {
  constructor(containerId = 'activity-log-container') {
    this.containerEl = document.getElementById(containerId);
    this.logs = [];
    this.initContainer();
  }
  initContainer() {
    if (!this.containerEl) {
      const gameContainer = document.querySelector('.game-container');
      if (gameContainer) {
        const section = document.createElement('section');
        section.className = 'activity-section';
        section.innerHTML = `
          <h2>Cosmic Activity Stream</h2>
          <div id="activity-log-container" class="activity-log-box"></div>
        `;
        gameContainer.appendChild(section);
        this.containerEl = document.getElementById(containerId);
      }
    }
  }
  logAction(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = { message, type, timestamp };
    this.logs.unshift(logEntry);
    if (this.logs.length > 50) {
      this.logs.pop();
    }
    this.render();
  }
  render() {
    if (!this.containerEl) return;
    this.containerEl.innerHTML = this.logs.map(entry => `
      <div class="log-item log-${entry.type}">
        <span class="log-time">[${entry.timestamp}]</span> ${entry.message}
      </div>
    `).join('');
  }
};
