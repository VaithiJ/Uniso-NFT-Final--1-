// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract SendToDeployer {
    address payable public deployer;

    constructor() {
        deployer = payable(msg.sender);
    }

    function sendToDeployer() public payable {
        require(msg.value > 0, "Must send positive value");
        deployer.transfer(msg.value);
    }
}
