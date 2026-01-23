const fs = require('fs');
const path = require('path');

// Read metro data
const metrosPath = path.join(__dirname, '../data/metros.json');
const metrosData = JSON.parse(fs.readFileSync(metrosPath, 'utf8'));

// Property types distribution
const propertyTypes = ["single-family", "townhome", "condo", "multi-family"];
const propertyTypeWeights = [0.55, 0.20, 0.20, 0.05]; // 55% SFH, 20% townhome, 20% condo, 5% multi-family

// Street names for realistic addresses
const streetNames = [
  "Main St", "Oak Ave", "Maple Dr", "Cedar Ln", "Pine St", "Elm Ave", "Washington Blvd",
  "Lake View Dr", "Park Ave", "Highland Rd", "Sunset Blvd", "River Rd", "Forest Ln",
  "Meadow Way", "Valley View Dr", "Mountain Rd", "Beach St", "Harbor Ln", "Bay Ave"
];

function randomChoice(arr, weights = null) {
  if (!weights) return arr[Math.floor(Math.random() * arr.length)];

  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < arr.length; i++) {
    random -= weights[i];
    if (random <= 0) return arr[i];
  }
  return arr[0];
}

function generateAddress(index) {
  const streetNumber = 100 + Math.floor(Math.random() * 9900);
  const streetName = randomChoice(streetNames);
  return `${streetNumber} ${streetName}`;
}

function generateZipCode(state) {
  // Simple zip code generation based on state patterns
  const zipPrefixes = {
    'NY': 10000, 'CA': 90000, 'IL': 60000, 'TX': 75000,
    'AZ': 85000, 'PA': 19000, 'FL': 32000, 'WA': 98000,
    'CO': 80000, 'MA': 02000, 'GA': 30000, 'TN': 37000,
    'NC': 27000, 'NV': 89000, 'OH': 43000
  };
  const prefix = zipPrefixes[state] || 10000;
  return prefix + Math.floor(Math.random() * 1000);
}

function generateProperty(metro, index) {
  const propertyType = randomChoice(propertyTypes, propertyTypeWeights);

  // Base pricing on metro median with variation
  const priceVariation = 0.5 + Math.random() * 1.8; // 50% to 230% of median
  const price = Math.round(metro.medianPrice * priceVariation);

  // Square footage based on property type
  let sqft;
  if (propertyType === "single-family") {
    sqft = 1400 + Math.floor(Math.random() * 2600); // 1400-4000 sqft
  } else if (propertyType === "townhome") {
    sqft = 1200 + Math.floor(Math.random() * 1800); // 1200-3000 sqft
  } else if (propertyType === "condo") {
    sqft = 600 + Math.floor(Math.random() * 1900); // 600-2500 sqft
  } else {
    sqft = 2000 + Math.floor(Math.random() * 3000); // 2000-5000 sqft
  }

  // Bedrooms and bathrooms based on size
  let bedrooms, bathrooms;
  if (sqft < 800) {
    bedrooms = 1; bathrooms = 1;
  } else if (sqft < 1200) {
    bedrooms = randomChoice([1, 2]); bathrooms = randomChoice([1, 1.5, 2]);
  } else if (sqft < 1800) {
    bedrooms = randomChoice([2, 3]); bathrooms = randomChoice([2, 2.5]);
  } else if (sqft < 2500) {
    bedrooms = randomChoice([3, 4]); bathrooms = randomChoice([2, 2.5, 3]);
  } else {
    bedrooms = randomChoice([4, 5]); bathrooms = randomChoice([3, 3.5, 4]);
  }

  const pricePerSqft = Math.round(price / sqft);
  const avgPricePerSqftInArea = metro.pricePerSqft + (Math.random() - 0.5) * 40;

  // Days on market with realistic distribution
  let daysOnMarket;
  const random = Math.random();
  if (random < 0.15) {
    daysOnMarket = Math.floor(Math.random() * 14); // 15% fresh listings
  } else if (random < 0.50) {
    daysOnMarket = 14 + Math.floor(Math.random() * 46); // 35% 2-8 weeks
  } else if (random < 0.75) {
    daysOnMarket = 60 + Math.floor(Math.random() * 60); // 25% 2-4 months
  } else {
    daysOnMarket = 120 + Math.floor(Math.random() * 150); // 25% 4+ months (stale listings)
  }

  // Price reductions based on days on market
  let priceReductions = 0;
  let lastPriceReduction = undefined;
  if (daysOnMarket > 90 && Math.random() > 0.3) {
    priceReductions = 1 + Math.floor(Math.random() * 2); // 1-2 reductions
    lastPriceReduction = 2 + Math.random() * 8; // 2-10% reduction
  } else if (daysOnMarket > 60 && Math.random() > 0.5) {
    priceReductions = 1;
    lastPriceReduction = 2 + Math.random() * 5; // 2-7% reduction
  }

  // Lot size (only for SFH and townhomes)
  const lotSize = (propertyType === "single-family" || propertyType === "townhome")
    ? 2000 + Math.floor(Math.random() * 8000)
    : undefined;

  // Year built
  const yearBuilt = 1960 + Math.floor(Math.random() * 64); // 1960-2024

  // Generate coordinates (simplified - rough metro area)
  const latBase = 30 + Math.random() * 20; // Rough US latitude range
  const lonBase = -120 + Math.random() * 40; // Rough US longitude range

  const property = {
    id: `prop-${metro.id}-${index}`,
    address: generateAddress(index),
    city: metro.name,
    state: metro.state,
    zipCode: String(generateZipCode(metro.state)),
    metroId: metro.id,
    metroName: metro.name,

    propertyType,
    price,
    bedrooms,
    bathrooms,
    sqft,
    lotSize,
    yearBuilt,

    pricePerSqft,
    daysOnMarket,
    priceReductions,
    lastPriceReduction,

    avgPricePerSqftInArea,
    avgDaysOnMarketInArea: metro.daysOnMarket + (Math.random() - 0.5) * 20,
    medianPriceInArea: metro.medianPrice,

    dealScore: 0, // Will be calculated by algorithm

    // Use Zillow search URL with property criteria - will show real listings matching these specs
    listingUrl: `https://www.zillow.com/homes/${encodeURIComponent(metro.name + ', ' + metro.state)}_rb/?searchQueryState={"pagination":{},"mapBounds":{},"regionSelection":[{"regionType":6}],"isMapVisible":true,"filterState":{"price":{"min":${Math.max(0, price - 50000)},"max":${price + 50000}},"beds":{"min":${bedrooms}},"baths":{"min":${bathrooms}},"sqft":{"min":${Math.max(0, sqft - 200)},"max":${sqft + 200}}}}`,
    description: `Beautiful ${bedrooms} bed, ${bathrooms} bath ${propertyType} in ${metro.name}`,

    latitude: latBase,
    longitude: lonBase
  };

  return property;
}

// Generate properties for each metro
console.log('🏠 Generating property listings...\n');

const allProperties = [];
const propertiesPerMetro = 2100; // Generate 2,100 properties per metro = 50,400 total

metrosData.metros.forEach(metro => {
  for (let i = 0; i < propertiesPerMetro; i++) {
    const property = generateProperty(metro, i);
    allProperties.push(property);
  }
  console.log(`  ✅ ${metro.name}: ${propertiesPerMetro} properties`);
});

// Write to file
const outputPath = path.join(__dirname, '../data/properties.json');
fs.writeFileSync(outputPath, JSON.stringify({ properties: allProperties }, null, 2));

console.log(`\n✅ Generated ${allProperties.length} total properties across ${metrosData.metros.length} metros`);
console.log(`✅ Saved to ${outputPath}`);

// Show distribution
const typeCount = {};
propertyTypes.forEach(type => {
  typeCount[type] = allProperties.filter(p => p.propertyType === type).length;
});

console.log('\n📊 Property Type Distribution:');
Object.entries(typeCount).forEach(([type, count]) => {
  console.log(`  • ${type}: ${count} (${(count / allProperties.length * 100).toFixed(1)}%)`);
});
