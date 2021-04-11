var Day1RegistryArtifact = artifacts.require("Day1Registry");

module.exports = function (deployer) {
  deployer.deploy(Day1RegistryArtifact);
};
