// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./PrimaToken.sol";

/**
 * @title RastroNFT
 * @notice Cada hike de limpieza se mintea como un NFT único en Monad.
 * @dev El NFT contiene metadata IPFS con: ruta GPS, foto de basura,
 *      kg recolectados, tipo de basura, cerro, timestamp.
 *      Al mintear el NFT, se mintean automáticamente tokens PRIMA
 *      al hiker proporcional a los kg recolectados.
 */
contract RastroNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    PrimaToken public primaToken;

    // Tipos de basura — afecta multiplicador de recompensa
    enum TrashType { MIXED, PET, GLASS, METAL, ORGANIC, HAZARDOUS_REPORT }

    // Tipos de cerro — para categorizar y dar colores al NFT
    enum TrailType { PRIMAVERA, COLLI, COLOMOS, METROPOLITANO, OTHER }

    // Struct que guarda los datos clave del hike on-chain
    struct Rastro {
        address hiker;
        uint256 distanceMeters;    // del GPS
        uint256 durationSeconds;   // del GPS
        uint256 trashGrams;        // peso reportado
        TrashType trashType;
        TrailType trailType;
        bool officialCheckpoint;   // true si pasó por estación oficial
        uint256 timestamp;
    }

    mapping(uint256 => Rastro) public rastros;
    mapping(address => uint256) public hikerTotalKg;      // leaderboard
    mapping(address => uint256) public hikerHikeCount;    // reputación

    // Tasa base: 10 tokens PRIMA por kg
    uint256 public constant BASE_RATE = 10;

    // Validaciones anti-fraude
    uint256 public constant MIN_DISTANCE_METERS = 1000;
    uint256 public constant MIN_DURATION_SECONDS = 1800;
    uint256 public constant MAX_SPEED_MPS = 10; // 10 m/s ~ 36 km/h tope razonable

    event HikeMinted(
        uint256 indexed tokenId,
        address indexed hiker,
        uint256 trashGrams,
        uint256 primaMinted,
        TrailType trail
    );

    constructor(address _primaToken) ERC721("Rastros", "RASTRO") Ownable(msg.sender) {
        primaToken = PrimaToken(_primaToken);
    }

    /**
     * @notice Mintea un NFT del hike + los tokens PRIMA proporcionales.
     * @param to Dirección del hiker.
     * @param uri URI de IPFS con metadata del NFT (imagen compuesta, stats).
     * @param distanceMeters Distancia caminada (GPS).
     * @param durationSeconds Tiempo del hike (GPS).
     * @param trashGrams Gramos de basura recolectada.
     * @param trashType Tipo de basura (afecta multiplicador).
     * @param trailType Cerro donde se hizo el hike.
     * @param officialCheckpoint Si el hike pasó por estación oficial (recompensa 2x).
     */
    function mintRastro(
        address to,
        string memory uri,
        uint256 distanceMeters,
        uint256 durationSeconds,
        uint256 trashGrams,
        TrashType trashType,
        TrailType trailType,
        bool officialCheckpoint
    ) external returns (uint256) {
        // VALIDACIONES ANTI-FRAUDE ON-CHAIN (Capa 1: GPS)
        require(distanceMeters >= MIN_DISTANCE_METERS, "Distance too short");
        require(durationSeconds >= MIN_DURATION_SECONDS, "Duration too short");

        // Velocidad sospechosa (si fue en carro, rechazar)
        uint256 speedMps = distanceMeters / durationSeconds;
        require(speedMps <= MAX_SPEED_MPS, "Suspicious speed - possible vehicle");

        // Mint del NFT
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        // Guardar datos del rastro
        rastros[tokenId] = Rastro({
            hiker: to,
            distanceMeters: distanceMeters,
            durationSeconds: durationSeconds,
            trashGrams: trashGrams,
            trashType: trashType,
            trailType: trailType,
            officialCheckpoint: officialCheckpoint,
            timestamp: block.timestamp
        });

        // Actualizar stats del hiker
        hikerTotalKg[to] += trashGrams;
        hikerHikeCount[to] += 1;

        // Calcular y mintear tokens PRIMA
        uint256 primaAmount = calculateReward(trashGrams, trashType, officialCheckpoint);
        primaToken.mint(to, primaAmount * 10**18);

        emit HikeMinted(tokenId, to, trashGrams, primaAmount, trailType);
        return tokenId;
    }

    /**
     * @notice Calcula la recompensa según tipo de basura y si fue oficial.
     * @dev MIXED = 1x, separado (PET/GLASS/METAL/ORGANIC) = 1.5x, HAZARDOUS = 2x
     *      Si fue checkpoint oficial, multiplica por 2 adicional.
     */
    function calculateReward(
        uint256 trashGrams,
        TrashType trashType,
        bool officialCheckpoint
    ) public pure returns (uint256) {
        uint256 kg = trashGrams / 1000;
        if (kg == 0) kg = 1; // mínimo 1 kg para que no se quede en 0

        uint256 reward = kg * BASE_RATE;

        // Multiplicador por tipo de basura
        if (trashType == TrashType.HAZARDOUS_REPORT) {
            reward = reward * 2; // reportar peligroso paga 2x (no lo tocas)
        } else if (trashType != TrashType.MIXED) {
            reward = (reward * 3) / 2; // separada paga 1.5x
        }

        // Multiplicador por checkpoint oficial
        if (officialCheckpoint) {
            reward = reward * 2;
        }

        return reward;
    }

    /**
     * @notice Info del rastro para el frontend.
     */
    function getRastro(uint256 tokenId) external view returns (Rastro memory) {
        return rastros[tokenId];
    }

    /**
     * @notice Leaderboard: cuántos kg totales ha limpiado un hiker.
     */
    function getHikerStats(address hiker) external view returns (uint256 totalKg, uint256 hikes) {
        return (hikerTotalKg[hiker], hikerHikeCount[hiker]);
    }
}
