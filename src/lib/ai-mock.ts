export async function mockCleanDescription(originalDesc: string): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 1500));
  return `✨ **AI Optimized Description**
- **Details:** ${originalDesc || "Fresh food available for pickup."}
- **Pickup Instructions:** Please arrive 10 minutes before the deadline and bring your own container if possible.
- **Safety Reminder:** Check for allergens and ensure food is consumed within 2 hours of pickup.`;
}

export async function mockUrgencyExplanation(foodName: string, urgency: string): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 1500));
  if (urgency === "Critical") {
    return `🚨 **Why is this Critical?** This batch of ${foodName} expires in less than 2 hours. Immediate pickup is recommended to prevent waste.`;
  }
  if (urgency === "High") {
    return `⚠️ **Why is this High Urgency?** This ${foodName} is a large quantity and expires soon.`;
  }
  return `ℹ️ **Urgency Level:** ${urgency}. Food is safe and available for pickup.`;
}

export async function mockImpactSummary(foodName: string, quantity: number): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 1500));
  return `🌱 **Impact Summary:** By donating ${quantity} packs of ${foodName}, you successfully saved approximately ${(quantity * 0.4).toFixed(1)} kg of food waste and provided meals to students in need. Thank you for your contribution!`;
}
