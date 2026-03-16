import { componentTabs, type ComponentTabId, type MachineSetTemplate } from '../../editorConfig';
import './HeaderWorkspaceControls.css';

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
    <div className="header-workspace-controls" data-tutorial="header-workspace">
      <div className="header-workspace-controls__row">
        <div className="header-workspace-controls__label">Families</div>
        {componentTabs.map((tab) => {
          const isActive = activeComponentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={(event) => {
                event.stopPropagation();
                onSelectComponentTab(tab.id);
              }}
              className={`header-workspace-controls__tab ${
                isActive ? 'header-workspace-controls__tab--active' : ''
              }`}
              title={tab.hint}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {visibleMachineSets.length > 0 && (
        <div
          className="header-workspace-controls__row header-workspace-controls__row--sets"
          data-tutorial="machine-sets"
        >
          <div className="header-workspace-controls__label">Sets</div>
          {visibleMachineSets.map((setTemplate) => (
            <button
              key={setTemplate.id}
              onClick={(event) => {
                event.stopPropagation();
                onAddMachineSet(setTemplate.id);
              }}
              className="header-workspace-controls__set"
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
