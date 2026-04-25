"use client";

import { useState } from "react";
import { TRASH_TYPES, TrashTypeInfo } from "../data/trashTypes";
import { HikeStats } from "./useHikeTracker";

interface SubmitHikeProps {
  stats: HikeStats;
  points: Array<{ lat: number; lng: number }>;
  onSubmit: (data: {
    photo: File;
    trashType: TrashTypeInfo;
    trashGrams: number;
    trailType: number;
    officialCheckpoint: boolean;
  }) => Promise<void>;
}

// Reto diario — cambia según el día del año para evitar reusar fotos
function getDailyChallenge(): string {
  const day = new Date().getDay();
  const challenges = [
    "Pon una hoja verde junto a la bolsa",
    "Muestra un pulgar arriba en la foto",
    "Pon una piedra encima de la bolsa",
    "Escribe RASTROS en la tierra junto a la bolsa",
    "Dibuja un círculo en el suelo alrededor de la bolsa",
    "Muestra dos dedos haciendo paz",
    "Pon tu gorra/cachucha encima de la bolsa",
  ];
  return challenges[day];
}

export function SubmitHike({ stats, points, onSubmit }: SubmitHikeProps) {
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedTrashType, setSelectedTrashType] = useState<TrashTypeInfo | null>(null);
  const [trashKg, setTrashKg] = useState(0.5);
  const [trailType, setTrailType] = useState(0);
  const [officialCheckpoint, setOfficialCheckpoint] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const dailyChallenge = getDailyChallenge();

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!photo || !selectedTrashType) return;

    // Validaciones anti-fraude del lado cliente (refuerzo antes de contrato)
    if (stats.distanceMeters < 1000) {
      alert("Distancia mínima: 1 km. Tu hike tiene " + (stats.distanceMeters / 1000).toFixed(2) + " km.");
      return;
    }
    if (stats.durationSeconds < 1800) {
      alert("Duración mínima: 30 min. Tu hike tiene " + Math.floor(stats.durationSeconds / 60) + " min.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        photo,
        trashType: selectedTrashType,
        trashGrams: Math.round(trashKg * 1000),
        trailType,
        officialCheckpoint,
      });
    } catch (err) {
      console.error(err);
      alert("Error al enviar. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  // Cálculo preview de recompensa
  const calculateReward = (): number => {
    let reward = trashKg * 10;
    if (selectedTrashType) {
      if (selectedTrashType.contractEnum === 5) reward *= 2;
      else if (selectedTrashType.contractEnum !== 0) reward *= 1.5;
    }
    if (officialCheckpoint) reward *= 2;
    return Math.floor(reward);
  };

  return (
    <div className="submit-hike">
      <div className="stats-summary">
        <h2>Tu Hike</h2>
        <div className="stat-grid">
          <div className="stat">
            <span className="stat-label">Distancia</span>
            <span className="stat-value">{(stats.distanceMeters / 1000).toFixed(2)} km</span>
          </div>
          <div className="stat">
            <span className="stat-label">Tiempo</span>
            <span className="stat-value">{Math.floor(stats.durationSeconds / 60)} min</span>
          </div>
          <div className="stat">
            <span className="stat-label">Desnivel</span>
            <span className="stat-value">+{Math.round(stats.elevationGain)} m</span>
          </div>
          <div className="stat">
            <span className="stat-label">Vel. Prom.</span>
            <span className="stat-value">{stats.averageSpeedKmh.toFixed(1)} km/h</span>
          </div>
        </div>
      </div>

      <div className="section">
        <label className="section-title">Foto de la basura recolectada</label>
        <div className="daily-challenge">
          <span className="challenge-icon">🎯</span>
          <div>
            <strong>Reto de hoy:</strong>
            <p>{dailyChallenge}</p>
          </div>
        </div>

        {photoPreview ? (
          <div className="photo-preview">
            <img src={photoPreview} alt="Basura recolectada" />
            <button onClick={() => { setPhoto(null); setPhotoPreview(null); }}>
              Cambiar foto
            </button>
          </div>
        ) : (
          <label className="photo-upload">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoChange}
              style={{ display: "none" }}
            />
            <div className="upload-placeholder">
              <span>📸 Tomar foto</span>
            </div>
          </label>
        )}
      </div>

      <div className="section">
        <label className="section-title">¿Qué recolectaste?</label>
        <div className="trash-types-grid">
          {TRASH_TYPES.map((type) => (
            <button
              key={type.id}
              className={`trash-card ${selectedTrashType?.id === type.id ? "selected" : ""}`}
              onClick={() => setSelectedTrashType(type)}
            >
              <span className="trash-icon">{type.icono}</span>
              <span className="trash-name">{type.nombre}</span>
              {type.multiplicador > 1 && (
                <span className="multiplicador">{type.multiplicador}x</span>
              )}
            </button>
          ))}
        </div>

        {selectedTrashType && (
          <div className="trash-info">
            <h4>{selectedTrashType.icono} {selectedTrashType.nombre}</h4>
            <p className="info-impact">{selectedTrashType.impacto}</p>
            <div className="info-grid">
              <div>
                <strong>Tiempo de degradación:</strong> {selectedTrashType.tiempo_degradacion}
              </div>
              <div>
                <strong>Disposición correcta:</strong> {selectedTrashType.ruta_correcta}
              </div>
              <div>
                <strong>Cómo separar:</strong> {selectedTrashType.como_separar}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="section">
        <label className="section-title">Peso estimado</label>
        <div className="kg-slider">
          <input
            type="range"
            min="0.1"
            max="10"
            step="0.1"
            value={trashKg}
            onChange={(e) => setTrashKg(parseFloat(e.target.value))}
          />
          <span className="kg-value">{trashKg.toFixed(1)} kg</span>
        </div>
      </div>

      <div className="section">
        <label className="section-title">Cerro</label>
        <select value={trailType} onChange={(e) => setTrailType(parseInt(e.target.value))}>
          <option value={0}>Bosque La Primavera</option>
          <option value={1}>Cerro del Colli</option>
          <option value={2}>Bosque Los Colomos</option>
          <option value={3}>Parque Metropolitano</option>
          <option value={4}>Otro</option>
        </select>
      </div>

      <div className="section">
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={officialCheckpoint}
            onChange={(e) => setOfficialCheckpoint(e.target.checked)}
          />
          <span>Pasé por estación oficial de pesaje (2x recompensa)</span>
        </label>
      </div>

      <div className="reward-preview">
        <span>Recibirás:</span>
        <span className="reward-amount">{calculateReward()} PRIMA</span>
        <span className="reward-subtitle">+ NFT único de tu ruta</span>
      </div>

      <button
        className="submit-button"
        onClick={handleSubmit}
        disabled={!photo || !selectedTrashType || submitting}
      >
        {submitting ? "Mintando NFT..." : "Finalizar Hike"}
      </button>
    </div>
  );
}
