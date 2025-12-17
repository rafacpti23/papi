# ╔═══════════════════════════════════════════════════════════════╗
# ║                      PASTORINI API                            ║
# ║              Production Docker Image                          ║
# ║                     © 2025 Pastorini                          ║
# ╚═══════════════════════════════════════════════════════════════╝
#
# IMPORTANTE: Execute 'npm run build:prod' antes de criar a imagem
#

FROM node:20-alpine

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY engine-requirements.js ./

# Instalar dependências de produção (--ignore-scripts pois já temos o build)
RUN npm install --omit=dev --ignore-scripts

# Instalar pacotes que podem estar faltando (usados pelo lib/ compilado)
RUN npm install lru-cache --save --ignore-scripts

# Instalar tsx para rodar TypeScript
RUN npm install -g tsx

# Copiar código compilado (já ofuscado)
COPY lib/ ./lib/
COPY WAProto/ ./WAProto/
COPY build-info.json ./

# Copiar arquivos TS necessários para execução
COPY server.ts ./
COPY instanceManager.ts ./

# Copiar tsconfig de produção
COPY tsconfig.json ./

# Copiar arquivos públicos (painel web)
COPY public/ ./public/

# Criar diretórios necessários
RUN mkdir -p sessions Media baileys_auth_info

# Variáveis de ambiente padrão
ENV NODE_ENV=production
ENV PORT=3000

# Expor porta
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Comando de inicialização
CMD ["tsx", "server.ts"]
