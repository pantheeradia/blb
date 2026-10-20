import { db } from "../src/db/client";
import { products } from "../src/db/schema";

async function main() {
  const rows = await db.select().from(products);
  console.log(JSON.stringify(rows, null, 2));
}

main().catch(console.error);
