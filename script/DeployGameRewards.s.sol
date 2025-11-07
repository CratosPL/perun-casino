// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/GameRewards.sol";

contract DeployGameRewards is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        address thunderAddress = 0xea0438580AaaA57BD27811428169566060073B6e;
        
        vm.startBroadcast(deployerPrivateKey);
        
        GameRewards gameRewards = new GameRewards(
            thunderAddress,
            deployer  // ✅ Backend signer = Twój adres
        );
        
        console.log("GameRewards deployed to:", address(gameRewards));
        console.log("Backend signer:", deployer);
        
        vm.stopBroadcast();
    }
}
