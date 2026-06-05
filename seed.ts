import { seedDatabase } from "./src/app/actions";

async function main() {
  console.log("Seeding database...");
  const result = await seedDatabase();
  console.log(result);
}

main();
