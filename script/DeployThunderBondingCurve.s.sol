// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/ThunderBondingCurve.sol";

contract DeployThunderBondingCurve is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address usdcAddress = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913; // Base USDC
        
        vm.startBroadcast(deployerPrivateKey);
        
        ThunderBondingCurve thunder = new ThunderBondingCurve(usdcAddress);
        
        console.log("ThunderBondingCurve deployed to:", address(thunder));
        
        vm.stopBroadcast();
    }
}
