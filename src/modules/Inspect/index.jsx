'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useControlStore } from '@/store/controlStore';
import { Scene } from './Scene';
import { Toggle } from './UI/Toggle';
import { Sidebar } from './UI/Sidebar';

const Controls = () => {
  const { rotateSpeed, setOrbitControls } = useControlStore();
  return (
    <OrbitControls
      ref={setOrbitControls}
      autoRotate={rotateSpeed > 0}
      autoRotateSpeed={rotateSpeed * 30}
      enableDamping={false}
    />
  );
};

export const Inspect = () => {
  return (
    <div className="flex-1 flex flex-row">
      <Canvas flat shadows dpr={[1, 2]} camera={{ position: [1.5, 0.3, 0], fov: 40 }}>
        <Scene />
        <Controls />
      </Canvas>

      <div>
        <Toggle />
        <Sidebar />
      </div>
    </div>
  );
};
