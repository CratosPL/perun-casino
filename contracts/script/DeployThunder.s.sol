// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {ThunderBondingCurve} from "../src/ThunderBondingCurve.sol";

contract DeployThunder is Script {
    function run() external returns (ThunderBondingCurve) {
        address usdcAddress = vm.envAddress("USDC_ADDRESS");
        
        vm.startBroadcast();
        
        ThunderBondingCurve thunder = new 
ThunderBondingCurve(usdcAddress);
        
        vm.stopBroadcast();
        
        return thunder;
    }
}

