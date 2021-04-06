var crypto = require("crypto");

var code1 = "John Doe";
const hash1 = crypto.createHash("sha256").update(code1).digest("base64");
console.log("First hash: " + hash1);

var code2 = "John doe";
const hash2 = crypto.createHash("sha256").update(code2).digest("base64");
console.log("Second hash: " + hash2);
