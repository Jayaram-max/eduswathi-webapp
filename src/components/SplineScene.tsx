import React, { useEffect, useRef, useState } from "react";

interface SplineSceneProps {
  scene?: string;
  className?: string;
}

export const SplineScene: React.FC<SplineSceneProps> = ({ className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 500);

    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let rotX = 0;
    let rotY = 0;

    // Handle resizing
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width && entry.contentRect.height) {
          width = canvas.width = entry.contentRect.width;
          height = canvas.height = entry.contentRect.height;
        }
      }
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // 3D Particles forming spherical lattice and orbital rings
    const particleCount = 140;
    const particles: {
      x: number;
      y: number;
      z: number;
      baseX: number;
      baseY: number;
      baseZ: number;
      color: string;
      size: number;
      orbitRadius?: number;
      orbitSpeed?: number;
      orbitAngle?: number;
      orbitTilt?: number;
    }[] = [];

    // Colors matching EduSwathi's palette: vibrant amber, emerald, electric cyan, violet
    const colors = [
      "rgba(245, 158, 11, 0.9)",  // Amber / Primary
      "rgba(16, 185, 129, 0.9)",  // Emerald
      "rgba(59, 130, 246, 0.9)",  // Electric Blue
      "rgba(168, 85, 247, 0.9)",  // Violet
      "rgba(236, 72, 153, 0.8)",  // Pink
    ];

    // Core sphere particles
    const coreRadius = Math.min(width, height) * 0.28;
    for (let i = 0; i < 90; i++) {
      const phi = Math.acos(-1 + (2 * i) / 90);
      const theta = Math.sqrt(90 * Math.PI) * phi;
      const x = coreRadius * Math.cos(theta) * Math.sin(phi);
      const y = coreRadius * Math.sin(theta) * Math.sin(phi);
      const z = coreRadius * Math.cos(phi);

      particles.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        color: colors[i % colors.length],
        size: Math.random() * 2.5 + 2,
      });
    }

    // Planetary / STEM Orbital ring particles
    const ringRadii = [coreRadius * 1.35, coreRadius * 1.65];
    const ringTilts = [0.45, -0.6];
    for (let r = 0; r < ringRadii.length; r++) {
      const ringRadius = ringRadii[r];
      const tilt = ringTilts[r];
      for (let j = 0; j < 25; j++) {
        const angle = (j / 25) * Math.PI * 2;
        particles.push({
          x: 0,
          y: 0,
          z: 0,
          baseX: 0,
          baseY: 0,
          baseZ: 0,
          color: r === 0 ? "rgba(245, 158, 11, 0.95)" : "rgba(16, 185, 129, 0.95)",
          size: Math.random() * 2 + 2.5,
          orbitRadius: ringRadius,
          orbitSpeed: (r === 0 ? 0.012 : -0.009) * (1 + (j % 3) * 0.1),
          orbitAngle: angle,
          orbitTilt: tilt,
        });
      }
    }

    // STEM Symbol nodes
    const stemSymbols = ["π", "∑", "E=mc²", "∫dx", "λ", "H₂O", "Δx", "√x", "{ }"];
    const symbolNodes = stemSymbols.map((sym, idx) => {
      const angle = (idx / stemSymbols.length) * Math.PI * 2;
      const rad = coreRadius * 1.5;
      return {
        sym,
        angle,
        speed: 0.006 * (idx % 2 === 0 ? 1 : -1),
        yOffset: (idx % 3 - 1) * 30,
        radius: rad,
      };
    });

    // Mouse movement listener for 3D gyro tilt
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      mouseY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      targetRotY = mouseX * 0.8;
      targetRotX = -mouseY * 0.8;
    };

    const handleMouseLeave = () => {
      targetRotX = 0;
      targetRotY = 0;
    };

    window.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    let time = 0;

    const render = () => {
      time += 0.015;
      // Smooth camera interpolation
      rotX += (targetRotX - rotX) * 0.05;
      rotY += (targetRotY - rotY) * 0.05;

      const autoSpin = time * 0.4;
      const currentRotY = rotY + autoSpin;
      const currentRotX = rotX + Math.sin(time * 0.5) * 0.15;

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const fov = 400;

      // Draw subtle orbital guide paths
      ctx.save();
      ctx.translate(centerX, centerY);

      // Orbital ellipse 1
      ctx.beginPath();
      ctx.ellipse(0, 0, coreRadius * 1.35, coreRadius * 0.55, 0.45 + rotX * 0.3, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(245, 158, 11, 0.25)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 6]);
      ctx.stroke();

      // Orbital ellipse 2
      ctx.beginPath();
      ctx.ellipse(0, 0, coreRadius * 1.65, coreRadius * 0.65, -0.6 + rotX * 0.3, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(16, 185, 129, 0.2)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 8]);
      ctx.stroke();
      ctx.restore();

      // Project 3D particles to 2D
      const projected = particles.map((p) => {
        let px = p.baseX;
        let py = p.baseY;
        let pz = p.baseZ;

        if (p.orbitRadius !== undefined && p.orbitAngle !== undefined && p.orbitSpeed !== undefined) {
          p.orbitAngle += p.orbitSpeed;
          const tilt = p.orbitTilt || 0;
          px = Math.cos(p.orbitAngle) * p.orbitRadius;
          const rawZ = Math.sin(p.orbitAngle) * p.orbitRadius;
          py = rawZ * Math.sin(tilt);
          pz = rawZ * Math.cos(tilt);
        }

        // 3D Rotation Y
        const cosY = Math.cos(currentRotY);
        const sinY = Math.sin(currentRotY);
        const x1 = px * cosY + pz * sinY;
        const z1 = -px * sinY + pz * cosY;

        // 3D Rotation X
        const cosX = Math.cos(currentRotX);
        const sinX = Math.sin(currentRotX);
        const y2 = py * cosX - z1 * sinX;
        const z2 = py * sinX + z1 * cosX;

        const depth = z2 + 450;
        const scale = depth > 0 ? fov / depth : 0;
        const screenX = centerX + x1 * scale;
        const screenY = centerY + y2 * scale;

        return {
          screenX,
          screenY,
          scale,
          z: z2,
          color: p.color,
          size: p.size * scale,
        };
      });

      // Sort by Z for proper depth
      projected.sort((a, b) => a.z - b.z);

      // Connect nearby particles with glowing STEM synaptic lines
      ctx.lineWidth = 1;
      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        if (p1.scale <= 0) continue;

        for (let j = i + 1; j < Math.min(i + 8, projected.length); j++) {
          const p2 = projected[j];
          if (p2.scale <= 0) continue;

          const dx = p1.screenX - p2.screenX;
          const dy = p1.screenY - p2.screenY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 55) {
            const alpha = (1 - dist / 55) * 0.35 * Math.min(p1.scale, 1);
            ctx.strokeStyle = `rgba(245, 158, 11, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.screenX, p1.screenY);
            ctx.lineTo(p2.screenX, p2.screenY);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of projected) {
        if (p.scale <= 0) continue;
        ctx.beginPath();
        ctx.arc(p.screenX, p.screenY, Math.max(1, p.size), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Glow ring around closer particles
        if (p.z > 0) {
          ctx.beginPath();
          ctx.arc(p.screenX, p.screenY, Math.max(2, p.size * 1.8), 0, Math.PI * 2);
          ctx.fillStyle = "rgba(245, 158, 11, 0.08)";
          ctx.fill();
        }
      }

      // Draw floating STEM formula labels
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      symbolNodes.forEach((node) => {
        node.angle += node.speed;
        const px = Math.cos(node.angle) * node.radius;
        const pz = Math.sin(node.angle) * node.radius;
        const py = node.yOffset + Math.sin(time * 2 + node.angle) * 15;

        // Rotate
        const cosY = Math.cos(currentRotY * 0.7);
        const sinY = Math.sin(currentRotY * 0.7);
        const x1 = px * cosY + pz * sinY;
        const z1 = -px * sinY + pz * cosY;

        const cosX = Math.cos(currentRotX * 0.7);
        const sinX = Math.sin(currentRotX * 0.7);
        const y2 = py * cosX - z1 * sinX;
        const z2 = py * sinX + z1 * cosX;

        const depth = z2 + 450;
        if (depth > 100) {
          const scale = fov / depth;
          const sx = centerX + x1 * scale;
          const sy = centerY + y2 * scale;

          if (z2 > -50) {
            // Background pill for label
            const textWidth = ctx.measureText(node.sym).width;
            ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
            ctx.strokeStyle = "rgba(18, 18, 18, 0.85)";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.roundRect(sx - textWidth / 2 - 6, sy - 9, textWidth + 12, 18, 5);
            ctx.fill();
            ctx.stroke();

            // Text
            ctx.fillStyle = "#121212";
            ctx.fillText(node.sym, sx, sy);
          }
        }
      });

      // Central glowing core pulse
      const corePulse = 1 + Math.sin(time * 3) * 0.06;
      const grad = ctx.createRadialGradient(
        centerX, centerY, 5,
        centerX, centerY, coreRadius * 0.55 * corePulse
      );
      grad.addColorStop(0, "rgba(245, 158, 11, 0.28)");
      grad.addColorStop(0.5, "rgba(16, 185, 129, 0.12)");
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius * 0.55 * corePulse, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-full h-full bg-transparent overflow-visible flex items-center justify-center select-none ${className}`}
    >
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block touch-none cursor-grab active:cursor-grabbing bg-transparent"
        style={{ background: "transparent" }}
      />
      {/* Dynamic interactive hint */}
      <div 
        className={`absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/90 backdrop-blur-sm border-2 border-on-surface/80 rounded-full shadow-brutalist-sm pointer-events-none transition-opacity duration-300 ${
          isHovered ? "opacity-90" : "opacity-0"
        }`}
      >
        <span className="font-mono text-[10px] font-black uppercase tracking-wider text-on-surface">
          Interactive 3D STEM Neural Core
        </span>
      </div>
    </div>
  );
};

