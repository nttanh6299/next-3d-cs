import { Paintbrush, Settings } from 'lucide-react';
import { useControlStore } from '@/store/controlStore';

export const Toggle = () => {
  const { setPaintMode, setSettingMode } = useControlStore();

  const toggles = [
    { id: 'paint', icon: Paintbrush, action: () => setPaintMode(true) },
    { id: 'settings', icon: Settings, action: () => setSettingMode(true) },
  ];

  return (
    <div className="fixed right-3 top-3 flex flex-col space-y-3">
      {toggles.map((toggle) => (
        <div
          key={toggle.id}
          className="group p-2 rounded-full border border-dashed border-primary/60 cursor-pointer hover:border-primary"
          onClick={toggle.action}
        >
          <toggle.icon className="w-6 h-6 text-primary/60 group-hover:text-primary" />
        </div>
      ))}
    </div>
  );
};
