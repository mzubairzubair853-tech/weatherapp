
"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function Page() {
  const mountRef = useRef(null);
  const gameRef = useRef(null);
  const [health, setHealth] = useState([100, 100]);
  const [winner, setWinner] = useState("");

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#101827");
    scene.fog = new THREE.Fog("#101827", 15, 35);

    const camera = new THREE.PerspectiveCamera(
      50,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 5.5, 12);
    camera.lookAt(0, 1.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x273044, 2));

    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(-4, 9, 7);
    light.castShadow = true;
    scene.add(light);

    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(18, 0.4, 12),
      new THREE.MeshStandardMaterial({ color: "#252d3b", roughness: 0.8 })
    );
    floor.position.y = -0.2;
    floor.receiveShadow = true;
    scene.add(floor);

    const grid = new THREE.GridHelper(18, 18, 0x64748b, 0x374151);
    grid.position.y = 0.01;
    scene.add(grid);

    function makeFighter(color, pantsColor, x, direction) {
      const root = new THREE.Group();
      root.position.set(x, 0, 0);
      scene.add(root);

      const body = new THREE.Group();
      root.add(body);

      const skin = new THREE.MeshStandardMaterial({
        color: "#d9a47c",
        roughness: 0.7,
      });
      const shirt = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.65,
      });
      const pants = new THREE.MeshStandardMaterial({
        color: pantsColor,
        roughness: 0.8,
      });
      const dark = new THREE.MeshStandardMaterial({ color: "#171717" });

      function part(parent, geometry, material, x, y, z) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        parent.add(mesh);
        return mesh;
      }

      // Torso
      part(
        body,
        new THREE.CapsuleGeometry(0.42, 0.65, 6, 12),
        shirt,
        0,
        1.55,
        0
      );

      // Neck and head
      part(body, new THREE.CylinderGeometry(0.13, 0.16, 0.22, 12), skin, 0, 2.1, 0);
      const head = part(
        body,
        new THREE.SphereGeometry(0.3, 24, 24),
        skin,
        0,
        2.48,
        0
      );

      // Hair
      part(
        body,
        new THREE.SphereGeometry(0.305, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2),
        dark,
        0,
        2.57,
        0
      );

      // Eyes: placed on the front (+Z) side of the local character
      const eyeMaterial = new THREE.MeshStandardMaterial({ color: "#111111" });
      part(body, new THREE.SphereGeometry(0.035, 10, 10), eyeMaterial, -0.1, 2.5, 0.27);
      part(body, new THREE.SphereGeometry(0.035, 10, 10), eyeMaterial, 0.1, 2.5, 0.27);

      // Arms
      const arms = [];
      [-1, 1].forEach((side) => {
        const arm = new THREE.Group();
        arm.position.set(side * 0.47, 1.85, 0);
        body.add(arm);

        part(
          arm,
          new THREE.CapsuleGeometry(0.13, 0.42, 5, 10),
          skin,
          0,
          -0.3,
          0
        );

        const glove = part(
          arm,
          new THREE.SphereGeometry(0.17, 12, 12),
          dark,
          0,
          -0.62,
          0.02
        );

        arms.push(arm);
      });

      // Legs
      const legs = [];
      [-1, 1].forEach((side) => {
        const leg = new THREE.Group();
        leg.position.set(side * 0.2, 0.9, 0);
        body.add(leg);

        part(
          leg,
          new THREE.CapsuleGeometry(0.18, 0.58, 5, 10),
          pants,
          0,
          -0.38,
          0
        );

        part(
          leg,
          new THREE.BoxGeometry(0.25, 0.15, 0.42),
          dark,
          0,
          -0.77,
          0.13
        );

        legs.push(leg);
      });

      // Turn the character's local front toward its opponent.
      // Local front is +Z. A rotation of +PI/2 points it toward +X;
      // -PI/2 points it toward -X.
      root.rotation.y = direction === 1 ? Math.PI / 2 : -Math.PI / 2;

      return {
        root,
        body,
        arms,
        legs,
        health: 100,
        attack: 0,
        attackCooldown: 0,
        hitCooldown: 0,
        direction,
        speed: 0,
        jumpVelocity: 0,
        grounded: true,
      };
    }

    const player = makeFighter("#2563eb", "#172554", -3, 1);
    const enemy = makeFighter("#dc2626", "#450a0a", 3, -1);

    // Arena boundaries
    const wallMaterial = new THREE.MeshStandardMaterial({ color: "#334155" });
    [-6, 6].forEach((x) => {
      const wall = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 3, 12),
        wallMaterial
      );
      wall.position.set(x, 1.5, 0);
      scene.add(wall);
    });

    const keys = {};
    let animationId;
    let previousTime = 0;
    let active = true;

    function updateFacing() {
      const diff = enemy.root.position.x - player.root.position.x;

      if (Math.abs(diff) > 0.01) {
        player.direction = diff > 0 ? 1 : -1;
        enemy.direction = diff > 0 ? -1 : 1;

        player.root.rotation.y =
          player.direction === 1 ? Math.PI / 2 : -Math.PI / 2;

        enemy.root.rotation.y =
          enemy.direction === 1 ? Math.PI / 2 : -Math.PI / 2;
      }
    }

    function attack(attacker, defender, type) {
      if (attacker.attackCooldown > 0 || attacker.health <= 0 || defender.health <= 0) {
        return;
      }

      attacker.attack = type;
      attacker.attackCooldown = 0.55;

      const distance = Math.abs(
        attacker.root.position.x - defender.root.position.x
      );

      if (distance < 2.1) {
        const damage = type === "kick" ? 15 : 9;
        defender.health = Math.max(0, defender.health - damage);

        setHealth((old) =>
          attacker === player
            ? [old[0], defender.health]
            : [defender.health, old[1]]
        );

        defender.hitCooldown = 0.2;

        if (defender.health <= 0) {
          setWinner(attacker === player ? "PLAYER 1 WINS!" : "PLAYER 2 WINS!");
        }
      }
    }

    function handleKeyDown(e) {
      keys[e.key.toLowerCase()] = true;

      if (e.repeat) return;

      if (e.key.toLowerCase() === "j") attack(player, enemy, "punch");
      if (e.key.toLowerCase() === "k") attack(player, enemy, "kick");
      if (e.key.toLowerCase() === "u") attack(enemy, player, "punch");
      if (e.key.toLowerCase() === "i") attack(enemy, player, "kick");
    }

    function handleKeyUp(e) {
      keys[e.key.toLowerCase()] = false;
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    function animate(time) {
      if (!active) return;

      animationId = requestAnimationFrame(animate);

      const dt = Math.min((time - previousTime) / 1000 || 0.016, 0.04);
      previousTime = time;

      if (!winner) {
        // Player 1 movement
        player.speed = 0;
        if (keys.a) player.speed = -4;
        if (keys.d) player.speed = 4;

        // Player 2 movement (AI)
        enemy.speed = 0;
        const distance = enemy.root.position.x - player.root.position.x;

        if (Math.abs(distance) > 1.5) {
          enemy.speed = distance > 0 ? -2 : 2;
        }

        // Player 1 jump
        if (keys.w && player.grounded) {
          player.jumpVelocity = 6;
          player.grounded = false;
        }

        // Enemy jump occasionally
        if (enemy.grounded && Math.random() < 0.002) {
          enemy.jumpVelocity = 5;
          enemy.grounded = false;
        }

        [player, enemy].forEach((fighter) => {
          fighter.root.position.x += fighter.speed * dt;
          fighter.root.position.x = THREE.MathUtils.clamp(
            fighter.root.position.x,
            -5.4,
            5.4
          );

          if (!fighter.grounded) {
            fighter.root.position.y += fighter.jumpVelocity * dt;
            fighter.jumpVelocity -= 15 * dt;

            if (fighter.root.position.y <= 0) {
              fighter.root.position.y = 0;
              fighter.grounded = true;
              fighter.jumpVelocity = 0;
            }
          }

          fighter.attackCooldown = Math.max(0, fighter.attackCooldown - dt);
          fighter.hitCooldown = Math.max(0, fighter.hitCooldown - dt);

          fighter.body.position.y = Math.sin(time * 0.008) * 0.025;

          if (fighter.attackCooldown > 0.3) {
            fighter.arms[0].rotation.x = -0.9;
          } else {
            fighter.arms[0].rotation.x = 0;
          }

          fighter.legs[0].rotation.x = Math.sin(time * 0.008) * 0.12;
          fighter.legs[1].rotation.x = -Math.sin(time * 0.008) * 0.12;
        });

        // Keep both fighters facing each other after movement
        updateFacing();

        // Keep fighters from overlapping
        const gap = enemy.root.position.x - player.root.position.x;
        if (Math.abs(gap) < 1.1) {
          const middle = (player.root.position.x + enemy.root.position.x) / 2;
          player.root.position.x = middle - 0.55;
          enemy.root.position.x = middle + 0.55;
        }
      }

      renderer.render(scene, camera);
    }

    gameRef.current = { player, enemy, keys };

    animationId = requestAnimationFrame(animate);

    function resize() {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }

    window.addEventListener("resize", resize);

    return () => {
      active = false;
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [winner]);

  function restart() {
    setHealth([100, 100]);
    setWinner("");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-4">
      <h1 className="text-center text-3xl md:text-5xl font-black text-red-500 mb-5">
        FIGHTING ARENA
      </h1>

      <div className="max-w-5xl mx-auto flex justify-between gap-5 mb-4">
        <div className="w-1/2">
          <p className="font-bold text-blue-400 mb-2">PLAYER 1</p>
          <div className="h-5 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all"
              style={{ width: `${health[0]}%` }}
            />
          </div>
        </div>

        <div className="w-1/2 text-right">
          <p className="font-bold text-red-400 mb-2">PLAYER 2</p>
          <div className="h-5 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-500 transition-all"
              style={{ width: `${health[1]}%` }}
            />
          </div>
        </div>
      </div>

      <div
        ref={mountRef}
        className="w-full max-w-5xl mx-auto h-[480px] rounded-xl overflow-hidden border border-slate-700"
      />

      <div className="text-center mt-5">
        {winner && (
          <p className="text-3xl font-black text-yellow-400 mb-4">{winner}</p>
        )}

        <p className="text-slate-300 mb-3">
          Player 1: A / D Move | W Jump | J Punch | K Kick
        </p>
        <p className="text-slate-300 mb-4">
          Player 2: Computer AI
        </p>

        <button
          onClick={restart}
          className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-lg font-bold"
        >
          RESTART GAME
        </button>
      </div>
    </main>
  );
}
