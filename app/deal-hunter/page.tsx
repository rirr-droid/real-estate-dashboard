"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, Title, Text } from "@tremor/react";
import { getTopDeals, formatPropertyType } from "@/lib/properties";
import { calculateDealScore, getDealScoreColor, getDealRatingColor } from "@/lib/deal-scoring";
import { PropertyType } from "@/types/property";
import { formatCurrency } from "@/lib/data";

export default function DealHunterPage() {
  const [searchCity, setSearchCity] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<PropertyType[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minBeds, setMinBeds] = useState("");
  const [minBaths, setMinBaths] = useState("");
  const [minScore, setMinScore] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);

  const propertyTypeOptions: { value: PropertyType; label: string }[] = [
    { value: "single-family", label: "Single Family" },
    { value: "townhome", label: "Townhome" },
    { value: "condo", label: "Condo" },
    { value: "multi-family", label: "Multi-Family" },
  ];

  const togglePropertyType = (type: PropertyType) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const topDeals = useMemo(() => {
    if (!hasSearched) return [];

    return getTopDeals({
      city: searchCity || undefined,
      propertyTypes: selectedTypes.length > 0 ? selectedTypes : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      minBedrooms: minBeds ? Number(minBeds) : undefined,
      minBathrooms: minBaths ? Number(minBaths) : undefined,
      minDealScore: minScore ? Number(minScore) : undefined,
    }, 100);
  }, [searchCity, selectedTypes, minPrice, maxPrice, minBeds, minBaths, minScore, hasSearched]);

  const handleSearch = () => {
    setHasSearched(true);
    setSelectedProperty(null);
  };

  const handleReset = () => {
    setSearchCity("");
    setSelectedTypes([]);
    setMinPrice("");
    setMaxPrice("");
    setMinBeds("");
    setMinBaths("");
    setMinScore("");
    setHasSearched(false);
    setSelectedProperty(null);
  };

  const selectedPropertyData = selectedProperty
    ? topDeals.find(p => p.id === selectedProperty)
    : null;

  const selectedPropertyAnalysis = selectedPropertyData
    ? calculateDealScore(selectedPropertyData)
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1800px] mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-semibold text-sm inline-flex items-center gap-2 hover:gap-3 transition-all">
            ← Back to Dashboard
          </Link>
          <Title className="text-4xl font-black text-gray-900 mt-4">
            🎯 Deal Hunter
          </Title>
          <Text className="text-gray-600 mt-2">
            Find the best property deals across the US with our proprietary scoring algorithm
          </Text>
        </div>

        {/* Search & Filters */}
        <Card className="shadow-xl border-gray-200">
          <Title className="text-2xl font-bold text-gray-900 mb-6">Search & Filter</Title>

          <div className="space-y-6">
            {/* Location */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Location (City or Metro)
              </label>
              <input
                type="text"
                placeholder="e.g., Seattle, Los Angeles, Miami"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
              <Text className="text-gray-600 text-sm mt-1">
                Leave blank to search all markets
              </Text>
            </div>

            {/* Property Types */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-3">
                Property Types
              </label>
              <div className="flex flex-wrap gap-3">
                {propertyTypeOptions.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => togglePropertyType(value)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      selectedTypes.includes(value)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <Text className="text-gray-600 text-sm mt-1">
                Select one or more, or leave blank for all types
              </Text>
            </div>

            {/* Price Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Min Price
                </label>
                <input
                  type="number"
                  placeholder="e.g., 300000"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Max Price
                </label>
                <input
                  type="number"
                  placeholder="e.g., 1000000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
              </div>
            </div>

            {/* Beds & Baths */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Min Bedrooms
                </label>
                <input
                  type="number"
                  placeholder="e.g., 3"
                  value={minBeds}
                  onChange={(e) => setMinBeds(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Min Bathrooms
                </label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="e.g., 2"
                  value={minBaths}
                  onChange={(e) => setMinBaths(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                />
              </div>
            </div>

            {/* Min Deal Score */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Minimum Deal Score (1-10)
              </label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="10"
                placeholder="e.g., 7.0 for great deals only"
                value={minScore}
                onChange={(e) => setMinScore(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleSearch}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors shadow-md"
              >
                🎯 Find Deals
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </Card>

        {/* Results */}
        {hasSearched && (
          <Card className="shadow-xl border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <Title className="text-2xl font-bold text-gray-900">
                  Top Deals Found: {topDeals.length}
                </Title>
                <Text className="text-gray-600 mt-1">
                  Ranked by deal score • Showing best opportunities first
                </Text>
              </div>
            </div>

            {topDeals.length === 0 ? (
              <div className="text-center py-12">
                <Text className="text-gray-600 text-lg">
                  No properties found matching your criteria. Try adjusting your filters.
                </Text>
              </div>
            ) : (
              <div className="space-y-4">
                {topDeals.map((property) => {
                  const analysis = calculateDealScore(property);
                  const isSelected = selectedProperty === property.id;

                  return (
                    <div
                      key={property.id}
                      className={`border-2 rounded-lg p-4 transition-all cursor-pointer ${
                        isSelected
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                      onClick={() => setSelectedProperty(isSelected ? null : property.id)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        {/* Property Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getDealScoreColor(analysis.dealScore)}`}>
                              Deal Score: {analysis.dealScore}/10
                            </span>
                            <span className={`px-3 py-1 rounded-full text-white text-xs font-bold ${getDealRatingColor(analysis.dealRating)}`}>
                              {analysis.dealRating}
                            </span>
                          </div>

                          <h3 className="font-bold text-xl text-gray-900 mb-1">
                            {property.address}
                          </h3>
                          <Text className="text-gray-600 mb-2">
                            {property.city}, {property.state} {property.zipCode}
                          </Text>

                          <div className="flex flex-wrap gap-4 text-sm">
                            <span className="font-semibold text-gray-900">
                              {formatPropertyType(property.propertyType)}
                            </span>
                            <span className="text-gray-700">
                              {property.bedrooms} bed • {property.bathrooms} bath
                            </span>
                            <span className="text-gray-700">
                              {property.sqft.toLocaleString()} sqft
                            </span>
                            <span className="text-gray-700">
                              Built {property.yearBuilt}
                            </span>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="font-black text-2xl text-gray-900 mb-1">
                            {formatCurrency(property.price)}
                          </div>
                          <Text className="text-gray-600">
                            ${property.pricePerSqft}/sqft
                          </Text>
                          <Text className="text-gray-600 text-sm mt-1">
                            {property.daysOnMarket} days on market
                          </Text>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isSelected && selectedPropertyAnalysis && (
                        <div className="mt-6 pt-6 border-t-2 border-gray-200 space-y-6">
                          {/* Deal Factors */}
                          <div>
                            <h4 className="font-bold text-lg text-gray-900 mb-3">
                              Why This is a Deal
                            </h4>
                            <div className="space-y-2">
                              {selectedPropertyAnalysis.factors.map((factor, idx) => (
                                <div
                                  key={idx}
                                  className={`p-3 rounded-lg ${
                                    factor.impact === "positive"
                                      ? "bg-green-50 border border-green-200"
                                      : "bg-red-50 border border-red-200"
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-semibold text-gray-900">
                                      {factor.impact === "positive" ? "✓" : "⚠"} {factor.factor}
                                    </span>
                                    <span className={`font-bold ${
                                      factor.impact === "positive" ? "text-green-700" : "text-red-700"
                                    }`}>
                                      {factor.points > 0 ? "+" : ""}{factor.points.toFixed(1)} pts
                                    </span>
                                  </div>
                                  <Text className="text-gray-700 text-sm mt-1">
                                    {factor.description}
                                  </Text>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Negotiation Strategy */}
                          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                            <h4 className="font-bold text-lg text-gray-900 mb-3">
                              💡 Negotiation Strategy
                            </h4>

                            <div className="space-y-3">
                              <div>
                                <Text className="text-sm font-semibold text-gray-700">Suggested Offer:</Text>
                                <div className="font-black text-2xl text-blue-700">
                                  {formatCurrency(selectedPropertyAnalysis.negotiationStrategy.suggestedOffer)}
                                </div>
                                <Text className="text-sm text-gray-600">
                                  ({selectedPropertyAnalysis.negotiationStrategy.suggestedOfferPercentage.toFixed(1)}% below asking)
                                </Text>
                              </div>

                              <div>
                                <Text className="text-sm font-semibold text-gray-700 mb-1">Strategy:</Text>
                                <Text className="text-gray-800">
                                  {selectedPropertyAnalysis.negotiationStrategy.strategy}
                                </Text>
                              </div>

                              {selectedPropertyAnalysis.negotiationStrategy.leverage.length > 0 && (
                                <div>
                                  <Text className="text-sm font-semibold text-gray-700 mb-1">Your Leverage:</Text>
                                  <ul className="space-y-1">
                                    {selectedPropertyAnalysis.negotiationStrategy.leverage.map((item, idx) => (
                                      <li key={idx} className="text-sm text-gray-700">
                                        • {item}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {selectedPropertyAnalysis.negotiationStrategy.risks.length > 0 && (
                                <div>
                                  <Text className="text-sm font-semibold text-gray-700 mb-1">Risks to Consider:</Text>
                                  <ul className="space-y-1">
                                    {selectedPropertyAnalysis.negotiationStrategy.risks.map((item, idx) => (
                                      <li key={idx} className="text-sm text-gray-700">
                                        • {item}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* View Listing Button */}
                          <a
                            href={property.listingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg text-center transition-colors"
                          >
                            View Full Listing on Zillow →
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        )}

        {/* Info Box */}
        {!hasSearched && (
          <Card className="shadow-xl border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <Title className="text-2xl font-bold text-gray-900 mb-4">
              How Deal Hunter Works
            </Title>
            <div className="space-y-3 text-gray-700">
              <p>
                <strong>Proprietary Algorithm:</strong> Our system analyzes properties on a 1-10 scale based on price per square foot, days on market, price reductions, and market comparables.
              </p>
              <p>
                <strong>Negotiation Intelligence:</strong> Get data-driven offer suggestions and negotiation strategies tailored to each property&apos;s unique situation.
              </p>
              <p>
                <strong>Nationwide Coverage:</strong> Search across 3,600+ active listings in 24 major US metro areas with advanced filtering by price, property type, and more.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
