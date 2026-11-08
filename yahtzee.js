class YahtzeeGame {
  constructor() {
    this.dicePool = new window.DicePool();
    this.scoreBoard = new window.ScoreBoard();
    this.chanceDeck = new window.ChanceCards(Object.keys(window.CATEGORIES).length);
    this.activityTracker = new window.Activity('activity-log-container');
    this.currentChanceCard = null;
    this.rollsLeft = 3;
    this.categoriesSelectedCount = 0;
    this.totalCategories = Object.keys(window.CATEGORIES).length;
    this.gameOver = false;
    this.gameStarted = false; // True only after the very first roll of the game
    
    new window.DiceEvents(
      this.dicePool, 
      (dice) => {
        this.renderDice();
        const heldCount = dice.filter(d => d.held).length;
        this.activityTracker.logAction(`Dice hold state toggled. Held count: ${heldCount}`, 'action');
      },
      () => this.gameStarted
    );
    
    this.initController();
  }

  initController() {
    const rollBtn = document.getElementById('roll-btn');
    const resetBtn = document.getElementById('reset-btn');

    if (rollBtn) {
      rollBtn.onclick = () => {
        if (!this.gameOver && this.rollsLeft > 0) {
          // If the game hasn't truly started yet (Null state at game initiation), the very first roll initiates the game & draws the first round's chance card
          if (!this.gameStarted) {
            this.gameStarted = true;
            this.startNewRound(true); // Draw card & begin round 1
          }

          this.activityTracker.logAction(`Rolling starlight dice... (${this.rollsLeft - 1} rolls left in orbit)`, 'roll');
          this.triggerRollAnimation(() => {
            this.dicePool.rollUnheld();
            this.rollsLeft--;
            this.renderDice();
            this.updateScorecardPreviews();
            this.updateUI();
            this.activityTracker.logAction(`Dice rolled: [${this.dicePool.values().join(', ')}]`, 'info');
          });
        }
      };
    }

    if (resetBtn) {
      resetBtn.onclick = () => {
        this.activityTracker.logAction('Returning to Cosmic Main Menu...', 'system');
        window.location.href = 'index.html';
      };
    }

    this.initNullState();
  }

  triggerRollAnimation(callback) {
    const diceEls = document.querySelectorAll('.die:not(.held)');
    diceEls.forEach(el => el.classList.add('rolling'));
    setTimeout(() => {
      diceEls.forEach(el => el.classList.remove('rolling'));
      callback();
    }, 400);
  }

  initNullState() {
    this.gameStarted = false;
    this.gameOver = false;
    this.currentChanceCard = null;
    this.rollsLeft = 3;
    this.categoriesSelectedCount = 0;

    const cardDescEl = document.getElementById('card-description');
    if (cardDescEl) {
      cardDescEl.textContent = 'Awaiting first roll of the new game...';
    }

    this.dicePool.reset(); // Sets dice to '-'
    this.renderDice();

    Object.values(window.CATEGORIES).forEach(cat => {
      const scoreCell = document.getElementById(`score-${cat.id}`);
      if (scoreCell) {
        scoreCell.textContent = '-';
        scoreCell.style.color = 'var(--success-color)';
        scoreCell.style.fontWeight = 'bold';
        scoreCell.style.cursor = 'pointer';
      }
    });

    this.updateUI();
    this.activityTracker.logAction('Game initialized in null state. Hit "Invoke Starlight" (Roll) to begin!', 'system');
  }

  startNewRound(isFirstRound = false) {
    if (this.gameOver) return;
    
    // Draw chance card for the new round
    this.currentChanceCard = this.chanceDeck.drawCard();
    const cardDescEl = document.getElementById('card-description');
    if (this.currentChanceCard) {
      if (cardDescEl) {
        cardDescEl.textContent = this.currentChanceCard.description;
        cardDescEl.classList.add('card-draw-anim');
        setTimeout(() => cardDescEl.classList.remove('card-draw-anim'), 500);
      }
      this.activityTracker.logAction(`Chance Card Drawn: ${this.currentChanceCard.description}`, 'chance');
      this.showEventNotification(`Chance Card Drawn: ${this.currentChanceCard.description}`);

      if (this.currentChanceCard.type === 'IMMEDIATE_YAHTZEE') {
        const yahtzeeCat = window.CATEGORIES.YAHTZEE;
        if (yahtzeeCat && this.scoreBoard.scores[yahtzeeCat.id] === undefined) {
          this.scoreBoard.setScore(yahtzeeCat.id, 50, yahtzeeCat.upper);
          this.updateCellUI(yahtzeeCat.id, 50);
          this.activityTracker.logAction(`Supernova triggered! Yahtzee automatically set to 50 pts.`, 'score');
          this.categoriesSelectedCount++;
          this.checkGameCompletion();
          return;
        }
      } else if (this.currentChanceCard.type === 'SET_ZERO') {
        const unplayedCat = Object.values(window.CATEGORIES).find(cat => this.scoreBoard.scores[cat.id] === undefined);
        if (unplayedCat) {
          this.scoreBoard.setScore(unplayedCat.id, 0, unplayedCat.upper);
          this.updateCellUI(unplayedCat.id, 0);
          this.activityTracker.logAction(`Black Hole triggered! ${unplayedCat.name} immediately set to 0 pts.`, 'score');
          this.categoriesSelectedCount++;
          this.checkGameCompletion();
          return;
        }
      }
    }

    if (!isFirstRound) {
      this.rollsLeft = 3;
      this.dicePool.reset();
      this.renderDice();
      this.updateScorecardPreviews();
      this.updateUI();
      this.activityTracker.logAction('New round started. Roll the dice!', 'system');
    }
  }

  checkGameCompletion() {
    if (this.categoriesSelectedCount >= this.totalCategories) {
      this.endGame();
    } else {
      this.startNewRound(false);
    }
  }

  resetGame() {
    window.location.href = 'index.html';
  }

  renderDice() {
    const container = document.getElementById('dice-pool');
    if (!container) return;
    container.innerHTML = '';
    this.dicePool.dice.forEach((d, index) => {
      const dieEl = document.createElement('div');
      dieEl.className = `die ${d.held ? 'held' : ''} ${!this.gameStarted ? 'null-die' : ''}`;
      dieEl.textContent = d.value;
      dieEl.dataset.index = index;
      container.appendChild(dieEl);
    });
  }

  renderScorecard() {
    const tbodyUpper = document.getElementById('scorecard-body-upper');
    const tbodyLower = document.getElementById('scorecard-body-lower');
    if (!tbodyUpper || !tbodyLower) return;

    tbodyUpper.innerHTML = '';
    tbodyLower.innerHTML = '';

    Object.values(window.CATEGORIES).forEach(cat => {
      const row = document.createElement('tr');
      const nameTd = document.createElement('td');
      nameTd.textContent = cat.name;
      
      const scoreTd = document.createElement('td');
      scoreTd.id = `score-${cat.id}`;
      scoreTd.className = 'score-val';
      scoreTd.textContent = '-';
      scoreTd.style.cursor = 'pointer';
      
      scoreTd.onclick = () => {
        this.selectCategory(cat);
      };
      
      row.appendChild(nameTd);
      row.appendChild(scoreTd);

      if (cat.upper) {
        tbodyUpper.appendChild(row);
      } else {
        tbodyLower.appendChild(row);
      }
    });
  }

  updateCellUI(catId, score) {
    const scoreCell = document.getElementById(`score-${catId}`);
    if (scoreCell) {
      scoreCell.textContent = score;
      scoreCell.classList.add('bound');
    }
  }

  selectCategory(cat) {
    if (this.gameOver) return;
    if (!this.gameStarted) {
      this.activityTracker.logAction('Cannot select category while in null state before first roll!', 'system');
      this.showEventNotification('Make your first roll to begin the game!');
      return;
    }
    if (this.scoreBoard.scores[cat.id] !== undefined) return;
    
    const values = this.dicePool.values();
    const analysis = window.ScoringEngine.analyzeRoll(values);
    let earnedScore = cat.scoreFn(analysis);

    if (this.currentChanceCard) {
      if (this.currentChanceCard.type === 'ADD_PTS') {
        earnedScore += this.currentChanceCard.value;
      } else if (this.currentChanceCard.type === 'SUB_PTS') {
        earnedScore = Math.max(0, earnedScore + this.currentChanceCard.value);
      }
    }

    this.scoreBoard.setScore(cat.id, earnedScore, cat.upper);
    this.updateCellUI(cat.id, earnedScore);

    this.activityTracker.logAction(`Category Bound: ${cat.name} scored ${earnedScore} points.`, 'score');
    this.showEventNotification(`Constellation Bound: ${cat.name} (+${earnedScore} pts)`);

    this.categoriesSelectedCount++;

    if (this.categoriesSelectedCount >= this.totalCategories) {
      this.endGame();
    } else {
      this.startNewRound(false);
    }
  }

  showEventNotification(message) {
    let notifyEl = document.getElementById('event-notification');
    if (!notifyEl) {
      notifyEl = document.createElement('div');
      notifyEl.id = 'event-notification';
      notifyEl.style.cssText = 'position: fixed; top: 20px; right: 20px; background: linear-gradient(135deg, #312e81 0%, #1e1b4b 100%); border: 1px solid #8b5cf6; color: #e2e8f0; padding: 14px 22px; border-radius: 10px; font-weight: 600; box-shadow: 0 10px 25px rgba(0,0,0,0.6), 0 0 20px rgba(139, 92, 246, 0.4); z-index: 1000; transition: opacity 0.3s ease;';
      document.body.appendChild(notifyEl);
    }
    notifyEl.textContent = message;
    notifyEl.style.opacity = '1';
    
    setTimeout(() => {
      notifyEl.style.opacity = '0';
    }, 3000);
  }

  updateScorecardPreviews() {
    if (this.gameOver || !this.gameStarted) return;
    const values = this.dicePool.values();
    const analysis = window.ScoringEngine.analyzeRoll(values);

    Object.values(window.CATEGORIES).forEach(cat => {
      const scoreCell = document.getElementById(`score-${cat.id}`);
      if (scoreCell && this.scoreBoard.scores[cat.id] === undefined) {
        let previewScore = cat.scoreFn(analysis);
        if (this.currentChanceCard) {
          if (this.currentChanceCard.type === 'ADD_PTS') previewScore += this.currentChanceCard.value;
          if (this.currentChanceCard.type === 'SUB_PTS') previewScore = Math.max(0, previewScore + this.currentChanceCard.value);
        }
        scoreCell.textContent = previewScore;
      }
    });
  }

  updateUI() {
    const rollsEl = document.getElementById('rolls-left');
    if (rollsEl && !this.gameOver) {
      rollsEl.textContent = this.rollsLeft;
    }

    const subtotalDisplay = document.getElementById('upper-subtotal-display');
    if (subtotalDisplay) subtotalDisplay.textContent = this.scoreBoard.upperSubtotal;

    const upperBonus = this.scoreBoard.getUpperBonus();
    const bonusDisplay = document.getElementById('upper-bonus-display');
    if (bonusDisplay) bonusDisplay.textContent = upperBonus;

    const totalScore = Object.values(this.scoreBoard.scores).reduce((a, b) => a + b, 0) + upperBonus;
    const grandTotalDisplay = document.getElementById('grand-total-display');
    if (grandTotalDisplay) grandTotalDisplay.textContent = totalScore;
  }

  endGame() {
    this.gameOver = true;
    this.gameStarted = false; // Enter null state on game end
    const upperBonus = this.scoreBoard.getUpperBonus();
    const totalScore = Object.values(this.scoreBoard.scores).reduce((a, b) => a + b, 0) + upperBonus;
    this.activityTracker.logAction(`Game Over! Final Pantheon Score: ${totalScore}. Returning to Null State.`, 'system');
    
    const indicator = document.getElementById('turn-indicator');
    if (indicator) {
      indicator.innerHTML = `<strong>Cosmos Aligned! Final Pantheon Score: ${totalScore}</strong>`;
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const game = new YahtzeeGame();
  game.renderScorecard();
});
