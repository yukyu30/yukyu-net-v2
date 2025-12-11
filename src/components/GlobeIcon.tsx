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

  // 経線の数（30度間隔で6本）
  const meridianAngles = [0, 30, 60, 90, 120, 150];

  // 経線のパスを計算
  // 左端: ( 形（左に膨らむ）
  // 中央: | 形（直線）
  // 右端: ) 形（右に膨らむ）
  const getMeridianPath = (baseAngle: number) => {
    const angle = (baseAngle + rotation) % 180;
    const normalizedAngle = angle > 90 ? angle - 180 : angle;

    // 角度からx位置を計算
    const rad = (normalizedAngle * Math.PI) / 180;
    const x = cx + Math.sin(rad) * r;

    // 曲率: 左端で負（左膨らみ）、中央で0（直線）、右端で正（右膨らみ）
    // sin(角度)で曲率の方向と大きさを決定
    const curvature = Math.sin(rad) * 4;

    // 透明度: 端に近いほど薄く
    const opacity = Math.abs(Math.cos(rad));

    if (opacity < 0.15) return null;

    // 制御点のx座標（曲率を反映）
    const controlX = x + curvature;

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
      <ellipse cx={cx} cy={cy} rx={r} ry={2} />

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
