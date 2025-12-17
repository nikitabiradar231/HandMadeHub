// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ArtNFT is ERC721, Ownable {
    uint256 public tokenId;

    constructor()
        ERC721("ArtNFT", "ANFT")
        Ownable(msg.sender)   
    {}

    function mint() public {
        tokenId++;
        _safeMint(msg.sender, tokenId);
    }
}
