// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title BharatShieldEvidence
 * @dev EVM Smart Contract for cryptographic evidence anchoring and court-admissible immutability verification.
 * Designed for BHARAT-SHIELD SENTINEL threat intelligence pipeline.
 */
contract BharatShieldEvidence {

    struct EvidenceRecord {
        bytes32 sha256Hash;
        string campaignId;
        uint256 timestamp;
        address anchorer;
        uint256 blockNumber;
        bool exists;
    }

    // Contract owner / authorized authority
    address public owner;
    
    // Total evidence records anchored on-chain
    uint256 public totalAnchoredRecords;

    // Mapping from SHA-256 Hash (bytes32) -> EvidenceRecord
    mapping(bytes32 => EvidenceRecord) private _records;

    // Events for transparency and indexers
    event EvidenceAnchored(
        bytes32 indexed sha256Hash,
        string indexed campaignId,
        address indexed anchorer,
        uint256 timestamp,
        uint256 blockNumber
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "BharatShieldEvidence: Only owner can perform action");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Anchor a single SHA-256 evidence digest onto the EVM blockchain.
     * @param sha256Hash The 32-byte digest of the canonical JSON evidence bundle.
     * @param campaignId Unique ID of the campaign (e.g., 'CAMPAIGN_007').
     */
    function anchorEvidence(bytes32 sha256Hash, string calldata campaignId) external returns (bool) {
        require(sha256Hash != bytes32(0), "BharatShieldEvidence: Invalid zero hash");
        require(!_records[sha256Hash].exists, "BharatShieldEvidence: Hash already anchored on-chain");

        _records[sha256Hash] = EvidenceRecord({
            sha256Hash: sha256Hash,
            campaignId: campaignId,
            timestamp: block.timestamp,
            anchorer: msg.sender,
            blockNumber: block.number,
            exists: true
        });

        totalAnchoredRecords += 1;

        emit EvidenceAnchored(
            sha256Hash,
            campaignId,
            msg.sender,
            block.timestamp,
            block.number
        );

        return true;
    }

    /**
     * @notice Batch anchor multiple evidence digests in a single transaction for gas optimization.
     * @param hashes Array of SHA-256 digests.
     * @param campaignIds Array of corresponding campaign IDs.
     */
    function batchAnchorEvidence(bytes32[] calldata hashes, string[] calldata campaignIds) external {
        require(hashes.length == campaignIds.length, "BharatShieldEvidence: Array length mismatch");

        for (uint256 i = 0; i < hashes.length; i++) {
            bytes32 hashVal = hashes[i];
            if (hashVal != bytes32(0) && !_records[hashVal].exists) {
                _records[hashVal] = EvidenceRecord({
                    sha256Hash: hashVal,
                    campaignId: campaignIds[i],
                    timestamp: block.timestamp,
                    anchorer: msg.sender,
                    blockNumber: block.number,
                    exists: true
                });
                totalAnchoredRecords += 1;

                emit EvidenceAnchored(
                    hashVal,
                    campaignIds[i],
                    msg.sender,
                    block.timestamp,
                    block.number
                );
            }
        }
    }

    /**
     * @notice Verify whether a given SHA-256 hash exists on-chain and retrieve details.
     * @param sha256Hash The 32-byte hash to look up.
     */
    function verifyEvidence(bytes32 sha256Hash) external view returns (
        bool isAnchored,
        string memory campaignId,
        uint256 timestamp,
        address anchorer,
        uint256 blockNumber
    ) {
        EvidenceRecord memory rec = _records[sha256Hash];
        return (rec.exists, rec.campaignId, rec.timestamp, rec.anchorer, rec.blockNumber);
    }
}
