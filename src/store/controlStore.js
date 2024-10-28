import { create } from 'zustand';

const initialState = {
  orbitControls: null,
  paintMode: false,
  settingMode: false,
  rotateSpeed: 0,
  brightness: 0.2,
};

export const useControlStore = create((set) => ({
  ...initialState,
  setOrbitControls: (orbitControls) => set(() => ({ orbitControls })),
  setPaintMode: (paintMode) => set(() => ({ paintMode })),
  setSettingMode: (settingMode) => set(() => ({ settingMode })),
  setRotateSpeed: (rotateSpeed) => set(() => ({ rotateSpeed })),
  setBrightness: (brightness) => set(() => ({ brightness })),
}));
