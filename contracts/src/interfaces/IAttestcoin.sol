// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title IAttestcoinPrecompiles
 * @notice Interfaces for Creditcoin CC3 Attestcoin Protocol precompiles and decoder.
 */
interface IChainInfo {
    function getChainInfo(uint256 chainKey) external view returns (bytes memory);
}

interface IBlockProver {
    function verifyProof(
        uint256 chainKey,
        bytes calldata blockHeader,
        bytes calldata proofData
    ) external view returns (bool isValid);
}

interface IAttestcoinDecoder {
    function decodeTransaction(
        bytes calldata encodedTx
    ) external pure returns (
        address from,
        address to,
        uint256 value,
        bytes memory data
    );
}
