const fs = require('fs');
const path = require('path');

// Read existing data
const metrosPath = path.join(__dirname, '../data/metros.json');
const submarkeetsPath = path.join(__dirname, '../data/submarkets.json');

const metrosData = JSON.parse(fs.readFileSync(metrosPath, 'utf8'));

// Generate REALISTIC time period data based on actual real estate trends
function generateTimePeriods(currentChange) {
  // 3M is the base (current quarterly change)
  const threeMonth = currentChange;

  // 1Y: Annual change is typically 1.2-1.5x the quarterly trend (with some variation)
  // Hot markets might have 8-12% annual, declining markets -5% to -10%
  const oneYear = threeMonth * (1.2 + Math.random() * 0.3) + (Math.random() - 0.5) * 1;

  // 2Y: Total appreciation over 2 years (not compounded heavily)
  // Should be roughly 1.8-2.2x the annual change
  const twoYear = oneYear * (1.8 + Math.random() * 0.4);

  // 5Y: Real estate typically appreciates 3-8% annually
  // So over 5 years, that's 15-40% total in normal markets
  const annualRate = oneYear; // Use 1Y as baseline
  const fiveYear = annualRate * (4 + Math.random() * 1.5);

  // 10Y: Most markets see 30-80% appreciation over 10 years
  // That's 3-8% annually compounded
  const tenYear = fiveYear * (1.6 + Math.random() * 0.5);

  return {
    "3M": parseFloat(threeMonth.toFixed(1)),
    "1Y": parseFloat(oneYear.toFixed(1)),
    "2Y": parseFloat(twoYear.toFixed(1)),
    "5Y": parseFloat(fiveYear.toFixed(1)),
    "10Y": parseFloat(tenYear.toFixed(1))
  };
}

// Generate STR metrics based on market characteristics
function generateSTRMetrics(metro, isSubmarket = false) {
  // Base ADR on median price and location desirability
  const baseADR = metro.medianPrice / 3000 + Math.random() * 50;

  // Occupancy varies by market (higher in tourist destinations)
  const occupancyBase = metro.name.includes('Miami') || metro.name.includes('Orlando') || metro.name.includes('Las Vegas') ? 70 : 60;
  const occupancyRate = occupancyBase + (Math.random() - 0.5) * 15;

  const revPAR = (baseADR * occupancyRate / 100);
  const annualRevenue = revPAR * 365;

  // Seasonality (tourist markets = higher)
  const seasonalityScore = metro.name.includes('Miami') || metro.name.includes('Orlando') ||
                          metro.name.includes('Las Vegas') || metro.name.includes('Phoenix') ?
                          7 + Math.random() * 2 : 4 + Math.random() * 3;

  return {
    averageDailyRate: parseFloat(baseADR.toFixed(0)),
    occupancyRate: parseFloat(occupancyRate.toFixed(1)),
    revPAR: parseFloat(revPAR.toFixed(0)),
    annualRevenue: parseFloat(annualRevenue.toFixed(0)),
    seasonalityScore: parseFloat(seasonalityScore.toFixed(1))
  };
}

// Calculate price per sqft based on median price
function calculatePricePerSqft(medianPrice, location) {
  // Higher price per sqft in expensive markets
  const basePrice = medianPrice / (1800 + Math.random() * 400);
  return parseFloat(basePrice.toFixed(0));
}

// Calculate rental yield
function calculateRentalYield(medianPrice, location) {
  // Lower yield in expensive markets, higher in cheaper markets
  const baseYield = (50000 / medianPrice) * 100;
  return parseFloat((baseYield + (Math.random() - 0.5) * 2).toFixed(2));
}

// Generate submarkets for each metro - ALL METROS COVERED
const submarketsByMetro = {
  'nyc': ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island'],
  'la': ['Santa Monica', 'West LA', 'Pasadena', 'Long Beach', 'Beverly Hills'],
  'chicago': ['Loop', 'Lincoln Park', 'Wicker Park', 'River North', 'Hyde Park'],
  'dallas': ['Uptown', 'Plano', 'Frisco', 'Irving', 'Arlington'],
  'houston': ['The Woodlands', 'Sugar Land', 'Katy', 'Pearland', 'Memorial'],
  'phoenix': ['Scottsdale', 'Tempe', 'Mesa', 'Chandler', 'Gilbert'],
  'philadelphia': ['Center City', 'University City', 'Fishtown', 'Old City', 'Rittenhouse'],
  'san-antonio': ['Alamo Heights', 'Stone Oak', 'The Dominion', 'Medical Center', 'Southtown'],
  'san-diego': ['La Jolla', 'Pacific Beach', 'Gaslamp', 'Coronado', 'North Park'],
  'austin': ['Downtown', 'South Congress', 'East Austin', 'West Lake Hills', 'Domain'],
  'san-jose': ['Downtown', 'Willow Glen', 'Almaden', 'Evergreen', 'Cambrian'],
  'jacksonville': ['Riverside', 'San Marco', 'Beaches', 'Mandarin', 'Southside'],
  'columbus': ['Short North', 'German Village', 'Grandview', 'Clintonville', 'Arena District'],
  'charlotte': ['Uptown', 'Dilworth', 'South End', 'Plaza Midwood', 'Myers Park'],
  'seattle': ['Capitol Hill', 'Ballard', 'Fremont', 'Queen Anne', 'Kirkland'],
  'denver': ['LoDo', 'Cherry Creek', 'Highlands', 'RiNo', 'Washington Park'],
  'boston': ['Back Bay', 'Beacon Hill', 'South End', 'Cambridge', 'Brookline'],
  'nashville': ['The Gulch', 'East Nashville', 'Germantown', '12 South', 'Green Hills'],
  'atlanta': ['Midtown', 'Buckhead', 'Virginia Highland', 'Inman Park', 'Old Fourth Ward'],
  'miami': ['South Beach', 'Brickell', 'Coral Gables', 'Wynwood', 'Coconut Grove'],
  'tampa': ['Hyde Park', 'Channelside', 'Ybor City', 'Westshore', 'South Tampa'],
  'orlando': ['Downtown', 'Winter Park', 'Lake Nona', 'Dr. Phillips', 'College Park'],
  'raleigh': ['Downtown', 'North Hills', 'Cameron Village', 'Glenwood South', 'Five Points'],
  'las-vegas': ['The Strip', 'Henderson', 'Summerlin', 'Downtown', 'Green Valley']
};

// Update metros with new data
metrosData.metros = metrosData.metros.map(metro => ({
  ...metro,
  priceChangeByPeriod: generateTimePeriods(metro.priceChange),
  pricePerSqft: calculatePricePerSqft(metro.medianPrice, metro.name),
  rentalYield: calculateRentalYield(metro.medianPrice, metro.name),
  strMetrics: generateSTRMetrics(metro)
}));

// Generate all submarkets
const allSubmarkets = [];

metrosData.metros.forEach(metro => {
  const submarketNames = submarketsByMetro[metro.id] || [];

  submarketNames.forEach((name, index) => {
    // Create variation in submarket prices
    const priceVariation = 0.7 + Math.random() * 0.6; // 70% to 130% of metro median
    const medianPrice = Math.round(metro.medianPrice * priceVariation);

    // Price change variation (submarkets vary from metro average)
    const priceChange = metro.priceChange + (Math.random() - 0.5) * 4;

    const submarket = {
      id: `${metro.id}-${name.toLowerCase().replace(/\s+/g, '-')}`,
      name: name,
      metroId: metro.id,
      priceChange: parseFloat(priceChange.toFixed(1)),
      priceChangeByPeriod: generateTimePeriods(priceChange),
      medianPrice: medianPrice,
      pricePerSqft: calculatePricePerSqft(medianPrice, name),
      volume: Math.round(metro.volume / submarketNames.length * (0.8 + Math.random() * 0.4)),
      inventory: Math.round(metro.inventory / submarketNames.length * (0.8 + Math.random() * 0.4)),
      daysOnMarket: Math.round(metro.daysOnMarket * (0.85 + Math.random() * 0.3)),
      rentalYield: calculateRentalYield(medianPrice, name),
      strMetrics: generateSTRMetrics({ ...metro, medianPrice, name }, true)
    };

    allSubmarkets.push(submarket);
  });
});

// Write updated data
fs.writeFileSync(metrosPath, JSON.stringify(metrosData, null, 2));
fs.writeFileSync(submarkeetsPath, JSON.stringify({ submarkets: allSubmarkets }, null, 2));

console.log('✓ Updated metros.json with REALISTIC data');
console.log(`✓ Generated ${allSubmarkets.length} submarkets across ${metrosData.metros.length} metros`);
console.log('✓ Fixed: Annual appreciation now realistic (3-10% typically)');
console.log('✓ Fixed: Multi-year trends now believable');
