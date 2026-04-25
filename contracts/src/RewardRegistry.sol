// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./PrimaToken.sol";

/**
 * @title RewardRegistry
 * @notice Catálogo de recompensas canjeables con tokens PRIMA.
 * @dev Soporta las 8 categorías de canje: consumo inmediato, eventos,
 *      productos outdoor, sustentabilidad, donación, servicios cotidianos,
 *      merch, y acceso exclusivo.
 */
contract RewardRegistry is Ownable {
    PrimaToken public primaToken;

    enum RewardCategory {
        IMMEDIATE,      // cerveza, café, comida (uso frecuente)
        EXPERIENCE,     // trail runs, talleres, hikes guiados
        OUTDOOR,        // equipo outdoor, reparaciones
        SUSTAINABILITY, // productos eco, plantas, composta
        DONATION,       // donación directa a ONGs
        SERVICE,        // restaurantes, lavanderías, libros
        MERCH,          // merch del proyecto
        EXCLUSIVE       // rutas VIP, early access, membresías
    }

    struct Reward {
        uint256 id;
        string name;
        string description;
        address sponsor;        // dirección del comercio/ONG aliado
        uint256 costInPrima;    // costo en PRIMA (con decimales)
        RewardCategory category;
        uint256 stock;          // -1 simulado con tipo grande = ilimitado
        bool active;
        string imageURI;        // IPFS del logo/imagen
    }

    struct Redemption {
        uint256 rewardId;
        address user;
        uint256 timestamp;
        bytes32 voucherCode;    // código único para canje físico
        bool claimed;           // si ya fue redimido presencialmente
    }

    uint256 private _nextRewardId;
    uint256 private _nextRedemptionId;

    mapping(uint256 => Reward) public rewards;
    mapping(uint256 => Redemption) public redemptions;
    mapping(address => uint256[]) public userRedemptions;
    mapping(address => bool) public approvedSponsors;

    event RewardAdded(uint256 indexed rewardId, string name, RewardCategory category);
    event RewardRedeemed(
        uint256 indexed redemptionId,
        uint256 indexed rewardId,
        address indexed user,
        bytes32 voucherCode
    );
    event VoucherClaimed(uint256 indexed redemptionId, address sponsor);

    constructor(address _primaToken) Ownable(msg.sender) {
        primaToken = PrimaToken(_primaToken);
    }

    modifier onlySponsor() {
        require(approvedSponsors[msg.sender], "Not approved sponsor");
        _;
    }

    function approveSponsor(address sponsor) external onlyOwner {
        approvedSponsors[sponsor] = true;
    }

    /**
     * @notice Añade una nueva recompensa al catálogo.
     * @dev Solo el owner (o sponsor aprobado en versión futura).
     */
    function addReward(
        string memory name,
        string memory description,
        address sponsor,
        uint256 costInPrima,
        RewardCategory category,
        uint256 stock,
        string memory imageURI
    ) external onlyOwner returns (uint256) {
        uint256 rewardId = _nextRewardId++;
        rewards[rewardId] = Reward({
            id: rewardId,
            name: name,
            description: description,
            sponsor: sponsor,
            costInPrima: costInPrima,
            category: category,
            stock: stock,
            active: true,
            imageURI: imageURI
        });

        emit RewardAdded(rewardId, name, category);
        return rewardId;
    }

    /**
     * @notice El usuario canjea sus tokens PRIMA por una recompensa.
     * @dev Quema los tokens del usuario y genera un voucher único.
     */
    function redeemReward(uint256 rewardId) external returns (uint256) {
        Reward storage reward = rewards[rewardId];
        require(reward.active, "Reward not active");
        require(reward.stock > 0, "Out of stock");
        require(
            primaToken.balanceOf(msg.sender) >= reward.costInPrima,
            "Insufficient PRIMA balance"
        );

        // Quemar tokens del usuario
        primaToken.burnFrom(msg.sender, reward.costInPrima);

        // Reducir stock
        reward.stock -= 1;

        // Generar voucher único
        bytes32 voucherCode = keccak256(
            abi.encodePacked(msg.sender, rewardId, block.timestamp, _nextRedemptionId)
        );

        uint256 redemptionId = _nextRedemptionId++;
        redemptions[redemptionId] = Redemption({
            rewardId: rewardId,
            user: msg.sender,
            timestamp: block.timestamp,
            voucherCode: voucherCode,
            claimed: false
        });

        userRedemptions[msg.sender].push(redemptionId);

        emit RewardRedeemed(redemptionId, rewardId, msg.sender, voucherCode);
        return redemptionId;
    }

    /**
     * @notice El sponsor marca un voucher como canjeado físicamente.
     * @dev Esto lo llama el comercio al escanear el QR del usuario.
     */
    function claimVoucher(uint256 redemptionId) external onlySponsor {
        Redemption storage redemption = redemptions[redemptionId];
        Reward storage reward = rewards[redemption.rewardId];

        require(reward.sponsor == msg.sender, "Not the reward sponsor");
        require(!redemption.claimed, "Already claimed");

        redemption.claimed = true;
        emit VoucherClaimed(redemptionId, msg.sender);
    }

    /**
     * @notice Lista todas las recompensas de una categoría (para el frontend).
     */
    function getRewardsByCategory(RewardCategory category)
        external
        view
        returns (uint256[] memory)
    {
        uint256 count = 0;
        for (uint256 i = 0; i < _nextRewardId; i++) {
            if (rewards[i].category == category && rewards[i].active) {
                count++;
            }
        }

        uint256[] memory ids = new uint256[](count);
        uint256 idx = 0;
        for (uint256 i = 0; i < _nextRewardId; i++) {
            if (rewards[i].category == category && rewards[i].active) {
                ids[idx++] = i;
            }
        }
        return ids;
    }

    function getUserRedemptions(address user) external view returns (uint256[] memory) {
        return userRedemptions[user];
    }
}
