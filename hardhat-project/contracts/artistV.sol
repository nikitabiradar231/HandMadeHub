// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ArtistProfile is Ownable {

    struct Profile {
        address wallet;
        string name;
        string bio;
        string uri; // optional off-chain metadata (IPFS URL)
        bool exists;
        bool verified; // set by owner/admin
    }

    mapping(address => Profile) public profiles;

    event ArtistRegistered(address indexed artist, string name, string uri);
    event ArtistUpdated(address indexed artist, string name, string uri);
    event ArtistVerified(address indexed artist, bool verified);

    constructor() Ownable(msg.sender) {}

    /// @notice Register or update the caller as an artist
    function registerArtist(
        string calldata name,
        string calldata bio,
        string calldata uri
    ) external {
        Profile storage p = profiles[msg.sender];

        if (!p.exists) {
            p.wallet = msg.sender;
            p.exists = true;
            emit ArtistRegistered(msg.sender, name, uri);
        } else {
            emit ArtistUpdated(msg.sender, name, uri);
        }

        p.name = name;
        p.bio = bio;
        p.uri = uri;
    }

    /// @notice Admin can set verification status for an artist
    function setVerified(address artist, bool verified) external onlyOwner {
        require(profiles[artist].exists, "Artist not registered");

        profiles[artist].verified = verified;
        emit ArtistVerified(artist, verified);
    }

    /// @notice Check if an address is a registered artist
    function isArtist(address addr) external view returns (bool) {
        return profiles[addr].exists;
    }

    /// @notice Check if an artist is verified
    function isVerified(address addr) external view returns (bool) {
        return profiles[addr].verified;
    }

    /// @notice Get profile metadata URI
    function profileURI(address addr) external view returns (string memory) {
        return profiles[addr].uri;
    }
}
