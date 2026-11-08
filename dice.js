window.DicePool = class DicePool {
  constructor(size = 5) {
    this.dice = Array.from({ length: size }, () => ({ value: '-', held: false }));
  }
  rollUnheld() {
    this.dice.forEach(d => {
      if (!d.held) {
        d.value = Math.floor(Math.random() * 6) + 1;
      }
    });
    return this.dice;
  }
  toggleHold(index) {
    if (this.dice[index]) {
      this.dice[index].held = !this.dice[index].held;
    }
  }
  reset() {
    this.dice.forEach(d => {
      d.held = false;
      d.value = '-';
    });
  }
  values() {
    return this.dice.map(d => (d.value === '-' ? 1 : d.value));
  }
};
