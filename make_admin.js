const mongoose = require("mongoose");

require("dotenv").config({ path: ".env.local" });

async function upgradeToAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB.");

    const result = await mongoose.connection.collection("users").updateMany(
      {},
      { $set: { role: "admin" } }
    );

    console.log(`Successfully upgraded ${result.modifiedCount} accounts to Admin role!`);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

upgradeToAdmin();
