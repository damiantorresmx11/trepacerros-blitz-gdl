// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Script.sol";
import "../src/RastroNFT.sol";

contract RedeployRastro is Script {
    function run() external {
        uint256 pk = vm.envUint("DEPLOYER_KEY");
        address primaToken = vm.envAddress("PRIMA_TOKEN");

        vm.startBroadcast(pk);
        RastroNFT newRastro = new RastroNFT(primaToken);
        console.log("NEW_RASTRO_NFT:", address(newRastro));
        vm.stopBroadcast();
    }
}
