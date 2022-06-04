
import { Contract } from "ethers";
import {
  EXCHANGE_CONTRACT_ABI,
  EXCHANGE_CONTRACT_ADDRESS,
  CRYPTODEV_TOKEN_CONTRACT_ADDRESS,
  CRYPTO_DEV_TOKEN_CONTRACT_ABI,
} from "../constants";

export const getEtherBalance = async (provider, address, contract = false) => {
  try {
    if (contract) {
      const balance = await provider.getBalance(EXCHANGE_CONTRACT_ADDRESS);
      return balance;
    } else {
      const balance = await provider.getBalance(address);
      return balance;
    }
  } catch (error) {
    console.error(error.message);
    return 0;
  }
};

export const getCDTokensBalance = async (provider, address) => {
  try {
    const tokenContract = new Contract(
      CRYPTODEV_TOKEN_CONTRACT_ADDRESS,
      CRYPTO_DEV_TOKEN_CONTRACT_ABI,
      provider
    );

    const cdBalance = await tokenContract.balanceOf(address);
    return cdBalance;
  } catch (err) {
    console.error(err.message);
  }
};

export const getLPTokensBalance = async (provider, address) => {
  try {
    const exchangeContract = new Contract(
      EXCHANGE_CONTRACT_ADDRESS,
      EXCHANGE_CONTRACT_ABI,
      provider
    );

    const userLPTokenBalance = await exchangeContract.balanceOf(address);
    return userLPTokenBalance;
  } catch (err) {
    console.error(err.message);
  }
};

export const getReserveOfCDTokens = async (provider) => {
  try {
    const exchangeContract = new Contract(
      EXCHANGE_CONTRACT_ADDRESS,
      EXCHANGE_CONTRACT_ABI,
      provider
    );
    const tokenReserve = exchangeContract.getReserve();
    return tokenReserve;
  } catch (err) {
    console.error(err.message);
  }
};
