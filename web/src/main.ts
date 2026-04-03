import { layoutWithLines, prepareWithSegments } from "@chenglou/pretext";

import "./styles.css";

type LoseMessage = {
  id: string;
  category: string;
  message: string;
};

const lineHeight = 48;
const horizontalPadding = 40;
const font = '700 32px "Iowan Old Style", "Palatino Linotype", "Book Antiqua", Georgia, serif';

const shuffleButton = document.querySelector<HTMLButtonElement>("#shuffle-button");
const syncButton = document.querySelector<HTMLButtonElement>("#sync-button");
const lossLines = document.querySelector<HTMLDivElement>("#loss-lines");
const lossCountValue = document.querySelector<HTMLElement>("#loss-count-value");
const categoryValue = document.querySelector<HTMLElement>("#category-value");
const messageIdValue = document.querySelector<HTMLElement>("#message-id-value");
const metricLines = document.querySelector<HTMLElement>("#metric-lines");
const metricHeight = document.querySelector<HTMLElement>("#metric-height");
const metricDomHeight = document.querySelector<HTMLElement>("#metric-dom-height");
const playgroundInput = document.querySelector<HTMLTextAreaElement>("#playground-input");
const widthSlider = document.querySelector<HTMLInputElement>("#width-slider");
const widthValue = document.querySelector<HTMLElement>("#width-value");
const pretextBox = document.querySelector<HTMLDivElement>("#pretext-box");
const domBox = document.querySelector<HTMLDivElement>("#dom-box");
const domText = document.querySelector<HTMLParagraphElement>("#dom-text");
const pretextSummary = document.querySelector<HTMLElement>("#pretext-summary");
const domSummary = document.querySelector<HTMLElement>("#dom-summary");
const sceneChair = document.querySelector<HTMLButtonElement>("#scene-chair");
const sceneTable = document.querySelector<HTMLButtonElement>("#scene-table");
const scenePinhata = document.querySelector<HTMLButtonElement>("#scene-pinhata");
const sceneCaption = document.querySelector<HTMLElement>("#scene-caption");

if (
  !shuffleButton ||
  !syncButton ||
  !lossLines ||
  !lossCountValue ||
  !categoryValue ||
  !messageIdValue ||
  !metricLines ||
  !metricHeight ||
  !metricDomHeight ||
  !playgroundInput ||
  !widthSlider ||
  !widthValue ||
  !pretextBox ||
  !domBox ||
  !domText ||
  !pretextSummary ||
  !domSummary ||
  !sceneChair ||
  !sceneTable ||
  !scenePinhata ||
  !sceneCaption
) {
  throw new Error("Missing required frontend elements.");
}

let currentMessage: LoseMessage | null = null;
let lossCount = 0;

const sceneStates = {
  chair: [
    "  __\n |__|\n |  |\n_|  |_",
    "  __\n /_/|\n |  |\n_| /_",
    "  xx\n /_/|\n  / /\n _/_ "
  ],
  table: [
    " ______\n|______|\n  |  |\n  |  |",
    " ______\n|_____/ \n  |  |\n _|  |",
    " __/___\n|____  \\\n  /  /\n _|__|_"
  ],
  pinhata: [
    "  /\\\\\n <**>\n /||\\\\\n  ||\n /  \\\\",
    "  /\\\\\n <++>\n /||\\\\\n  ||\n /  \\\\",
    "  /\\\\\n <x*>\n /||\\\\\n _||_\n/____\\\\"
  ]
};

let chairIndex = 0;
let tableIndex = 0;
let pinhataIndex = 0;

const fetchLoseMessage = async (): Promise<LoseMessage> => {
  const response = await fetch("/perdi");

  if (!response.ok) {
    throw new Error(`Failed to fetch lose message: ${response.status}`);
  }

  return (await response.json()) as LoseMessage;
};

const renderMessage = (message: LoseMessage): void => {
  const stageWidth = Math.max(lossLines.clientWidth - horizontalPadding, 180);
  const prepared = prepareWithSegments(message.message, font);
  const result = layoutWithLines(prepared, stageWidth, lineHeight);

  lossLines.innerHTML = "";
  lossLines.style.minHeight = `${result.height}px`;

  result.lines.forEach((line) => {
    const lineElement = document.createElement("p");
    lineElement.className = "loss-line";
    lineElement.textContent = line.text;
    lossLines.append(lineElement);
  });

  categoryValue.textContent = message.category;
  messageIdValue.textContent = message.id;
  metricLines.textContent = String(result.lineCount);
  metricHeight.textContent = `${Math.round(result.height)}px`;
  lossCountValue.textContent = String(lossCount);

  requestAnimationFrame(() => {
    metricDomHeight.textContent = `${Math.round(lossLines.clientHeight)}px`;
  });
};

const getPlaygroundWidth = (): number => Number(widthSlider.value);

const updateAsciiProp = (element: HTMLButtonElement, state: string): void => {
  const art = element.querySelector(".ascii-art");

  if (!art) {
    return;
  }

  art.textContent = state;
};

const updateSceneCaption = (width: number): void => {
  if (width <= 260) {
    sceneCaption.textContent = "A sala apertou. A cadeira caiu, a mesa rangeu e alguem perdeu de novo.";
    return;
  }

  if (width <= 420) {
    sceneCaption.textContent = "Agora da para ver a composicao se reorganizando. O clima segue ruim.";
    return;
  }

  sceneCaption.textContent = "Dica: deixe a largura pequena para ver a frase perder a compostura. Clique nos objetos para piorar o ambiente.";
};

const updatePlayground = (): void => {
  const text = playgroundInput.value.trim() || "Perdi o Jogo. Agora voce tambem.";
  const width = getPlaygroundWidth();
  const prepared = prepareWithSegments(text, font);
  const pretextResult = layoutWithLines(prepared, width, lineHeight);

  widthValue.textContent = `${width}px`;
  pretextBox.style.inlineSize = `${width}px`;
  pretextBox.innerHTML = "";

  pretextResult.lines.forEach((line) => {
    const lineElement = document.createElement("p");
    lineElement.className = "compare-line";
    lineElement.textContent = line.text;
    pretextBox.append(lineElement);
  });

  domBox.style.inlineSize = `${width}px`;
  domText.textContent = text;
  updateSceneCaption(width);

  requestAnimationFrame(() => {
    const domHeight = domBox.clientHeight;
    const domLineHeight = Number.parseFloat(getComputedStyle(domText).lineHeight);
    const domLines = domLineHeight > 0 ? Math.round(domHeight / domLineHeight) : 0;

    pretextSummary.textContent = `${pretextResult.lineCount} linhas • ${Math.round(pretextResult.height)}px`;
    domSummary.textContent = `${domLines} linhas • ${Math.round(domHeight)}px`;
  });
};

const loadMessage = async (): Promise<void> => {
  shuffleButton.setAttribute("disabled", "true");

  try {
    lossCount += 1;
    currentMessage = await fetchLoseMessage();
    renderMessage(currentMessage);
    playgroundInput.value = currentMessage.message;
    updatePlayground();
  } finally {
    shuffleButton.removeAttribute("disabled");
  }
};

shuffleButton.addEventListener("click", () => {
  void loadMessage();
});

sceneChair.addEventListener("click", () => {
  chairIndex = (chairIndex + 1) % sceneStates.chair.length;
  updateAsciiProp(sceneChair, sceneStates.chair[chairIndex]);
  sceneCaption.textContent = "A cadeira desistiu primeiro.";
});

sceneTable.addEventListener("click", () => {
  tableIndex = (tableIndex + 1) % sceneStates.table.length;
  updateAsciiProp(sceneTable, sceneStates.table[tableIndex]);
  sceneCaption.textContent = "A mesa recebeu a noticia e ficou instavel.";
});

scenePinhata.addEventListener("click", () => {
  pinhataIndex = (pinhataIndex + 1) % sceneStates.pinhata.length;
  updateAsciiProp(scenePinhata, sceneStates.pinhata[pinhataIndex]);
  sceneCaption.textContent = "A pinhata tambem nao tankou a derrota.";
});

syncButton.addEventListener("click", () => {
  if (currentMessage) {
    playgroundInput.value = currentMessage.message;
    updatePlayground();
  }
});

playgroundInput.addEventListener("input", updatePlayground);
widthSlider.addEventListener("input", updatePlayground);

const resizeObserver = new ResizeObserver(() => {
  if (currentMessage) {
    renderMessage(currentMessage);
  }
});

resizeObserver.observe(lossLines);

void loadMessage();
