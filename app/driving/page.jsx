
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

function ControlButton({ label, keyName, color = "bg-white/20" }) {
  const send = (pressed) => {
    window.dispatchEvent(
      new CustomEvent("city-game-control", {
        detail: { key: keyName, pressed },
      })
    );
  };

  return (
    <button
      onPointerDown={(e) => {
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);
        send(true);
      }}
      onPointerUp={() => send(false)}
      onPointerCancel={() => send(false)}
      onLostPointerCapture={() => send(false)}
      className={`h-16 w-16 touch-none select-none rounded-full border border-white/20 ${color} text-sm font-bold text-white shadow-lg active:scale-95`}
    >
      {label}
    </button>
  );
}

export default function Page() {
  const canvasRef = useRef(null);
  const gameRef = useRef(null);

  const [hud, setHud] = useState({
    score: 0,
    speed: 0,
    boost: 0,
    gameOver: false,
  });

  const restartGame = useCallback(() => {
    gameRef.current?.reset();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const game = {
      carX: window.innerWidth / 2,
      speed: 0,
      score: 0,
      roadOffset: 0,
      traffic: [],
      boosters: [],
      buildings: [],
      spawnTimer: 0,
      boosterTimer: 2,
      boostTime: 0,
      gameOver: false,
      keys: {},
      lastTime: 0,
      animationId: 0,
      reset: null,
    };

    gameRef.current = game;

    const W = () => window.innerWidth;
    const H = () => window.innerHeight;
    const roadWidth = () => Math.min(W() * 0.68, 540);
    const roadLeft = () => (W() - roadWidth()) / 2;
    const laneWidth = () => roadWidth() / 3;
    const playerY = () => H() - 165;

    const buildingColors = [
      "#26384b", "#34475d", "#3d5065", "#202f42",
      "#46576b", "#293d50", "#37465a",
    ];

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W() * dpr;
      canvas.height = H() * dpr;
      canvas.style.width = `${W()}px`;
      canvas.style.height = `${H()}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function reset() {
      game.carX = W() / 2;
      game.speed = 0;
      game.score = 0;
      game.roadOffset = 0;
      game.traffic = [];
      game.boosters = [];
      game.spawnTimer = 0;
      game.boosterTimer = 2;
      game.boostTime = 0;
      game.gameOver = false;
      game.keys = {};
      game.lastTime = 0;

      game.buildings = [];

      for (let side of [-1, 1]) {
        for (let i = 0; i < 12; i++) {
          game.buildings.push({
            side,
            y: i * 150 - 100,
            width: 50 + Math.random() * 65,
            height: 120 + Math.random() * 220,
            color: buildingColors[
              Math.floor(Math.random() * buildingColors.length)
            ],
            seed: Math.random(),
          });
        }
      }

      setHud({ score: 0, speed: 0, boost: 0, gameOver: false });
    }

    game.reset = reset;

    function drawBuilding(building) {
      const left = roadLeft();
      const rw = roadWidth();
      const y = building.y;
      const bw = building.width;
      const bh = building.height;

      const x =
        building.side === -1
          ? left - 20 - bw
          : left + rw + 20;

      // Building shadow
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.fillRect(x + 8, y + 8, bw, bh);

      // Main building
      ctx.fillStyle = building.color;
      ctx.fillRect(x, y, bw, bh);

      // Roof
      ctx.fillStyle = "#64748b";
      ctx.fillRect(x - 3, y, bw + 6, 7);

      // Windows
      const rows = Math.floor(bh / 22);
      const cols = Math.floor(bw / 15);

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const lit =
            Math.sin(row * 12.7 + col * 7.3 + building.seed * 20) > -0.2;

          ctx.fillStyle = lit
            ? "#f9d98a"
            : "rgba(120,190,230,0.18)";

          ctx.fillRect(
            x + 8 + col * 15,
            y + 14 + row * 22,
            7,
            12
          );
        }
      }

      // Neon building accent
      ctx.fillStyle = "#22d3ee";
      ctx.globalAlpha = 0.65;
      ctx.fillRect(
        building.side === -1 ? x + bw - 3 : x,
        y,
        3,
        bh
      );
      ctx.globalAlpha = 1;
    }

    function drawCar(x, y, color, player = false) {
      const cw = player ? 48 : 43;
      const ch = player ? 88 : 78;

      ctx.save();
      ctx.translate(x, y);

      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.beginPath();
      ctx.roundRect(-cw / 2 + 4, 5, cw, ch, 10);
      ctx.fill();

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(-cw / 2, 0, cw, ch, 10);
      ctx.fill();

      ctx.fillStyle = "#102637";
      ctx.beginPath();
      ctx.roundRect(-cw / 2 + 6, 12, cw - 12, 23, 5);
      ctx.fill();

      ctx.fillStyle = "#253d4e";
      ctx.beginPath();
      ctx.roundRect(-cw / 2 + 6, 49, cw - 12, 17, 4);
      ctx.fill();

      ctx.fillStyle = player ? "#fff4b0" : "#ff2525";
      ctx.fillRect(-cw / 2 + 4, player ? 3 : ch - 8, 9, 5);
      ctx.fillRect(cw / 2 - 13, player ? 3 : ch - 8, 9, 5);

      ctx.fillStyle = "#080808";
      ctx.fillRect(-cw / 2 - 4, 14, 5, 18);
      ctx.fillRect(cw / 2 - 1, 14, 5, 18);
      ctx.fillRect(-cw / 2 - 4, 56, 5, 18);
      ctx.fillRect(cw / 2 - 1, 56, 5, 18);

      ctx.restore();
    }

    function drawBooster(x, y) {
      ctx.save();
      ctx.translate(x, y);

      ctx.shadowColor = "#00e5ff";
      ctx.shadowBlur = 24;
      ctx.fillStyle = "rgba(0,229,255,0.2)";
      ctx.beginPath();
      ctx.roundRect(-24, -34, 48, 68, 10);
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.strokeStyle = "#00e5ff";
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = "#a5ffff";
      ctx.beginPath();
      ctx.moveTo(0, -23);
      ctx.lineTo(15, -5);
      ctx.lineTo(7, -5);
      ctx.lineTo(7, 20);
      ctx.lineTo(-7, 20);
      ctx.lineTo(-7, -5);
      ctx.lineTo(-15, -5);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }

    function drawRoad() {
      const w = W();
      const h = H();
      const rw = roadWidth();
      const left = roadLeft();

      // City background
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, "#101a30");
      sky.addColorStop(0.55, "#26364b");
      sky.addColorStop(1, "#182b25");

      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // Sidewalks
      ctx.fillStyle = "#7b8490";
      ctx.fillRect(left - 20, 0, 20, h);
      ctx.fillRect(left + rw, 0, 20, h);

      // Buildings
      game.buildings.forEach((building) => {
        drawBuilding(building);
      });

      // Road
      ctx.fillStyle = "#292e37";
      ctx.fillRect(left, 0, rw, h);

      // Road edges
      ctx.fillStyle = "#e5e7eb";
      ctx.fillRect(left + 4, 0, 5, h);
      ctx.fillRect(left + rw - 9, 0, 5, h);

      // Lane markings
      ctx.strokeStyle = "#f8fafc";
      ctx.lineWidth = 4;
      ctx.setLineDash([38, 34]);
      ctx.lineDashOffset = -game.roadOffset;

      for (let i = 1; i < 3; i++) {
        const x = left + laneWidth() * i;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      ctx.setLineDash([]);

      // Streetlights
      const offset = game.roadOffset % 220;

      for (let y = -220; y < h + 220; y += 220) {
        const ly = y + offset;

        for (const side of [-1, 1]) {
          const lx =
            side === -1 ? left - 12 : left + rw + 12;

          ctx.fillStyle = "#303946";
          ctx.fillRect(lx - 3, ly, 6, 75);

          ctx.strokeStyle = "#64748b";
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(lx, ly);
          ctx.lineTo(lx + side * 20, ly - 12);
          ctx.stroke();

          ctx.shadowColor = "#ffe8a3";
          ctx.shadowBlur = 18;
          ctx.fillStyle = "#fff1b8";
          ctx.beginPath();
          ctx.arc(lx + side * 20, ly - 12, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // Road reflection
      ctx.fillStyle = "rgba(34,211,238,0.025)";
      ctx.fillRect(left, 0, rw, h);
    }

    function spawnTraffic() {
      const lane = Math.floor(Math.random() * 3);

      game.traffic.push({
        x: roadLeft() + laneWidth() * lane + laneWidth() / 2,
        y: -110,
        color: ["#e63946", "#f4a261", "#8d99ae", "#f1faee"][
          Math.floor(Math.random() * 4)
        ],
        passed: false,
      });
    }

    function spawnBooster() {
      const lane = Math.floor(Math.random() * 3);

      game.boosters.push({
        x: roadLeft() + laneWidth() * lane + laneWidth() / 2,
        y: -80,
      });
    }

    function update(dt) {
      if (game.gameOver) return;

      if (game.boostTime > 0) {
        game.boostTime = Math.max(0, game.boostTime - dt);
      }

      const boosting = game.boostTime > 0;

      if (game.keys.ArrowUp || game.keys.KeyW) {
        game.speed = Math.min(
          game.speed + 110 * dt,
          boosting ? 420 : 280
        );
      } else {
        game.speed = Math.max(game.speed - 20 * dt, 100);
      }

      if (boosting) {
        game.speed = Math.min(game.speed + 220 * dt, 420);
      }

      if (game.keys.ArrowDown || game.keys.KeyS) {
        game.speed = Math.max(game.speed - 220 * dt, 0);
      }

      const steering = 300 * (0.4 + game.speed / 280);

      if (game.keys.ArrowLeft || game.keys.KeyA) {
        game.carX -= steering * dt;
      }

      if (game.keys.ArrowRight || game.keys.KeyD) {
        game.carX += steering * dt;
      }

      game.carX = Math.max(
        roadLeft() + 38,
        Math.min(roadLeft() + roadWidth() - 38, game.carX)
      );

      game.roadOffset += game.speed * dt;
      game.score += game.speed * dt * 0.02;

      // Move city buildings
      game.buildings.forEach((building) => {
        building.y += game.speed * dt;

        if (building.y > H() + 100) {
          building.y = -building.height - Math.random() * 200;
          building.width = 50 + Math.random() * 65;
          building.height = 120 + Math.random() * 220;
          building.color =
            buildingColors[
              Math.floor(Math.random() * buildingColors.length)
            ];
          building.seed = Math.random();
        }
      });

      // Traffic
      game.spawnTimer += dt;

      if (game.spawnTimer >= Math.max(0.55, 1.5 - game.speed / 400)) {
        spawnTraffic();
        game.spawnTimer = 0;
      }

      game.traffic = game.traffic.filter((car) => {
        car.y += game.speed * dt;

        const hit =
          Math.abs(car.x - game.carX) < 42 &&
          Math.abs(car.y - playerY()) < 72;

        if (hit) {
          game.gameOver = true;
          game.speed = 0;
          return true;
        }

        if (!car.passed && car.y > playerY() + 90) {
          car.passed = true;
          game.score += 25;
        }

        return car.y < H() + 120;
      });

      // Boosters
      game.boosterTimer += dt;

      if (game.boosterTimer >= 5) {
        spawnBooster();
        game.boosterTimer = 0;
      }

      game.boosters = game.boosters.filter((booster) => {
        booster.y += game.speed * dt;

        const hit =
          Math.abs(booster.x - game.carX) < 48 &&
          Math.abs(booster.y - playerY()) < 65;

        if (hit) {
          game.boostTime = 3;
          game.speed = Math.max(game.speed, 300);
          game.score += 100;
          return false;
        }

        return booster.y < H() + 100;
      });
    }

    function draw() {
      ctx.clearRect(0, 0, W(), H());

      drawRoad();

      game.boosters.forEach((booster) => {
        drawBooster(booster.x, booster.y);
      });

      game.traffic.forEach((car) => {
        drawCar(car.x, car.y, car.color);
      });

      if (game.boostTime > 0) {
        ctx.save();
        ctx.shadowColor = "#00e5ff";
        ctx.shadowBlur = 30;
        ctx.strokeStyle = "#00e5ff";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(
          game.carX,
          playerY() + 44,
          35,
          55,
          0,
          0,
          Math.PI * 2
        );
        ctx.stroke();
        ctx.restore();
      }

      drawCar(game.carX, playerY(), "#1479ff", true);

      // Speedometer
      const bx = W() - 160;
      const by = H() - 115;

      ctx.fillStyle = "rgba(5,10,20,0.85)";
      ctx.beginPath();
      ctx.roundRect(bx, by, 140, 90, 16);
      ctx.fill();

      ctx.textAlign = "center";
      ctx.fillStyle = game.boostTime > 0 ? "#00e5ff" : "#ffffff";
      ctx.font = "bold 25px Arial";
      ctx.fillText(`${Math.round(game.speed)} km/h`, bx + 70, by + 38);

      ctx.fillStyle = "#aabbd0";
      ctx.font = "12px Arial";
      ctx.fillText("SPEED", bx + 70, by + 63);
    }

    let lastHudUpdate = 0;

    function loop(time) {
      game.animationId = requestAnimationFrame(loop);

      const dt = Math.min(
        (time - (game.lastTime || time)) / 1000,
        0.05
      );

      game.lastTime = time;

      update(dt);
      draw();

      if (time - lastHudUpdate > 100) {
        setHud({
          score: Math.floor(game.score),
          speed: Math.round(game.speed),
          boost: game.boostTime,
          gameOver: game.gameOver,
        });

        lastHudUpdate = time;
      }
    }

    function onKeyDown(e) {
      game.keys[e.code] = true;

      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(
          e.key
        )
      ) {
        e.preventDefault();
      }
    }

    function onKeyUp(e) {
      game.keys[e.code] = false;
    }

    function onControl(e) {
      game.keys[e.detail.key] = e.detail.pressed;
    }

    function onBlur() {
      game.keys = {};
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", resize);
    window.addEventListener("blur", onBlur);
    window.addEventListener("city-game-control", onControl);

    resize();
    reset();

    game.animationId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(game.animationId);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("resize", resize);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("city-game-control", onControl);
    };
  }, []);

  return (
    <main className="relative h-screen w-full overflow-hidden bg-slate-950 text-white">
      <canvas ref={canvasRef} className="absolute inset-0 block" />

      {/* HUD */}
      <div className="pointer-events-none absolute left-4 top-4 flex flex-wrap gap-3">
        <div className="rounded-xl border border-cyan-400/20 bg-slate-950/80 px-5 py-3 backdrop-blur">
          <p className="text-xs uppercase tracking-widest text-slate-400">
            Distance
          </p>
          <p className="text-2xl font-bold">{hud.score} m</p>
        </div>

        <div className="rounded-xl border border-cyan-400/20 bg-slate-950/80 px-5 py-3 backdrop-blur">
          <p className="text-xs uppercase tracking-widest text-slate-400">
            Speed
          </p>
          <p className="text-2xl font-bold text-cyan-300">
            {hud.speed} km/h
          </p>
        </div>

        <div className="rounded-xl border border-cyan-400/30 bg-slate-950/80 px-5 py-3 backdrop-blur">
          <p className="text-xs uppercase tracking-widest text-cyan-300">
            Turbo
          </p>
          <p className="text-2xl font-bold text-cyan-200">
            {hud.boost > 0 ? `${hud.boost.toFixed(1)}s` : "READY"}
          </p>
        </div>
      </div>

      {/* Controls guide */}
      <div className="absolute left-4 top-32 rounded-xl border border-white/10 bg-slate-950/75 px-4 py-3 text-sm text-slate-200 backdrop-blur">
        <p>W / ↑ Accelerate</p>
        <p>S / ↓ Brake</p>
        <p>A / ← Steer left</p>
        <p>D / → Steer right</p>
        <p className="mt-2 text-cyan-300">
          Collect blue pads for TURBO!
        </p>
      </div>

      <button
        onClick={restartGame}
        className="absolute right-4 top-4 rounded-xl border border-white/15 bg-red-600 px-5 py-3 font-bold shadow-lg transition hover:bg-red-500 active:scale-95"
      >
        Restart
      </button>

      {/* Mobile controls */}
      <div className="absolute bottom-6 left-4 right-4 flex items-end justify-between sm:hidden">
        <div className="flex gap-3">
          <ControlButton label="←" keyName="ArrowLeft" />
          <ControlButton label="→" keyName="ArrowRight" />
        </div>

        <div className="flex gap-3">
          <ControlButton
            label="BRAKE"
            keyName="ArrowDown"
            color="bg-red-600/80"
          />
          <ControlButton
            label="GAS"
            keyName="ArrowUp"
            color="bg-blue-600/90"
          />
        </div>
      </div>

      {/* Game over */}
      {hud.gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur">
          <div className="w-full max-w-md rounded-3xl border border-cyan-400/20 bg-slate-950 p-10 text-center shadow-2xl">
            <h1 className="mb-3 text-4xl font-black text-red-500">
              CRASHED!
            </h1>

            <p className="mb-8 text-slate-300">
              Distance: {hud.score} m
            </p>

            <button
              onClick={restartGame}
              className="rounded-xl bg-cyan-600 px-8 py-3 font-bold transition hover:bg-cyan-500 active:scale-95"
            >
              PLAY AGAIN
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
