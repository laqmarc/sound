import './HeaderBrand.css';

interface HeaderBrandProps {
  onTestSound: () => void;
}

export function HeaderBrand({ onTestSound }: HeaderBrandProps) {
  return (
    <div className="header-brand" onClick={onTestSound}>
      <h1 className="header-brand__title">
        QUITUS<span className="header-brand__accent">BASS</span>CAOS
      </h1>
    </div>
  );
}
