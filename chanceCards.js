window.ChanceCards = class ChanceCards {
  constructor(totalRounds = 13) {
    this.totalRounds = totalRounds;
    this.deck = [];
    this.currentCard = null;
    this.generateDeck();
  }
  generateDeck() {
    const possibleEffects = [
      { type: 'ADD_PTS', value: 15, description: 'Divine Blessing: +15 pts to roll value' },
      { type: 'ADD_PTS', value: 10, description: 'Stellar Surge: +10 pts to roll value' },
      { type: 'ADD_PTS', value: 5, description: 'Solar Flare: +5 pts to roll value' },
      { type: 'SUB_PTS', value: -5, description: 'Solar Eclipse: -5 pts to roll value' },
      { type: 'SUB_PTS', value: -10, description: 'Cosmic Drag: -10 pts to roll value' },
      { type: 'SUB_PTS', value: -15, description: 'Gravitational Pull: -15 pts to roll value' },
      { type: 'IMMEDIATE_YAHTZEE', value: 50, description: 'Supernova: Instant Yahtzee (50 pts)' },
      { type: 'SET_ZERO', value: 0, description: 'Black Hole: Immediately set one category to zero' }
    ];
    this.deck = [];
    for (let i = 0; i < this.totalRounds; i++) {
      const template = possibleEffects[Math.floor(Math.random() * possibleEffects.length)];
      this.deck.push({ ...template, id: i });
    }
  }
  drawCard() {
    if (this.deck.length > 0) {
      this.currentCard = this.deck.pop();
      return this.currentCard;
    }
    return null;
  }
};
