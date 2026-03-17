# Roadmap

## Fet

### ~~1. Gravacio d'audio de la sessio~~
- Boto de gravacio a la UI.
- Captura de l'output master.
- Export automatic a `.wav`.

### ~~2. Sampler amb pujada d'arxius~~
- Pujada d'arxius `.mp3` o `.wav`.
- Reproduccio des de la interficie.

### ~~3. Mixer de 8 canals~~
- 8 canals amb EQ de 3 bandes.
- Gate i compressor per canal.
- Enviaments a `room` i `delay`.
- Retorns integrats dins del mixer.

### ~~4. Spectral delay experimental~~
- Efecte spectral delay experimental.

### ~~5. Canal complet de processament~~
- Gate.
- Compressor.
- EQ de 4 bandes.
- Control de `Q`.
- Filtres passa-alts i passa-baixos.

### ~~6. Master Bus~~
- `Master Bus` real a la sortida final.
- `Gain` master.
- Mode `mono/stereo`.
- Limiter final i indicador de `clip`.
- Gravacio post-master.

### ~~7. Solo, meters i gain reduction al mixer~~
- VU per canal al mixer.
- `Solo` per canal.
- Indicador de gate i compressor actuant.

## Seguent

### 8. Vocoder
- Fer un vocoder amb:
  - un sampler com a font
  - o be el microfon per a vocoder en temps real
- Referencia:
  - https://github.com/mdn/webaudio-examples/tree/main/voice-change-o-matic

### 9. Undo / redo i duplicar nodes
- Afegir `undo` i `redo` al patcher.
- Permetre duplicar nodes rapidament.

### 10. Import / export de projectes reals
- Exportar un patch complet a JSON.
- Importar un patch complet des de fitxer.

### 11. Sampler sincronitzat amb el master
- Sincronitzar l'audio del sampler amb els BPM del master.

## Mes endavant

### 12. Sampler V2
- Afegir sync amb BPM.
- Afegir slice.
- Afegir control de `start` i `end`.
- Afegir `reverse`.
- Afegir ADSR.
- Afegir `pitch per nota`.
- Afegir `choke groups`.

### 13. Automation / modulacio
- Afegir una capa mes clara per automatitzar parametres.
- Permetre gravar moviments de knobs.

### 14. MIDI input
- Tocar synths amb teclat MIDI.
- Mapar knobs externs.
- Disparar sampler i arp des de MIDI.

### 15. Versions V2 de tots els components
- Fer versions de tots els components amb mes parametres.
