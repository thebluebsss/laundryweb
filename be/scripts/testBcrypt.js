import bcrypt from "bcryptjs";

const testBcrypt = async () => {
  const password = "123456";

  console.log("Testing bcrypt...\n");
  console.log("Plain password:", password);

  // Hash password
  const hash = await bcrypt.hash(password, 10);
  console.log("Generated hash:", hash);

  // Compare
  const isValid = await bcrypt.compare(password, hash);
  console.log("Comparison result:", isValid);

  // Test with existing hash
  const existingHash =
    "$2b$10$dHLEDdJUlovev57.2DPqLepxV1JFjSMCBhQxqcF3qPcgjL0N5XLim";
  console.log("\nTesting with existing hash:", existingHash);
  const isValidExisting = await bcrypt.compare(password, existingHash);
  console.log("Comparison result:", isValidExisting);

  // Try different passwords
  console.log("\nTrying different passwords:");
  const passwords = ["123456", "admin", "admin123", "password"];
  for (const pwd of passwords) {
    const result = await bcrypt.compare(pwd, existingHash);
    console.log(`  "${pwd}":`, result);
  }
};

testBcrypt();
