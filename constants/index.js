const adminAbi = require("./Admin/abi.json");
const adminContractAddress = require("./Admin/address.json");
const blindAuctionFactoryAbi = require("./BlindAuctionFactory/abi.json");
const blindAuctionFactoryContractAddress = require("./BlindAuctionFactory/address.json");
const blindAuctionAbi = require("./BlindAuction/abi.json");

const AUCTIONSTATE = {
  UNVERIFIED: 0,
  REJECTED: 1,
  OPEN: 2,
  SUCCESSFUL: 3,
  FAILED: 4,
};

module.exports = {
  adminAbi,
  adminContractAddress,
  blindAuctionFactoryAbi,
  blindAuctionFactoryContractAddress,
  blindAuctionAbi,
  AUCTIONSTATE,
};
