const { ethers } = require("hardhat");
const { CRYPTODEV_TOKEN_CONTRACT_ADDRESS } = require("../constants")

const main = async() => {
    
    const cryptodevTokenAddress = CRYPTODEV_TOKEN_CONTRACT_ADDRESS;
    
    const exchangeContractIns = await ethers.getContractFactory("Exchange");

    const deployedExchangeContract = await exchangeContractIns.deploy(
        cryptodevTokenAddress
    );

    await deployedExchangeContract.deployed();

    console.log("Exchange Contract Address", deployedExchangeContract.address)
};

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error.message);
    process.exit(1)
})