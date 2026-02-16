/**
 * Eco-Impact Calculation Utility
 * Based on Life Cycle Assessment (LCA) Framework
 */

const INDUSTRY_STANDARDS = {
  'Reusable Products': { co2: 15, water: 200 }, // kg CO2e, Liters
  'Organic Foods': { co2: 5, water: 150 },
  'Eco-Friendly Home': { co2: 25, water: 500 },
  'Sustainable Fashion': { co2: 20, water: 2700 }, // Fashion is water intensive
  'Zero Waste': { co2: 10, water: 100 },
  'Natural Beauty': { co2: 8, water: 50 },
  'Green Tech': { co2: 50, water: 1000 },
  'Other': { co2: 15, water: 200 }
};

/**
 * Calculates total carbon footprint based on LCA stages
 * Formula: Sum of impacts for each stage
 * @param {Object} lca - Object containing impact values for each stage in kg CO2e
 */
const calculateCarbonFootprint = (lca) => {
  const { rawMaterials = 0, manufacturing = 0, transportation = 0, usage = 0, disposal = 0 } = lca;
  return Number((rawMaterials + manufacturing + transportation + usage + disposal).toFixed(2));
};

/**
 * Calculates EcoScore (0-100) based on comparison with industry standards
 * Formula: 100 * (1 - (ProductFootprint / IndustryStandardFootprint))
 * Adjusted with a base score for being "Sustainable"
 * @param {number} carbonFootprint - Total carbon footprint in kg CO2e
 * @param {string} category - Product category to determine industry standard
 */
const calculateEcoScore = (carbonFootprint, category) => {
  const standard = (INDUSTRY_STANDARDS[category] || INDUSTRY_STANDARDS['Other']).co2;
  
  // A sustainable product should ideally have at least 30-50% lower footprint than standard
  let score = 100 * (1 - (carbonFootprint / (standard * 2))); // We use standard * 2 as the "worst case" 0 score
  
  // Ensure score is within 0-100 range
  score = Math.max(0, Math.min(100, score));
  
  return Math.round(score);
};

/**
 * Calculates Net Savings (Avoided Impact)
 * Formula: Impact of Standard Product - Impact of This Product
 */
const calculateNetSavings = (carbonFootprint, category) => {
  const standard = (INDUSTRY_STANDARDS[category] || INDUSTRY_STANDARDS['Other']).co2;
  return Math.max(0, Number((standard - carbonFootprint).toFixed(2)));
};

/**
 * Calculates Water Saved
 * Formula: (Industry standard water use - Estimated sustainable water use)
 */
const calculateWaterSaved = (carbonFootprint, category) => {
  const standardWater = (INDUSTRY_STANDARDS[category] || INDUSTRY_STANDARDS['Other']).water;
  // Heuristic: Water saving usually correlates with CO2 saving in sustainable manufacturing
  const standardCo2 = (INDUSTRY_STANDARDS[category] || INDUSTRY_STANDARDS['Other']).co2;
  const savingRatio = Math.max(0, (standardCo2 - carbonFootprint) / standardCo2);
  return Math.round(standardWater * savingRatio);
};

/**
 * Calculates Trees Equivalent
 * Formula: CO2 Saved / 22 (One tree absorbs ~22kg CO2/year)
 */
const calculateTreesEquivalent = (co2Saved) => {
  return Number((co2Saved / 22).toFixed(2));
};

module.exports = {
  calculateCarbonFootprint,
  calculateEcoScore,
  calculateNetSavings,
  calculateWaterSaved,
  calculateTreesEquivalent,
  INDUSTRY_STANDARDS
};
