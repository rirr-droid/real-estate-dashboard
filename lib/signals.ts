import { Metro } from "@/types";

export type Signal = "strong_buy" | "buy" | "hold" | "sell" | "strong_sell";

export interface MarketSignal {
  signal: Signal;
  score: number; // 0-100
  reasons: string[];
  momentum: "bullish" | "bearish" | "neutral";
}

// Calculate market signal based on multiple factors
export function getMarketSignal(metro: Metro): MarketSignal {
  let score = 50; // Start neutral
  const reasons: string[] = [];

  // Factor 1: Recent price momentum (40% weight)
  const oneYear = metro.priceChangeByPeriod["1Y"];
  const fiveYear = metro.priceChangeByPeriod["5Y"];

  if (oneYear > 5) {
    score += 15;
    reasons.push(`Strong 1Y growth: ${oneYear.toFixed(1)}%`);
  } else if (oneYear > 2) {
    score += 8;
    reasons.push(`Positive 1Y trend: ${oneYear.toFixed(1)}%`);
  } else if (oneYear < -3) {
    score -= 15;
    reasons.push(`Weak 1Y performance: ${oneYear.toFixed(1)}%`);
  } else if (oneYear < 0) {
    score -= 8;
    reasons.push(`Negative 1Y trend: ${oneYear.toFixed(1)}%`);
  }

  if (fiveYear > 30) {
    score += 10;
    reasons.push("Excellent 5Y appreciation");
  } else if (fiveYear > 20) {
    score += 5;
    reasons.push("Good 5Y appreciation");
  }

  // Factor 2: Rental yield (25% weight)
  const yield_ = metro.rentalYield;

  if (yield_ > 12) {
    score += 12;
    reasons.push(`High rental yield: ${yield_.toFixed(2)}%`);
  } else if (yield_ > 9) {
    score += 6;
    reasons.push(`Good rental yield: ${yield_.toFixed(2)}%`);
  } else if (yield_ < 5) {
    score -= 8;
    reasons.push(`Low rental yield: ${yield_.toFixed(2)}%`);
  }

  // Factor 3: Market velocity (20% weight)
  const dom = metro.daysOnMarket;

  if (dom < 30) {
    score += 10;
    reasons.push(`Hot market: ${dom} days on market`);
  } else if (dom < 40) {
    score += 5;
    reasons.push("Fast-moving market");
  } else if (dom > 55) {
    score -= 10;
    reasons.push(`Slow market: ${dom} days on market`);
  }

  // Factor 4: STR potential (15% weight)
  const revPAR = metro.strMetrics.revPAR;

  if (revPAR > 140) {
    score += 8;
    reasons.push(`Excellent STR potential: $${revPAR}/day`);
  } else if (revPAR > 110) {
    score += 4;
    reasons.push("Good STR potential");
  } else if (revPAR < 80) {
    score -= 5;
    reasons.push("Limited STR potential");
  }

  // Factor 5: Price accessibility
  const price = metro.medianPrice;

  if (price < 350000 && yield_ > 8) {
    score += 5;
    reasons.push("Affordable with strong yield");
  } else if (price > 900000 && yield_ < 6) {
    score -= 5;
    reasons.push("High price with low yield");
  }

  // Determine momentum
  let momentum: "bullish" | "bearish" | "neutral";
  if (oneYear > 3 && fiveYear > 20) {
    momentum = "bullish";
  } else if (oneYear < -2 && dom > 50) {
    momentum = "bearish";
  } else {
    momentum = "neutral";
  }

  // Clamp score
  score = Math.max(0, Math.min(100, score));

  // Determine signal
  let signal: Signal;
  if (score >= 75) {
    signal = "strong_buy";
  } else if (score >= 60) {
    signal = "buy";
  } else if (score >= 40) {
    signal = "hold";
  } else if (score >= 25) {
    signal = "sell";
  } else {
    signal = "strong_sell";
  }

  return { signal, score, reasons, momentum };
}

export function getSignalColor(signal: Signal): string {
  switch (signal) {
    case "strong_buy": return "bg-green-600 text-white";
    case "buy": return "bg-green-400 text-white";
    case "hold": return "bg-yellow-400 text-gray-900";
    case "sell": return "bg-orange-500 text-white";
    case "strong_sell": return "bg-red-600 text-white";
  }
}

export function getSignalLabel(signal: Signal): string {
  switch (signal) {
    case "strong_buy": return "STRONG BUY";
    case "buy": return "BUY";
    case "hold": return "HOLD";
    case "sell": return "SELL";
    case "strong_sell": return "STRONG SELL";
  }
}

export function getMomentumColor(momentum: "bullish" | "bearish" | "neutral"): string {
  switch (momentum) {
    case "bullish": return "text-green-600";
    case "bearish": return "text-red-600";
    case "neutral": return "text-gray-600";
  }
}
