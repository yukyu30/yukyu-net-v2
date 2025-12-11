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
  // 左端: ( 形（左に膨らむ）
  // 中央: | 形（直線）
  // 右端: ) 形（右に膨らむ）
  const getMeridianPath = (baseAngle: number) => {
    const angle = (baseAngle + rotation) % 180;
    const normalizedAngle = angle > 90 ? angle - 180 : angle;

    // 角度からx位置を計算（sin関数で-1〜1の範囲）
    const rad = (normalizedAngle * Math.PI) / 180;
    const sinVal = Math.sin(rad);

    // x位置: 円の内側に収める
    const x = cx + sinVal * r;

    // 曲率: 位置に応じて ( | ) 形に変化
    // 制御点は円の内側に収まるよう、位置に応じた最大曲率を計算
    // 端（x = cx ± r）では曲率0、中央（x = cx）では最大
    const maxCurvature = Math.sqrt(1 - sinVal * sinVal) * r * 0.55;
    const curvature = sinVal * maxCurvature;

    // 透明度: 端に近いほど薄く
    const opacity = Math.abs(Math.cos(rad));

    if (opacity < 0.1) return null;

    // 制御点のx座標
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
