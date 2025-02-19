// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

interface ISwapRouter {
  function addLiquidity(
    tokenA: string,
    tokenB: string,
    fee: number,
    amountA: ethers.BigNumber,
    amountB: ethers.BigNumber,
    sqrtPriceLimitX96: ethers.BigNumber,
    deadline: number,
    recipient: string
  ): Promise<ethers.ContractTransaction>;
}

