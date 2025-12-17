// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";

/// @title ArtNFT - Mintable ERC721 NFT Contract for Artists
contract ArtNFT is ERC721URIStorage, ERC2981, Ownable {
    uint256 private _nextTokenId = 1;

    // Mapping tokenId → creator/artist address
    mapping(uint256 => address) public artistOf;

    event ArtMinted(address indexed artist, uint256 tokenId, string tokenURI);

    constructor()
        ERC721("ArtistDAppNFT", "ARTD")
        Ownable(msg.sender)
    {
        // default royalty for all NFTs (5%)
        _setDefaultRoyalty(msg.sender, 500); // 500 = 5%
    }

    /// @notice Mint NFT (any user can mint)
    function mintArt(string memory tokenURI) external returns (uint256) {
        uint256 tokenId = _nextTokenId;

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);

        // store creator
        artistOf[tokenId] = msg.sender;

        emit ArtMinted(msg.sender, tokenId, tokenURI);

        _nextTokenId++;

        return tokenId;
    }

    /// @notice Set royalties per NFT (owner/admin only)
    function setTokenRoyalty(
        uint256 tokenId,
        address receiver,
        uint96 royaltyFees
    ) external onlyOwner {
        _setTokenRoyalty(tokenId, receiver, royaltyFees);
    }

    /// @notice Required override for ERC721URIStorage + ERC2981
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage, ERC2981)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
