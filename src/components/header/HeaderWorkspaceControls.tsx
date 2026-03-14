import { componentTabs, type ComponentTabId, type MachineSetTemplate } from '../../editorConfig';

interface HeaderWorkspaceControlsProps {
  activeComponentTab: ComponentTabId;
  onSelectComponentTab: (tabId: ComponentTabId) => void;
  visibleMachineSets: MachineSetTemplate[];
  onAddMachineSet: (setId: string) => void;
}

export function HeaderWorkspaceControls({
  activeComponentTab,
  onSelectComponentTab,
  visibleMachineSets,
  onAddMachineSet,
}: HeaderWorkspaceControlsProps) {
  return (
    <div className="flex-1 min-w-0 bg-white/5 p-3 rounded-2xl border border-white/5 shadow-inner">
      <div className="flex flex-wrap items-center gap-1.5 px-1">
        <div className="text-[9px] uppercase tracking-[0.22em] text-white/40 mr-2">Families</div>
        {componentTabs.map((tab) => {
          const isActive = activeComponentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={(event) => {
                event.stopPropagation();
                onSelectComponentTab(tab.id);
              }}
              className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.18em] border transition-all ${
                isActive
                  ? 'bg-white text-black border-white shadow-lg'
                  : 'bg-white/5 text-white/55 border-white/10 hover:bg-white/10 hover:text-white'
              }`}
              title={tab.hint}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {visibleMachineSets.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 px-1 pt-3 mt-3 border-t border-white/10">
          <div className="text-[9px] uppercase tracking-[0.22em] text-white/40 mr-2">Sets</div>
          {visibleMachineSets.map((setTemplate) => (
            <button
              key={setTemplate.id}
              onClick={(event) => {
                event.stopPropagation();
                onAddMachineSet(setTemplate.id);
              }}
              className="px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.18em] border bg-fuchsia-500/10 text-fuchsia-200 border-fuchsia-500/25 hover:bg-fuchsia-500/20 transition-all"
              title={setTemplate.hint}
            >
              + {setTemplate.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
