// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/PrimaToken.sol";
import "../src/RastroNFT.sol";
import "../src/RewardRegistry.sol";

/**
 * @title Deploy Rastros
 * @notice Deploy completo a Monad testnet + seed de recompensas.
 * @dev Run: forge script script/Deploy.s.sol --rpc-url https://testnet-rpc.monad.xyz --private-key $PK --broadcast
 */
contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        address deployer = vm.addr(deployerPrivateKey);

        // 1. Deploy PrimaToken
        PrimaToken prima = new PrimaToken();
        console.log("PrimaToken deployed at:", address(prima));

        // 2. Deploy RastroNFT
        RastroNFT rastro = new RastroNFT(address(prima));
        console.log("RastroNFT deployed at:", address(rastro));

        // 3. Deploy RewardRegistry
        RewardRegistry registry = new RewardRegistry(address(prima));
        console.log("RewardRegistry deployed at:", address(registry));

        // 4. Setear permisos del token
        prima.setMinter(address(rastro));
        prima.setBurner(address(registry));

        // 5. Aprobar deployer como sponsor demo (para que pueda claim vouchers en la demo)
        registry.approveSponsor(deployer);

        // 6. Seed de recompensas — todas las 8 categorías
        _seedImmediate(registry, deployer);
        _seedExperience(registry, deployer);
        _seedOutdoor(registry, deployer);
        _seedSustainability(registry, deployer);
        _seedDonation(registry, deployer);
        _seedService(registry, deployer);
        _seedMerch(registry, deployer);
        _seedExclusive(registry, deployer);

        vm.stopBroadcast();

        console.log("==========================================");
        console.log("DEPLOY COMPLETE - save these addresses:");
        console.log("PRIMA_TOKEN=", address(prima));
        console.log("RASTRO_NFT=", address(rastro));
        console.log("REWARD_REGISTRY=", address(registry));
        console.log("==========================================");
    }

    // Consumo inmediato — uso frecuente, valor bajo
    function _seedImmediate(RewardRegistry r, address s) internal {
        r.addReward("Chela Cervecera Minerva", "1 cerveza artesanal en bares aliados", s, 20 * 10**18, RewardRegistry.RewardCategory.IMMEDIATE, 100, "ipfs://QmChela");
        r.addReward("Cafe de Especialidad", "1 cafe en cafeterias aliadas", s, 15 * 10**18, RewardRegistry.RewardCategory.IMMEDIATE, 200, "ipfs://QmCafe");
        r.addReward("Smoothie Post-Hike", "Smoothie verde en juice bars", s, 18 * 10**18, RewardRegistry.RewardCategory.IMMEDIATE, 150, "ipfs://QmSmoothie");
        r.addReward("Pan de Masa Madre", "1 pan en panaderias aliadas", s, 12 * 10**18, RewardRegistry.RewardCategory.IMMEDIATE, 100, "ipfs://QmPan");
        r.addReward("Tacos del Dia", "Orden de tacos en locales aliados", s, 25 * 10**18, RewardRegistry.RewardCategory.IMMEDIATE, 80, "ipfs://QmTacos");
    }

    // Eventos y experiencias — valor alto, aspiracionales
    function _seedExperience(RewardRegistry r, address s) internal {
        r.addReward("Trail Run Primavera 2026", "Entrada a carrera oficial", s, 150 * 10**18, RewardRegistry.RewardCategory.EXPERIENCE, 50, "ipfs://QmTrail");
        r.addReward("Hike Guiado con Experto", "Ruta guiada en La Primavera con biologo", s, 80 * 10**18, RewardRegistry.RewardCategory.EXPERIENCE, 30, "ipfs://QmHike");
        r.addReward("Taller de Reforestacion", "Taller de 4hrs con ONG aliada", s, 60 * 10**18, RewardRegistry.RewardCategory.EXPERIENCE, 40, "ipfs://QmTaller");
        r.addReward("Yoga al Amanecer", "Clase de yoga outdoor en el cerro", s, 35 * 10**18, RewardRegistry.RewardCategory.EXPERIENCE, 60, "ipfs://QmYoga");
        r.addReward("Primeros Auxilios Montana", "Curso certificado de 8hrs", s, 200 * 10**18, RewardRegistry.RewardCategory.EXPERIENCE, 20, "ipfs://QmPrimeros");
        r.addReward("Avistamiento de Aves", "Tour de aves silvestres con guia", s, 70 * 10**18, RewardRegistry.RewardCategory.EXPERIENCE, 25, "ipfs://QmAves");
    }

    // Productos outdoor — equipo y servicios deportivos
    function _seedOutdoor(RewardRegistry r, address s) internal {
        r.addReward("Descuento Tienda Outdoor", "30% en tienda de montanismo aliada", s, 50 * 10**18, RewardRegistry.RewardCategory.OUTDOOR, 100, "ipfs://QmOutdoor");
        r.addReward("Botella Reutilizable Branded", "Botella de acero inoxidable", s, 40 * 10**18, RewardRegistry.RewardCategory.OUTDOOR, 80, "ipfs://QmBotella");
        r.addReward("Calcetines Trail", "Calcetines tecnicos", s, 30 * 10**18, RewardRegistry.RewardCategory.OUTDOOR, 60, "ipfs://QmCalc");
        r.addReward("Reparacion de Bicicleta", "Servicio basico en taller aliado", s, 80 * 10**18, RewardRegistry.RewardCategory.OUTDOOR, 40, "ipfs://QmBici");
        r.addReward("Lavado de Equipo", "Lavado profesional de mochila/carpa", s, 45 * 10**18, RewardRegistry.RewardCategory.OUTDOOR, 30, "ipfs://QmLavado");
        r.addReward("Bandana Rastros", "Bandana multiuso del proyecto", s, 25 * 10**18, RewardRegistry.RewardCategory.OUTDOOR, 100, "ipfs://QmBandana");
    }

    // Sustentabilidad — productos eco para la casa
    function _seedSustainability(RewardRegistry r, address s) internal {
        r.addReward("Kit Limpieza a Granel", "Set de productos biodegradables", s, 55 * 10**18, RewardRegistry.RewardCategory.SUSTAINABILITY, 50, "ipfs://QmLimp");
        r.addReward("Shampoo Solido", "Cosmetica solida eco", s, 35 * 10**18, RewardRegistry.RewardCategory.SUSTAINABILITY, 70, "ipfs://QmShamp");
        r.addReward("Planta Nativa de Jalisco", "Planta para tu jardin", s, 30 * 10**18, RewardRegistry.RewardCategory.SUSTAINABILITY, 100, "ipfs://QmPlanta");
        r.addReward("Composta Casera Kit", "Kit para empezar composta", s, 65 * 10**18, RewardRegistry.RewardCategory.SUSTAINABILITY, 40, "ipfs://QmComp");
        r.addReward("Bolsa Reutilizable Set", "3 bolsas de tela organica", s, 20 * 10**18, RewardRegistry.RewardCategory.SUSTAINABILITY, 150, "ipfs://QmBolsa");
    }

    // Donación — altruista, impacto directo
    function _seedDonation(RewardRegistry r, address s) internal {
        r.addReward("Donacion Bosque La Primavera AC", "Aporte directo a la ONG", s, 10 * 10**18, RewardRegistry.RewardCategory.DONATION, 999999, "ipfs://QmDonPrim");
        r.addReward("Refugio Fauna Silvestre", "Ayuda a rescate animal", s, 15 * 10**18, RewardRegistry.RewardCategory.DONATION, 999999, "ipfs://QmDonFauna");
        r.addReward("Reforestacion 1 Arbol", "Financia la plantacion de 1 arbol real", s, 25 * 10**18, RewardRegistry.RewardCategory.DONATION, 999999, "ipfs://QmArbol");
        r.addReward("Rescate Animal Jalisco", "Donativo a centro de rescate", s, 20 * 10**18, RewardRegistry.RewardCategory.DONATION, 999999, "ipfs://QmRescate");
        r.addReward("Beca Ambiental Estudiante", "Aporta a beca de estudios ambientales", s, 50 * 10**18, RewardRegistry.RewardCategory.DONATION, 999999, "ipfs://QmBeca");
    }

    // Servicios cotidianos — expansión del uso
    function _seedService(RewardRegistry r, address s) internal {
        r.addReward("Menu del Dia Restaurante", "Comida corrida en restaurantes aliados", s, 40 * 10**18, RewardRegistry.RewardCategory.SERVICE, 80, "ipfs://QmMenu");
        r.addReward("Lavanderia Ciclo", "Ciclo de lavado + secado", s, 25 * 10**18, RewardRegistry.RewardCategory.SERVICE, 60, "ipfs://QmLav");
        r.addReward("Libreria Independiente", "Descuento en libros", s, 30 * 10**18, RewardRegistry.RewardCategory.SERVICE, 50, "ipfs://QmLib");
        r.addReward("Corte de Pelo", "Corte en barberia/peluqueria aliada", s, 45 * 10**18, RewardRegistry.RewardCategory.SERVICE, 40, "ipfs://QmCorte");
        r.addReward("Pase 1 Dia Gym", "Entrada a estudio fitness aliado", s, 35 * 10**18, RewardRegistry.RewardCategory.SERVICE, 80, "ipfs://QmGym");
    }

    // Merch — identidad del proyecto
    function _seedMerch(RewardRegistry r, address s) internal {
        r.addReward("Playera Rastros", "Playera del proyecto edicion limitada", s, 60 * 10**18, RewardRegistry.RewardCategory.MERCH, 100, "ipfs://QmPlay");
        r.addReward("Hoodie Edicion Limitada", "Sudadera edicion Blitz GDL 2026", s, 120 * 10**18, RewardRegistry.RewardCategory.MERCH, 50, "ipfs://QmHood");
        r.addReward("Kit de Limpieza Hiker", "Guantes, bolsas biodegradables, pinza", s, 35 * 10**18, RewardRegistry.RewardCategory.MERCH, 150, "ipfs://QmKit");
        r.addReward("Sticker Pack Temporada", "Pack de stickers y parches", s, 15 * 10**18, RewardRegistry.RewardCategory.MERCH, 200, "ipfs://QmStick");
        r.addReward("NFT Especial Blitz GDL", "NFT coleccionable del evento", s, 100 * 10**18, RewardRegistry.RewardCategory.MERCH, 30, "ipfs://QmNFTblitz");
    }

    // Acceso exclusivo — lo top, solo para los activos
    function _seedExclusive(RewardRegistry r, address s) internal {
        r.addReward("Ruta VIP Guiada Primavera", "Acceso a ruta privada con guia", s, 180 * 10**18, RewardRegistry.RewardCategory.EXCLUSIVE, 15, "ipfs://QmVIP");
        r.addReward("Early Access Nueva Zona", "Primeros en acceder a cerro nuevo", s, 80 * 10**18, RewardRegistry.RewardCategory.EXCLUSIVE, 40, "ipfs://QmEarly");
        r.addReward("Evento Sponsor Exclusivo", "Invitacion a evento privado de marca", s, 100 * 10**18, RewardRegistry.RewardCategory.EXCLUSIVE, 25, "ipfs://QmEvent");
        r.addReward("Membresia Premium 3 Meses", "Features avanzadas en la app", s, 150 * 10**18, RewardRegistry.RewardCategory.EXCLUSIVE, 50, "ipfs://QmPrem");
    }
}
