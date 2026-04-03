# AGENTS

## Projeto

- Nome: Lose-as-a-service
- Objetivo: API local educacional com mensagens aleatorias sobre perder o Jogo.
- Stack principal: Node.js, TypeScript, Express, Swagger UI, Vite, `@chenglou/pretext`.

## Direcao Tecnica

- Preferir simplicidade operacional sobre arquitetura excessiva.
- Manter a v1 segura por padrao: bind local quando rodando fora de container e exposicao controlada quando publicada na rede.
- Tratar a API como produto principal; a UI existe para demonstracao, aprendizado e inspecao operacional.
- Preservar o contrato OpenAPI e a UI Swagger como partes obrigatorias do projeto.

## Estrutura Relevante

- `src/server.ts`: backend Express, Swagger, API `/` e `/perdi`, e entrega opcional da UI buildada em `/app/`.
- `src/openapi.json`: contrato OpenAPI versionado no repo.
- `src/data/messages.json`: dataset local das mensagens.
- `web/`: frontend TypeScript/Vite que consome a API e demonstra `@chenglou/pretext`.
- `Dockerfile`: imagem unica para deploy da API com a UI buildada.
- `docker-compose.yml`: execucao persistente recomendada para homelab e rede local.

## Padroes de Execucao

- Desenvolvimento local:
  - `npm run dev:all`
  - API em `127.0.0.1:3000`
  - UI em `127.0.0.1:5173`
- Build local:
  - `npm run build:all`
- Container:
  - `docker compose up -d --build`
  - servico publicado em `0.0.0.0:${HOST_PORT:-3100}` no host
  - UI buildada via API em `/app/`

## Rede e Hosts

- O `docker-compose.yml` publica a porta como `0.0.0.0:${HOST_PORT:-3100}:3000` para acesso na LAN.
- Preferir hostname do host na rede local, com fallback para IP apenas quando necessario.
- A porta padrao escolhida para este projeto e `3100`, evitando conflito com outros servicos comuns em homelab.
- Nao registrar caminhos absolutos do host, IPs reais ou inventario pessoal neste repositorio.
- Nao commitar arquivos `.env`, artefatos de build, logs locais ou configuracoes pessoais do editor.

## Regras Para Agentes

- Nao remover Swagger nem o endpoint `/perdi`.
- Nao trocar container unico por arquitetura multi-servico sem motivo operacional concreto.
- Nao assumir que a API deve ser exposta na rede; default seguro primeiro.
- Se mudar host, porta, compose ou bind de rede, atualizar este arquivo e o `README.md`.
- Se introduzir persistencia, preferir arquivo local simples antes de banco.
- Se evoluir a UI, manter o foco em demonstracao e aprendizado do funcionamento da API e do `pretext`.
