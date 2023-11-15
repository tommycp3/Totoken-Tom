const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("Totoken", (m) => {
  const totoken = m.contract("Totoken", ["ipfs: //Qmf1Lm9JJrqZyVYym4p3ADtZB9Vn6LevKmmAdbR6FXqJnX", "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", "3" ]);

  // m.call(totoken, "launch", []);

  return { totoken };
});