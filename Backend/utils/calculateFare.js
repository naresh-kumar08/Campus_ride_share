const RATE_PER_KM = 5; // Rs per KM for additional distance
const BASE_FARE = 20; // Minimum fare in Rs
const BASE_DISTANCE = 4; // Base distance in km

function calculateFare(distanceKm = 0) {
  const distance = Number(distanceKm) || 0;
  
  // Minimum fare is ₹20 for any distance up to 4 km
  if (distance <= BASE_DISTANCE) {
    return BASE_FARE;
  }
  
  // For distance > 4 km: Base fare ₹20 + (distance - 4) * ₹5
  const additionalDistance = distance - BASE_DISTANCE;
  const additionalFare = additionalDistance * RATE_PER_KM;
  const totalFare = BASE_FARE + additionalFare;
  
  return Math.max(0, Math.round(totalFare * 100) / 100);
}

module.exports = {
  RATE_PER_KM,
  BASE_FARE,
  BASE_DISTANCE,
  calculateFare,
};


