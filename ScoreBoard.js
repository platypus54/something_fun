window.ScoreBoard = class ScoreBoard {
  constructor() {
    this.scores = {};
    this.upperSubtotal = 0;
    this.upperBonusAwarded = false;
  }
  setScore(categoryName, score, isUpperSection) {
    if (this.scores[categoryName] !== undefined) return false;
    this.scores[categoryName] = score;
    if (isUpperSection) {
      this.upperSubtotal += score;
    }
    return true;
  }
  getUpperBonus() {
    if (!this.upperBonusAwarded && this.upperSubtotal >= 63) {
      this.upperBonusAwarded = true;
      return 35;
    }
    return this.upperBonusAwarded ? 35 : 0;
  }
};
