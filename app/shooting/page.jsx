"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

export default function Page() {
  const canvasRef = useRef(null);
  const gameRef = useRef(null);
  const keysRef = useRef({});
  const [status, setStatus] = useState("ready");
  const [stats, setStats] = useState({
    score: 0,
    health: 100,
    ammo: 30,
    reserve: 120,
    wave: 1,
  });

  const startGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();

    gameRef.current = {
      player: {
        x: rect.width / 2,
        y: rect.height / 2,
        radius: 16,
        speed: 240,
        hp: 100,
      },
      enemies: [],
      bullets: [],
      score: 0,
      ammo: 30,
      reserve: 120,
      wave: 1,
      spawnTimer: 0.5,
      shootTimer: 0,
      running: true,
      gameOver: false,
      lastTime: 0,
      width: rect.width,
      height: rect.height,
      mouse: { x: rect.width / 2 + 100, y: rect.height / 2 },
    };

    keysRef.current = {};
    setStats({ score: 0, health: 100, ammo: 30, reserve: 120, wave: 1 });
    setStatus("playing");
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId;
    let lastHudUpdate = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.max(1, rect.width * dpr);
      canvas.height = Math.max(1, rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const game = gameRef.current;
      if (game) {
        game.width = rect.width;
        game.height = rect.height;
        game.player.x = Math.max(
          game.player.radius,
          Math.min(game.player.x, rect.width - game.player.radius)
        );
        game.player.y = Math.max(
          game.player.radius,
          Math.min(game.player.y, rect.height - game.player.radius)
        );
      }
    };

    const shoot = () => {
      const game = gameRef.current;
      if (!game || !game.running || game.ammo <= 0 || game.shootTimer > 0) {
        return;
      }

      const p = game.player;
      const angle = Math.atan2(game.mouse.y - p.y, game.mouse.x - p.x);

      game.bullets.push({
        x: p.x + Math.cos(angle) * 22,
        y: p.y + Math.sin(angle) * 22,
        vx: Math.cos(angle) * 620,
        vy: Math.sin(angle) * 620,
        radius: 4,
        enemy: false,
        life: 1.2,
      });

      game.ammo--;
      game.shootTimer = 0.15;
    };

    const spawnEnemy = (game) => {
      const side = Math.floor(Math.random() * 4);
      let x, y;

      if (side === 0) {
        x = Math.random() * game.width;
        y = -25;
      } else if (side === 1) {
        x = game.width + 25;
        y = Math.random() * game.height;
      } else if (side === 2) {
        x = Math.random() * game.width;
        y = game.height + 25;
      } else {
        x = -25;
        y = Math.random() * game.height;
      }

      const hp = 2 + Math.floor(game.wave / 3);

      game.enemies.push({
        x,
        y,
        radius: 15,
        hp,
        maxHp: hp,
        speed: 55 + game.wave * 5 + Math.random() * 20,
      });
    };

    const update = (game, dt) => {
      const p = game.player;
      const keys = keysRef.current;

      let dx = 0;
      let dy = 0;

      if (keys.w || keys.arrowup) dy--;
      if (keys.s || keys.arrowdown) dy++;
      if (keys.a || keys.arrowleft) dx--;
      if (keys.d || keys.arrowright) dx++;

      const length = Math.hypot(dx, dy) || 1;

      p.x += (dx / length) * p.speed * dt;
      p.y += (dy / length) * p.speed * dt;

      p.x = Math.max(p.radius, Math.min(game.width - p.radius, p.x));
      p.y = Math.max(p.radius, Math.min(game.height - p.radius, p.y));

      game.shootTimer = Math.max(0, game.shootTimer - dt);

      if (keys.mouse) shoot();

      game.spawnTimer -= dt;

      if (game.spawnTimer <= 0) {
        spawnEnemy(game);
        game.spawnTimer = Math.max(0.4, 1.4 - game.wave * 0.04);
      }

      game.enemies.forEach((enemy) => {
        const angle = Math.atan2(p.y - enemy.y, p.x - enemy.x);

        enemy.x += Math.cos(angle) * enemy.speed * dt;
        enemy.y += Math.sin(angle) * enemy.speed * dt;

        if (
          Math.hypot(p.x - enemy.x, p.y - enemy.y) <
          p.radius + enemy.radius
        ) {
          p.hp -= 25 * dt;
        }
      });

      game.bullets.forEach((bullet) => {
        bullet.x += bullet.vx * dt;
        bullet.y += bullet.vy * dt;
        bullet.life -= dt;

        if (
          bullet.enemy &&
          Math.hypot(p.x - bullet.x, p.y - bullet.y) <
            p.radius + bullet.radius
        ) {
          p.hp -= 12;
          bullet.life = 0;
        }

        if (!bullet.enemy && bullet.life > 0) {
          for (const enemy of game.enemies) {
            if (
              Math.hypot(enemy.x - bullet.x, enemy.y - bullet.y) <
              enemy.radius + bullet.radius
            ) {
              enemy.hp--;
              bullet.life = 0;

              if (enemy.hp <= 0 && !enemy.dead) {
                enemy.dead = true;
                game.score += 100;
              }

              break;
            }
          }
        }
      });

      game.bullets = game.bullets.filter(
        (bullet) =>
          bullet.life > 0 &&
          bullet.x > -20 &&
          bullet.x < game.width + 20 &&
          bullet.y > -20 &&
          bullet.y < game.height + 20
      );

      game.enemies = game.enemies.filter((enemy) => !enemy.dead);

      if (game.score >= game.wave * 500) game.wave++;

      if (p.hp <= 0) {
        p.hp = 0;
        game.running = false;
        game.gameOver = true;
      }
    };

    const draw = (game) => {
      const { width, height, player } = game;

      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = "#111827";
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = "rgba(148,163,184,0.08)";
      ctx.lineWidth = 1;

      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      game.bullets.forEach((bullet) => {
        ctx.beginPath();
        ctx.fillStyle = bullet.enemy ? "#fb7185" : "#facc15";
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      game.enemies.forEach((enemy) => {
        ctx.beginPath();
        ctx.fillStyle = "#ef4444";
        ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#374151";
        ctx.fillRect(enemy.x - 18, enemy.y - 25, 36, 5);

        ctx.fillStyle = "#4ade80";
        ctx.fillRect(
          enemy.x - 18,
          enemy.y - 25,
          36 * Math.max(0, enemy.hp / enemy.maxHp),
          5
        );
      });

      const angle = Math.atan2(
        game.mouse.y - player.y,
        game.mouse.x - player.x
      );

      ctx.save();
      ctx.translate(player.x, player.y);
      ctx.rotate(angle);

      ctx.fillStyle = "#e2e8f0";
      ctx.fillRect(5, -5, 30, 10);

      ctx.beginPath();
      ctx.fillStyle = "#38bdf8";
      ctx.arc(0, 0, player.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(game.mouse.x, game.mouse.y, 10, 0, Math.PI * 2);
      ctx.stroke();
    };

    const loop = (time) => {
      const game = gameRef.current;

      if (game) {
        const dt = Math.min(
          (time - (game.lastTime || time)) / 1000,
          0.035
        );

        game.lastTime = time;

        if (game.running) update(game, dt);

        draw(game);

        if (time - lastHudUpdate > 100) {
          setStats({
            score: game.score,
            health: Math.ceil(game.player.hp),
            ammo: game.ammo,
            reserve: game.reserve,
            wave: game.wave,
          });

          if (game.gameOver) setStatus("gameover");

          lastHudUpdate = time;
        }
      }

      animationId = requestAnimationFrame(loop);
    };

    const onKeyDown = (event) => {
      const key = event.key.toLowerCase();

      if (
        ["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(key)
      ) {
        event.preventDefault();
      }

      keysRef.current[key] = true;

      if (key === " " && gameRef.current?.running) shoot();
      if (key === "r") startGame();
    };

    const onKeyUp = (event) => {
      keysRef.current[event.key.toLowerCase()] = false;
    };

    const onMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const game = gameRef.current;

      if (game) {
        game.mouse.x = event.clientX - rect.left;
        game.mouse.y = event.clientY - rect.top;
      }
    };

    const onMouseDown = () => shoot();

    resize();

    window.addEventListener("resize", resize);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", onMouseDown);

    animationId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mousedown", onMouseDown);
    };
  }, [startGame]);

  const reload = () => {
    const game = gameRef.current;

    if (!game || game.reserve <= 0 || game.ammo >= 30) return;

    const amount = Math.min(30 - game.ammo, game.reserve);
    game.ammo += amount;
    game.reserve -= amount;

    setStats((previous) => ({
      ...previous,
      ammo: game.ammo,
      reserve: game.reserve,
    }));
  };

  const setMove = (key, value) => {
    keysRef.current[key] = value;
  };

  return (
    <main className="min-h-screen bg-[#080d16] p-3 text-white sm:p-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400 text-2xl font-black text-slate-950">
              ✦
            </div>
            <div>
              <h1 className="text-xl font-black tracking-wider sm:text-2xl">
                ARENA <span className="text-cyan-400">STRIKE</span>
              </h1>
              <p className="text-xs tracking-widest text-slate-400">
                SURVIVAL SHOOTER
              </p>
            </div>
          </div>

          <button
            onClick={startGame}
            className="rounded-lg bg-cyan-400 px-5 py-2.5 font-bold text-slate-950 transition hover:bg-cyan-300"
          >
            {status === "playing" ? "Restart" : "Play Game"}
          </button>
        </header>

        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["SCORE", stats.score.toLocaleString(), "text-cyan-400"],
            ["HEALTH", `${stats.health}%`, "text-green-400"],
            ["WAVE", stats.wave, "text-yellow-400"],
            ["AMMO", `${stats.ammo} / ${stats.reserve}`, "text-orange-400"],
          ].map(([label, value, color]) => (
            <div
              key={label}
              className="rounded-xl border border-slate-800 bg-slate-900 p-4"
            >
              <p className="text-xs font-bold tracking-widest text-slate-500">
                {label}
              </p>
              <p className={`mt-1 text-2xl font-black ${color}`}>{value}</p>

              {label === "HEALTH" && (
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-700">
                  <div
                    className="h-full rounded-full bg-green-400 transition-all"
                    style={{ width: `${stats.health}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
          <canvas
            ref={canvasRef}
            className="block h-[60vh] min-h-[400px] w-full cursor-crosshair touch-none sm:h-[650px]"
            onPointerMove={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              const game = gameRef.current;

              if (game) {
                game.mouse.x = event.clientX - rect.left;
                game.mouse.y = event.clientY - rect.top;
              }
            }}
            onPointerDown={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              const game = gameRef.current;

              if (game) {
                game.mouse.x = event.clientX - rect.left;
                game.mouse.y = event.clientY - rect.top;
              }

              if (event.pointerType === "touch") {
                keysRef.current.mouse = true;
              }
            }}
            onPointerUp={() => {
              keysRef.current.mouse = false;
            }}
            onPointerLeave={() => {
              keysRef.current.mouse = false;
            }}
          />

          {status !== "playing" && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 p-5 backdrop-blur-sm">
              <div className="max-w-md text-center">
                <div className="mb-4 text-6xl">
                  {status === "gameover" ? "💀" : "🎯"}
                </div>
                <h2 className="text-3xl font-black sm:text-5xl">
                  {status === "gameover" ? "GAME OVER" : "ARE YOU READY?"}
                </h2>
                <p className="mt-3 text-slate-300">
                  {status === "gameover"
                    ? `Final score: ${stats.score}. Try again!`
                    : "Move with WASD, aim with your mouse, and click to shoot."}
                </p>
                <button
                  onClick={startGame}
                  className="mt-6 rounded-xl bg-cyan-400 px-8 py-3 font-black text-slate-950 transition hover:scale-105 hover:bg-cyan-300"
                >
                  {status === "gameover" ? "PLAY AGAIN" : "START GAME"}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <h3 className="mb-3 font-bold text-cyan-400">HOW TO PLAY</h3>
            <div className="grid grid-cols-2 gap-3 text-sm text-slate-300">
              <p><kbd className="rounded bg-slate-800 px-2 py-1 text-white">W A S D</kbd> Move</p>
              <p><kbd className="rounded bg-slate-800 px-2 py-1 text-white">Mouse</kbd> Aim</p>
              <p><kbd className="rounded bg-slate-800 px-2 py-1 text-white">Click</kbd> Shoot</p>
              <p><kbd className="rounded bg-slate-800 px-2 py-1 text-white">R</kbd> Restart</p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-cyan-400">WEAPON</h3>
                <p className="mt-1 text-sm text-slate-400">
                  Assault Rifle · Automatic
                </p>
              </div>
              <div className="text-3xl">🔫</div>
            </div>
            <button
              onClick={reload}
              className="mt-4 w-full rounded-lg border border-slate-700 py-2 text-sm font-bold transition hover:bg-slate-800"
            >
              ↻ Reload
            </button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 sm:hidden">
          <div className="col-span-2 grid grid-cols-3 gap-2">
            <span />
            <button
              onPointerDown={() => setMove("w", true)}
              onPointerUp={() => setMove("w", false)}
              onPointerLeave={() => setMove("w", false)}
              className="rounded-xl bg-slate-800 py-4 text-xl"
            >
              ▲
            </button>
            <span />
            <button
              onPointerDown={() => setMove("a", true)}
              onPointerUp={() => setMove("a", false)}
              onPointerLeave={() => setMove("a", false)}
              className="rounded-xl bg-slate-800 py-4 text-xl"
            >
              ◀
            </button>
            <button
              onPointerDown={() => setMove("s", true)}
              onPointerUp={() => setMove("s", false)}
              onPointerLeave={() => setMove("s", false)}
              className="rounded-xl bg-slate-800 py-4 text-xl"
            >
              ▼
            </button>
            <button
              onPointerDown={() => setMove("d", true)}
              onPointerUp={() => setMove("d", false)}
              onPointerLeave={() => setMove("d", false)}
              className="rounded-xl bg-slate-800 py-4 text-xl"
            >
              ▶
            </button>
          </div>

          <button
            onPointerDown={() => setMove("mouse", true)}
            onPointerUp={() => setMove("mouse", false)}
            onPointerLeave={() => setMove("mouse", false)}
            className="rounded-xl bg-red-500 font-black text-white active:bg-red-600"
          >
            FIRE
          </button>
        </div>
      </div>
    </main>
  );
}
