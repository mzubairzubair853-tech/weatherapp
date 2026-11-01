```jsx
"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function Page() {
  const mountRef = useRef(null);
  const [hud, setHud] = useState({
    health: 100,
    ammo: 30,
    score: 0,
    wave: 1,
    gameOver: false,
  });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let scene, camera, renderer, animationId;
    let player, ground;
    let zombies = [];
    let bullets = [];
    let keys = {};
    let mouse = new THREE.Vector2(0, 0);
    let raycaster = new THREE.Raycaster();
    let running = true;
    let lastTime = 0;
    let spawnTimer = 0;
    let health = 100;
    let ammo = 30;
    let score = 0;
    let wave = 1;
    let gameOver = false;

    const worldSize = 100;
    const clock = new THREE.Clock();

    scene = new THREE.Scene();
    scene.background = new THREE.Color("#101820");
    scene.fog = new THREE.Fog("#101820", 35, 100);

    camera = new THREE.PerspectiveCamera(
      65,
      mount.clientWidth / mount.clientHeight,
      0.1,
      200
    );

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xb9d9ff, 0x26321d, 2));

    const sun = new THREE.DirectionalLight(0xffffff, 2.5);
    sun.position.set(15, 30, 10);
    sun.castShadow = true;
    scene.add(sun);

    // Ground
    const groundGeo = new THREE.PlaneGeometry(worldSize, worldSize);
    const groundMat = new THREE.MeshStandardMaterial({
      color: "#35443a",
      roughness: 1,
    });
    ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Ground grid
    const grid = new THREE.GridHelper(worldSize, 50, "#71806b", "#536252");
    grid.position.y = 0.02;
    scene.add(grid);

    // Simple cover objects
    for (let i = 0; i < 24; i++) {
      const box = new THREE.Mesh(
        new THREE.BoxGeometry(2 + Math.random() * 2, 1.5, 2 + Math.random() * 2),
        new THREE.MeshStandardMaterial({ color: "#5a625c" })
      );
      box.position.set(
        (Math.random() - 0.5) * 70,
        0.75,
        (Math.random() - 0.5) * 70
      );
      box.castShadow = true;
      box.receiveShadow = true;
      scene.add(box);
    }

    // Player
    player = new THREE.Group();

    const body = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.45, 0.8, 4, 8),
      new THREE.MeshStandardMaterial({ color: "#2563eb" })
    );
    body.position.y = 1;
    body.castShadow = true;
    player.add(body);

    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 16, 16),
      new THREE.MeshStandardMaterial({ color: "#e8b995" })
    );
    head.position.y = 1.85;
    player.add(head);

    // Gun
    const gun = new THREE.Mesh(
      new THREE.BoxGeometry(0.18, 0.18, 1.1),
      new THREE.MeshStandardMaterial({ color: "#171717", metalness: 0.7 })
    );
    gun.position.set(0.35, 1.35, -0.65);
    player.add(gun);

    player.position.set(0, 0, 0);
    scene.add(player);

    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

    function spawnZombie() {
      const zombie = new THREE.Group();

      const skin = new THREE.MeshStandardMaterial({ color: "#6b9b54" });
      const shirt = new THREE.MeshStandardMaterial({ color: "#713f3f" });

      const torso = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.42, 0.75, 4, 8),
        shirt
      );
      torso.position.y = 1;
      torso.castShadow = true;
      zombie.add(torso);

      const zHead = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), skin);
      zHead.position.y = 1.85;
      zombie.add(zHead);

      const armGeo = new THREE.BoxGeometry(0.2, 0.75, 0.2);
      const leftArm = new THREE.Mesh(armGeo, skin);
      leftArm.position.set(-0.55, 1.1, -0.1);
      leftArm.rotation.x = -0.7;
      zombie.add(leftArm);

      const rightArm = new THREE.Mesh(armGeo, skin);
      rightArm.position.set(0.55, 1.1, -0.1);
      rightArm.rotation.x = -0.7;
      zombie.add(rightArm);

      const angle = Math.random() * Math.PI * 2;
      const distance = 20 + Math.random() * 12;
      zombie.position.set(
        player.position.x + Math.cos(angle) * distance,
        0,
        player.position.z + Math.sin(angle) * distance
      );

      zombie.userData = { health: 2, attackCooldown: 0 };
      scene.add(zombie);
      zombies.push(zombie);
    }

    function spawnWave() {
      const count = Math.min(4 + wave * 2, 30);
      for (let i = 0; i < count; i++) spawnZombie();
    }

    spawnWave();

    function updateHud() {
      setHud({ health, ammo, score, wave, gameOver });
    }

    function shoot() {
      if (gameOver || ammo <= 0) return;

      ammo--;

      raycaster.setFromCamera(mouse, camera);
      const target = new THREE.Vector3();
      raycaster.ray.intersectPlane(groundPlane, target);

      const direction = target.sub(player.position);
      direction.y = 0.15;
      direction.normalize();

      const bullet = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 8, 8),
        new THREE.MeshBasicMaterial({ color: "#ffd166" })
      );

      bullet.position.set(
        player.position.x,
        1.35,
        player.position.z
      );

      bullet.userData = {
        velocity: direction.multiplyScalar(35),
        life: 1.5,
      };

      scene.add(bullet);
      bullets.push(bullet);
      updateHud();
    }

    function reload() {
      if (gameOver) return;
      ammo = 30;
      updateHud();
    }

    function onKeyDown(e) {
      keys[e.code] = true;
      if (e.code === "KeyR") reload();
    }

    function onKeyUp(e) {
      keys[e.code] = false;
    }

    function onMouseMove(e) {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    }

    function onMouseDown(e) {
      if (e.button === 0) shoot();
    }

    function onResize() {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    }

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
    renderer.domElement.addEventListener("mousemove", onMouseMove);
    renderer.domElement.addEventListener("mousedown", onMouseDown);
    renderer.domElement.addEventListener("contextmenu", (e) => e.preventDefault());

    function animate(time) {
      if (!running) return;
      animationId = requestAnimationFrame(animate);

      const delta = Math.min(clock.getDelta(), 0.05);

      if (!gameOver) {
        // Player movement
        const move = new THREE.Vector3();
        if (keys.KeyW || keys.ArrowUp) move.z -= 1;
        if (keys.KeyS || keys.ArrowDown) move.z += 1;
        if (keys.KeyA || keys.ArrowLeft) move.x -= 1;
        if (keys.KeyD || keys.ArrowRight) move.x += 1;

        if (move.length() > 0) {
          move.normalize().multiplyScalar(8 * delta);
          player.position.add(move);
          player.position.x = THREE.MathUtils.clamp(player.position.x, -45, 45);
          player.position.z = THREE.MathUtils.clamp(player.position.z, -45, 45);
        }

        // Aim player toward mouse target
        raycaster.setFromCamera(mouse, camera);
        const aimTarget = new THREE.Vector3();
        raycaster.ray.intersectPlane(groundPlane, aimTarget);
        player.rotation.y = Math.atan2(
          aimTarget.x - player.position.x,
          aimTarget.z - player.position.z
        );

        // Camera follows player
        const desiredCamera = new THREE.Vector3(
          player.position.x,
          player.position.y + 12,
          player.position.z + 15
        );
        camera.position.lerp(desiredCamera, 0.08);
        camera.lookAt(player.position.x, 0, player.position.z);

        // Zombies chase player
        zombies.forEach((zombie) => {
          const direction = new THREE.Vector3()
            .subVectors(player.position, zombie.position);
          direction.y = 0;
          const distance = direction.length();

          if (distance > 1.5) {
            direction.normalize();
            zombie.position.add(direction.multiplyScalar((1.6 + wave * 0.08) * delta));
            zombie.rotation.y = Math.atan2(direction.x, direction.z);
          } else {
            zombie.userData.attackCooldown -= delta;
            if (zombie.userData.attackCooldown <= 0) {
              health -= 8;
              zombie.userData.attackCooldown = 0.8;
              if (health <= 0) {
                health = 0;
                gameOver = true;
              }
              updateHud();
            }
          }
        });

        // Move bullets and check hits
        bullets = bullets.filter((bullet) => {
          bullet.position.add(bullet.userData.velocity.clone().multiplyScalar(delta));
          bullet.userData.life -= delta;

          let hit = false;
          for (let i = zombies.length - 1; i >= 0; i--) {
            const zombie = zombies[i];
            if (bullet.position.distanceTo(zombie.position.clone().add(
              new THREE.Vector3(0, 1, 0)
            )) < 1.1) {
              zombie.userData.health--;
              hit = true;

              if (zombie.userData.health <= 0) {
                scene.remove(zombie);
                zombies.splice(i, 1);
                score += 100;
                updateHud();
              }
              break;
            }
          }

          if (hit || bullet.userData.life <= 0) {
            scene.remove(bullet);
            return false;
          }
          return true;
        });

        // Start next wave
        if (zombies.length === 0) {
          spawnTimer += delta;
          if (spawnTimer > 2) {
            wave++;
            spawnTimer = 0;
            spawnWave();
            updateHud();
          }
        }
      }

      renderer.render(scene, camera);
    }

    updateHud();
    animate(0);

    return () => {
      running = false;
      cancelAnimationFrame(animationId);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("resize", onResize);
      renderer.domElement.removeEventListener("mousemove", onMouseMove);
      renderer.domElement.removeEventListener("mousedown", onMouseDown);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <main className="relative h-screen w-full overflow-hidden bg-black text-white">
      <div ref={mountRef} className="absolute inset-0" />

      <div className="pointer-events-none absolute left-4 top-4 flex flex-wrap gap-3">
        <div className="rounded-xl border border-white/20 bg-black/70 px-4 py-2">
          <p className="text-xs uppercase tracking-widest text-gray-400">Health</p>
          <p className="text-xl font-bold text-red-400">{hud.health}%</p>
        </div>
        <div className="rounded-xl border border-white/20 bg-black/70 px-4 py-2">
          <p className="text-xs uppercase tracking-widest text-gray-400">Ammo</p>
          <p className="text-xl font-bold text-yellow-300">{hud.ammo}/30</p>
        </div>
        <div className="rounded-xl border border-white/20 bg-black/70 px-4 py-2">
          <p className="text-xs uppercase tracking-widest text-gray-400">Score</p>
          <p className="text-xl font-bold">{hud.score}</p>
        </div>
        <div className="rounded-xl border border-white/20 bg-black/70 px-4 py-2">
          <p className="text-xs uppercase tracking-widest text-gray-400">Wave</p>
          <p className="text-xl font-bold text-green-300">{hud.wave}</p>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-xl border border-white/20 bg-black/70 px-5 py-3 text-center text-sm text-gray-200">
        WASD / Arrow Keys: Move · Mouse: Aim · Left Click: Shoot · R: Reload
      </div>

      <button
        onClick={() => window.location.reload()}
        className="absolute right-4 top-4 rounded-xl bg-red-600 px-4 py-2 font-bold hover:bg-red-500"
      >
        Restart
      </button>

      {hud.gameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="rounded-2xl border border-red-500/40 bg-gray-950 p-8 text-center">
            <h1 className="mb-2 text-4xl font-black text-red-500">GAME OVER</h1>
            <p className="mb-6 text-gray-300">Final score: {hud.score}</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-xl bg-red-600 px-6 py-3 font-bold hover:bg-red-500"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
```