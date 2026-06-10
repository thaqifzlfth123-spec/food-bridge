import { FoodListing, UrgencyLevel } from "./mock-data";

const urgencyHierarchy: UrgencyLevel[] = ["Low", "Medium", "High", "Critical", "Expired"];

export function calculateUrgency(listing: FoodListing): UrgencyLevel {
  const now = new Date().getTime();
  const expiry = new Date(listing.expiryTime).getTime();
  const timeRemainingMs = expiry - now;

  if (timeRemainingMs <= 0) return "Expired";

  const hoursRemaining = timeRemainingMs / (1000 * 60 * 60);
  let baseLevel: UrgencyLevel = "Low";

  if (hoursRemaining < 1) {
    baseLevel = "Critical";
  } else if (hoursRemaining <= 3) {
    baseLevel = "High";
  } else if (hoursRemaining <= 6) {
    baseLevel = "Medium";
  }

  if (baseLevel === "Critical") return baseLevel;

  let bump = false;
  if (listing.quantityAvailable > 20) bump = true;
  if (listing.category === "Main Course") bump = true; // approximation for cooked rice/meat

  const pickup = new Date(listing.pickupDeadline).getTime();
  const pickupHoursRemaining = (pickup - now) / (1000 * 60 * 60);
  if (pickupHoursRemaining < 2 && pickupHoursRemaining > 0) bump = true;

  if (bump) {
    const currentIndex = urgencyHierarchy.indexOf(baseLevel);
    if (currentIndex < urgencyHierarchy.length - 2) { // don't bump into Expired
      return urgencyHierarchy[currentIndex + 1];
    }
  }

  return baseLevel;
}
