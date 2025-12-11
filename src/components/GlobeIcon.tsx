'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface GlobeIconProps {
  size?: number;
  className?: string;
}

export default function GlobeIcon({ size = 20, className = '' }: GlobeIconProps) {
  const [rotation, setRotation] = useState(0);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    // 回転角度を連続的に更新
    const animate = () => {
      setRotation(prev => (prev + 1) % 360);
      animationRef.current = requestAnimationFrame(animate);
    };

    // 60fpsで約6秒で1回転（360度 / 60fps / 6秒 = 1度/フレーム）
    const interval = setInterval(() => {
      setRotation(prev => (prev + 2) % 360);
    }, 50);

    return () => {
      clearInterval(interval);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const cx = 12;
  const cy = 12;
  const r = 8;

  // 経線の数と間隔（30度間隔で12本だが、見える範囲は前面の半分）
  const meridianAngles = [0, 30, 60, 90, 120, 150];

  // 経線のパスを計算
  const getMeridianPath = (baseAngle: number) => {
    // 回転を加えた角度
    const angle = (baseAngle + rotation) % 180;
    // -90〜90の範囲に正規化（前面に見える範囲）
    const normalizedAngle = angle > 90 ? angle - 180 : angle;

    // 角度からx位置を計算（sin関数で-r〜rの範囲）
    const rad = (normalizedAngle * Math.PI) / 180;
    const x = cx + Math.sin(rad) * r;

    // 経線の曲率（中央で直線、端で曲線）
    // cos(角度)が曲率を決定
    const curvature = Math.cos(rad) * 3;

    // 経線が端に近いほど透明に
    const opacity = Math.cos(rad);

    if (opacity < 0.1) return null; // 裏側は表示しない

    // 二次ベジェ曲線で経線を描画
    const path = `M ${x} ${cy - r} Q ${x + curvature} ${cy} ${x} ${cy + r}`;

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

      {/* 赤道（水平楕円） */}
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
