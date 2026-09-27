# Interfície mòbil

La interfície s'activa automàticament per sota de 1024 píxels. Comparteix les màquines, els paràmetres, els cables i el motor d'àudio amb el canvas d'escriptori. Canviar l'amplada de la finestra conserva el patch.

## Ús

1. Prem **Play** per activar l'àudio amb un gest explícit.
2. A **Tocar**, obre una màquina. Els controls de dial es converteixen en lliscadors tàctils; DRUM2 mostra una veu cada vegada.
3. A **Afegir**, tria un set ja connectat o una màquina individual.
4. A **Cables**, selecciona origen, destinació i entrada. Els selectors mostren les entrades compatibles i impedeixen duplicar un cable.
5. A **Sessió**, ajusta tempo i swing, guarda/carrega patches o grava un WAV.

Els patches guardats viuen en aquest navegador i domini. No se sincronitzen entre dispositius. Play/Stop i el volum continuen accessibles mentre es desplaça el contingut.

## Arquitectura

- `MobileWorkbench` organitza les quatre pantalles i reutilitza les interfícies de les 76 màquines.
- `MobileSession` reutilitza els gestors existents de presets i gravació.
- `NodeHandle` dibuixa connectors només dins d'un node React Flow; permet muntar els mateixos editors fora del canvas.
- `routingOptions` defineix les entrades compatibles amb el motor existent.
- `Knob` exposa un lliscador natiu al mòbil i control amb teclat a l'escriptori.
- L'arrencada reprèn l'AudioContext abans de carregar els worklets i evita arrencades/parades simultànies.

## Execució i construcció

Utilitza Node 24 LTS. Les proves importen TypeScript amb el suport natiu de Node.

```sh
npm ci
npm test
npm run lint
npm run build
npm run dev
```

Per comprovar la construcció final: `npm run preview`. Per desplegar, serveix el contingut complet de `dist/` en HTTPS, incloent-hi els worklets. El ZIP de distribució conté aquests fitxers. No obris `index.html` directament com un fitxer local.

## Validació feta el 27 de setembre de 2026

- Cinc proves de routing: notes, entrades de mixer/vocoder, exclusions, modulació i duplicats.
- Compilació TypeScript/Vite i ESLint.
- Les 76 interfícies de màquines obertes individualment a 360 × 800; corregides les etiquetes de Filter i Gain que sobresortien.
- Les quatre pantalles principals a 320 × 740 sense controls fora de l'amplada.
- Vista vertical a 390 × 844 i horitzontal a 844 × 390; retorn al canvas d'escriptori a 1440 × 900 conservant els paràmetres.
- Arrencada/parada real del motor, edició d'un pas de bateria i d'un paràmetre, guardar, recarregar i recuperar el patch.
- Connexió i desconnexió d'un cable al canal 4 del mixer, amb rebuig de duplicats.
- WAV descarregat: estèreo, 48 kHz, 12,46 segons i senyal no nul.

Aquestes comprovacions s'han fet al navegador d'escriptori amb amplades mòbils. No equivalen a una prova en un telèfon físic ni a una verificació sonora exhaustiva de les 76 màquines.

## Prova pendent en dispositius reals

Cal comprovar Safari en iPhone i Chrome en Android: primer Play, arrossegar lliscadors mentre es desplaça la pàgina, rotació, teclat en pantalla, descàrrega WAV i interrupcions de l'àudio en bloquejar la pantalla o canviar d'aplicació. Si el navegador suspèn el motor, utilitza Stop i Play en tornar. La reproducció en segon pla no està garantida.

La versió preparada és local; encara no s'ha publicat a quitusbass.quexulo.cat.
