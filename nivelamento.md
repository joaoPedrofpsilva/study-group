# Nivelamento — Passo a Passo para Atingir o Estado Atual do Projeto

> Este documento descreve **tudo** que precisa ser feito para que seu projeto atinja o estado atual — **excluindo a feature de autenticação (auth)**, que será abordada na sessão de hoje.

---

## Visão Geral da Arquitetura Atual

```
web/ (React — porta 3000)
  └── fetch GET /feedbacks/list ──────┐
                                      ▼
src/ (Express — porta 3001)
  routes/ → controllers/ → services/ → Prisma → PostgreSQL (Docker)
```

**Stack:**
- **Backend:** Express 5 + TypeScript + Prisma ORM + PostgreSQL
- **Frontend:** React 19 (Create React App) + TypeScript
- **Banco:** PostgreSQL 16 via Docker Compose

---

## Checklist Resumido

- [ ] [Etapa 1] Backend Express com CRUD de Feedbacks (em memória)
- [ ] [Etapa 2] Frontend React exibindo dados fake
- [ ] [Etapa 3] Integração Front ↔ Back (CORS, fetch, tipos alinhados)
- [ ] [Etapa 4] Docker + PostgreSQL + Prisma (persistência real)

---

## Etapa 1 — Backend Express (API de Feedbacks)

### 1.1 Inicializar o projeto

```bash
mkdir study-group-mentor && cd study-group-mentor
npm init -y
```

### 1.2 Instalar dependências

```bash
npm install express
npm install --save-dev typescript ts-node @types/node @types/express
```

### 1.3 Configurar TypeScript

Criar `tsconfig.json` na raiz:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true
  }
}
```

### 1.4 Script de dev

No `package.json`, adicionar:

```json
"scripts": {
  "dev": "ts-node src/server.ts"
}
```

### 1.5 Criar estrutura de pastas

```
src/
├── app.ts
├── server.ts
├── types/
│   └── feedback.ts
├── routes/
│   └── feedback-routes.ts
├── controllers/
│   └── feedback.controllers.ts
└── services/
    └── feedback.service.ts
```

### 1.6 Tipos — `src/types/feedback.ts`

```typescript
export interface Feedback {
  id: number;
  autor: string;
  mensagem: string;
  nota: number;
}

export type CreateFeedbackDTO = Omit<Feedback, "id">;
```

### 1.7 Service (lógica de negócio) — `src/services/feedback.service.ts`

Versão inicial com array em memória:

```typescript
import { CreateFeedbackDTO, Feedback } from "../types/feedback";

const feedbacks: Feedback[] = [];
let nextId = 1;

export const feedbackService = {
  create(dto: CreateFeedbackDTO): Feedback {
    const feedback: Feedback = { id: nextId++, ...dto };
    feedbacks.push(feedback);
    return feedback;
  },

  list(): Feedback[] {
    return feedbacks;
  },
};
```

### 1.8 Controller — `src/controllers/feedback.controllers.ts`

```typescript
import { Request, Response } from "express";
import { feedbackService } from "../services/feedback.service";

export const create = (req: Request, res: Response): void => {
  const feedback = feedbackService.create(req.body);
  res.status(201).json(feedback);
};

export const list = (_req: Request, res: Response): void => {
  const feedbacks = feedbackService.list();
  res.json(feedbacks);
};
```

### 1.9 Rotas — `src/routes/feedback-routes.ts`

```typescript
import { Router } from "express";
import { create, list } from "../controllers/feedback.controllers";

const router = Router();

router.post("/", create);
router.get("/list", list);

export default router;
```

### 1.10 App — `src/app.ts`

```typescript
import express from "express";
import feedbackRoute from "./routes/feedback-routes";

const app = express();
app.use(express.json());
app.use("/feedbacks", feedbackRoute);

export default app;
```

### 1.11 Server — `src/server.ts`

```typescript
import app from "./app";

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
```

### 1.12 Testar

```bash
npm run dev
# Em outro terminal:
curl -X POST http://localhost:3001/feedbacks \
  -H "Content-Type: application/json" \
  -d '{"autor":"João","mensagem":"Ótima aula!","nota":5}'

curl http://localhost:3001/feedbacks/list
```

---

## Etapa 2 — Frontend React

### 2.1 Criar o projeto React

```bash
npx create-react-app web --template typescript
```

### 2.2 Tipo do Feedback — `web/src/types/feedback.ts`

```typescript
export interface FeedBack {
  id: number;
  autor: string;
  mensagem: string;
  nota: number;
}
```

### 2.3 Componente FeedbackList — `web/src/components/FeedbackList.tsx`

```typescript
import { FeedBack } from "../types/feedback";

interface FeedbackListProps {
  feedbacks: FeedBack[];
}

function FeedbackList({ feedbacks }: FeedbackListProps) {
  return (
    <div>
      <h2>Feedbacks</h2>
      {feedbacks.length === 0 ? (
        <p>Nenhum feedback encontrado.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {feedbacks.map((fb) => (
            <li
              key={fb.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: 8,
                padding: 16,
                marginBottom: 12,
              }}
            >
              <strong>{fb.autor}</strong> — Nota: {fb.nota}/5
              <p>{fb.mensagem}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FeedbackList;
```

### 2.4 App.tsx (inicialmente com dados fake para testar)

```typescript
import React from "react";
import "./App.css";
import { FeedBack } from "./types/feedback";
import FeedbackList from "./components/FeedbackList";

const fakeFeedbacks: FeedBack[] = [
  { id: 1, autor: "João", mensagem: "Ótima aula!", nota: 5 },
  { id: 2, autor: "Maria", mensagem: "Poderia ter mais exemplos", nota: 3 },
];

function App() {
  return (
    <div className="App">
      <h1>Study Group</h1>
      <FeedbackList feedbacks={fakeFeedbacks} />
    </div>
  );
}

export default App;
```

### 2.5 Testar

```bash
cd web
npm start
```

Deve exibir os dois feedbacks fake no browser.

---

## Etapa 3 — Integração Frontend ↔ Backend

### 3.1 Instalar CORS no backend

```bash
# Na raiz do projeto (NÃO dentro de web/)
npm install cors
npm install --save-dev @types/cors
```

### 3.2 Habilitar CORS no app.ts

```typescript
import express from "express";
import cors from "cors";
import feedbackRoute from "./routes/feedback-routes";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/feedbacks", feedbackRoute);

export default app;
```

### 3.3 Substituir dados fake por fetch — `web/src/App.tsx`

```typescript
import React, { useState, useEffect } from "react";
import "./App.css";
import { FeedBack } from "./types/feedback";
import FeedbackList from "./components/FeedbackList";

function App() {
  const [feedbacks, setFeedbacks] = useState<FeedBack[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/feedbacks/list")
      .then((response) => response.json())
      .then((data) => setFeedbacks(data))
      .catch((error) => console.error("Erro ao buscar feedbacks:", error));
  }, []);

  return (
    <div className="App">
      <h1>Study Group</h1>
      <FeedbackList feedbacks={feedbacks} />
    </div>
  );
}

export default App;
```

### 3.4 Alinhar tipos

Garantir que o campo no frontend é `mensagem` (não `message`) — o nome deve bater com o que o backend retorna.

### 3.5 Testar a integração

1. Iniciar backend: `npm run dev` (porta 3001)
2. Iniciar frontend: `cd web && npm start` (porta 3000)
3. Criar um feedback via curl/Insomnia no backend
4. Verificar que aparece no browser automaticamente ao recarregar a página

---

## Etapa 4 — Banco de Dados com Docker + Prisma

### 4.1 Criar `docker-compose.yml` na raiz do projeto

```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: feedback_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### 4.2 Subir o banco

```bash
docker compose up -d
```

> Pré-requisito: Docker Desktop instalado e rodando.

### 4.3 Instalar Prisma

```bash
npm install prisma @prisma/client
```

### 4.4 Inicializar o Prisma

```bash
npx prisma init
```

Isso cria:
- `prisma/schema.prisma`
- `.env` com `DATABASE_URL`

### 4.5 Configurar a variável de ambiente

No `.env` (na raiz do projeto):

```dotenv
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/feedback_db?schema=public"
```

> **IMPORTANTE:** O `.env` **NÃO deve ser commitado**. Verificar que está no `.gitignore`.

### 4.6 Definir o modelo — `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Feedback {
  id       Int    @id @default(autoincrement())
  autor    String
  mensagem String
  nota     Int
}
```

### 4.7 Rodar a migração

```bash
npx prisma migrate dev --name init
```

Isso:
1. Cria a tabela `Feedback` no PostgreSQL
2. Gera o arquivo de migração em `prisma/migrations/`
3. Regenera o Prisma Client com os tipos atualizados

### 4.8 Criar o singleton do Prisma Client — `src/prisma.ts`

```typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
```

### 4.9 Atualizar o Service para usar Prisma — `src/services/feedback.service.ts`

```typescript
import prisma from "../prisma";
import { CreateFeedbackDTO, Feedback } from "../types/feedback";

export const feedbackService = {
  async create(dto: CreateFeedbackDTO): Promise<Feedback> {
    return prisma.feedback.create({ data: dto });
  },

  async list(): Promise<Feedback[]> {
    return prisma.feedback.findMany();
  },
};
```

### 4.10 Atualizar o Controller para async — `src/controllers/feedback.controllers.ts`

```typescript
import { Request, Response } from "express";
import { feedbackService } from "../services/feedback.service";

export const create = async (req: Request, res: Response): Promise<void> => {
  const feedback = await feedbackService.create(req.body);
  res.status(201).json(feedback);
};

export const list = async (_req: Request, res: Response): Promise<void> => {
  const feedbacks = await feedbackService.list();
  res.json(feedbacks);
};
```

### 4.11 Testar persistência

```bash
npm run dev

# Criar feedback
curl -X POST http://localhost:3001/feedbacks \
  -H "Content-Type: application/json" \
  -d '{"autor":"João","mensagem":"Dados persistentes!","nota":5}'

# Parar o servidor (Ctrl+C) e reiniciar
npm run dev

# Verificar que o feedback ainda existe
curl http://localhost:3001/feedbacks/list
# Deve retornar o feedback criado antes do reinício
```

---

## Estrutura Final de Arquivos (sem auth)

```
study-group-mentor/
├── docker-compose.yml
├── package.json
├── tsconfig.json
├── .env                          ← NÃO commitar
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│       └── 20XXXXXX_init/
│           └── migration.sql
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── prisma.ts
│   ├── types/
│   │   └── feedback.ts
│   ├── routes/
│   │   └── feedback-routes.ts
│   ├── controllers/
│   │   └── feedback.controllers.ts
│   └── services/
│       └── feedback.service.ts
└── web/
    ├── package.json
    └── src/
        ├── App.tsx
        ├── types/
        │   └── feedback.ts
        └── components/
            └── FeedbackList.tsx
```

---

## Dependências Instaladas (backend — `package.json` raiz)

| Pacote | Tipo | Motivo |
|--------|------|--------|
| `express` | prod | Framework HTTP |
| `cors` | prod | Permitir requisições cross-origin do frontend |
| `@prisma/client` | prod | Cliente ORM para acessar o banco |
| `prisma` | prod | CLI de migrações e geração do client |
| `typescript` | dev | Compilador TypeScript |
| `ts-node` | dev | Executar TS diretamente (sem compilar para JS) |
| `@types/node` | dev | Tipos do Node.js |
| `@types/express` | dev | Tipos do Express |
| `@types/cors` | dev | Tipos do CORS |

---

## Erros Comuns e Como Resolver

| Sintoma | Causa | Solução |
|---------|-------|---------|
| `EADDRINUSE :3001` | Servidor já rodando | Matar o processo anterior (`Ctrl+C`) |
| Frontend mostra lista vazia | Backend não está rodando ou CORS não habilitado | Verificar que o backend está na porta 3001 com CORS |
| `fb.message` undefined no React | Tipo desalinhado (era `message`, agora é `mensagem`) | Alinhar interface no frontend |
| `Can't reach database` | Docker não está rodando ou .env errado | `docker compose up -d` e checar DATABASE_URL |
| `Table does not exist` | Migração não foi rodada | `npx prisma migrate dev` |
| `prisma: command not found` | Prisma não instalado | `npm install prisma @prisma/client` |

---

## Resumo por Semana

| Semana | O que foi feito |
|--------|----------------|
| Anteriores | Backend Express com CRUD em memória + Frontend React com dados fake |
| Semana 5 | Integração Front ↔ Back (CORS, fetch, useEffect, alinhamento de tipos) |
| Semana 6 | Docker + PostgreSQL + Prisma (persistência real no banco) |
