# FoodBridge Campus

FoodBridge Campus is an AI-powered food rescue platform built specifically for university campuses. It aims to bridge the gap between food surplus and student hunger by connecting food donors (like campus cafes or event organizers) directly with receivers (students and volunteers).

## 🚀 Tech Stack
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Database:** MySQL (XAMPP)
- **ORM:** Prisma v5
- **Styling:** Tailwind CSS
- **Icons:** Lucide React

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

### 3. Database-Enforced Claiming System
- **Real-Time Inventory:** When a receiver claims food, the database immediately deducts the requested quantity from the listing.
- **Strict Daily Limits:** Receivers are mathematically limited by the database to **2 claims per day** or **5 total meals per day**. Any request exceeding this is hard-blocked.
- **Allergy Confirmation:** If a listing contains allergens, the receiver MUST check a mandatory confirmation box before claiming.

### 4. Security & Verification (QR Codes)
- Once a claim is approved, the system generates a **Unique QR Code** containing the Claim ID on the receiver's dashboard.
- Receivers must show this QR code at the pickup location.
- Donors visually verify the Claim ID under the QR code against their "Approved Pickups" list to ensure the right person is taking the food.

### 5. No-Show Penalty System
- If a receiver fails to pick up their claimed food, donors can mark the claim as a **"No-Show"**.
- If a receiver accumulates **3 No-Shows**, the database actively restricts their account from claiming any new food, preventing future food waste.

### 6. Search & Filtering
- Users can instantly filter the live database feed using the Search Bar (searching by food name or description) and Category Dropdown.

### 7. AI Integrations (Planned)
- Future integrations will include Auto-Categorization (guessing dietary tags from text) and Intelligent Urgency Sorting (bringing expiring food to the top of the feed).

## 🛠️ Getting Started Locally

1. **Start XAMPP** (Ensure Apache and MySQL are running).
2. **Clone the repository** and install dependencies:
   ```bash
   npm install
   ```
3. **Set up the Database**
   - Create a `.env` file in the root directory.
   - Add your connection string: `DATABASE_URL="mysql://root:@localhost:3306/foodbridge"`
   - Generate the database client and push the schema:
     ```bash
     npx prisma generate
     npx prisma db push
     ```
4. **Run the development server:**
   ```bash
   npm run dev
   ```
5. **Open [http://localhost:3000](http://localhost:3000)** in your browser!
