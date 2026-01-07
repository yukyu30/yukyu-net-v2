'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// react-force-graph-2dは SSR非対応なので動的インポート
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ForceGraph2D: any = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <span className="text-green-400 font-mono animate-pulse">
        Loading graph...
      </span>
    </div>
  ),
});

interface GraphNode {
  id: string;
  name: string;
  tags: string[];
  date: string;
  url: string;
  group: string;
  x?: number;
  y?: number;
}

interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  value: number;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

// タグごとの色マッピング
const tagColors: Record<string, string> = {
  '日記': '#4ade80',
  '技術': '#60a5fa',
  '読書': '#f472b6',
  'VR': '#a78bfa',
  'ゲーム': '#fbbf24',
  '振り返り': '#34d399',
  '目標': '#f87171',
  'other': '#6b7280',
};

function getNodeColor(group: string): string {
  return tagColors[group] || tagColors['other'];
}

export default function ArticleGraph() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);

  // グラフデータを読み込み
  useEffect(() => {
    fetch('/graph/graph-data.json')
      .then(res => res.json())
      .then(data => setGraphData(data))
      .catch(err => console.error('Failed to load graph data:', err));
  }, []);

  // コンテナサイズを監視
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // ノードクリック時のハンドラ
  const handleNodeClick = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (node: any) => {
      if (node?.url) {
        router.push(node.url);
      }
    },
    [router]
  );

  // ノードホバー時のハンドラ
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleNodeHover = useCallback((node: any) => {
    setHoveredNode(node || null);
  }, []);

  // ノードの描画
  const nodeCanvasObject = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const label = node.name || node.id;
      const fontSize = 12 / globalScale;
      ctx.font = `${fontSize}px monospace`;

      // ノードの円を描画
      const nodeSize = 6;
      ctx.beginPath();
      ctx.arc(node.x || 0, node.y || 0, nodeSize, 0, 2 * Math.PI);
      ctx.fillStyle = getNodeColor(node.group || 'other');
      ctx.fill();

      // ホバー中または拡大時はラベルを表示
      if (hoveredNode?.id === node.id || globalScale > 1.5) {
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#4ade80';
        ctx.fillText(label, node.x || 0, (node.y || 0) + nodeSize + fontSize);
      }
    },
    [hoveredNode]
  );

  if (!graphData) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-green-400 font-mono animate-pulse">
          Loading graph data...
        </span>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <ForceGraph2D
        graphData={graphData}
        width={dimensions.width}
        height={dimensions.height}
        nodeCanvasObject={nodeCanvasObject}
        nodePointerAreaPaint={(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          node: any,
          color: string,
          ctx: CanvasRenderingContext2D
        ) => {
          ctx.beginPath();
          ctx.arc(node.x || 0, node.y || 0, 8, 0, 2 * Math.PI);
          ctx.fillStyle = color;
          ctx.fill();
        }}
        linkColor={() => 'rgba(74, 222, 128, 0.3)'}
        linkWidth={1}
        onNodeClick={handleNodeClick}
        onNodeHover={handleNodeHover}
        backgroundColor="transparent"
        cooldownTime={5000}
        d3AlphaMin={0.001}
        d3AlphaDecay={0.008}
        d3VelocityDecay={0.2}
        warmupTicks={0}
        enableNodeDrag={true}
        enableZoomInteraction={true}
        enablePanInteraction={true}
        linkDistance={10}
        nodeRelSize={4}
        dagMode={undefined}
        onEngineStop={() => {}}
        d3Force={(d3: { force: (name: string) => { strength?: (s: number) => void; distanceMax?: (d: number) => void; distance?: (d: number) => void } | null }) => {
          const charge = d3.force('charge');
          if (charge && charge.strength) {
            charge.strength(-2);
          }
          if (charge && charge.distanceMax) {
            charge.distanceMax(50);
          }
          const link = d3.force('link');
          if (link && link.distance) {
            link.distance(20);
          }
          // 中心への引力
          const forceX = d3.force('x');
          if (forceX && forceX.strength) {
            forceX.strength(0.3);
          }
          const forceY = d3.force('y');
          if (forceY && forceY.strength) {
            forceY.strength(0.3);
          }
        }}
      />

      {/* ホバー中のノード情報 */}
      {hoveredNode && (
        <div className="absolute top-4 left-4 bg-black/90 border border-green-400 p-3 max-w-xs">
          <h3 className="text-green-400 font-mono font-bold text-sm">
            {hoveredNode.name}
          </h3>
          {hoveredNode.tags && hoveredNode.tags.length > 0 && (
            <p className="text-green-600 font-mono text-xs mt-1">
              {hoveredNode.tags.join(', ')}
            </p>
          )}
          <p className="text-green-700 font-mono text-xs mt-1">
            Click to open
          </p>
        </div>
      )}

      {/* 凡例 */}
      <div className="absolute bottom-4 right-4 bg-black/90 border border-green-400 p-3">
        <p className="text-green-400 font-mono text-xs mb-2">LEGEND</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          {Object.entries(tagColors)
            .filter(([key]) => key !== 'other')
            .slice(0, 6)
            .map(([tag, color]) => (
              <div key={tag} className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-green-600 font-mono text-xs">{tag}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
