// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Totoken is ERC1155, Ownable {

    struct NFTMetadata {
        string tokenName;
        string tokenDescription;
        string imageLink;
    }

    mapping(uint256 => NFTMetadata) public tokenMetadata;
    uint256 public nextTokenId;
    uint256 public totalNfts; // New variable for the total number of NFTs

    constructor(string memory _uri, address initialOwner, uint256 _totalNfts) ERC1155(_uri) Ownable(initialOwner) {
        nextTokenId = 1;
        totalNfts = _totalNfts;
    }

    function mintNFT(
        address account,
        uint256 tokenId,
        string memory _tokenName,
        string memory _tokenDescription,
        string memory _imageLink,
        uint256 amount
    ) external onlyOwner {
        require(nextTokenId <= totalNfts, "Total NFTs minted exceeded");
        
        _mint(account, tokenId, amount, "");
        tokenMetadata[tokenId] = NFTMetadata({
            tokenName: _tokenName,
            tokenDescription: _tokenDescription,
            imageLink: _imageLink
        });
        nextTokenId++;
    }

    function batchMintNFT(
        address account,
        uint256[] memory tokenIds,
        string[] memory tokenNames,
        string[] memory tokenDescriptions,
        string[] memory imageLinks,
        uint256[] memory amounts
    ) external onlyOwner {
        require(
            tokenIds.length == tokenNames.length &&
            tokenNames.length == tokenDescriptions.length &&
            tokenDescriptions.length == imageLinks.length &&
            imageLinks.length == amounts.length,
            "Input arrays must have the same length"
        );

        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(nextTokenId <= totalNfts, "Total NFTs minted exceeded");

            uint256 tokenId = tokenIds[i];
            _mint(account, tokenId, amounts[i], "");
            tokenMetadata[tokenId] = NFTMetadata({
                tokenName: tokenNames[i],
                tokenDescription: tokenDescriptions[i],
                imageLink: imageLinks[i]
            });
            if (tokenId >= nextTokenId) {
                nextTokenId = tokenId + 1;
            }
        }
    }
}