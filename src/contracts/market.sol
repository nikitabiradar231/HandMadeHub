// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract HandmadeHubNFT is ERC721, Ownable, ReentrancyGuard {

    uint256 public tokenCounter;

    struct MarketItem {
        uint256 tokenId;
        address payable seller;
        uint256 price;
        bool isListed;
    }

    mapping(uint256 => MarketItem) public marketItems;

    event NFTMinted(uint256 tokenId, address owner);
    event NFTListed(uint256 tokenId, uint256 price, address seller);
    event NFTSold(uint256 tokenId, address buyer, uint256 price);

    constructor()
        ERC721("HandmadeHub", "HHNFT")
        Ownable(msg.sender)
    {
        tokenCounter = 0;
    }

    function mintNFT() external {
        tokenCounter++;
        _safeMint(msg.sender, tokenCounter);
        emit NFTMinted(tokenCounter, msg.sender);
    }

    function listNFT(uint256 tokenId, uint256 price) external {
        require(ownerOf(tokenId) == msg.sender, "Not NFT owner");
        require(price > 0, "Price must be > 0");

        marketItems[tokenId] = MarketItem(
            tokenId,
            payable(msg.sender),
            price,
            true
        );

        approve(address(this), tokenId);
        emit NFTListed(tokenId, price, msg.sender);
    }

    function buyNFT(uint256 tokenId) external payable nonReentrant {
        MarketItem storage item = marketItems[tokenId];

        require(item.isListed, "NFT not for sale");
        require(msg.value == item.price, "Incorrect ETH amount");

        item.seller.transfer(msg.value);
        safeTransferFrom(item.seller, msg.sender, tokenId);

        item.isListed = false;
        emit NFTSold(tokenId, msg.sender, item.price);
    }

    function cancelListing(uint256 tokenId) external {
        MarketItem storage item = marketItems[tokenId];
        require(item.seller == msg.sender, "Not seller");

        item.isListed = false;
    }
}
