import { Zap } from 'lucide-react';

interface HeaderBrandProps {
  onTestSound: () => void;
}

export function HeaderBrand({ onTestSound }: HeaderBrandProps) {
  return (
    <div className="flex items-center gap-3 group cursor-pointer flex-shrink-0" onClick={onTestSound}>
      <div className="bg-gradient-to-br from-sky-400 to-blue-600 p-2.5 rounded-xl shadow-lg shadow-sky-500/20 group-hover:scale-110 transition-transform">
        <Zap className="text-white w-5 h-5 fill-white" />
      </div>
      <h1 className="text-xl font-black tracking-tighter bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent hidden sm:block">
        SOUND<span className="text-sky-500">LAB</span>
      </h1>
    </div>
  );
}
