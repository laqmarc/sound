# QUITUSBASSCAOS

Patching visual d'audio fet amb React, TypeScript, Vite i React Flow. La idea del projecte es simple: tens un canvas modular, hi afegeixes maquines de so, efectes, sequenciadors i eines de visualitzacio, i construeixes el routing connectant nodes.

No hi ha backend. Tot passa al navegador via Web Audio API.

## Stack

- `React 19`
- `TypeScript`
- `Vite`
- `React Flow`
- `Web Audio API`
- `lucide-react`

## Scripts

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Com va l'app

### Flux basic

1. Obre el projecte amb `npm run dev`.
2. Entra a la UI i prem `START ENGINE`.
3. Tria una familia al header: `Tot el Caos`, `Bestiari Sonor`, `Ritmes Toxics`, `Spa Radioactiu`, `Cablejat Fino` o `Ulls Mutants`.
4. Afegeix components des del panell lateral.
5. Connecta sortides i entrades al canvas.
6. Ajusta parametres directament als nodes.
7. Ruteja el resultat final al node `destination`.

### Interaccio important

- `Presets`: obre la llibreria de presets i usuaris.
- Click a una cable: l'elimines.
- `RESET`: torna al canvas base.
- `BPM` i `Swing`: controlen el transport global.

### Transport

El transport viu al component lateral inferior/dret i controla:

- estat `Running / Stopped`
- pas actual de 16 steps
- `BPM`
- `Swing`
- arrencada i parada del motor d'audio

## Estructura del projecte

```text
src/
  main.tsx                      Entrada React
  App.tsx                       Shell principal, React Flow, estat global del patch
  App.css                       Layout principal
  AudioEngine.ts                Facade del motor d'audio
  editorConfig.ts               Families, botons i machine sets
  nodeDefaults.ts               Valors inicials de tots els nodes
  presetLibrary.ts              Presets builtin + persistencia local
  types.ts                      Tipus compartits dels nodes
  index.css                     Estils globals
  styles/
    tokens.css                  Design tokens
  components/
    Knob.tsx                    Control rotary reutilitzable
    header/                     Header, tabs, presets
    layout/                     Transport i layout extra
  nodes/                        UI de cada node del canvas
  audio-engine/
    runtime.ts                  Stores i estat intern del motor
    routing.ts                  Connexions entre nodes
    transport.ts                Clock, bpm, swing i triggers
    create-node-musical.ts      Creacio de nodes musicals
    create-node-fx.ts           Creacio de nodes d'efectes
    apply-node-data-musical.ts  Aplicacio de parametres musicals
    apply-node-data-fx.ts       Aplicacio de parametres d'efectes
    apply-node-data-basic.ts    Aplicacio de parametres basics
    update-node-param.ts        Escriure parametres a AudioParams
    cleanup.ts                  Teardown i reset del motor
```

## Fitxers clau

### [src/main.tsx](./src/main.tsx)

Munta l'app React i carrega `App`.

### [src/App.tsx](./src/App.tsx)

Es el centre de la UI. Porta:

- estat dels `nodes` i `edges`
- sincronitzacio amb el motor d'audio
- creacio i eliminacio de nodes
- connexio i desconnexio d'edges
- presets i user presets
- `ReactFlow`, `Background` i `Controls`

### [src/AudioEngine.ts](./src/AudioEngine.ts)

Motor, Exposa funcions com:

- `createAudioNode`
- `applyAudioNodeData`
- `connectNodes`
- `disconnectNodes`
- `removeNode`
- `startTransport`
- `stopAudio`

### [src/types.ts](./src/types.ts)

Defineix:

- `editableNodeTypes`
- `SoundNodeData`
- `SoundFlowNode`

### [src/nodeDefaults.ts](./src/nodeDefaults.ts)

Conte els valors inicials de cada tipus de node. Quan afegeixes un component nou, normalment el primer lloc a tocar es aquest.

### [src/editorConfig.ts](./src/editorConfig.ts)

Configura:

- tabs/families del header
- `machineSetTemplates`
- botons disponibles al panell lateral

### [src/presetLibrary.ts](./src/presetLibrary.ts)

Gestiona:

- presets builtin
- exportacio de presets
- guardat a `localStorage`
- clonat segur de nodes i edges

## Components de UI

### Header

Fitxers:

- [src/components/header/SoundLabHeader.tsx](./src/components/header/SoundLabHeader.tsx)
- [src/components/header/HeaderBrand.tsx](./src/components/header/HeaderBrand.tsx)
- [src/components/header/HeaderWorkspaceControls.tsx](./src/components/header/HeaderWorkspaceControls.tsx)
- [src/components/header/PresetLibraryModal.tsx](./src/components/header/PresetLibraryModal.tsx)

Responsabilitats:

- branding
- families de components
- machine sets
- presets i user presets

### Transport

Fitxer:

- [src/components/layout/TransportAside.tsx](./src/components/layout/TransportAside.tsx)

Responsabilitats:

- play/stop engine
- bpm
- swing
- reset canvas

### Knob

Fitxer:

- [src/components/Knob.tsx](./src/components/Knob.tsx)

Es el control rotary base reutilitzat a gairebe tots els nodes.

## Families de nodes

El projecte te un node fix `destination` i una colla llarga de nodes editables.

### Voices

Fonts i sintes:

- `oscillator`
- `dualOsc`
- `dronePad`
- `bassline`
- `leadVoice`
- `monoSynth`
- `fmSynth`
- `subOsc`
- `noise`
- `noiseLayer`
- `weirdMachine`
- `chaosShrine`
- `chordGenerator`

### Groove

Ritme, seq i maquines generatives:

- `drumMachine`
- `drum2`
- `kickSynth`
- `snareSynth`
- `hiHatSynth`
- `arpeggiator`
- `arp2`
- `looper`
- `chordSeq`

### FX

Processat i destruccio:

- `filter`
- `distortion`
- `delay`
- `reverb`
- `compressor`
- `chorus`
- `bitcrusher`
- `flanger`
- `limiter`
- `tremolo`
- `ringMod`
- `vibrato`
- `combFilter`
- `autoPan`
- `autoFilter`
- `resonator`
- `wah`
- `stereoWidener`
- `foldback`
- `tiltEq`
- `saturator`
- `equalizer8`
- `phaser`
- `cabSim`
- `transientShaper`
- `freezeFx`
- `granular`
- `stutter`
- `humanizer`
- `triggerDelay`

### Wiring / Control

Routing i control:

- `gain`
- `mixer`
- `panner`
- `lfo`
- `clockDivider`
- `randomCv`
- `sampleHold`
- `gateSeq`
- `cvOffset`
- `envelopeFollower`
- `quantizer`
- `comparator`
- `lag`

### Sight

Meters i visuals:

- `scope`
- `vuMeter`
- `phaseCorrelator`
- `lissajous`
- `tuner`
- `spectrogram`

## Machine sets disponibles

Definits a [src/editorConfig.ts](./src/editorConfig.ts):

- `Drum Bus`: kick, snare i hi-hat ja connectats a un mixer.
- `Mutant Rig`: arpeggiator, weird machine, delay i scope.
- `FX Ladder`: cadena simple de filter -> chorus -> delay -> reverb.

## Arquitectura del motor d'audio

El motor esta separat per responsabilitats:

- [src/audio-engine/runtime.ts](./src/audio-engine/runtime.ts)
  Guarda stores globals, references de Web Audio i helpers comuns.
- [src/audio-engine/routing.ts](./src/audio-engine/routing.ts)
  Resol origen i desti d'una connexio i executa `connect`/`disconnect`.
- [src/audio-engine/transport.ts](./src/audio-engine/transport.ts)
  Gestiona clock global, bpm, swing i triggers de sequenciadors.
- [src/audio-engine/create-node-musical.ts](./src/audio-engine/create-node-musical.ts)
  Construeix instruments i fonts musicals.
- [src/audio-engine/create-node-fx.ts](./src/audio-engine/create-node-fx.ts)
  Construeix efectes i chains d'audio.
- [src/audio-engine/apply-node-data-*.ts](./src/audio-engine)
  Actualitzen parametres dels nodes quan canvies un knob, slider o select.
- [src/audio-engine/cleanup.ts](./src/audio-engine/cleanup.ts)
  Teardown, stop i reset de l'audio graph.

## Presets

Hi ha dos nivells:

- presets builtin dins de [src/presetLibrary.ts](./src/presetLibrary.ts)
- presets d'usuari guardats a `localStorage`

Des de la modal de presets pots:

- carregar presets builtin
- guardar el patch actual
- carregar presets d'usuari
- eliminar presets d'usuari
- exportar un preset en format codi

## Com afegir un node nou

Ordre recomanat:

1. Afegeix el tipus a [src/types.ts](./src/types.ts).
2. Afegeix defaults a [src/nodeDefaults.ts](./src/nodeDefaults.ts).
3. Crea la UI del node dins `src/nodes/`.
4. Registra'l a `nodeTypes` dins [src/App.tsx](./src/App.tsx).
5. Afegeix el boto i la familia a [src/editorConfig.ts](./src/editorConfig.ts).
6. Implementa la creacio del node al motor:
   `AudioEngine.ts`, `create-node-musical.ts` o `create-node-fx.ts`.
7. Implementa l'aplicacio de parametres a algun dels fitxers `apply-node-data-*`.
8. Si guarda estat intern o crea chains, neteja'l a [src/audio-engine/cleanup.ts](./src/audio-engine/cleanup.ts).

## Notes practiques

- El projecte depen de la Web Audio API, aixi que l'audio s'activa per interaccio d'usuari.
- El canvas treballa amb React Flow; el pan i zoom els controla aquest component.
- El node `destination` es la sortida final del patch.
- El `mixer` actual es de 4 canals i te volum, pan, mute i EQ basica per canal.


