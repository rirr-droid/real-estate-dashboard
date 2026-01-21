const fs = require('fs');
const path = require('path');
const comprehensiveSubmarkets = require('./comprehensive-submarkets');

// Read existing metro data
const metrosPath = path.join(__dirname, '../data/metros.json');
const submarkeetsPath = path.join(__dirname, '../data/submarkets.json');
const metrosData = JSON.parse(fs.readFileSync(metrosPath, 'utf8'));

// Generate time period data for submarkets (variation from metro)
function generateTimePeriods(metroChange) {
  // Submarkets vary from the metro average by -3% to +3%
  const variation = (Math.random() - 0.5) * 6;
  const submarketChange = metroChange + variation;

  // 3M is roughly 1/4 of annual
  const threeMonth = submarketChange / 4 + (Math.random() - 0.5) * 0.5;
  const oneYear = submarketChange;
  const twoYear = submarketChange * (1.9 + Math.random() * 0.2);
  const fiveYear = submarketChange * (4.2 + Math.random() * 0.8);
  const tenYear = submarketChange * (7.5 + Math.random() * 1.5);

  return {
    "3M": parseFloat(threeMonth.toFixed(1)),
    "1Y": parseFloat(oneYear.toFixed(1)),
    "2Y": parseFloat(twoYear.toFixed(1)),
    "5Y": parseFloat(fiveYear.toFixed(1)),
    "10Y": parseFloat(tenYear.toFixed(1))
  };
}

// Calculate price per sqft
function calculatePricePerSqft(medianPrice) {
  const basePrice = medianPrice / (1800 + Math.random() * 400);
  return parseFloat(basePrice.toFixed(0));
}

// Calculate rental yield
function calculateRentalYield(medianPrice) {
  const baseYield = (50000 / medianPrice) * 100;
  return parseFloat((baseYield + (Math.random() - 0.5) * 2).toFixed(2));
}

// Generate STR metrics
function generateSTRMetrics(medianPrice, metroId) {
  const baseADR = medianPrice / 3000 + Math.random() * 50;
  const occupancyBase = ['miami', 'orlando', 'las-vegas', 'san-diego'].includes(metroId) ? 70 : 60;
  const occupancyRate = occupancyBase + (Math.random() - 0.5) * 15;
  const revPAR = (baseADR * occupancyRate / 100);
  const annualRevenue = revPAR * 365;
  const seasonalityScore = ['miami', 'orlando', 'las-vegas', 'phoenix', 'san-diego'].includes(metroId) ?
                          7 + Math.random() * 2 : 4 + Math.random() * 3;

  return {
    averageDailyRate: parseFloat(baseADR.toFixed(0)),
    occupancyRate: parseFloat(occupancyRate.toFixed(1)),
    revPAR: parseFloat(revPAR.toFixed(0)),
    annualRevenue: parseFloat(annualRevenue.toFixed(0)),
    seasonalityScore: parseFloat(seasonalityScore.toFixed(1))
  };
}

// Create URL-safe slug from name
function createSlug(name) {
  return name.toLowerCase()
    .replace(/['']/g, '')
    .replace(/&/g, 'and')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

// Generate all submarkets
const allSubmarkets = [];
let totalCount = 0;

metrosData.metros.forEach(metro => {
  const submarketNames = comprehensiveSubmarkets[metro.id] || [];

  if (submarketNames.length === 0) {
    console.warn(`⚠️  No submarkets defined for ${metro.name}`);
    return;
  }

  submarketNames.forEach((name) => {
    // Price variation: 60% to 140% of metro median
    const priceVariation = 0.6 + Math.random() * 0.8;
    const medianPrice = Math.round(metro.medianPrice * priceVariation);

    // Price change variation from metro
    const priceChange = metro.priceChange + (Math.random() - 0.5) * 4;

    const submarket = {
      id: `${metro.id}-${createSlug(name)}`,
      name: name,
      slug: createSlug(name),
      metroId: metro.id,
      metroName: metro.name,
      state: metro.state,
      priceChange: parseFloat(priceChange.toFixed(1)),
      priceChangeByPeriod: generateTimePeriods(priceChange),
      medianPrice: medianPrice,
      pricePerSqft: calculatePricePerSqft(medianPrice),
      volume: Math.round(metro.volume / submarketNames.length * (0.8 + Math.random() * 0.4)),
      inventory: Math.round(metro.inventory / submarketNames.length * (0.8 + Math.random() * 0.4)),
      daysOnMarket: Math.round(metro.daysOnMarket * (0.85 + Math.random() * 0.3)),
      rentalYield: calculateRentalYield(medianPrice),
      strMetrics: generateSTRMetrics(medianPrice, metro.id),
      // Redfin search URL
      redfinUrl: `https://www.redfin.com/${metro.state}/${metro.name.toLowerCase().replace(/\s+/g, '-')}/${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
    };

    allSubmarkets.push(submarket);
    totalCount++;
  });
});

// Write updated data
fs.writeFileSync(submarkeetsPath, JSON.stringify({ submarkets: allSubmarkets }, null, 2));

console.log('✅ Generated comprehensive submarkets');
console.log(`✅ Created ${totalCount} submarkets across ${metrosData.metros.length} metros`);
console.log('');
console.log('Breakdown by metro:');
metrosData.metros.forEach(metro => {
  const count = comprehensiveSubmarkets[metro.id]?.length || 0;
  console.log(`  • ${metro.name}: ${count} submarkets`);
});
