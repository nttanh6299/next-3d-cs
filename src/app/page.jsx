'use client';

import { Suspense, useEffect, useState, useLayoutEffect } from 'react';
import { SRGBColorSpace, RepeatWrapping, TextureLoader } from 'three';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, useGLTF, Stage } from '@react-three/drei';
import { HttpClient } from '@/lib/axios';

function Model({ legacy, url, textureUrl, textureSecondUrl }) {
  const { scene } = useGLTF(url);
  console.log(scene);
  useLayoutEffect(() => {
    scene.traverse((obj) => {
      if (obj.isMesh) {
        const loader = new TextureLoader();

        obj.castShadow = obj.receiveShadow = false;
        obj.material.envMapIntensity = 0.8;

        if (
          (legacy && obj.name === 'model') ||
          (legacy && obj.name === 'model_lens') ||
          (legacy && obj.name === 'model_scope') ||
          (!legacy && obj.name === 'legacy') ||
          (!legacy && obj.name === 'legacy_lens') ||
          (!legacy && obj.name === 'legacy_scope')
        ) {
          obj.visible = false;
        }

        if ((legacy && obj.name === 'legacy_lens') || (!legacy && obj.name === 'model_lens')) {
          obj.material = obj.material.clone();
          obj.material.color = 'black';
        }

        if (textureSecondUrl) {
          if (
            (legacy && obj.name === 'legacy_second') ||
            (legacy && obj.name === 'legacy_scope') ||
            (!legacy && obj.name === 'model_second') ||
            (!legacy && obj.name === 'model_scope') ||
            obj.name === 'bullets'
          ) {
            obj.material = obj.material.clone();
            loader.load(textureSecondUrl, (loadedTexture) => {
              loadedTexture.colorSpace = SRGBColorSpace;
              loadedTexture.flipY = false;
              loadedTexture.wrapS = RepeatWrapping;
              loadedTexture.wrapT = RepeatWrapping;
              obj.material.map = loadedTexture;
              obj.material.roughness = 0.6;
              obj.material.needsUpdate = true;
            });
          }
        }

        if (textureUrl) {
          if ((legacy && obj.name === 'legacy') || (!legacy && obj.name === 'model')) {
            obj.material = obj.material.clone();
            loader.load(textureUrl, (loadedTexture) => {
              loadedTexture.colorSpace = SRGBColorSpace;
              loadedTexture.flipY = false;
              loadedTexture.wrapS = RepeatWrapping;
              loadedTexture.wrapT = RepeatWrapping;
              obj.material.map = loadedTexture;
              obj.material.roughness = 0.5;
              obj.material.needsUpdate = true;
            });
          }
        }
      }
    });
  }, [scene, legacy, textureUrl, textureSecondUrl]);

  return (
    // <Center ref={ref} {...props} dispose={null}>
    //   <primitive object={scene} />
    // </Center>
    <Stage intensity={0.8} environment="warehouse" adjustCamera={false}>
      <primitive object={scene} />
    </Stage>
  );
}

const Scene = () => {
  const [modelUrl, setModelUrl] = useState(null);
  const [textureUrl, setTextureUrl] = useState(null);

  useEffect(() => {
    HttpClient.get('/api/skin', { responseType: 'blob' })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        setModelUrl(url);
      })
      .catch((error) => {
        console.error('Error fetching model:', error);
      });
  }, []);

  useEffect(() => {
    HttpClient.get('/api/skin/texture', { responseType: 'blob' })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        setTextureUrl(url);
      })
      .catch((error) => {
        console.error('Error fetching texture:', error);
      });
  }, []);

  return (
    <>
      <color attach="background" args={['black']} />
      {/* <color attach="background" args={['#f5efe6']} /> */}
      <ambientLight intensity={0.5} />
      <Suspense fallback={null}>
        {modelUrl && (
          <Model
            legacy={false}
            url={modelUrl}
            textureUrl={textureUrl}
            textureSecondUrl="/textures/negev_bullets.png"
          />
        )}
        <Environment preset="warehouse" />
      </Suspense>
      <OrbitControls enableZoom={true} />
    </>
  );
};

function App() {
  return (
    <Canvas flat shadows dpr={[1, 2]} camera={{ fov: 40 }}>
      <Scene />
    </Canvas>
  );
}

export default App;
