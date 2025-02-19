import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-toolbox/network-helpers");

async function main() {
  // Get impersonatedSigner account
  
  const USDCHolder = "0xf584f8728b874a6a5c7a8d4d387c9aae9172d621";
   // Impersonate the USDC Holder
   await helpers.impersonateAccount(USDCHolder);
   const impersonatedSigner = await ethers.getSigner(USDCHolder);

  // Uniswap V3 Router contract address (on Mainnet)
  const UNISWAP_V3_ROUTER_ADDRESS = "0xE592427A0AEce92De3Edee1F18E0157C05861564"; 
  // Token addresses (replace with actual token addresses from Mainnet)
  const tokenA = "0x6B175474E89094C44Da98b954EedeAC495271d0F"; // DAI token address
  const tokenB = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; // USDC token address

  // Initialize the Uniswap V3 Router contract
  const IUniswapV3Router = await ethers.getContractAt(
    "ISwapRouter",
    UNISWAP_V3_ROUTER_ADDRESS
  );
  console.log("Uniswap V3 Router Contract Address:", UNISWAP_V3_ROUTER_ADDRESS);

  // Amount to add to liquidity (in the smallest units of tokens)
  const amountTokenA = ethers.parseUnits("1000", 18); // 1000 DAI
  const amountTokenB = ethers.parseUnits("1000", 6); // 1000 USDC
  console.log(`Adding liquidity: ${ethers.formatUnits(amountTokenA, 18)} DAI and ${ethers.formatUnits(amountTokenB, 6)} USDC`);

  // Approve tokens for liquidity addition
  const tokenAContract = await ethers.getContractAt("IERC20", tokenA);
  const tokenBContract = await ethers.getContractAt("IERC20", tokenB);

  console.log("Approving token A (DAI) for liquidity...");
  const approvalTxA = await tokenAContract.approve(UNISWAP_V3_ROUTER_ADDRESS, amountTokenA);
  await approvalTxA.wait();
  console.log(`DAI approved for liquidity: ${ethers.formatUnits(amountTokenA, 18)} DAI`);

  console.log("Approving token B (USDC) for liquidity...");
  const approvalTxB = await tokenBContract.approve(UNISWAP_V3_ROUTER_ADDRESS, amountTokenB);
  await approvalTxB.wait();
  console.log(`USDC approved for liquidity: ${ethers.formatUnits(amountTokenB, 6)} USDC`);

  const poolFee = 3000; 
  const lowerPrice = ethers.parseUnits("1", 18); // Lower price range
  const upperPrice = ethers.parseUnits("2", 18); // Upper price range
  console.log("Liquidity range set: Lower Price:", ethers.formatUnits(lowerPrice, 18), "Upper Price:", ethers.formatUnits(upperPrice, 18));

  // Add liquidity to the Uniswap V3 pool
  console.log("Initiating liquidity addition transaction...");
  const tx = await IUniswapV3Router.addLiquidity(
    tokenA,
    tokenB,
    poolFee,
    amountTokenA,
    amountTokenB,
    lowerPrice,
    upperPrice,
    impersonatedSigner.address,
    Math.floor(Date.now() / 1000) + 60 * 10 
  );

  console.log("Transaction Hash:", tx.hash);
  
  const receipt = await tx.wait();
  console.log("Liquidity successfully added to the Uniswap V3 pool!");
  console.log("Transaction Receipt:", receipt);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error in adding liquidity:", error);
    process.exit(1);
  });
