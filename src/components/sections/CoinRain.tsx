"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, useGLTF } from "@react-three/drei";
import * as THREE from "three";

/*
 * 3D "golden coin shower" for the Rewards section. ~50 (desktop) / ~25 (mobile)
 * coin instances fall continuously through the frame with gentle rotation. Each
 * coin is recycled the moment it drops below the view — respawned at a fresh
 * random point above — so the shower runs forever with no pile, pause, or reset.
 * Initial heights are spread across the full visible column so the frame is
 * populated from the first paint. Rendering is gated on viewport visibility and
 * honours reduced-motion.
 */

const MODEL_PATH = "/models/coin.glb";

const TARGET_DIAMETER = 0.5; // normalized coin size
const TOP_Y = 4.2; // respawn height (above the frame)
const BOTTOM_Y = -2.8; // recycle threshold (below the frame)
const SPAN_X = 2.3; // half-width of the spawn column
const SPAN_Z = 0.8; // depth spread
const MIN_SPEED = 1.2; // fall speed range (world units / sec)
const MAX_SPEED = 2.2;
const MAX_SPIN = 1.5; // gentle rotation (rad / sec)

const rand = (min: number, max: number) => min + Math.random() * (max - min);

interface Coin {
  x: number;
  y: number;
  z: number;
  speed: number;
  rx: number; // current rotation
  ry: number;
  rz: number;
  sx: number; // spin velocity
  sy: number;
  sz: number;
  scale: number;
}

/* Seed every coin at a random point, with initial Y spread across the whole
 * visible column so coins exist at all heights from the first frame. */
const initShower = (count: number, scaleBase: number): Coin[] => {
  const coins: Coin[] = [];
  for (let i = 0; i < count; i++) {
    coins.push({
      x: rand(-SPAN_X, SPAN_X),
      y: rand(BOTTOM_Y, TOP_Y),
      z: rand(-SPAN_Z, SPAN_Z),
      speed: rand(MIN_SPEED, MAX_SPEED),
      rx: rand(0, Math.PI * 2),
      ry: rand(0, Math.PI * 2),
      rz: rand(0, Math.PI * 2),
      sx: rand(-MAX_SPIN, MAX_SPIN),
      sy: rand(-MAX_SPIN, MAX_SPIN),
      sz: rand(-MAX_SPIN, MAX_SPIN),
      scale: scaleBase * rand(0.82, 1.08),
    });
  }
  return coins;
};

interface CoinAsset {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  scaleBase: number;
}

/* Pull the first mesh's geometry + material out of the GLB, center the geometry
 * so coins rotate about their middle, and derive a scale that normalizes the
 * coin to TARGET_DIAMETER regardless of the model's authored size. */
const useCoinAsset = (): CoinAsset => {
  const { scene } = useGLTF(MODEL_PATH);
  return useMemo(() => {
    let geometry: THREE.BufferGeometry | undefined;
    let material: THREE.Material | undefined;
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh && !geometry) {
        geometry = mesh.geometry.clone();
        material = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
      }
    });
    if (!geometry || !material) throw new Error("coin.glb contains no mesh");

    geometry.center();
    geometry.computeBoundingBox();
    const size = new THREE.Vector3();
    geometry.boundingBox!.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;

    return { geometry, material, scaleBase: TARGET_DIAMETER / maxDim };
  }, [scene]);
};

interface CoinShowerProps {
  count: number;
  reduced: boolean;
}

const CoinShower = ({ count, reduced }: CoinShowerProps) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { geometry, material, scaleBase } = useCoinAsset();
  const coins = useMemo(() => initShower(count, scaleBase), [count, scaleBase]);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    // Clamp dt so resuming after an off-screen pause never jumps the shower.
    const dt = reduced ? 0 : Math.min(delta, 0.05);

    for (let i = 0; i < coins.length; i++) {
      const c = coins[i];

      if (dt > 0) {
        c.y -= c.speed * dt;
        c.rx += c.sx * dt;
        c.ry += c.sy * dt;
        c.rz += c.sz * dt;

        // Recycle below the frame back to a fresh point above.
        if (c.y < BOTTOM_Y) {
          c.y = TOP_Y + Math.random() * 1.5;
          c.x = rand(-SPAN_X, SPAN_X);
          c.z = rand(-SPAN_Z, SPAN_Z);
          c.speed = rand(MIN_SPEED, MAX_SPEED);
        }
      }

      dummy.position.set(c.x, c.y, c.z);
      dummy.rotation.set(c.rx, c.ry, c.rz);
      dummy.scale.setScalar(c.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[geometry, material, count]} frustumCulled={false} />
  );
};

export const CoinRain = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [count, setCount] = useState(50);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setCount(window.matchMedia("(max-width: 640px)").matches ? 25 : 50);
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.1,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0 [mask-image:radial-gradient(ellipse_70%_70%_at_center,#000_30%,transparent_80%)] [-webkit-mask-image:radial-gradient(ellipse_70%_70%_at_center,#000_30%,transparent_80%)]"
    >
      <Canvas
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [0, 0.4, 5.6], fov: 45 }}
        frameloop={reduced ? "demand" : inView ? "always" : "never"}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 6, 3]} intensity={1.4} />
        <directionalLight position={[-4, 2, -3]} intensity={0.5} color="#b366ff" />
        <Suspense fallback={null}>
          {/* Procedural studio env — metallic coins need reflections, no remote HDR. */}
          <Environment resolution={128} frames={1}>
            <Lightformer intensity={2} position={[0, 3, 3]} scale={6} />
            <Lightformer intensity={1.2} position={[-4, 1, 2]} scale={4} color="#b366ff" />
            <Lightformer intensity={1.6} position={[4, 2, -1]} scale={4} color="#ffd27f" />
          </Environment>
          <CoinShower count={count} reduced={reduced} />
        </Suspense>
      </Canvas>
    </div>
  );
};

useGLTF.preload(MODEL_PATH);
