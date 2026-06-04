# FoodBridge Campus

FoodBridge Campus is an AI-powered food rescue platform built specifically for university campuses. It aims to bridge the gap between food surplus and student hunger by connecting food donors (like campus cafes or event organizers) directly with receivers (students and volunteers).

## 🚀 Tech Stack
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Forms & Validation:** React Hook Form + Zod
- **Utilities:** `qrcode.react` (for security verification)

## ✨ Key Features (A-Z)

### 1. Role-Based Dashboards
Users can switch between three core roles upon login, each with a tailored experience:
- **Donor:** Can post food listings, manage pending claims, verify QR codes for pickups, mark no-shows, and view an Impact Certificate.
- **Receiver:** Can browse available food, claim items with a daily limit, and view a "My Pickups" cart with generated QR codes.
- **Volunteer:** Can post food or status updates (e.g., "Dining hall is crowded") and browse available food to redistribute to others.

### 2. Food Donation & Listing Flow
- **Detailed Forms:** Donors specify food names, quantity, expiry deadlines, and pickup locations.
- **Dietary Tags:** Support for Halal, Vegetarian, and specific allergy warnings.
- **Urgency Scoring:** The system automatically calculates urgency (Low, Medium, High, Critical) based on the quantity of food and the remaining time until expiry.

### 3. Claiming & Cart System
- **My Pickups:** Receivers add food to their "Cart" (My Pickups). 
- **Approval Flow:** Claims sit in a "Pending" state until the donor explicitly approves them.
- **Daily Claim Limits:** To ensure fair distribution, receivers are strictly limited to **2 claims or 5 total meals per day**.
- **Allergy Confirmation:** If a listing contains allergens, the receiver MUST check a mandatory confirmation box before the system allows them to claim it.

### 4. Security & Verification (QR Codes)
- Once a claim is approved, the system generates a **Unique QR Code** containing the Claim ID on the receiver's dashboard.
- Receivers must show this QR code at the pickup location.
- Donors visually verify the Claim ID under the QR code against their "Approved Pickups" list to ensure the right person is taking the food.

### 5. No-Show Penalty System
- If a receiver fails to pick up their claimed food, donors can mark the claim as a **"No-Show"**.
- Receivers receive warnings on their dashboard. If a receiver accumulates **3 No-Shows**, their account is temporarily restricted from claiming new food, preventing future food waste.

### 6. Donor Trust & Rewards
- **Verified Badges:** Trusted donors (like official Campus Cafes) receive a blue "Verified Donor" checkmark badge on their listings to build confidence.
- **Impact Dashboard & Certificates:** Donors see live metrics (Meals Saved, Waste Reduced). They can also generate a beautiful, shareable **Certificate of Impact** acknowledging their contributions.

### 7. AI Integrations (Mocked for MVP)
- The architecture is prepared for Gemini API integration for future features like:
  - **Description Cleaner:** Formatting messy donor text into clean, appetizing descriptions.
  - **Urgency Explainer:** Generating a one-sentence reason why an item is urgent.
  - **Impact Summarizer:** Creating personalized thank-you messages.

## 🛠️ Getting Started Locally

1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Run the development server:**
   ```bash
   npm run dev
   ```
4. **Open [http://localhost:3000](http://localhost:3000)** in your browser to see the result.

### Testing Accounts (Mock Data)
- **Donor:** `cafe@campus.edu` (Auto-logs in as a Verified Donor)
- **Receiver:** `aina@student.edu` (Auto-logs in as a Receiver)
- **Volunteer:** `sarah@volunteer.org` (Auto-logs in as a Volunteer)
