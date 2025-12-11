'use client';

import { useEffect, useState } from 'react';

interface GlobeIconProps {
  size?: number;
  className?: string;
}

export default function GlobeIcon({ size = 20, className = '' }: GlobeIconProps) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 2) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const cx = 12;
  const cy = 12;
  const r = 8;

  // 経線の数（45度間隔で4本）
  const meridianAngles = [0, 45, 90, 135];

  // 経線のパスを計算
  const getMeridianPath = (baseAngle: number) => {
    const angle = (baseAngle + rotation) % 180;
    const normalizedAngle = angle > 90 ? angle - 180 : angle;

    const rad = (normalizedAngle * Math.PI) / 180;
    const sinVal = Math.sin(rad);
    const cosVal = Math.cos(rad);

    // x位置
    const x = cx + sinVal * r;

    // 透明度: 端に近いほど薄く
    const opacity = Math.abs(cosVal);
    if (opacity < 0.1) return null;

    // 曲率の計算
    // 中央(sin=0): 直線 (曲率=0)
    // 端(sin=±1): 半円 (曲率=r)
    //
    // ベジェ曲線で半円を描くには制御点を約 r * 0.55 離す必要がある
    // ただし端では経線の始点・終点が円周上にあるため、
    // 制御点は円の中心方向に r だけ離れる
    //
    // 曲率 = sin(角度) * r（端で最大、中央で0）
    // ただし制御点が円の外に出ないよう調整
    const curveFactor = Math.abs(sinVal);

    // 端に近づくほど曲率を大きく（半円に近づける）
    // 制御点を円の中心方向へ（右側の経線は左へ、左側の経線は右へ）
    const controlOffset = sinVal * r * curveFactor;
    const controlX = cx + (sinVal * r * (1 - curveFactor));

    const path = `M ${x} ${cy - r} Q ${controlX} ${cy} ${x} ${cy + r}`;

    return { path, opacity };
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
    >
      {/* 外周の円 */}
      <circle cx={cx} cy={cy} r={r} />

      {/* 赤道 */}
      <line x1={cx - r} y1={cy} x2={cx + r} y2={cy} />

      {/* 回転する経線 */}
      {meridianAngles.map((angle, i) => {
        const meridian = getMeridianPath(angle);
        if (!meridian) return null;
        return (
          <path
            key={i}
            d={meridian.path}
            strokeOpacity={meridian.opacity * 0.8}
          />
        );
      })}
    </svg>
  );
}
