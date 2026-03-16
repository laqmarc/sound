import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react';

import './TutorialModal.css';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TutorialPlacement = 'top' | 'right' | 'bottom' | 'left' | 'center';

interface TutorialStep {
  id: string;
  title: string;
  body: string;
  target?: string;
  placement: TutorialPlacement;
  offsetY?: number;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Benvingut al patcher',
    body:
      'Aquest recorregut et porta pels controls principals de QUITUSBASSCAOS. Pots navegar amb Seguent i Anterior, i la resta de la UI continua sent clicable mentre segueixes el tutorial.',
    placement: 'center',
  },
  {
    id: 'transport-actions',
    title: 'Arrenca, reseteja o reobre el tutorial',
    body:
      'Aquesta zona controla les accions principals. Prem START ENGINE per activar laudio, RESET per tornar al patch inicial i TUTORIAL per tornar a obrir aquesta guia quan vulguis.',
    target: 'transport-actions',
    placement: 'left',
  },
  {
    id: 'transport-controls',
    title: 'Controla el tempo global',
    body:
      'El transport canvia els BPM, el swing i el pas actiu de 16 steps. Si canvies aquests valors, tots els sequenciadors sincronitzats de l app segueixen aquest rellotge.',
    target: 'transport-panel',
    placement: 'left',
  },
  {
    id: 'recording-panel',
    title: 'Configura la gravacio',
    body:
      'El bloc Recorder serveix per preparar lexport. Pots escriure el nom del fitxer, triar Stereo o Mono i activar Normalize export per pujar el nivell del WAV final.',
    target: 'recording-panel',
    placement: 'left',
  },
  {
    id: 'record-button',
    title: 'Grava la sessio i exporta a WAV',
    body:
      'Quan el motor esta en marxa, prem REC per començar a gravar tota la sortida final del patch. El boto passa a STOP REC i, en aturar-lo, lapp descarrega automaticament un fitxer .wav.',
    target: 'record-button',
    placement: 'left',
  },
  {
    id: 'sidebar',
    title: 'Afegeix maquines noves',
    body:
      'Al lateral esquerre tens tots els nodes disponibles per a la familia activa. Cada boto crea un node nou al canvas.',
    target: 'components-sidebar',
    placement: 'right',
  },
  {
    id: 'families',
    title: 'Filtra per families i sets',
    body:
      'Aquest header et deixa canviar de familia i afegir sets com Drum Bus, Mutant Rig o FX Ladder. Els sets son ideal per muntar un patch rapid sense connectar-ho tot des de zero.',
    target: 'header-workspace',
    placement: 'bottom',
  },
  {
    id: 'canvas',
    title: 'Construeix el patch al canvas',
    body:
      'Aqui connectes sortides amb entrades, mous nodes i ajustes el routing. El patch inicial ja ve preparat amb instruments, mixer i destination perque puguis escoltar so de seguida.',
    target: 'patch-canvas',
    placement: 'center',
    offsetY: 132,
  },
  {
    id: 'mixer-overview',
    title: 'El mixer ara es el centre del patch',
    body:
      'El node Mixer te 8 entrades, una per canal. Cada target `CH 1` fins `CH 8` rep una font diferent, i el mixer envia una sola sortida master cap a destination o cap a una cadena d efectes.',
    target: 'mixer-node',
    placement: 'bottom',
    offsetY: 28,
  },
  {
    id: 'mixer-detail',
    title: 'Selecciona el canal i ajusta el strip',
    body:
      'Prem qualsevol targeta del mixer per editar aquell canal. A dins tens volum, pan, gate, compressor, EQ de 3 bandes i els enviaments `Room` i `Delay` per portar senyal als efectes interns.',
    target: 'mixer-node',
    placement: 'right',
  },
  {
    id: 'mixer-returns',
    title: 'El mixer ja porta els retorns integrats',
    body:
      'A la part baixa del mixer controles la reverb `Room` i el delay master. `Room Size`, `Decay` i `Room Ret` defineixen la reverb; `Delay Sync`, la divisio, `Feed` i `Delay Ret` controlen el delay sincronitzat amb els BPM.',
    target: 'mixer-node',
    placement: 'left',
    offsetY: 74,
  },
  {
    id: 'presets',
    title: 'Guarda i recupera presets',
    body:
      'Des del boto Presets pots carregar patches integrats, guardar els teus al navegador i exportar-los com a codi. Es la forma rapida de conservar experiments bons.',
    target: 'presets-button',
    placement: 'bottom',
    offsetY: 56,
  },
  {
    id: 'done',
    title: 'Flux recomanat',
    body:
      'Per començar: prem START ENGINE, prepara el Recorder si vols exportar, escolta el patch base, afegeix un set des del header, connecta la cadena fins a destination i grava la sessio amb REC per baixar-la en WAV.',
    target: 'tutorial-button',
    placement: 'left',
  },
];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const findTutorialTarget = (step: TutorialStep) => {
  if (!step.target) {
    return null;
  }

  const element = document.querySelector<HTMLElement>(`[data-tutorial="${step.target}"]`);
  if (!element) {
    return null;
  }

  const rect = element.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) {
    return null;
  }

  return rect;
};

export function TutorialModal({ isOpen, onClose }: TutorialModalProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [spotlightRect, setSpotlightRect] = useState<DOMRect | null>(null);
  const [cardStyle, setCardStyle] = useState<CSSProperties>({});
  const cardRef = useRef<HTMLDivElement | null>(null);

  const activeStep = tutorialSteps[stepIndex] ?? tutorialSteps[0];
  const isLastStep = stepIndex === tutorialSteps.length - 1;
  const progressLabel = useMemo(
    () => `${stepIndex + 1} / ${tutorialSteps.length}`,
    [stepIndex],
  );

  useEffect(() => {
    if (isOpen) {
      setStepIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  useLayoutEffect(() => {
    if (!isOpen) {
      return;
    }

    const updateLayout = () => {
      const targetRect = findTutorialTarget(activeStep);
      const nextSpotlight = targetRect
        ? new DOMRect(targetRect.x, targetRect.y, targetRect.width, targetRect.height)
        : null;
      setSpotlightRect(nextSpotlight);

      const cardWidth = Math.min(360, window.innerWidth - 32);
      const cardHeight = cardRef.current?.offsetHeight ?? 260;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const gap = 18;

      if (!targetRect || activeStep.placement === 'center') {
        setCardStyle({
          width: `${cardWidth}px`,
          left: `${Math.max(24, (viewportWidth - cardWidth) / 2)}px`,
          top: `${Math.max(32, (viewportHeight - cardHeight) / 2)}px`,
        });
        return;
      }

      let left = targetRect.left;
      let top = targetRect.top;
      const offsetY = activeStep.offsetY ?? 0;

      switch (activeStep.placement) {
        case 'top':
          left = targetRect.left + (targetRect.width - cardWidth) / 2;
          top = targetRect.top - cardHeight - gap + offsetY;
          break;
        case 'right':
          left = targetRect.right + gap;
          top = targetRect.top + (targetRect.height - cardHeight) / 2 + offsetY;
          break;
        case 'bottom':
          left = targetRect.left + (targetRect.width - cardWidth) / 2;
          top = targetRect.bottom + gap + offsetY;
          break;
        case 'left':
          left = targetRect.left - cardWidth - gap;
          top = targetRect.top + (targetRect.height - cardHeight) / 2 + offsetY;
          break;
      }

      setCardStyle({
        width: `${cardWidth}px`,
        left: `${clamp(left, 24, viewportWidth - cardWidth - 24)}px`,
        top: `${clamp(top, 32, viewportHeight - cardHeight - 32)}px`,
      });
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    window.addEventListener('scroll', updateLayout, true);

    return () => {
      window.removeEventListener('resize', updateLayout);
      window.removeEventListener('scroll', updateLayout, true);
    };
  }, [activeStep, isOpen]);

  if (!isOpen) {
    return null;
  }

  const highlightStyle: CSSProperties | undefined = spotlightRect
    ? {
        left: `${spotlightRect.left - 10}px`,
        top: `${spotlightRect.top - 10}px`,
        width: `${spotlightRect.width + 20}px`,
        height: `${spotlightRect.height + 20}px`,
      }
    : undefined;

  return (
    <div className="tutorial-tour" aria-live="polite">
      <div className="tutorial-tour__backdrop" />
      {highlightStyle ? <div className="tutorial-tour__spotlight" style={highlightStyle} /> : null}

      <div
        ref={cardRef}
        className="tutorial-tour__card"
        style={cardStyle}
        role="dialog"
        aria-modal="false"
      >
        <div className="tutorial-tour__eyebrow">
          <span>Tutorial interactiu</span>
          <span>{progressLabel}</span>
        </div>

        <h2 className="tutorial-tour__title">{activeStep.title}</h2>
        <p className="tutorial-tour__body">{activeStep.body}</p>

        <div className="tutorial-tour__footer">
          <button
            onClick={() => setStepIndex((current) => Math.max(0, current - 1))}
            className="tutorial-tour__button tutorial-tour__button--ghost"
            disabled={stepIndex === 0}
          >
            Anterior
          </button>
          <button onClick={onClose} className="tutorial-tour__button tutorial-tour__button--ghost">
            Tancar
          </button>
          <button
            onClick={() => {
              if (isLastStep) {
                onClose();
                return;
              }
              setStepIndex((current) => Math.min(tutorialSteps.length - 1, current + 1));
            }}
            className="tutorial-tour__button tutorial-tour__button--primary"
          >
            {isLastStep ? 'Acabar' : 'Seguent'}
          </button>
        </div>
      </div>
    </div>
  );
}
