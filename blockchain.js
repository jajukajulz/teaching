var crypto = require("crypto");

//HASHING
console.log("\n", "-----BEGIN HASHING-----");
var code1 = "John Doe";
const hash1 = crypto.createHash("sha256").update(code1).digest("base64");
console.log("First hash: " + hash1);

var code2 = "John doe";
const hash2 = crypto.createHash("sha256").update(code2).digest("base64");
console.log("Second hash: " + hash2);

console.log(
  "-----END HASHING-----",
  "\n" //new line
);

//ASYMMETRIC ENCRYPTION (3 Steps)
console.log(
  "-----BEGIN ASYMMETRIC ENCRYPTION-----",
  "\n" //new line
);

// Step 1 - Key Generation

// The `generateKeyPairSync` method accepts two arguments:
// 1. The algorithm we wish to use, which in this case is "rsa" - RSA works by generating a public and a private key. The public and private keys are generated together and form a key pair.
// 2. An object with the properties of the key
const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  // The standard secure default length for RSA keys is 2048 bits
  modulusLength: 2048,
});

console.log(
  publicKey.export({
    type: "pkcs1",
    format: "pem",
  }),
  "\n" //new line
);

console.log(
  privateKey.export({
    type: "pkcs1",
    format: "pem",
  }),
  "\n" //new line
);

//PEM (originally “Privacy Enhanced Mail”) is the most common format for X. 509 certificates, CSRs, and cryptographic keys. A PEM file is a text file containing one or more items in Base64 ASCII encoding, each with plain-text headers and footers (e.g. -----BEGIN CERTIFICATE----- and -----END CERTIFICATE----- )

// Step 2 - Encryption

// This is the data we want to encrypt
const data = "Welcome to UCT FinTech 2021";

const encryptedData = crypto.publicEncrypt(
  {
    key: publicKey,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    oaepHash: "sha256",
  },
  // We convert the data string to a buffer using `Buffer.from`
  Buffer.from(data)
);

// The encrypted data is in the form of bytes, so we print it in base64 format
// so that it's displayed in a more readable form
console.log("\n", "encypted data: ", encryptedData.toString("base64"));

// Step 3 - Decryption
//We need to the following:
//The encrypted data (called the cipher text)
//The hash that we used to encrypt the data
//The padding scheme that we used to encrypt the data
//The private key, which we generated in Step 1
const decryptedData = crypto.privateDecrypt(
  {
    key: privateKey,
    // In order to decrypt the data, we need to specify the
    // same hashing function and padding scheme that we used to
    // encrypt the data in the previous step
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    oaepHash: "sha256",
  },
  encryptedData
);

// The decrypted data is of the Buffer type, which we can convert to a
// string to reveal the original data
console.log("\n", "decrypted data: ", decryptedData.toString());

console.log("\n", "-----END ASYMMETRIC ENCRYPTION-----");
