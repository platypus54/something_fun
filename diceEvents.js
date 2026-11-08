window.DiceEvents = class DiceEvents {
  constructor(dicePool, onDiceToggle, canToggleCheck) {
    this.dicePool = dicePool;
    this.onDiceToggle = onDiceToggle;
    this.canToggleCheck = canToggleCheck; // Function returning boolean whether holding is allowed
    this.containerEl = document.getElementById('dice-pool');
    this.bindEvents();
  }
  bindEvents() {
    if (!this.containerEl) return;
    this.containerEl.addEventListener('click', (event) => {
      const dieEl = event.target.closest('.die');
      if (!dieEl) return;
      
      // If a check function is provided and returns false, prevent selecting/holding dice
      if (typeof this.canToggleCheck === 'function' && !this.canToggleCheck()) {
        return;
      }

      const index = parseInt(dieEl.dataset.index, 10);
      if (!isNaN(index)) {
        this.dicePool.toggleHold(index);
        if (typeof this.onDiceToggle === 'function') {
          this.onDiceToggle(this.dicePool.dice);
        }
      }
    });
  }
};
