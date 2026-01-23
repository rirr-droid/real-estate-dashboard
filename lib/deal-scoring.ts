import { Property, DealAnalysis, DealFactor, NegotiationStrategy } from "@/types/property";

/**
 * Proprietary Deal Scoring Algorithm
 * Analyzes properties on a 1-10 scale based on multiple factors
 */
export function calculateDealScore(property: Property): DealAnalysis {
  const factors: DealFactor[] = [];
  let totalScore = 5; // Start at neutral

  // Factor 1: Price per sqft vs area average (30% weight)
  const pricePerSqftDiff = ((property.pricePerSqft - property.avgPricePerSqftInArea) / property.avgPricePerSqftInArea) * 100;
  if (pricePerSqftDiff < -15) {
    totalScore += 1.5;
    factors.push({
      factor: "Price per Sqft",
      impact: "positive",
      description: `${Math.abs(pricePerSqftDiff).toFixed(1)}% below area average ($${property.pricePerSqft} vs $${property.avgPricePerSqftInArea})`,
      points: 1.5
    });
  } else if (pricePerSqftDiff < -8) {
    totalScore += 1.0;
    factors.push({
      factor: "Price per Sqft",
      impact: "positive",
      description: `${Math.abs(pricePerSqftDiff).toFixed(1)}% below area average`,
      points: 1.0
    });
  } else if (pricePerSqftDiff > 10) {
    totalScore -= 1.0;
    factors.push({
      factor: "Price per Sqft",
      impact: "negative",
      description: `${pricePerSqftDiff.toFixed(1)}% above area average - overpriced`,
      points: -1.0
    });
  }

  // Factor 2: Days on market (25% weight)
  if (property.daysOnMarket > 90) {
    const points = Math.min(2.0, (property.daysOnMarket - 90) / 60);
    totalScore += points;
    factors.push({
      factor: "Days on Market",
      impact: "positive",
      description: `${property.daysOnMarket} days - seller likely motivated`,
      points: points
    });
  } else if (property.daysOnMarket < 14) {
    totalScore -= 0.5;
    factors.push({
      factor: "Days on Market",
      impact: "negative",
      description: `Only ${property.daysOnMarket} days - limited negotiation leverage`,
      points: -0.5
    });
  }

  // Factor 3: Price reductions (20% weight)
  if (property.priceReductions > 0) {
    const points = Math.min(1.5, property.priceReductions * 0.5);
    totalScore += points;
    factors.push({
      factor: "Price Reductions",
      impact: "positive",
      description: `${property.priceReductions} price reduction${property.priceReductions > 1 ? 's' : ''} - seller is flexible`,
      points: points
    });
  }

  // Factor 4: Price vs area median (15% weight)
  const priceVsMedian = ((property.price - property.medianPriceInArea) / property.medianPriceInArea) * 100;
  if (priceVsMedian < -10 && property.sqft >= property.medianPriceInArea / property.avgPricePerSqftInArea * 0.9) {
    totalScore += 0.8;
    factors.push({
      factor: "Market Position",
      impact: "positive",
      description: `Priced ${Math.abs(priceVsMedian).toFixed(1)}% below area median with good size`,
      points: 0.8
    });
  }

  // Factor 5: Property age and condition proxy (10% weight)
  const propertyAge = new Date().getFullYear() - property.yearBuilt;
  if (propertyAge < 10) {
    totalScore += 0.5;
    factors.push({
      factor: "Property Age",
      impact: "positive",
      description: `Built in ${property.yearBuilt} - newer construction`,
      points: 0.5
    });
  } else if (propertyAge > 50 && property.pricePerSqft < property.avgPricePerSqftInArea * 0.85) {
    totalScore += 0.3;
    factors.push({
      factor: "Renovation Opportunity",
      impact: "positive",
      description: `${propertyAge} years old at below-market price - potential value-add`,
      points: 0.3
    });
  }

  // Normalize score to 1-10 range
  totalScore = Math.max(1, Math.min(10, totalScore));

  // Generate negotiation strategy
  const negotiationStrategy = generateNegotiationStrategy(property);

  // Determine rating
  let dealRating: DealAnalysis["dealRating"];
  if (totalScore >= 8.5) dealRating = "Exceptional";
  else if (totalScore >= 7.0) dealRating = "Great";
  else if (totalScore >= 5.5) dealRating = "Good";
  else if (totalScore >= 4.0) dealRating = "Fair";
  else dealRating = "Poor";

  return {
    dealScore: parseFloat(totalScore.toFixed(1)),
    dealRating,
    factors,
    negotiationStrategy
  };
}

function generateNegotiationStrategy(
  property: Property
): NegotiationStrategy {
  let offerPercentage = 0;
  const leverage: string[] = [];
  const risks: string[] = [];

  // Base offer percentage on deal score and market factors
  if (property.daysOnMarket > 120) {
    offerPercentage += 8;
    leverage.push(`Property has been on market for ${property.daysOnMarket} days`);
  } else if (property.daysOnMarket > 60) {
    offerPercentage += 5;
    leverage.push(`${property.daysOnMarket} days on market suggests seller flexibility`);
  } else if (property.daysOnMarket < 14) {
    offerPercentage -= 2;
    risks.push("Fresh listing - seller may have multiple offers");
  }

  if (property.priceReductions >= 2) {
    offerPercentage += 5;
    leverage.push(`${property.priceReductions} price reductions indicate motivated seller`);
  } else if (property.priceReductions === 1) {
    offerPercentage += 3;
    leverage.push("Seller has already reduced price once");
  }

  const pricePerSqftDiff = ((property.pricePerSqft - property.avgPricePerSqftInArea) / property.avgPricePerSqftInArea) * 100;
  if (pricePerSqftDiff > 10) {
    offerPercentage += 7;
    leverage.push(`Overpriced by ${pricePerSqftDiff.toFixed(1)}% compared to area average`);
  } else if (pricePerSqftDiff < -10) {
    offerPercentage -= 3;
    risks.push("Already priced competitively - limited room for negotiation");
  }

  // Cap offer percentage between 2% and 15%
  offerPercentage = Math.max(2, Math.min(15, offerPercentage));

  const suggestedOffer = Math.round(property.price * (1 - offerPercentage / 100));

  // Generate strategy description
  let strategy = "";
  if (offerPercentage >= 10) {
    strategy = `Strong negotiating position. Start ${offerPercentage}% below asking with evidence of comparable sales. Emphasize the extended time on market and be prepared to walk away.`;
  } else if (offerPercentage >= 7) {
    strategy = `Moderate leverage. Offer ${offerPercentage}% below asking and highlight any property concerns or market data supporting your position.`;
  } else if (offerPercentage >= 5) {
    strategy = `Competitive market. Offer ${offerPercentage}% below asking but be prepared to negotiate up slightly. Move quickly if interested.`;
  } else {
    strategy = `Hot property. Offer ${offerPercentage}% below asking maximum, or consider full price with favorable terms. Be prepared for multiple offers.`;
  }

  // Add property-type specific considerations
  if (property.propertyType === "condo") {
    leverage.push("Request HOA documents and recent financials before finalizing offer");
  }
  if (property.yearBuilt < 1980) {
    leverage.push("Consider inspection contingency for older systems and structure");
  }

  return {
    suggestedOffer,
    suggestedOfferPercentage: offerPercentage,
    strategy,
    leverage,
    risks
  };
}

export function getDealScoreColor(score: number): string {
  if (score >= 8.5) return "text-green-700 bg-green-100";
  if (score >= 7.0) return "text-green-600 bg-green-50";
  if (score >= 5.5) return "text-blue-600 bg-blue-50";
  if (score >= 4.0) return "text-yellow-600 bg-yellow-50";
  return "text-red-600 bg-red-50";
}

export function getDealRatingColor(rating: DealAnalysis["dealRating"]): string {
  switch (rating) {
    case "Exceptional": return "bg-green-600";
    case "Great": return "bg-green-500";
    case "Good": return "bg-blue-500";
    case "Fair": return "bg-yellow-500";
    case "Poor": return "bg-red-500";
  }
}
