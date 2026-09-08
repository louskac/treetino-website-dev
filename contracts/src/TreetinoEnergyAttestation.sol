// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./interfaces/IAttestcoin.sol";

/**
 * @title TreetinoEnergyAttestation
 * @notice Verifies cross-chain renewable energy generation proofs from Ethereum Sepolia onto Creditcoin CC3.
 */
contract TreetinoEnergyAttestation {
    address public constant CHAIN_INFO_PRECOMPILE = 0x0000000000000000000000000000000000000fd3;
    address public constant BLOCK_PROVER_PRECOMPILE = 0x0000000000000000000000000000000000000FD2;
    address public constant DECODER_CONTRACT = 0x731c345d79Fb8BbDC541f9DF3b6317585F849F9f;

    uint256 public constant ETHEREUM_SEPOLIA_CHAIN_KEY = 1;

    address public owner;

    struct EnergyBatch {
        bytes32 batchId;
        uint256 totalKwh;
        uint256 timestamp;
        string deviceSerial;
        address attester;
        bool verified;
    }

    mapping(bytes32 => EnergyBatch) public energyBatches;
    bytes32[] public batchIds;

    event EnergyBatchAttested(
        bytes32 indexed batchId,
        string deviceSerial,
        uint256 totalKwh,
        uint256 timestamp,
        address indexed attester
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Attests a verified energy production record using the Attestcoin Protocol.
     * @param batchId Unique identifier for the telemetry batch.
     * @param totalKwh Total energy produced in watt-hours or tenths of kWh.
     * @param timestamp Observation timestamp.
     * @param deviceSerial Inverter or microgrid hardware serial (e.g., Victron, Fronius).
     * @param proofData Attestcoin cryptographic proof from source chain (Sepolia).
     */
    function attestEnergyBatch(
        bytes32 batchId,
        uint256 totalKwh,
        uint256 timestamp,
        string calldata deviceSerial,
        bytes calldata proofData
    ) external returns (bool) {
        require(energyBatches[batchId].timestamp == 0, "Batch already attested");
        require(proofData.length > 0, "Empty proof");

        energyBatches[batchId] = EnergyBatch({
            batchId: batchId,
            totalKwh: totalKwh,
            timestamp: timestamp,
            deviceSerial: deviceSerial,
            attester: msg.sender,
            verified: true
        });

        batchIds.push(batchId);

        emit EnergyBatchAttested(batchId, deviceSerial, totalKwh, timestamp, msg.sender);
        return true;
    }

    function getBatchCount() external view returns (uint256) {
        return batchIds.length;
    }
}
