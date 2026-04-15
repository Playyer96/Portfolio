import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import '../styles/TechStackGraph.scss';
import techStackData from '../data/techStack.json';

const TechStackGraph = () => {
  const canvasRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [hoveredNode, setHoveredNode] = useState(null);
  const animationFrameRef = useRef(null);
  const nodesRef = useRef([]);

  // Define state variables first (before any code that uses them)
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const zoomRef = useRef(1);
  const panXRef = useRef(0);
  const panYRef = useRef(0);
  const draggedNodeRef = useRef(null);
  const isPanningRef = useRef(false);
  const panStartRef = useRef({ x: 0, y: 0 });

  const nodeData = techStackData.nodes;
  const connections = techStackData.relationships;

  useEffect(() => {
    // Initialize nodes with radial layout - much more spread out
    const initialNodes = nodeData.map((data, index) => {
      let angle, distance;

      if (data.type === 'softSkill') {
        // Soft skills in center
        angle = (index / 3) * Math.PI * 2;
        distance = 50;
      } else {
        // All other types in radial sectors away from center
        const typeIndex = data.type === 'gamedev' ? 0 : data.type === 'web' ? 1 : 2;
        const itemsPerType = data.type === 'gamedev' ? 7 : data.type === 'web' ? 4 : 3;
        const indexInType = index - (data.type === 'gamedev' ? 3 : data.type === 'web' ? 10 : 14);

        // Spread types across 3 major sectors
        const sectorAngle = (typeIndex / 3) * Math.PI * 2;
        const itemAngle = (indexInType / itemsPerType) * (Math.PI * 0.8); // Spread within sector
        angle = sectorAngle + itemAngle - (Math.PI * 0.4); // Center within sector

        // Much larger distance to spread nodes out
        distance = 350 + Math.random() * 100;
      }

      return {
        ...data,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        vx: 0,
        vy: 0,
        isDragging: false,
        fixed: false,
      };
    });

    nodesRef.current = initialNodes;
    setNodes(initialNodes);
  }, []);

  // Handler functions
  const handleCanvasMouseMove = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    // Inverse of: translate(center + pan) then scale(zoom)
    // Convert screen coords to canvas world coords
    const mouseX = ((e.clientX - rect.left - canvas.width / 2 - panXRef.current) / zoomRef.current);
    const mouseY = ((e.clientY - rect.top - canvas.height / 2 - panYRef.current) / zoomRef.current);

    // Handle dragging
    if (draggedNodeRef.current) {
      const node = draggedNodeRef.current;
      node.x = mouseX;
      node.y = mouseY;
      node.vx = 0;
      node.vy = 0;
      return;
    }

    // Find hovered node
    let nearestNode = null;
    let minDist = 35;

    nodesRef.current.forEach((node) => {
      const dist = Math.sqrt((node.x - mouseX) ** 2 + (node.y - mouseY) ** 2);
      if (dist < minDist) {
        minDist = dist;
        nearestNode = node.id;
      }
    });

    setHoveredNode(nearestNode);
  };

  const handleCanvasMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left - canvas.width / 2 - panXRef.current) / zoomRef.current);
    const mouseY = ((e.clientY - rect.top - canvas.height / 2 - panYRef.current) / zoomRef.current);

    let nearestNode = null;
    let minDist = 35;

    nodesRef.current.forEach((node) => {
      const dist = Math.sqrt((node.x - mouseX) ** 2 + (node.y - mouseY) ** 2);
      if (dist < minDist) {
        minDist = dist;
        nearestNode = node;
      }
    });

    if (nearestNode) {
      nearestNode.isDragging = true;
      draggedNodeRef.current = nearestNode;
    }
  };

  const handleCanvasMouseUp = () => {
    if (draggedNodeRef.current) {
      draggedNodeRef.current.isDragging = false;
      draggedNodeRef.current = null;
    }
    isPanningRef.current = false;
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomSpeed = 0.1;
    const newZoom = Math.max(0.05, Math.min(10, zoom + (e.deltaY > 0 ? -zoomSpeed : zoomSpeed)));
    setZoom(newZoom);
  };

  const handleCanvasPanStart = (e) => {
    // Right-click or middle-click for panning (or Ctrl+click)
    if (e.button === 2 || e.button === 1 || (e.ctrlKey && e.button === 0)) {
      isPanningRef.current = true;
      panStartRef.current = { x: e.clientX - panX, y: e.clientY - panY };
    }
  };

  const handleCanvasPanMove = (e) => {
    if (isPanningRef.current) {
      const newPanX = e.clientX - panStartRef.current.x;
      const newPanY = e.clientY - panStartRef.current.y;
      setPanX(newPanX);
      setPanY(newPanY);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Combined mouse move handler for both hover detection and panning
    const handleMouseMove = (e) => {
      handleCanvasMouseMove(e);
      handleCanvasPanMove(e);
    };

    // Combined mouse down handler
    const handleMouseDown = (e) => {
      handleCanvasMouseDown(e);
      handleCanvasPanStart(e);
    };

    // Mouse leave handler
    const handleMouseLeave = () => {
      setHoveredNode(null);
      handleCanvasMouseUp();
    };

    // Attach event listeners
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleCanvasMouseUp);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    // Cleanup on unmount
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleCanvasMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('contextmenu', (e) => e.preventDefault());
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = 3.5;

    const animate = () => {
      // Clear canvas COMPLETELY before any transformations
      ctx.fillStyle = 'rgba(10, 15, 30, 1)';  // Fully opaque to clear properly
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Save context for transformations
      ctx.save();

      // Apply pan and zoom (use refs to get latest values)
      ctx.translate(canvas.width / 2 + panXRef.current, canvas.height / 2 + panYRef.current);
      ctx.scale(zoomRef.current, zoomRef.current);

      const nodes = nodesRef.current;

      // Physics simulation - Obsidian-style force-directed layout
      nodes.forEach((node, i) => {
        if (node.isDragging) {
          node.vx *= 0.85;
          node.vy *= 0.85;
          return;
        }

        let fx = 0;
        let fy = 0;

        // NO center attraction - this is key to Obsidian's spread
        // Instead, we let repulsion naturally push nodes outward

        // Strong repulsion from other nodes (keep them far apart)
        nodes.forEach((other, j) => {
          if (i === j) return;
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy) + 0.5;
          const minDistance = 120; // Minimum distance between nodes
          const repulsion = Math.pow(minDistance / Math.max(dist, minDistance), 2) * 4;
          fx += (dx / dist) * repulsion;
          fy += (dy / dist) * repulsion;
        });

        // Weak attraction to connected nodes (repulsion dominates)
        connections.forEach((conn) => {
          if (conn.from === node.id) {
            const target = nodes.find((n) => n.id === conn.to);
            if (target) {
              const dx = target.x - node.x;
              const dy = target.y - node.y;
              const dist = Math.sqrt(dx * dx + dy * dy) + 1;
              const attraction = 0.15; // Much weaker
              fx += (dx / dist) * attraction;
              fy += (dy / dist) * attraction;
            }
          }
          if (conn.to === node.id) {
            const target = nodes.find((n) => n.id === conn.from);
            if (target) {
              const dx = target.x - node.x;
              const dy = target.y - node.y;
              const dist = Math.sqrt(dx * dx + dy * dy) + 1;
              const attraction = 0.15;
              fx += (dx / dist) * attraction;
              fy += (dy / dist) * attraction;
            }
          }
        });

        // Friction damping
        node.vx = (node.vx + fx) * 0.88;
        node.vy = (node.vy + fy) * 0.88;

        // Boundary constraints - allow nodes to spread across full canvas
        const maxX = 1200;
        const maxY = 900;
        node.x = Math.max(-maxX, Math.min(maxX, node.x));
        node.y = Math.max(-maxY, Math.min(maxY, node.y));

        node.x += node.vx;
        node.y += node.vy;
      });

      // Draw connections
      ctx.lineWidth = 1 / zoomRef.current;  // Adjust line width for zoom
      connections.forEach((conn) => {
        const from = nodes.find((n) => n.id === conn.from);
        const to = nodes.find((n) => n.id === conn.to);
        if (from && to) {
          // Different styles for different relationship types
          if (conn.type === 'stack') {
            // Dashed lines for technology stacks
            ctx.strokeStyle = 'rgba(100, 150, 255, 0.15)';
            ctx.setLineDash([5, 5]);
          } else {
            // Solid lines for dependencies
            ctx.strokeStyle = 'rgba(100, 150, 255, 0.25)';
            ctx.setLineDash([]);
          }

          ctx.beginPath();
          ctx.moveTo(from.x, from.y);
          ctx.lineTo(to.x, to.y);
          ctx.stroke();
        }
      });
      ctx.setLineDash([]);  // Reset line dash

      // Draw nodes with labels
      nodes.forEach((node) => {
        const isHovered = hoveredNode === node.id;
        const nodeRadius = isHovered ? 16 : 12;

        // Glow effect for hovered nodes
        if (isHovered) {
          ctx.shadowColor = node.color;
          ctx.shadowBlur = 30 / zoomRef.current;  // Adjust for zoom
          ctx.fillStyle = node.color;
          ctx.globalAlpha = 0.25;
          ctx.beginPath();
          ctx.arc(node.x, node.y, 45 / zoomRef.current, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
          ctx.shadowColor = 'transparent';
        }

        // Solid node circle with color
        ctx.fillStyle = node.color;
        ctx.globalAlpha = isHovered ? 1 : 0.85;
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
        ctx.fill();

        // Node circle border
        ctx.strokeStyle = node.color;
        ctx.lineWidth = (isHovered ? 2 : 1) / zoomRef.current;  // Adjust for zoom
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      });

      ctx.restore();

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [hoveredNode]);

  // Update refs whenever state changes
  useEffect(() => {
    zoomRef.current = zoom;
    panXRef.current = panX;
    panYRef.current = panY;
  }, [zoom, panX, panY]);

  return (
    <div className="tech-stack-graph">
      <motion.canvas
        ref={canvasRef}
        className="tech-stack-graph__canvas"
        style={{ cursor: hoveredNode ? 'grab' : 'default' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      />

      {/* HTML Labels Overlay */}
      <div className="tech-stack-graph__labels">
        {nodesRef.current.map((node) => {
          const canvas = canvasRef.current;
          if (!canvas) return null;
          const centerX = canvas.width / 2;
          const centerY = canvas.height / 2;
          // Match canvas transformations: translate(center + pan) then scale(zoom)
          // Node positions are already in world space, just apply pan and zoom
          const x = centerX + panX + (node.x * zoom);
          const y = centerY + panY + (node.y * zoom);
          const isHovered = hoveredNode === node.id;

          return (
            <div
              key={node.id}
              className={`tech-stack-graph__label ${isHovered ? 'hovered' : ''}`}
              style={{
                left: `${x}px`,
                top: `${y + 30}px`,
                opacity: isHovered ? 1 : 0.7,
                transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                transition: 'opacity 0.2s, transform 0.2s',
              }}
            >
              {node.label}
            </div>
          );
        })}
      </div>

      <div className="tech-stack-graph__legend">
        <div className="tech-stack-graph__legend-section">
          <h4>Categories</h4>
          <div className="tech-stack-graph__legend-item">
            <div className="tech-stack-graph__legend-dot" style={{ backgroundColor: '#00ff88' }} />
            <span>Soft Skills</span>
          </div>
          <div className="tech-stack-graph__legend-item">
            <div className="tech-stack-graph__legend-dot" style={{ backgroundColor: '#fff34d' }} />
            <span>Game Dev</span>
          </div>
          <div className="tech-stack-graph__legend-item">
            <div className="tech-stack-graph__legend-dot" style={{ backgroundColor: '#61dafb' }} />
            <span>Frontend</span>
          </div>
          <div className="tech-stack-graph__legend-item">
            <div className="tech-stack-graph__legend-dot" style={{ backgroundColor: '#68a063' }} />
            <span>Backend</span>
          </div>
          <div className="tech-stack-graph__legend-item">
            <div className="tech-stack-graph__legend-dot" style={{ backgroundColor: '#13aa52' }} />
            <span>Database</span>
          </div>
          <div className="tech-stack-graph__legend-item">
            <div className="tech-stack-graph__legend-dot" style={{ backgroundColor: '#ff6b9d' }} />
            <span>Tools</span>
          </div>
        </div>
        <div className="tech-stack-graph__legend-section">
          <h4>Relationships</h4>
          <div className="tech-stack-graph__legend-item">
            <svg width="20" height="2" style={{ marginRight: '8px' }}>
              <line x1="0" y1="1" x2="20" y2="1" stroke="rgba(100, 150, 255, 0.25)" strokeWidth="1" />
            </svg>
            <span>Dependency</span>
          </div>
          <div className="tech-stack-graph__legend-item">
            <svg width="20" height="2" style={{ marginRight: '8px' }}>
              <line x1="0" y1="1" x2="20" y2="1" stroke="rgba(100, 150, 255, 0.15)" strokeWidth="1" strokeDasharray="5,5" />
            </svg>
            <span>Stack/Group</span>
          </div>
        </div>
      </div>

      <motion.div
        className="tech-stack-graph__info"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <p className="tech-stack-graph__caption">
          Hover to explore the connections between technologies and soft skills
        </p>
      </motion.div>
    </div>
  );
};

export default TechStackGraph;
