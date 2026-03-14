interface HeaderBrandProps {
  onTestSound: () => void;
}

export function HeaderBrand({ onTestSound }: HeaderBrandProps) {
  return (
    <div className="flex items-center gap-3 group cursor-pointer flex-shrink-0" onClick={onTestSound}>
      <h1 className="text-xl font-black tracking-tighter bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent hidden sm:block">
        QUITUS<span className="text-sky-500">BASS</span>
      </h1>
    </div>
  );
}
