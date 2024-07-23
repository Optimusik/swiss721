// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721, ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract TestNFT is ERC721URIStorage {
    uint256 private _currentTokenId;

    constructor() ERC721("TestNFT", "TNFT") {}

    function mintNFT(address recipient, string memory tokenURI) public returns (uint256) {
        _currentTokenId++;
        uint256 newItemId = _currentTokenId;
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);
        return newItemId;
    }

    function burnNFT(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Only the owner can burn the NFT");
        _burn(tokenId);
    }
}
