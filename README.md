# Lose-as-a-service

API local em TypeScript inspirada em "No-as-a-service", focada em mensagens aleatorias sobre perder o Jogo.

## Stack

- Node.js
- TypeScript
- Express
- Swagger UI
- Vite
- `@chenglou/pretext`

## Como rodar

```bash
npm install
npm run dev
```

Servidor local:

- API: `http://127.0.0.1:3000`
- Swagger UI: `http://127.0.0.1:3000/docs`
- OpenAPI JSON: `http://127.0.0.1:3000/openapi.json`

Frontend local com Vite:

```bash
npm run dev:web
```

- UI: `http://127.0.0.1:5173`

Para subir API e UI juntas:

```bash
npm run dev:all
```

## Como rodar em container

Build e subida com Compose:

```bash
docker compose up -d --build
```

Se quiser sobrescrever a porta padrao `3100`:

```bash
HOST_PORT=3200 docker compose up -d --build
```

Parar:

```bash
docker compose down
```

Logs:

```bash
docker compose logs -f
```

Nesse modo, a aplicacao roda em um unico container e expoe:

- API: `http://<hostname-ou-ip>:3100`
- Swagger UI: `http://<hostname-ou-ip>:3100/docs`
- OpenAPI JSON: `http://<hostname-ou-ip>:3100/openapi.json`
- UI buildada: `http://<hostname-ou-ip>:3100/app/`

Exemplos:

- `http://my-hostname:3100/app/`
- `http://192.168.x.x:3100/app/`

O `docker-compose.yml` foi configurado para bind em `0.0.0.0` no host.
Isso permite acessar o servico diretamente de outros dispositivos na LAN.

## Endpoints iniciais

- `GET /`
- `GET /perdi`
- `GET /perdi?category=classico`

## Estrutura

```text
src/
  data/messages.json
  openapi.json
  server.ts
web/
  index.html
  src/main.ts
  src/styles.css
```

## Observacoes

- Em desenvolvimento, a API roda em `127.0.0.1` por padrao.
- As mensagens ficam em arquivo JSON local para facilitar edicao e futura migracao.
- O frontend usa `@chenglou/pretext` para calcular as quebras e a altura do texto antes da renderizacao final.
- Em container, o processo Node escuta em `0.0.0.0` dentro do container e o Compose publica a porta na LAN do host.
- O repositorio nao inclui arquivos `.env`; use variaveis de ambiente do shell ou do Compose quando necessario.
