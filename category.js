window.CATEGORIES = {
  ONES: { id: 'ones', name: 'Ones (Sol)', upper: true, scoreFn: (analysis) => window.ScoringEngine.scoreUpper(analysis, 1) },
  TWOS: { id: 'twos', name: 'Twos (Luna)', upper: true, scoreFn: (analysis) => window.ScoringEngine.scoreUpper(analysis, 2) },
  THREES: { id: 'threes', name: 'Threes (Ares)', upper: true, scoreFn: (analysis) => window.ScoringEngine.scoreUpper(analysis, 3) },
  FOURS: { id: 'fours', name: 'Fours (Zeus)', upper: true, scoreFn: (analysis) => window.ScoringEngine.scoreUpper(analysis, 4) },
  FIVES: { id: 'fives', name: 'Fives (Hermes)', upper: true, scoreFn: (analysis) => window.ScoringEngine.scoreUpper(analysis, 5) },
  SIXES: { id: 'sixes', name: 'Sixes (Kronos)', upper: true, scoreFn: (analysis) => window.ScoringEngine.scoreUpper(analysis, 6) },
  THREE_OF_A_KIND: { id: 'threeOfAKind', name: 'Triple Constellation', upper: false, scoreFn: (analysis) => window.ScoringEngine.scoreNOfAKind(analysis, 3) },
  FOUR_OF_A_KIND: { id: 'fourOfAKind', name: 'Quadruple Nebula', upper: false, scoreFn: (analysis) => window.ScoringEngine.scoreNOfAKind(analysis, 4) },
  FULL_HOUSE: { id: 'fullHouse', name: 'Cosmic Eclipse', upper: false, scoreFn: (analysis) => window.ScoringEngine.scoreFullHouse(analysis) },
  SMALL_STRAIGHT: { id: 'smallStraight', name: 'Stellar Orbit (Small)', upper: false, scoreFn: (analysis) => window.ScoringEngine.scoreSmallStraight(analysis) },
  LARGE_STRAIGHT: { id: 'largeStraight', name: 'Galactic Alignment (Large)', upper: false, scoreFn: (analysis) => window.ScoringEngine.scoreLargeStraight(analysis) },
  YAHTZEE: { id: 'yahtzee', name: 'Supernova Yahtzee', upper: false, scoreFn: (analysis) => window.ScoringEngine.scoreYahtzee(analysis) },
  CHANCE: { id: 'chance', name: 'Dark Matter (Chance)', upper: false, scoreFn: (analysis) => window.ScoringEngine.scoreChance(analysis) }
};
