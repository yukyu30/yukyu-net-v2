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
    // 地球を正面から見たとき:
    // - 右側の経線は ) 形（右に膨らむ）
    // - 左側の経線は ( 形（左に膨らむ）
    // - 中央の経線は | 形（直線）
    //
    // 制御点は円の内側に収める必要がある
    // 端(sin=±1)では制御点がx位置と同じ（膨らみなし、円周上）
    // 中央に近づくほど膨らみが大きい
    const curveFactor = Math.abs(cosVal); // 中央で最大、端で0

    // 制御点: xから外側方向へ（ただし円の内側に収まるよう）
    const maxBulge = Math.sqrt(r * r - (x - cx) * (x - cx)); // その位置での最大膨らみ
    const controlX = x + (sinVal > 0 ? 1 : -1) * maxBulge * curveFactor * 0.5;

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
