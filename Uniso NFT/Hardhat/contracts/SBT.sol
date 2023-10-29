// pragma solidity ^0.8.4;

// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

// contract SoulBoundNFT is ERC721, Ownable {
//     mapping(uint256 => string) private tokenCID;
//     uint256 private tokenIdCounter;
//     uint256 private totalNfts;

//     constructor() ERC721("SoulBoundNFT", "SOUL") {
//         tokenIdCounter = 1;
//         totalNfts = 0;
//     }

//     function mintNFT(address _to, string memory _tokenCID) public onlyOwner {
//         uint256 tokenId = tokenIdCounter;
//         _mint(_to, tokenId);
//         tokenCID[tokenId] = _tokenCID;
//         tokenIdCounter++;
//         totalNfts++;
//     }

//     function getTotalNFTsMinted() external view returns (uint256) {
//         return totalNfts;
//     }

   
// }


// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SoulBoundNFT is ERC721, ERC721URIStorage, Ownable {

    uint256 private _tokenIdCounter;
     mapping(uint256 => string) private tokenCID;
     uint256 private tokenIdCounter;
     uint256 private totalNfts;

    constructor() ERC721("SoulBound", "SBT") {}

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
    return super.supportsInterface(interfaceId);
}


function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 data)
    internal
    override
{
    require(from == address(0), "Token not transferable");
    super._beforeTokenTransfer(from, to, tokenId, data);
}

    function safeMint(address to) public onlyOwner {
        _tokenIdCounter += 1;
        _safeMint(to, _tokenIdCounter);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function mintNFT(address _to, string memory _tokenCID) public  {
    uint256 tokenId = tokenIdCounter;
    _mint(_to, tokenId);
    _setTokenURI(tokenId, _tokenCID);
    tokenIdCounter++;
    totalNfts++;
}

function getTokenCIDBySigner(address signer) public view returns (string memory) {
    for (uint256 tokenId = 0; tokenId <= tokenIdCounter; tokenId++) {
        address owner = ownerOf(tokenId);
        if (owner == signer) {
            return tokenURI(tokenId);
        }
    }
    return "";
}


    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}