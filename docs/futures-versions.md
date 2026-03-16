# Idees per a futures versions

## V1

### ~~1. Gravacio d'audio de la sessio~~
- Afegir un boto a la part dreta, sota `Start engine` i `Reset`.
- Aquest boto permetra gravar l'audio de la sessio.
- Gravara l'output master.
- Quan l'usuari premi `Stop`, es guardara automaticament un arxiu `.wav`.

### ~~2. Sampler amb pujada d'arxius~~
- Afegir un sampler que permeti pujar arxius `.mp3` o `.wav`.
- Un cop carregats, es podran llanÃ§ar des de la interfÃ­cie.

### 3. Mixer de 8 canals
- Crear un mixer de 8 canals.
- Cada canal tindra una EQ de 3 parametres.
- Cada canal tambe tindra gate i compressor.
- Cada canal incloura 2 auxiliars:
  - un enviament a una reverb `room`
  - un enviament a un delay
  - els retorn de la reverb i el delay estÃ¡n integrats al mixer.

### ~~4. Spectral delay experimental~~
- Crear un spectral delay una mica boig / experimental.

### 5. Canal complet de processament
- Crear un canal complet amb:
- gate
- compressor
- EQ de 4 bandes
- control de `Q`
- filtres passa alts i baixos

### 6. Vocoder
- Crear un vocoder on es pugui fer servir:
- un sampler com a font
- o be el microfon per fer vocoder en temps real
- https://github.com/mdn/webaudio-examples/tree/main/voice-change-o-matic
## V2

### Sampler sincronitzat amb el master
- Sincronitzar l'audio del sampler amb els BPM del master.


### Crear versiÃ³ns V2 de totes els components.
- Versions de tots els components amb mÃ©s parÃ¡metres