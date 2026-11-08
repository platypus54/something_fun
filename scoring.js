window.ScoringEngine = {
  analyzeRoll(dice) {
    const counts = {};
    let sum = 0;
    for (const die of dice) {
      counts[die] = (counts[die] || 0) + 1;
      sum += die;
    }
    const uniqueSorted = Object.keys(counts).map(Number).sort((a, b) => a - b);
    const maxFrequency = Math.max(...Object.values(counts));
    return { dice, counts, sum, uniqueSorted, maxFrequency };
  },
  scoreUpper(analysis, targetValue) { return (analysis.counts[targetValue] || 0) * targetValue; },
  scoreNOfAKind(analysis, n) { return analysis.maxFrequency >= n ? analysis.sum : 0; },
  scoreFullHouse(analysis) {
    const vals = Object.values(analysis.counts);
    return (vals.length === 2 && vals.includes(3) && vals.includes(2)) ? 25 : 0;
  },
  scoreSmallStraight(analysis) {
    const str = analysis.uniqueSorted.join('');
    return ['1234', '2345', '3456'].some(s => str.includes(s)) ? 30 : 0;
  },
  scoreLargeStraight(analysis) {
    const str = analysis.uniqueSorted.join('');
    return (str === '12345' || str === '23456') ? 40 : 0;
  },
  scoreYahtzee(analysis) { return analysis.maxFrequency === 5 ? 50 : 0; },
  scoreChance(analysis) { return analysis.sum; }
};
