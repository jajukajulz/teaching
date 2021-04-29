/*
Testing smart contracts is very important because you need to make sure that they work perfectly before going live on the blockchain.


Truffle uses the Mocha testing framework and Chai for assertions to provide you with a solid framework from which to write your JavaScript tests.
Mocha is a feature-rich JavaScript test framework running on Node.js and in the browser, 
making asynchronous testing simple and fun. Mocha tests run serially, allowing for flexible and accurate reporting, 
while mapping uncaught exceptions to the correct test cases. Hosted on GitHub.


The describe call is what gives structure to your test suite i.e. logically group your tests
i.e. `describe()` is merely for grouping

The it call identifies each individual tests but by itself it does not tell Mocha anything about how your test suite is structured. 
i.e. `it()` is a test case

`before()`, `beforeEach()`, `after()`, `afterEach()` are hooks to run before/after first/each it() or describe().

Ref - https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
*/

const Day1Registry = artifacts.require("Day1Registry"); //const Day1Registry = artifacts.require("../contracts/Day1Registry.sol");

contract("Day1Registry", (accounts) => {
  // predefine parameters
  let day1registryInstance;
  const name = "SatoshiTest";
  const surname = "NakamotoTest";
  const surname2 = "NakamotoTest2";

  before(async () => {
    // fetch deployed instance of Day1Registry contract
    day1registryInstance = await Day1Registry.deployed();
  });

  describe("deployment", async () => {
    it("deploys successfully", async () => {
      const address = await day1registryInstance.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });
  });

  describe("adding a user", async () => {
    it("should contain zero users in the beginning", async function () {
      // get the number of users
      let userCounter = await day1registryInstance.getNumberOfUsers();
      // check that there are no users initially
      assert.equal(userCounter, 0, "initial number not equal to zero");
    });

    it("should add a user to the registry", async function () {
      // register a user from account 0
      await day1registryInstance.registerUser(name, surname, {
        from: accounts[0],
      });
      // get the number of users
      let userCounter = await day1registryInstance.getNumberOfUsers();
      // check that there is one user now registered
      assert.equal(userCounter, 1, "user was not successfully registered");
    });

    it("retrieve added user from the registry", async function () {
      // retrieve the user details
      let user = await day1registryInstance.day1_users(0);
      // check that they match the original user details
      assert.equal(
        user["added_by"],
        accounts[0],
        "added by address does not match"
      );
      assert.equal(user["name"], name, "name does not match");
      assert.equal(user["surname"], surname, "surname does not match");
      //assert.equal(user["surname"], surname2, "surname does not match - decoy test");
    });
  });
});
