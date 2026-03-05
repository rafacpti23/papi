FROM node:20

WORKDIR /app

# habilita yarn v4 (corepack)
RUN corepack enable

COPY package.json package-lock.json ./

# instala dependências
RUN npm install

COPY . .

ENV NODE_ENV=production
ENV PORT=8090
ENV TZ=America/Sao_Paulo

EXPOSE 8090

CMD ["npm", "run", "server"]
