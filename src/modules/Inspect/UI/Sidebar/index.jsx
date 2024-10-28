import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Plus, Minus } from 'lucide-react';
import { useControlStore } from '@/store/controlStore';
import { usePaintStore } from '@/store/paintStore';
import { STATIC_URL } from '@/config/env';

const Accordion = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col space-y-1.5 min-w-40">
      <div
        className="group flex justify-between items-center cursor-pointer select-none"
        onClick={() => setOpen(!open)}
      >
        <span className="text-base font-medium border-b border-transparent group-hover:border-primary/60">
          {title}
        </span>
        {open ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
      </div>
      {open && children}
    </div>
  );
};

const CategorySelection = () => {
  const { categories, categoryTypes, selectedCategory, selectCategory } = usePaintStore();

  return (
    <div className="relative flex-1 flex flex-col min-w-[200px]">
      <div className="absolute inset-0 flex flex-col space-y-2 overflow-auto hoverable-scrollbar scrollbar pr-2">
        {categoryTypes.map((category) => {
          const categoriesByType = categories.filter((cat) => cat.type_name === category);
          return (
            <Accordion key={category} title={category}>
              <div className="flex flex-col">
                {categoriesByType.map((cat) => (
                  <div
                    key={cat.defindex}
                    data-selected={selectedCategory?.defindex === cat.defindex}
                    className="px-2 py-1.5 text-sm rounded cursor-pointer hover:bg-slate-100 data-[selected=true]:bg-slate-100"
                    onClick={() => selectCategory(cat)}
                  >
                    {cat.name}
                  </div>
                ))}
              </div>
            </Accordion>
          );
        })}
      </div>
    </div>
  );
};

const CustomImage = ({ src }) => {
  const fallbackSrc = '/gun.png';
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    setImgSrc(fallbackSrc);
  };

  return <Image src={imgSrc} alt="" layout="fill" objectFit="cover" onError={handleError} />;
};

const PaintList = () => {
  const router = useRouter();
  const { orbitControls } = useControlStore();
  const { selectedPaint, selectedCategory, isFetchingPaints, paintCollection, setPaint } =
    usePaintStore();
  const paints = paintCollection[selectedCategory?.defindex] || [];

  const handleSelectPaint = (paint) => {
    if (paint.uuid !== selectedPaint?.uuid) {
      orbitControls.reset();
      setPaint(paint);
      router.push(`/?paint=${paint.uuid}`);
    }
  };

  return (
    <div className="relative flex-1 flex flex-col min-w-[350px]">
      {isFetchingPaints && (
        <div className="absolute inset-0 pr-2 backdrop-blur-sm z-[1]">
          <div className="w-full h-full bg-slate-100/70"></div>
        </div>
      )}
      <div className="absolute inset-0 grid grid-cols-3 gap-1 overflow-auto hoverable-scrollbar scrollbar pr-2">
        {paints.map((paint) => (
          <div
            key={paint.uuid}
            className="flex flex-col p-2 pt-0 rounded cursor-pointer select-none hover:bg-slate-100"
            onClick={() => handleSelectPaint(paint)}
          >
            <div className="flex-1 relative pt-[100%]">
              <CustomImage src={`${STATIC_URL}/images/${paint.uuid}_icon.webp`} />
            </div>
            <span className="text-xs text-center truncate">{paint.skin_name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const PaintMode = () => {
  const { paintMode, setPaintMode } = useControlStore();

  const handleCollapsePaint = () => {
    setPaintMode(!paintMode);
  };

  return (
    <div
      data-open={paintMode}
      className="z-[1] fixed right-0 top-0 bottom-0 overflow-hidden bg-white flex flex-col transition-transform shadow-sm duration-300 translate-x-full data-[open=true]:translate-x-0"
    >
      <div className="flex-1 flex flex-col space-y-4 pl-4 pr-1 py-3">
        <div className="relative">
          <div className="cursor-pointer absolute left-0 top-0" onClick={handleCollapsePaint}>
            <ChevronLeft className="w-7 h-7" />
          </div>
          <div className="text-lg font-semibold text-center pt-0.5">3D CSGO Skins</div>
        </div>

        <div className="w-full h-px pr-2.5">
          <div className="w-full h-px border-t border-border"></div>
        </div>

        <div className="flex-1 flex space-x-4">
          <CategorySelection />
          <PaintList />
        </div>
      </div>
    </div>
  );
};

export const Sidebar = () => {
  const { brightness, rotateSpeed, settingMode, setSettingMode, setRotateSpeed, setBrightness } =
    useControlStore();

  const handleCollapseSettings = () => {
    setSettingMode(!settingMode);
  };

  return (
    <>
      <PaintMode />
      <div
        data-open={settingMode}
        className="fixed right-0 top-0 bottom-0 overflow-hidden bg-white flex flex-col transition-transform shadow-sm duration-300 translate-x-full data-[open=true]:translate-x-0"
      >
        <div className="flex-1 flex flex-col space-y-4 pl-4 pr-1 py-3">
          <div className="relative">
            <div className="cursor-pointer absolute left-0 top-0" onClick={handleCollapseSettings}>
              <ChevronLeft className="w-7 h-7" />
            </div>
            <div className="text-lg font-semibold text-center pt-0.5">Settings</div>
          </div>

          <div className="w-full h-px pr-2.5">
            <div className="w-full h-px border-t border-border"></div>
          </div>

          <div className="flex-1 flex flex-col space-y-4 min-w-[300px] pr-2.5">
            <div>
              <label htmlFor="rotate" className="block text-sm font-medium text-gray-900">
                Auto Rotate {rotateSpeed > 0 ? `(speed ${rotateSpeed.toFixed(2)})` : ''}
              </label>
              <input
                id="rotate"
                type="range"
                value={rotateSpeed}
                min={0}
                max={1}
                step={0.01}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                onChange={(e) => setRotateSpeed(parseFloat(e.target.value))}
              />
            </div>
            <div>
              <label htmlFor="brightness" className="block text-sm font-medium text-gray-900">
                Brightness ({brightness})
              </label>
              <input
                id="brightness"
                type="range"
                value={brightness}
                min={0}
                max={5}
                step={0.01}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                onChange={(e) => setBrightness(parseFloat(e.target.value))}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
