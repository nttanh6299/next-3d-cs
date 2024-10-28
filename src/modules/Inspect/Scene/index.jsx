import { Suspense, useEffect, useRef } from 'react';
import { TextureLoader, SRGBColorSpace, RepeatWrapping } from 'three';
import { Stage, useGLTF } from '@react-three/drei';
import { usePaintStore } from '@/store/paintStore';
import { STATIC_URL } from '@/config/env';
import { useControlStore } from '@/store/controlStore';

function Model({ legacy, url, textureUrl, textureSecondUrl }) {
  const { scene } = useGLTF(url);
  const ref = useRef();

  useEffect(() => {
    scene.traverse((obj) => {
      if (obj.isMesh) {
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
        } else {
          obj.visible = true;
        }

        if ((legacy && obj.name === 'legacy_lens') || (!legacy && obj.name === 'model_lens')) {
          obj.material = obj.material.clone();
          obj.material.color = 'black';
        }
      }
    });
  }, [scene, legacy]);

  useEffect(() => {
    scene.traverse((obj) => {
      if (obj.isMesh) {
        if (textureUrl) {
          if ((legacy && obj.name === 'legacy') || (!legacy && obj.name === 'model')) {
            obj.material = obj.material.clone();
            const loader = new TextureLoader();
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
  }, [scene, textureUrl, legacy]);

  useEffect(() => {
    scene.traverse((obj) => {
      if (obj.isMesh) {
        if (textureSecondUrl) {
          if (
            (legacy && obj.name === 'legacy_second') ||
            (legacy && obj.name === 'legacy_scope') ||
            (!legacy && obj.name === 'model_second') ||
            (!legacy && obj.name === 'model_scope') ||
            obj.name === 'bullets'
          ) {
            obj.material = obj.material.clone();
            const loader = new TextureLoader();
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
      }
    });
  }, [scene, textureSecondUrl, legacy]);

  useEffect(() => {
    return () => {
      // Clean up old model when component unmounts
      if (ref.current) {
        ref.current.traverse((child) => {
          if (child.isMesh) {
            child.geometry.dispose();
            child.material.dispose();
          }
        });
      }
    };
  }, [scene]);

  return (
    <Stage intensity={0.2} environment="warehouse" shadows={false} adjustCamera={false}>
      <primitive ref={ref} object={scene} />
    </Stage>
  );
}

const Light = ({ children }) => {
  const { brightness } = useControlStore();
  return (
    <>
      {children}
      <directionalLight position={[7, 0, 3]} color="#ebf2fc" intensity={brightness} />
    </>
  );
};

export const Scene = () => {
  const { selectedPaint } = usePaintStore();
  return (
    <>
      <color attach="background" args={['#ebf2fc']} />
      <Light>
        {selectedPaint && (
          <Suspense fallback={null}>
            <Model
              legacy={selectedPaint.uv_type === 'cs1'}
              url={`${STATIC_URL}/models/weapon_${selectedPaint.material}.glb`}
              textureUrl={`${STATIC_URL}/textures/${selectedPaint.defindex}/${selectedPaint.uuid}.webp`}
              textureSecondUrl={
                selectedPaint.slot ? `${STATIC_URL}/images/${selectedPaint.slot}` : ''
              }
            />
          </Suspense>
        )}
      </Light>
    </>
  );
};
