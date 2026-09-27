import { useRef, useState, type ReactNode } from 'react';
import { type Edge, type NodeTypes } from 'reactflow';
import {
  ArrowLeft,
  ArrowRight,
  Cable,
  Check,
  ChevronRight,
  Disc3,
  Plus,
  SlidersHorizontal,
  Square,
  Play,
  Trash2,
  Volume2,
} from 'lucide-react';
import {
  addNodeButtons,
  componentTabs,
  machineSetTemplates,
  type ComponentTabId,
} from '../../editorConfig';
import type {
  EditableAudioNodeType,
  SoundFlowNode,
  SoundNodeData,
} from '../../types';
import { canConnect, inputPorts } from './routingOptions';
import './MobileWorkbench.css';

type Page = 'play' | 'add' | 'cables' | 'session';
interface MobileWorkbenchProps {
  nodes: SoundFlowNode[];
  edges: Edge[];
  nodeTypes: NodeTypes;
  audioStarted: boolean;
  audioBusy: boolean;
  audioError: string;
  bpm: number;
  swing: number;
  onToggleAudio: () => void;
  onBpm: (value: number) => void;
  onSwing: (value: number) => void;
  onDataChange: (id: string, patch: Partial<SoundNodeData>) => void;
  onAdd: (type: EditableAudioNodeType) => string;
  onAddSet: (id: string) => string | undefined;
  onConnect: (source: string, target: string, handle: string | null) => void;
  onDisconnect: (edge: Edge) => void;
  onDelete: (node: SoundFlowNode) => void;
  session: ReactNode;
}

const familyNames: Record<ComponentTabId, string> = {
  all: 'Totes',
  voices: 'Sons',
  groove: 'Ritmes',
  fx: 'Efectes',
  wiring: 'Control',
  sight: 'Visuals',
};
const familyColors: Record<ComponentTabId, string> = {
  all: '#b8c8d3',
  voices: '#78dce8',
  groove: '#ee9de4',
  fx: '#e7bd76',
  wiring: '#b4d68b',
  sight: '#afa7ff',
};
const labelFor = (node: SoundFlowNode) =>
  node.type === 'destination'
    ? 'Sortida principal'
    : node.data.label ||
      addNodeButtons.find((button) => button.type === node.type)?.label ||
      node.type ||
      'Màquina';
const familyFor = (node: SoundFlowNode) =>
  addNodeButtons.find((button) => button.type === node.type)?.tab ?? 'wiring';

export function MobileWorkbench(props: MobileWorkbenchProps) {
  const [page, setPage] = useState<Page>('play');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [family, setFamily] = useState<ComponentTabId>('all');
  const [search, setSearch] = useState('');
  const [sourceId, setSourceId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [portId, setPortId] = useState('');
  const [feedback, setFeedback] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const contentRef = useRef<HTMLElement>(null);
  const selected = props.nodes.find((node) => node.id === selectedId);
  const NodeComponent = selected?.type
    ? props.nodeTypes[selected.type]
    : undefined;
  const destination = props.nodes.find((node) => node.type === 'destination');
  const source = props.nodes.find((node) => node.id === sourceId);
  const targets = source
    ? props.nodes.filter((node) => inputPorts(source, node).length > 0)
    : [];
  const target = targets.find((node) => node.id === targetId);
  const ports = source && target ? inputPorts(source, target) : [];
  const port = ports.find((entry) => (entry.id ?? '') === portId) ?? ports[0];
  const connectable =
    source &&
    target &&
    port &&
    canConnect(source, target, port.id, props.edges);
  const buttons = addNodeButtons.filter(
    (button) =>
      (family === 'all' || button.tab === family) &&
      `${button.label} ${button.type}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  const go = (next: Page) => {
    setPage(next);
    setFeedback('');
    contentRef.current?.scrollTo(0, 0);
  };
  const edit = (id: string) => {
    setSelectedId(id);
    setConfirmDelete(false);
    go('play');
  };
  const machines = props.nodes.filter((node) => node.type !== 'destination');
  const optionLabel = (node: SoundFlowNode) => node.type === 'destination'
    ? labelFor(node)
    : `${String(machines.findIndex(entry => entry.id === node.id) + 1).padStart(2, '0')} · ${labelFor(node)}`;

  return (
    <div className="mobile-workbench">
      <header className="mobile-header">
        <div>
          <span className="mobile-brand">
            QUITUS<span>BASS</span>CAOS
          </span>
          <span className="mobile-eyebrow">Laboratori de butxaca</span>
        </div>
        <span
          className={`mobile-engine-state ${props.audioStarted ? 'is-on' : ''}`}
        >
          <i />
          {props.audioStarted ? 'En marxa' : 'En pausa'}
        </span>
      </header>

      <main
        className="mobile-content"
        ref={contentRef}
        id="mobile-panel"
        aria-label={
          page === 'play'
            ? 'Tocar'
            : page === 'add'
              ? 'Afegir màquines'
              : page === 'cables'
                ? 'Connexions'
                : 'Sessió'
        }
      >
        {page === 'play' && (
          <>
            {selected && NodeComponent ? (
              <>
                <div className="mobile-editor-heading">
                  <button
                    onClick={() => {
                      setSelectedId(null);
                      setConfirmDelete(false);
                      contentRef.current?.scrollTo(0, 0);
                    }}
                  >
                    <ArrowLeft size={18} /> Màquines
                  </button>
                  <span>{familyNames[familyFor(selected)]}</span>
                </div>
                <h1>{labelFor(selected)}</h1>
                <p className="mobile-hint">
                  Llisca els controls per canviar el so.
                </p>
                <div className="mobile-node" data-node-type={selected.type}>
                  <NodeComponent
                    key={selected.id}
                    id={selected.id}
                    data={selected.data}
                    type={selected.type ?? ''}
                    selected={false}
                    isConnectable={false}
                    xPos={0}
                    yPos={0}
                    zIndex={0}
                    dragging={false}
                  />
                </div>
                <button
                  className="mobile-wide-button"
                  onClick={() => {
                    setSourceId(
                      selected.type === 'destination' ? '' : selected.id,
                    );
                    setTargetId('');
                    go('cables');
                  }}
                >
                  <Cable size={18} /> Veure i connectar cables
                </button>
                {selected.type !== 'destination' && (
                  <div className="mobile-delete">
                    {confirmDelete ? (
                      <>
                        <p>Treure {labelFor(selected)} i els seus cables?</p>
                        <div className="mobile-row">
                          <button onClick={() => setConfirmDelete(false)}>
                            Conservar
                          </button>
                          <button
                            className="mobile-danger"
                            onClick={() => {
                              props.onDelete(selected);
                              setSelectedId(null);
                              setConfirmDelete(false);
                            }}
                          >
                            Sí, treure
                          </button>
                        </div>
                      </>
                    ) : (
                      <button onClick={() => setConfirmDelete(true)}>
                        <Trash2 size={16} /> Treure màquina
                      </button>
                    )}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="mobile-intro">
                  <span className="mobile-eyebrow">
                    EL TEU PATCH · {machines.length} MÀQUINES
                  </span>
                  <h1>
                    Fes-lo teu<span>.</span>
                  </h1>
                  <p>
                    El so ja està preparat. Prem <strong>Play</strong> i toca
                    una màquina per començar.
                  </p>
                </div>
                <div className="mobile-machine-list">
                  {machines.map((node, index) => (
                    <button
                      className="mobile-machine"
                      key={node.id}
                      onClick={() => edit(node.id)}
                      style={
                        {
                          '--machine-color': familyColors[familyFor(node)],
                        } as React.CSSProperties
                      }
                    >
                      <span className="mobile-machine-number">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span>
                        <strong>{labelFor(node)}</strong>
                        <small>
                          {familyNames[familyFor(node)]} ·{' '}
                          {props.edges.some((edge) => edge.source === node.id)
                            ? 'Amb connexió de sortida'
                            : 'Sense connexió de sortida'}
                        </small>
                      </span>
                      <ChevronRight size={20} />
                    </button>
                  ))}
                </div>
                <button
                  className="mobile-wide-button"
                  onClick={() => go('add')}
                >
                  <Plus size={19} /> Afegeix una màquina
                </button>
                {destination && (
                  <button
                    className="mobile-master-card"
                    onClick={() => edit(destination.id)}
                  >
                    <Volume2 size={22} />
                    <span>
                      <strong>Sortida principal</strong>
                      <small>Volum, estèreo i limitador</small>
                    </span>
                    <ChevronRight size={18} />
                  </button>
                )}
              </>
            )}
          </>
        )}

        {page === 'add' && (
          <>
            <span className="mobile-eyebrow">AMPLIA EL LABORATORI</span>
            <h1>Què hi posem?</h1>
            <p className="mobile-hint">
              Un set ja porta les màquines connectades.
            </p>
            <div className="mobile-set-list">
              {machineSetTemplates.map((set) => (
                <button
                  key={set.id}
                  disabled={props.audioBusy}
                  onClick={() => {
                    const id = props.onAddSet(set.id);
                    if (id) edit(id);
                  }}
                >
                  <Plus size={18} />
                  <span>
                    <strong>{set.name}</strong>
                    <small>{set.hint}</small>
                  </span>
                </button>
              ))}
            </div>
            <h2>Màquines individuals</h2>
            <label className="mobile-field">
              Cerca una màquina
              <input
                type="search"
                value={search}
                placeholder="Oscil·lador, delay, drums…"
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
            <div className="mobile-families" aria-label="Famílies">
              {componentTabs.map((tab) => (
                <button
                  key={tab.id}
                  aria-pressed={family === tab.id}
                  onClick={() => setFamily(tab.id)}
                >
                  {familyNames[tab.id]}
                </button>
              ))}
            </div>
            <p className="mobile-hint">
              Afegeix-la i uneix-la al teu patch des de Cables.
            </p>
            <div className="mobile-catalog">
              {buttons.map((button) => (
                <button
                  key={button.type}
                  disabled={props.audioBusy}
                  onClick={() => edit(props.onAdd(button.type))}
                >
                  <span>{button.label}</span>
                  <Plus size={18} />
                </button>
              ))}
            </div>
            {!buttons.length && (
              <p>No hem trobat cap màquina amb aquest nom.</p>
            )}
          </>
        )}

        {page === 'cables' && (
          <>
            <span className="mobile-eyebrow">EL CAMÍ DEL SO</span>
            <h1>Connecta el caos.</h1>
            <p className="mobile-hint">
              Tria d’on surt el senyal i on ha d’anar.
            </p>
            <div className="mobile-card mobile-connection-form">
              <label className="mobile-field">
                1. Origen
                <select
                  value={source?.id ?? ''}
                  onChange={(event) => {
                    setSourceId(event.target.value);
                    setTargetId('');
                    setPortId('');
                    setFeedback('');
                  }}
                >
                  <option value="">Tria una màquina</option>
                  {machines.map((node) => (
                    <option key={node.id} value={node.id}>
                      {optionLabel(node)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="mobile-field">
                2. Destinació
                <select
                  value={target?.id ?? ''}
                  disabled={!source}
                  onChange={(event) => {
                    setTargetId(event.target.value);
                    setPortId('');
                    setFeedback('');
                  }}
                >
                  <option value="">Tria on connectar</option>
                  {targets.map((node) => (
                    <option key={node.id} value={node.id}>
                      {optionLabel(node)}
                    </option>
                  ))}
                </select>
              </label>
              {ports.length > 0 && (
                <label className="mobile-field">
                  3. Entrada
                  <select
                    value={port?.id ?? ''}
                    onChange={(event) => setPortId(event.target.value)}
                  >
                    {ports.map((entry) => (
                      <option key={entry.id ?? 'audio'} value={entry.id ?? ''}>
                        {entry.label}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <button
                className="mobile-primary"
                disabled={!connectable || props.audioBusy}
                onClick={() => {
                  if (source && target && port && connectable) {
                    props.onConnect(source.id, target.id, port.id);
                    setFeedback('Cable connectat.');
                  }
                }}
              >
                <Plus size={18} /> Connectar
              </button>
              {source && target && port && !connectable && (
                <p className="mobile-hint">Aquest cable ja està connectat.</p>
              )}
              <p className="mobile-feedback" role="status">
                {feedback}
              </p>
            </div>
            <h2>{props.edges.length} connexions</h2>
            <div className="mobile-cable-list">
              {props.edges.map((edge) => {
                const from = props.nodes.find(
                  (node) => node.id === edge.source,
                );
                const to = props.nodes.find((node) => node.id === edge.target);
                return (
                  <div className="mobile-cable" key={edge.id}>
                    <span>
                      <strong>{from ? labelFor(from) : edge.source}</strong>
                      <small>
                        <ArrowRight size={14} />{' '}
                        {to ? labelFor(to) : edge.target}
                        {edge.targetHandle ? ` · ${edge.targetHandle}` : ''}
                      </small>
                    </span>
                    <button
                      aria-label={`Desconnectar ${from ? labelFor(from) : edge.source} de ${to ? labelFor(to) : edge.target}${edge.targetHandle ? ` ${edge.targetHandle}` : ''}`}
                      disabled={props.audioBusy}
                      onClick={() => props.onDisconnect(edge)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {page === 'session' && (
          <>
            <span className="mobile-eyebrow">AL TEU RITME</span>
            <h1>La teva sessió.</h1>
            <div className="mobile-card">
              <h2>Tempo i moviment</h2>
              <label className="mobile-field">
                Tempo · {props.bpm} BPM
                <input
                  aria-label="Tempo"
                  type="range"
                  min={60}
                  max={180}
                  value={props.bpm}
                  onChange={(event) => props.onBpm(Number(event.target.value))}
                />
              </label>
              <label className="mobile-field">
                Swing · {Math.round(props.swing * 100)}%
                <input
                  aria-label="Swing"
                  type="range"
                  min={0}
                  max={0.45}
                  step={0.01}
                  value={props.swing}
                  onChange={(event) =>
                    props.onSwing(Number(event.target.value))
                  }
                />
              </label>
            </div>
            {props.session}
            <details className="mobile-card mobile-help">
              <summary>Com començar</summary>
              <ol>
                <li>Prem Play per activar el so.</li>
                <li>A Tocar, obre una màquina i llisca els controls.</li>
                <li>
                  Afegeix un set preparat o connecta màquines des de Cables.
                </li>
                <li>Guarda el patch o grava la sessió en WAV.</li>
              </ol>
            </details>
          </>
        )}
      </main>

      <footer className="mobile-dock">
        {props.audioError && (
          <p className="mobile-error" role="alert">
            {props.audioError}
          </p>
        )}
        <div className="mobile-transport">
          <button
            className={`mobile-play ${props.audioStarted ? 'is-playing' : ''}`}
            aria-label={
              props.audioStarted ? 'Aturar el so' : 'Play · Engegar el so'
            }
            disabled={props.audioBusy}
            onClick={props.onToggleAudio}
          >
            {props.audioStarted ? (
              <Square size={18} fill="currentColor" />
            ) : (
              <Play size={20} fill="currentColor" />
            )}
            {props.audioBusy ? 'Espera…' : props.audioStarted ? 'Stop' : 'Play'}
          </button>
          <label className="mobile-volume">
            <span>Volum</span>
            <input
              aria-label="Volum principal"
              type="range"
              min={0}
              max={2}
              step={0.01}
              value={destination?.data.gain ?? 1}
              disabled={!destination}
              onChange={(event) => {
                if (destination)
                  props.onDataChange(destination.id, {
                    gain: Number(event.target.value),
                  });
              }}
            />
          </label>
          <button
            className="mobile-tempo"
            onClick={() => go('session')}
            aria-label={`Tempo ${props.bpm} BPM`}
          >
            <strong>{props.bpm}</strong>
            <small>BPM</small>
          </button>
        </div>
        <nav className="mobile-tabs" aria-label="Navegació principal">
          {(
            [
              ['play', 'Tocar', SlidersHorizontal],
              ['add', 'Afegir', Plus],
              ['cables', 'Cables', Cable],
              ['session', 'Sessió', Disc3],
            ] as const
          ).map(([id, label, Icon]) => (
            <button
              key={id}
              aria-current={page === id ? 'page' : undefined}
              onClick={() => go(id)}
            >
              <Icon size={20} />
              <span>{label}</span>
              {page === id && <Check className="mobile-tab-check" size={10} />}
            </button>
          ))}
        </nav>
      </footer>
    </div>
  );
}
