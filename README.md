<p align="center"><img src="public/logo-papi.png" alt="Pastorini API" width="120"></p>
<h1 align="center">Pastorini API</h1>
<p align="center">
<strong>API completa para WhatsApp com suporte a mensagens interativas</strong><br>
Botões, Listas, Carrossel, Mídia e muito mais
</p>
<p align="center">
<img src="https://img.shields.io/badge/version-1.4-green" alt="Version">
<img src="https://img.shields.io/badge/node-%3E%3D18-blue" alt="Node">
<img src="https://img.shields.io/badge/license-Proprietary-red" alt="License">
<img src="https://img.shields.io/badge/n8n-community--node-ff6d5a" alt="n8n">
</p>

---

## 📋 Recursos

- ✅ Envio de mensagens de texto, imagem, vídeo, áudio, documento
- ✅ **Botões interativos** (Reply, URL, Call, Copy)
- ✅ **Listas/Menus** com seções e opções
- ✅ **Carrossel** de cards com imagens e botões
- ✅ Gerenciamento de grupos
- ✅ Webhooks configuráveis por instância
- ✅ Múltiplas instâncias simultâneas
- ✅ Painel web integrado
- ✅ API Tester embutido
- ✅ Suporte a PostgreSQL + Redis para alta escala
- ✅ **Templates prontos** para carrossel, botões e listas (disponíveis na documentação)
- ✅ **Integração com n8n** via node da comunidade

---

## 🔌 Integração com n8n

A Pastorini API possui um **node oficial para n8n** que permite integrar facilmente com seus workflows de automação.

### Instalação no n8n

```bash
# Via npm (n8n self-hosted)
npm install n8n-nodes-papi

# Ou busque por "PAPI WhatsApp" na aba Community Nodes do n8n
```

### Funcionalidades do Node

| Recurso | Operações |
|---------|-----------|
| **Instâncias** | Criar, Listar, Status, QR Code, Deletar, Logout |
| **Mensagens** | Texto, Imagem, Vídeo, Áudio, Documento, Localização, Contato, Sticker, Reação |
| **Interativas** | Botões, Lista, Carrossel |
| **Grupos** | Criar, Listar, Metadados, Participantes, Convite |
| **Perfil** | Foto, Nome, Status |
| **Privacidade** | Configurações, Bloquear/Desbloquear |
| **Webhook** | Configurar, Obter configuração |
| **Utilitários** | Verificar número, Presença, Labels |

### Configuração das Credenciais

1. No n8n, vá em **Credentials** → **New Credential**
2. Busque por **PAPI API**
3. Preencha:
   - **Base URL**: URL do seu servidor (ex: `https://papi.seudominio.com`)
   - **API Key**: Sua chave do painel (PANEL_API_KEY)

---

## 🚀 Instalação

### Pré-requisitos

- Node.js 18+
- Docker e Docker Compose ou swarm (recomendado)
- Chave de licença válida

```bash
# Clone o repositório
git clone https://github.com/mktpastorini/papi.git
cd pastorini-api

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com sua LICENSE_KEY

# Inicie com Docker Compose
docker-compose up -d
```

### Via NPM

```bash
# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Inicie o servidor
npm run server
```

---

## ⚙️ Configuração

Edite o arquivo `.env`:

```env
# =================================================================
# STORAGE CONFIGURATION
# =================================================================
# Opções: file | postgres | postgres+redis
# - file: Armazena no disco (padrão, bom para desenvolvimento)
# - postgres: Armazena no PostgreSQL (melhor para produção)
# - postgres+redis: PostgreSQL + Redis cache (máxima performance)
STORAGE_TYPE=postgres+redis

# Senha do seu painel, se deixar em branco ele abrira sem senha
PANEL_API_KEY=SUA_senha_do_PAINEL

# =================================================================
# POSTGRESQL (usado quando STORAGE_TYPE = postgres ou postgres+redis)
# =================================================================
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5433
POSTGRES_DB=pastorini_api
POSTGRES_USER=pastorini
POSTGRES_PASSWORD=pastorini123
POSTGRES_SSL=false

# =================================================================
# REDIS (usado quando STORAGE_TYPE = postgres+redis)
# =================================================================
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# =================================================================
# SERVER
# =================================================================
PORT=3000

# =================================================================
# Chave de licença fornecida no cadastro entre em contato no grupo após subir a instalação
LICENSE_KEY=Sua_chave_do_cadastro_aqui

# URL do servidor admin de licenças
LICENSE_ADMIN_URL=https://padmin.intrategica.com.br/

# =================================================================
# WHATSAPP (opcional)
# =================================================================
# Versão do WhatsApp (deixe comentado para usar a mais recente)
# CONFIG_SESSION_PHONE_VERSION=2.24.6.77
```

---

## 📖 Documentação

Após iniciar o servidor, acesse:

| Recurso | URL |
|---------|-----|
| **Painel Principal** | `http://localhost:3000` |
| **Documentação da API** | `http://localhost:3000/docs.html` |
| **API Tester** | `http://localhost:3000/api-tester.html` |

> 💡 **Dica**: A documentação inclui **templates prontos** para copiar e usar em carrosséis, botões e listas!

---

## 🔗 Endpoints Principais

### Instâncias

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/instances` | Listar instâncias |
| POST | `/api/instances` | Criar instância |
| GET | `/api/instances/:id/qr` | Obter QR Code |
| GET | `/api/instances/:id/status` | Status da instância |
| DELETE | `/api/instances/:id` | Deletar instância |

### Mensagens

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/instances/:id/send-text` | Enviar texto |
| POST | `/api/instances/:id/send-image` | Enviar imagem |
| POST | `/api/instances/:id/send-buttons` | Enviar botões |
| POST | `/api/instances/:id/send-list` | Enviar lista/menu |
| POST | `/api/instances/:id/send-carousel` | Enviar carrossel |

### Webhooks

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/instances/:id/webhook` | Obter config webhook |
| POST | `/api/instances/:id/webhook` | Configurar webhook |

---

## 📱 Exemplo de Uso

### Enviar Mensagem com Botões

```bash
curl -X POST http://localhost:3000/api/instances/default/send-buttons \
-H "Content-Type: application/json" \
-d '{
  "jid": "5511999999999@s.whatsapp.net",
  "text": "Escolha uma opção:",
  "footer": "Pastorini API",
  "buttons": [
    { "type": "reply", "displayText": "Opção 1", "id": "btn1" },
    { "type": "url", "displayText": "Site", "url": "https://google.com" }
  ]
}'
```

### Enviar Carrossel

```bash
curl -X POST http://localhost:3000/api/instances/default/send-carousel \
-H "Content-Type: application/json" \
-d '{
  "jid": "5511999999999@s.whatsapp.net",
  "cards": [
    {
      "header": { "title": "Produto 1", "imageUrl": "https://exemplo.com/img.jpg" },
      "body": "Descrição do produto",
      "footer": "R$ 99,90",
      "buttons": [{ "displayText": "Comprar", "urlButton": { "url": "https://loja.com" } }]
    }
  ]
}'
```

---

## 📞 Suporte

- **Criador**: Matheus Pastorini
- **WhatsApp**: [+55 82 98889-8565](https://wa.me/5582988898565)
- **Documentação**: Acesse `/docs.html` no painel
- **Grupo Oficial Automatik**: [Acessar Grupo](https://chat.whatsapp.com/BL1yLEFDjmkFB1yLkQVsCn)
- **Ajude a manter o projeto**: pix: 82988898565

---

## ⚠️ Aviso Legal

Este software requer uma licença válida para funcionamento. O uso não autorizado é proibido.

---

<p align="center">
<strong>© 2025 Pastorini API</strong><br>
Powered by Baileys
</p>
