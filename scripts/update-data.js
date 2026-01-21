const fs = require('fs');
const path = require('path');

// Read existing data
const metrosPath = path.join(__dirname, '../data/metros.json');
const submarkeetsPath = path.join(__dirname, '../data/submarkets.json');

const metrosData = JSON.parse(fs.readFileSync(metrosPath, 'utf8'));
const submarkets = JSON.parse(fs.readFileSync(submarkeetsPath, 'utf8'));

// Generate realistic time period data based on current price change
function generateTimePeriods(currentChange) {
  // 3M is the base (current)
  const threeMonth = currentChange;

  // 1Y shows cumulative trend with some volatility
  const oneYear = threeMonth * 3.5 + (Math.random() - 0.5) * 2;

  // 2Y compounds but with market cycles
  const twoYear = oneYear * 1.8 + (Math.random() - 0.5) * 3;

  // 5Y shows longer trends, typically more positive
  const fiveYear = twoYear * 2.2 + Math.random() * 5;

  // 10Y shows significant appreciation in most markets
  const tenYear = fiveYear * 1.8 + Math.random() * 10;

  return {
    "3M": parseFloat(threeMonth.toFixed(1)),
    "1Y": parseFloat(oneYear.toFixed(1)),
    "2Y": parseFloat(twoYear.toFixed(1)),
    "5Y": parseFloat(fiveYear.toFixed(1)),
    "10Y": parseFloat(tenYear.toFixed(1))
  };
}

// Update metros
metrosData.metros = metrosData.metros.map(metro => ({
  ...metro,
  priceChangeByPeriod: generateTimePeriods(metro.priceChange)
}));

// Update submarkets
submarkets.submarkets = submarkets.submarkets.map(submarket => ({
  ...submarket,
  priceChangeByPeriod: generateTimePeriods(submarket.priceChange)
}));

// Write updated data
fs.writeFileSync(metrosPath, JSON.stringify(metrosData, null, 2));
fs.writeFileSync(submarkeetsPath, JSON.stringify(submarkets, null, 2));

console.log('✓ Updated metros.json with time period data');
console.log('✓ Updated submarkets.json with time period data');
