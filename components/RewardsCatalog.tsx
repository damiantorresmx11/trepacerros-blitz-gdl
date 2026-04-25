"use client";

import { useState } from "react";
import { REWARDS, CATEGORY_INFO, RewardCategory, Reward } from "../data/rewards";

interface RewardsCatalogProps {
  primaBalance: number;
  onRedeem: (reward: Reward) => Promise<void>;
}

export function RewardsCatalog({ primaBalance, onRedeem }: RewardsCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<RewardCategory | "ALL">("ALL");
  const [redeeming, setRedeeming] = useState<number | null>(null);

  const filteredRewards =
    selectedCategory === "ALL"
      ? REWARDS
      : REWARDS.filter((r) => r.category === selectedCategory);

  const handleRedeem = async (reward: Reward) => {
    if (primaBalance < reward.costInPrima) {
      alert(`Necesitas ${reward.costInPrima} PRIMA. Tienes ${primaBalance}.`);
      return;
    }
    setRedeeming(reward.id);
    try {
      await onRedeem(reward);
    } catch (err) {
      console.error(err);
      alert("Error al canjear. Intenta de nuevo.");
    } finally {
      setRedeeming(null);
    }
  };

  return (
    <div className="rewards-catalog">
      <div className="catalog-header">
        <h1>Catálogo de Recompensas</h1>
        <div className="balance-pill">
          <span className="balance-label">Tus PRIMA:</span>
          <span className="balance-value">{primaBalance}</span>
        </div>
      </div>

      <div className="category-tabs">
        <button
          className={selectedCategory === "ALL" ? "tab active" : "tab"}
          onClick={() => setSelectedCategory("ALL")}
        >
          <span>🔥</span>
          <span>Todas</span>
        </button>
        {(Object.keys(CATEGORY_INFO) as RewardCategory[]).map((cat) => {
          const info = CATEGORY_INFO[cat];
          return (
            <button
              key={cat}
              className={selectedCategory === cat ? "tab active" : "tab"}
              onClick={() => setSelectedCategory(cat)}
              style={{ borderColor: selectedCategory === cat ? info.color : undefined }}
            >
              <span>{info.icon}</span>
              <span>{info.label}</span>
            </button>
          );
        })}
      </div>

      {selectedCategory !== "ALL" && (
        <div className="category-description">
          {CATEGORY_INFO[selectedCategory].description}
        </div>
      )}

      <div className="rewards-grid">
        {filteredRewards.map((reward) => {
          const canAfford = primaBalance >= reward.costInPrima;
          const categoryInfo = CATEGORY_INFO[reward.category];

          return (
            <div
              key={reward.id}
              className={`reward-card ${!canAfford ? "unaffordable" : ""}`}
              style={{ borderTopColor: reward.color }}
            >
              <div className="reward-icon" style={{ background: reward.color + "20" }}>
                {reward.icon}
              </div>
              <div className="reward-category-badge" style={{ color: reward.color }}>
                {categoryInfo.label}
              </div>
              <h3>{reward.name}</h3>
              <p className="reward-description">{reward.description}</p>
              <p className="reward-sponsor">por {reward.sponsor}</p>
              <div className="reward-footer">
                <div className="reward-cost">
                  <span className="cost-value">{reward.costInPrima}</span>
                  <span className="cost-label">PRIMA</span>
                </div>
                <button
                  className="redeem-button"
                  onClick={() => handleRedeem(reward)}
                  disabled={!canAfford || redeeming === reward.id}
                  style={{
                    background: canAfford ? reward.color : undefined,
                  }}
                >
                  {redeeming === reward.id ? "..." : canAfford ? "Canjear" : "Faltan " + (reward.costInPrima - primaBalance)}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
