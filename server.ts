/**
 * ╔═══════════════════════════════════════════════════════════════╗
 * ║                      PASTORINI API                            ║
 * ║              WhatsApp API powered by Baileys                  ║
 * ║                     © 2025 Pastorini                          ║
 * ╚═══════════════════════════════════════════════════════════════╝
 */

import 'dotenv/config'
import express, { type Request, type Response, type NextFunction } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'
import os from 'os'
import instanceManager from './instanceManager'
import { generateCarouselMessage, generateListMessage, generateButtonMessage, prepareWAMessageMedia, type CarouselCard } from './lib/Utils/messages.js'
import * as qrcode from 'qrcode'
import { fileURLToPath } from 'url'
import licenseManager from './lib/License/licenseManager.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ==================== PROTEÇÃO DE CRÉDITOS ====================
const PROTECTED_FOOTER = `<!-- Footer Fixo -->
    <footer id="mainFooter" style="position: fixed; bottom: 0; left: 0; right: 0; text-align: center; padding: 12px 20px; background: rgba(10,10,10,0.95); backdrop-filter: blur(10px); border-top: 1px solid rgba(255,255,255,0.1); color: #888; font-size: 0.8rem; z-index: 100;">
        <span id="footerCredits">© 2025 <a href="https://wa.me/5582988898565" target="_blank" style="color: #10b981; text-decoration: none;">Pastorini API</a> - Powered by Baileys</span>
    </footer>`

const FOOTER_PROTECTION_SCRIPT = `
    <script>
        // Proteção de créditos do footer
        (function() {
            const fc = '© 2025 <a href="https://wa.me/5582988898565" target="_blank" style="color: #10b981; text-decoration: none;">Pastorini API</a> - Powered by Baileys';
            const fe = document.getElementById('footerCredits');
            const ff = document.getElementById('mainFooter');
            function checkFooter() {
                if (!fe || !ff || fe.innerHTML !== fc || ff.style.display === 'none' || ff.style.visibility === 'hidden' || ff.style.opacity === '0') {
                    if (ff) { ff.style.cssText = 'position:fixed;bottom:0;left:0;right:0;text-align:center;padding:12px 20px;background:rgba(10,10,10,0.95);backdrop-filter:blur(10px);border-top:1px solid rgba(255,255,255,0.1);color:#888;font-size:0.8rem;z-index:100;display:block;visibility:visible;opacity:1;'; }
                    if (fe) fe.innerHTML = fc;
                    else if (ff) ff.innerHTML = '<span id="footerCredits">' + fc + '</span>';
                }
            }
            checkFooter();
            setInterval(checkFooter, 2000);
            new MutationObserver(checkFooter).observe(document.body, { childList: true, subtree: true, attributes: true, characterData: true });
        })();
    </script>`

// Arquivos HTML protegidos
const PROTECTED_HTML_FILES = ['index.html', 'docs.html', 'api-tester.html', 'qr-client.html']

// Armazena hashes originais dos arquivos
const originalFileHashes: Map<string, string> = new Map()

/**
 * Calcula hash MD5 de um conteúdo
 */
function calculateHash(content: string): string {
    return crypto.createHash('md5').update(content).digest('hex')
}

/**
 * Verifica se o arquivo HTML contém o footer de créditos
 */
function hasValidFooter(content: string): boolean {
    return content.includes('id="mainFooter"') && 
           content.includes('id="footerCredits"') && 
           content.includes('Pastorini API') &&
           content.includes('wa.me/5582988898565')
}

/**
 * Injeta o footer de créditos no HTML se estiver faltando
 */
function injectFooterIfMissing(content: string): string {
    if (hasValidFooter(content)) {
        return content
    }
    
    console.log('[Credits] ⚠️ Footer de créditos removido - restaurando...')
    
    // Injeta antes do </body>
    let modified = content
    
    // Remove footer existente se estiver corrompido
    modified = modified.replace(/<footer[^>]*id="mainFooter"[^>]*>[\s\S]*?<\/footer>/gi, '')
    
    // Injeta o footer correto antes do </body>
    if (modified.includes('</body>')) {
        modified = modified.replace('</body>', `${PROTECTED_FOOTER}\n</body>`)
    }
    
    // Verifica se tem o script de proteção
    if (!modified.includes('Proteção de créditos do footer')) {
        modified = modified.replace('</body>', `${FOOTER_PROTECTION_SCRIPT}\n</body>`)
    }
    
    return modified
}

/**
 * Verifica e restaura arquivos HTML protegidos no startup
 */
function verifyAndRestoreProtectedFiles(): void {
    const publicDir = path.join(__dirname, 'public')
    
    console.log('[Credits] 🔒 Verificando integridade dos arquivos protegidos...')
    
    for (const filename of PROTECTED_HTML_FILES) {
        const filePath = path.join(publicDir, filename)
        
        try {
            if (!fs.existsSync(filePath)) {
                console.log(`[Credits] ⚠️ Arquivo não encontrado: ${filename}`)
                continue
            }
            
            let content = fs.readFileSync(filePath, 'utf-8')
            const originalHash = calculateHash(content)
            
            // Verifica se tem footer válido
            if (!hasValidFooter(content)) {
                console.log(`[Credits] ⚠️ Footer inválido em ${filename} - restaurando...`)
                content = injectFooterIfMissing(content)
                fs.writeFileSync(filePath, content, 'utf-8')
                console.log(`[Credits] ✓ ${filename} restaurado com sucesso`)
            } else {
                console.log(`[Credits] ✓ ${filename} - OK`)
            }
            
            // Armazena hash para verificação posterior
            originalFileHashes.set(filename, calculateHash(content))
            
        } catch (error) {
            console.error(`[Credits] ❌ Erro ao verificar ${filename}:`, error)
        }
    }
    
    console.log('[Credits] 🔒 Verificação concluída')
}

/**
 * Middleware para servir arquivos HTML com proteção de créditos
 */
function creditsProtectionMiddleware(req: Request, res: Response, next: NextFunction): void {
    // Só processa arquivos HTML protegidos
    const requestedFile = req.path === '/' ? 'index.html' : req.path.substring(1)
    
    if (!PROTECTED_HTML_FILES.includes(requestedFile)) {
        return next()
    }
    
    const filePath = path.join(__dirname, 'public', requestedFile)
    
    try {
        if (!fs.existsSync(filePath)) {
            return next()
        }
        
        let content = fs.readFileSync(filePath, 'utf-8')
        
        // Verifica e injeta footer se necessário
        if (!hasValidFooter(content)) {
            console.log(`[Credits] ⚠️ Footer removido detectado em ${requestedFile} - injetando...`)
            content = injectFooterIfMissing(content)
            
            // Salva o arquivo corrigido
            fs.writeFileSync(filePath, content, 'utf-8')
        }
        
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.send(content)
        
    } catch (error) {
        console.error(`[Credits] Erro ao servir ${requestedFile}:`, error)
        next()
    }
}

const app = express()
const PORT = 3000

// API Key for panel access (optional)
const PANEL_API_KEY = process.env.PANEL_API_KEY || ''



app.use(cors())
app.use(cookieParser())
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// Panel API Key middleware - protects panel access (HTML pages)
const panelAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // If no API key configured, allow access
    if (!PANEL_API_KEY) {
        return next()
    }
    
    // Allow API routes (they have their own auth middleware below)
    if (req.path.startsWith('/api/')) {
        return next()
    }
    
    // Allow static assets (css, js, images, fonts)
    if (req.path.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
        return next()
    }
    
    // Protected pages
    const protectedPages = ['/', '/index.html', '/api-tester.html', '/docs.html']
    if (!protectedPages.includes(req.path)) {
        return next()
    }
    
    // Check for API key in multiple places:
    // 1. Cookie (preferred - secure)
    // 2. Query param: ?key=xxx
    const cookieKey = req.cookies?.panelKey
    const queryKey = req.query.key as string
    
    // Valid key via cookie - allow access
    if (cookieKey && cookieKey === PANEL_API_KEY) {
        return next()
    }
    
    // If key provided via query param and is valid, set cookie and redirect to clean URL
    if (queryKey && queryKey === PANEL_API_KEY) {
        res.cookie('panelKey', queryKey, { 
            httpOnly: false, // Allow JS to read for API calls
            secure: false,   // Allow HTTP for development
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        })
        // Store in session for API calls
        return res.redirect(req.path)
    }
    
    // Invalid key provided via query
    if (queryKey && queryKey !== PANEL_API_KEY) {
        return res.status(401).send(`
            <!DOCTYPE html>
            <html>
            <head><title>Acesso Negado</title></head>
            <body style="font-family:Arial;background:#111;color:#fff;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;">
                <div style="text-align:center;">
                    <h1 style="color:#ef4444;">❌ Chave Inválida</h1>
                    <p><a href="${req.path}" style="color:#10b981;">Tentar novamente</a></p>
                </div>
            </body>
            </html>
        `)
    }
    
    // No key - show login form
    return res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Acesso ao Painel</title>
            <style>
                body { font-family: Arial, sans-serif; background: #111; color: #fff; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
                .login-box { background: #1a1a1a; padding: 40px; border-radius: 12px; text-align: center; max-width: 400px; }
                h1 { color: #10b981; margin-bottom: 20px; }
                input { padding: 12px; width: 100%; border: 1px solid #333; border-radius: 8px; background: #222; color: #fff; margin-bottom: 15px; box-sizing: border-box; }
                button { padding: 12px 30px; background: #10b981; color: #fff; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; width: 100%; }
                button:hover { background: #059669; }
                .hint { color: #666; font-size: 0.8rem; margin-top: 15px; }
            </style>
        </head>
        <body>
            <div class="login-box">
                <h1>🔐 Pastorini API</h1>
                <p style="color:#888;margin-bottom:20px;">Digite a chave de acesso ao painel</p>
                <form onsubmit="event.preventDefault(); const k=document.getElementById('key').value; if(k) window.location.href='${req.path}?key='+encodeURIComponent(k);">
                    <input type="password" id="key" placeholder="API Key" autofocus><br>
                    <button type="submit">Entrar</button>
                </form>
                <p class="hint">A chave é definida na variável PANEL_API_KEY</p>
            </div>
        </body>
        </html>
    `)
}

// API Key middleware - protects API routes
const apiAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // If no API key configured, allow access (development mode)
    if (!PANEL_API_KEY) {
        return next()
    }
    
    // Only protect /api/ routes
    if (!req.path.startsWith('/api/')) {
        return next()
    }
    
    // Public API routes that don't require authentication
    const publicApiRoutes = [
        '/api/stats',                    // Server stats (for monitoring)
        '/api/license/status',           // License status check
        '/api/activate',                 // License activation
        '/api/heartbeat',                // License heartbeat
        '/api/panel/auth',               // Panel authentication (login)
        '/api/panel/logout',             // Panel logout
    ]
    
    // Check if it's a public route
    if (publicApiRoutes.some(route => req.path === route)) {
        return next()
    }
    
    // Public status for QR client (check pattern /api/instances/:id/public-status)
    if (req.path.match(/^\/api\/instances\/[^/]+\/public-status$/)) {
        return next()
    }
    
    // Public QR for client (check pattern /api/instances/:id/qr and verify referer is qr-client)
    if (req.path.match(/^\/api\/instances\/[^/]+\/qr$/) && req.headers.referer?.includes('qr-client.html')) {
        return next()
    }
    
    // Check for API key in multiple places:
    // 1. Header: x-api-key
    // 2. Header: Authorization: Bearer <key>
    // 3. Query param: ?key=xxx
    const headerKey = req.headers['x-api-key'] as string
    const authHeader = req.headers['authorization']
    const bearerKey = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null
    const queryKey = req.query.key as string
    
    const providedKey = headerKey || bearerKey || queryKey
    
    // Valid key - allow access
    if (providedKey && providedKey === PANEL_API_KEY) {
        return next()
    }
    
    // No key or invalid key - return 401
    return res.status(401).json({
        error: 'Unauthorized',
        message: 'API key required. Provide via x-api-key header, Authorization: Bearer <key>, or ?key= query param'
    })
}

app.use(panelAuthMiddleware)
app.use(apiAuthMiddleware)

// Middleware de proteção de créditos (antes do static)
app.use(creditsProtectionMiddleware)

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')))

// License check middleware - blocks API if license is invalid
const licenseMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // Allow public routes
    const publicPaths = ['/api/license/status', '/api/instances/:id/public-status', '/api/stats']
    const isPublicPath = publicPaths.some(p => req.path.includes(p.replace(':id', '')))
    
    if (isPublicPath || !req.path.startsWith('/api/')) {
        return next()
    }
    
    if (!licenseManager.isAllowed()) {
        const status = licenseManager.getStatus()
        return res.status(403).json({
            error: 'License blocked',
            status: status.status,
            message: status.message
        })
    }
    
    next()
}

app.use(licenseMiddleware)

// Panel authentication endpoint (POST to avoid key in URL)
app.post('/api/panel/auth', (req: Request, res: Response) => {
    const { key } = req.body
    
    if (!PANEL_API_KEY) {
        return res.json({ success: true, message: 'No authentication required' })
    }
    
    if (key && key === PANEL_API_KEY) {
        // Set secure cookie
        res.cookie('panelKey', key, { 
            httpOnly: true, 
            secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        })
        return res.json({ success: true })
    }
    
    return res.status(401).json({ error: 'Invalid key' })
})

// Panel logout endpoint
app.post('/api/panel/logout', (req: Request, res: Response) => {
    res.clearCookie('panelKey')
    return res.json({ success: true })
})

/**
 * Normaliza um número de telefone para o formato JID do WhatsApp
 * Trata especialmente números brasileiros com o 9º dígito
 * 
 * Regras para Brasil (DDI 55):
 * - Celulares: 55 + DDD (2 dígitos) + 9 + número (8 dígitos) = 13 dígitos
 * - Se o número tiver 13 dígitos e começar com 55, remove o 9 após o DDD
 * - DDDs de SP (11-19) sempre precisam do 9
 * - Outros DDDs (21-99) o 9 foi adicionado gradualmente
 * 
 * @param phone Número de telefone (pode incluir @s.whatsapp.net ou não)
 * @returns JID normalizado no formato numero@s.whatsapp.net
 */
function normalizeJid(phone: string): string {
    if (!phone) return phone
    
    // Se já é um JID de grupo, retorna como está
    if (phone.includes('@g.us') || phone.includes('@broadcast') || phone.includes('@lid')) {
        return phone
    }
    
    // Remove o sufixo @s.whatsapp.net se existir
    let number = phone.replace('@s.whatsapp.net', '').replace('@c.us', '')
    
    // Remove caracteres não numéricos (exceto +)
    number = number.replace(/[^\d+]/g, '')
    
    // Remove o + do início se existir
    number = number.replace(/^\+/, '')
    
    // Tratamento especial para números brasileiros
    if (number.startsWith('55')) {
        const withoutCountry = number.substring(2) // Remove o 55
        
        // Verifica se é um número de celular brasileiro com 9º dígito
        // Formato com 9: DDD (2) + 9 + número (8) = 11 dígitos após o 55
        // Formato sem 9: DDD (2) + número (8) = 10 dígitos após o 55
        
        if (withoutCountry.length === 11) {
            const ddd = withoutCountry.substring(0, 2)
            const ninthDigit = withoutCountry.substring(2, 3)
            const restOfNumber = withoutCountry.substring(3)
            
            // Se o terceiro dígito é 9 e o número tem 11 dígitos, pode ser o 9º dígito extra
            // Verifica se o número após o 9 começa com 9, 8, 7 (típico de celulares)
            if (ninthDigit === '9') {
                const firstDigitAfterNine = restOfNumber.substring(0, 1)
                
                // Se após remover o 9, o número começa com 9, 8 ou 7, é celular
                // Remove o 9 extra para DDDs que não precisam
                // DDDs de SP (11-19) geralmente precisam do 9
                // Outros DDDs podem ou não precisar
                
                // Estratégia: tentar primeiro sem o 9 extra para DDDs fora de SP
                const dddNum = parseInt(ddd)
                
                // Para DDDs fora de SP (20+), remove o 9 se presente
                // Para DDDs de SP (11-19), mantém o 9
                if (dddNum >= 20 && ['9', '8', '7'].includes(firstDigitAfterNine)) {
                    // Remove o 9º dígito para DDDs fora de SP
                    number = '55' + ddd + restOfNumber
                    console.log(`[JID] Número brasileiro normalizado (removido 9): ${phone} -> ${number}`)
                }
            }
        }
        // Se tem 10 dígitos após o 55, está no formato correto (sem 9 extra)
    }
    
    return `${number}@s.whatsapp.net`
}

/**
 * Verifica se um número existe no WhatsApp e retorna o JID correto
 * Útil para resolver problemas de 9º dígito e LID
 */
async function resolveJid(socket: any, phone: string): Promise<string> {
    const normalizedJid = normalizeJid(phone)
    console.log(`[JID] Iniciando resolução: ${phone} -> normalizado: ${normalizedJid}`)
    
    try {
        // Tenta verificar se o número existe
        const numberOnly = normalizedJid.replace('@s.whatsapp.net', '')
        console.log(`[JID] Verificando número: ${numberOnly}`)
        
        const results = await socket.onWhatsApp(numberOnly)
        console.log(`[JID] Resultado onWhatsApp:`, JSON.stringify(results, null, 2))
        
        const [result] = results || []
        
        if (result?.exists && result?.jid) {
            console.log(`[JID] ✓ Número verificado: ${phone} -> ${result.jid}`)
            // Verifica se é LID
            if (result.jid.includes('@lid')) {
                console.log(`[JID] ⚠ Número usa formato LID (novo formato Meta)`)
            }
            return result.jid
        }
        
        console.log(`[JID] Número não encontrado diretamente, tentando variações...`)
        
        // Se não encontrou, tenta com/sem o 9
        const number = numberOnly
        if (number.startsWith('55') && number.length === 12) {
            // Tenta adicionar o 9
            const withNine = number.substring(0, 4) + '9' + number.substring(4)
            console.log(`[JID] Tentando com 9: ${withNine}`)
            const [resultWithNine] = await socket.onWhatsApp(withNine) || []
            if (resultWithNine?.exists && resultWithNine?.jid) {
                console.log(`[JID] ✓ Número encontrado com 9: ${phone} -> ${resultWithNine.jid}`)
                return resultWithNine.jid
            }
        } else if (number.startsWith('55') && number.length === 13) {
            // Tenta remover o 9
            const withoutNine = number.substring(0, 4) + number.substring(5)
            console.log(`[JID] Tentando sem 9: ${withoutNine}`)
            const [resultWithoutNine] = await socket.onWhatsApp(withoutNine) || []
            if (resultWithoutNine?.exists && resultWithoutNine?.jid) {
                console.log(`[JID] ✓ Número encontrado sem 9: ${phone} -> ${resultWithoutNine.jid}`)
                return resultWithoutNine.jid
            }
        }
        
        console.log(`[JID] ✗ Número não encontrado em nenhuma variação`)
    } catch (error) {
        console.log(`[JID] ✗ Erro ao verificar número:`, error)
    }
    
    // Retorna o JID normalizado se não conseguiu verificar
    console.log(`[JID] Usando JID normalizado (não verificado): ${normalizedJid}`)
    return normalizedJid
}

// List instances
app.get('/api/instances', (req: Request, res: Response) => {
    const instances = instanceManager.getAllInstances()
    res.json(instances)
})

// Create instance
app.post('/api/instances', async (req: Request, res: Response) => {
    const id = req.body.id as string
    if (!id) return res.status(400).json({ error: 'ID is required' })

    try {
        const instance = await instanceManager.createInstance(id)
        if (!instance) {
            return res.status(500).json({ error: 'Failed to create instance' })
        }
        res.json({
            id: instance.id,
            status: instance.status
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Failed to create instance' })
    }
})

app.get('/api/instances/:id/qr', async (req: Request, res: Response) => {
    const id = req.params.id
    if (!id) return res.status(400).json({ error: 'ID is required' })

    const instance = instanceManager.getInstance(id)

    if (!instance) return res.status(404).json({ error: 'Instance not found' })
    if (!instance.qr) return res.status(400).json({ error: 'QR not ready or already connected' })

    try {
        const qrImage = await qrcode.toDataURL(instance.qr)
        res.json({ qrImage })
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate QR image' })
    }
})

// Delete instance
app.delete('/api/instances/:id', async (req: Request, res: Response) => {
    const id = req.params.id
    if (!id) return res.status(400).json({ error: 'ID is required' })

    await instanceManager.deleteInstance(id)
    res.json({ success: true })
})

// Send Carousel
app.post('/api/instances/:id/send-carousel', async (req: Request, res: Response) => {
    const id = req.params.id
    console.log(`[Carousel] Request received for instance: ${id}`);

    if (!id) return res.status(400).json({ error: 'ID is required' })
    const { jid, title, body, footer, cards: requestCards } = req.body
    console.log(`[Carousel] Target JID: ${jid}`);
    console.log(`[Carousel] Title: ${title}, Body: ${body}, Footer: ${footer}`);

    const instance = instanceManager.getInstance(id)
    if (!instance || !instance.socket) {
        console.error(`[Carousel] Instance not found or not connected. Instance: ${!!instance}, Socket: ${!!instance?.socket}`);
        return res.status(404).json({ error: 'Instance not found or not connected' })
    }

    try {
        console.log('[Carousel] Generating message content...');
        
        // Usar cards do request ou fallback para exemplo
        const cards: CarouselCard[] = (requestCards && requestCards.length > 0) ? requestCards.map((card: any) => ({
            header: {
                title: card.title || 'Produto',
                subtitle: card.footer || '',
                imageUrl: card.imageUrl || card.header?.imageUrl
            },
            body: card.body || '',
            footer: card.footer || '',
            buttons: (card.buttons || []).map((btn: any) => {
                // Converter formato simplificado para formato Baileys
                if (btn.id && btn.title) {
                    return { displayText: btn.title, quickReplyButton: { id: btn.id } };
                }
                return btn;
            })
        })) : [
            {
                header: {
                    title: 'Oferta Especial',
                    subtitle: 'Aproveite agora',
                    imageUrl: 'https://www.w3schools.com/w3css/img_lights.jpg'
                },
                body: 'Melhores produtos com desconto!',
                footer: 'Promoção válida até amanhã',
                buttons: [
                    { displayText: 'Ver Site', urlButton: { url: 'https://google.com' } },
                    { displayText: 'Eu Quero', quickReplyButton: { id: 'want_it' } }
                ]
            }
        ];

        // Upload media for cards
        for (const card of cards) {
            if (card.header?.imageUrl) {
                try {
                    console.log(`[Carousel] Uploading image for card: ${card.header.title}`);
                    const message = await prepareWAMessageMedia(
                        { image: { url: card.header.imageUrl } },
                        {
                            upload: instance.socket.waUploadToServer,
                            logger: instance.socket.logger
                        }
                    );
                    card.header.imageMessage = message.imageMessage || undefined;
                } catch (error) {
                    console.error(`[Carousel] Failed to upload image for card ${card.header.title}:`, error);
                }
            }
            if (card.header?.videoUrl) {
                try {
                    console.log(`[Carousel] Uploading video for card: ${card.header.title}`);
                    const message = await prepareWAMessageMedia(
                        { video: { url: card.header.videoUrl } },
                        {
                            upload: instance.socket.waUploadToServer,
                            logger: instance.socket.logger
                        }
                    );
                    card.header.videoMessage = message.videoMessage || undefined;
                } catch (error) {
                    console.error(`[Carousel] Failed to upload video for card ${card.header.title}:`, error);
                }
            }
        }

        console.log('[Carousel] Socket User:', instance.socket.user);
        console.log('[Carousel] Cards:', JSON.stringify(cards, null, 2));
        console.log('[Carousel] Title:', title, 'Body:', body, 'Footer:', footer);

        const carouselContent = generateCarouselMessage({ cards, title, body, footer });

        console.log('[Carousel] Sending message via relayMessage...');

        const resolvedJid = await resolveJid(instance.socket, jid)
        console.log('[Carousel] JID Original:', jid);
        console.log('[Carousel] JID Resolvido:', resolvedJid);
        
        // Enviar diretamente como interactiveMessage (sem viewOnceMessage wrapper)
        // Isso pode funcionar melhor em dispositivos iOS
        const messageContent = {
            interactiveMessage: carouselContent
        };

        console.log('[Carousel] Message Content (sem viewOnce):', JSON.stringify(messageContent, null, 2));
        
        await instance.socket.relayMessage(resolvedJid, messageContent, {});
        console.log('[Carousel] Message sent successfully to:', resolvedJid);
        res.json({ success: true, jidOriginal: jid, jidResolved: resolvedJid })
    } catch (error) {
        console.error('[Carousel] Failed to send message:', error)
        res.status(500).json({ error: 'Failed to send message: ' + (error as Error).message })
    }
})

// Send List Message
app.post('/api/instances/:id/send-list', async (req: Request, res: Response) => {
    const id = req.params.id
    if (!id) return res.status(400).json({ error: 'ID is required' })
    const { jid, title, text, footer, buttonText, sections } = req.body

    const instance = instanceManager.getInstance(id)
    if (!instance || !instance.socket) return res.status(404).json({ error: 'Instance not found or not connected' })

    try {
        const resolvedJid = await resolveJid(instance.socket, jid)
        const listInteractive = generateListMessage(sections, buttonText, text, title, footer)

        console.log('[List] Sending via sendMessage...');
        console.log('[List] Content:', JSON.stringify(listInteractive, null, 2));
        
        // Usar sendMessage que processa corretamente o interactiveMessage
        await instance.socket.sendMessage(resolvedJid, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: listInteractive
                }
            }
        } as any);
        
        console.log('[List] Message sent successfully to:', resolvedJid);
        res.json({ success: true })
    } catch (error) {
        console.error('[List] Error:', error)
        res.status(500).json({ error: 'Failed to send list message' })
    }
})

// Send Button Message
app.post('/api/instances/:id/send-buttons', async (req: Request, res: Response) => {
    const id = req.params.id
    if (!id) return res.status(400).json({ error: 'ID is required' })
    const { jid, text, footer, buttons, headerType, mediaUrl } = req.body

    const instance = instanceManager.getInstance(id)
    if (!instance || !instance.socket) return res.status(404).json({ error: 'Instance not found or not connected' })

    try {
        const resolvedJid = await resolveJid(instance.socket, jid)
        const buttonsInteractive = generateButtonMessage(buttons, text, footer, headerType, mediaUrl)

        console.log('[Buttons] Sending via sendMessage...');
        console.log('[Buttons] Content:', JSON.stringify(buttonsInteractive, null, 2));
        
        // Usar sendMessage que processa corretamente o interactiveMessage
        await instance.socket.sendMessage(resolvedJid, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: buttonsInteractive
                }
            }
        } as any);
        
        console.log('[Buttons] Message sent successfully to:', resolvedJid);
        res.json({ success: true })
    } catch (error) {
        console.error('[Buttons] Error:', error)
        res.status(500).json({ error: 'Failed to send button message' })
    }
})

// ==================== NOVAS ROTAS ====================

// Get instance status
app.get('/api/instances/:id/status', (req: Request, res: Response) => {
    const id = req.params.id
    if (!id) return res.status(400).json({ error: 'ID is required' })
    
    const instance = instanceManager.getInstance(id)
    if (!instance) return res.status(404).json({ error: 'Instance not found' })
    
    const { socket, ...rest } = instance as any
    res.json(rest)
})

// Send text message
app.post('/api/instances/:id/send-text', async (req: Request, res: Response) => {
    const id = req.params.id
    const { jid, text } = req.body
    
    const instance = instanceManager.getInstance(id)
    if (!instance?.socket) return res.status(404).json({ error: 'Instance not found or not connected' })
    
    try {
        const resolvedJid = await resolveJid(instance.socket, jid)
        await instance.socket.sendMessage(resolvedJid, { text })
        res.json({ success: true })
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message' })
    }
})

// Send image
app.post('/api/instances/:id/send-image', async (req: Request, res: Response) => {
    const id = req.params.id
    const { jid, url, caption } = req.body
    
    const instance = instanceManager.getInstance(id)
    if (!instance?.socket) return res.status(404).json({ error: 'Instance not found or not connected' })
    
    try {
        const resolvedJid = await resolveJid(instance.socket, jid)
        await instance.socket.sendMessage(resolvedJid, { image: { url }, caption })
        res.json({ success: true })
    } catch (error) {
        res.status(500).json({ error: 'Failed to send image' })
    }
})

// Send video
app.post('/api/instances/:id/send-video', async (req: Request, res: Response) => {
    const id = req.params.id
    const { jid, url, caption, gifPlayback } = req.body
    
    const instance = instanceManager.getInstance(id)
    if (!instance?.socket) return res.status(404).json({ error: 'Instance not found or not connected' })
    
    try {
        const resolvedJid = await resolveJid(instance.socket, jid)
        await instance.socket.sendMessage(resolvedJid, { video: { url }, caption, gifPlayback })
        res.json({ success: true })
    } catch (error) {
        res.status(500).json({ error: 'Failed to send video' })
    }
})

// Send audio
app.post('/api/instances/:id/send-audio', async (req: Request, res: Response) => {
    const id = req.params.id
    const { jid, url, ptt } = req.body
    
    const instance = instanceManager.getInstance(id)
    if (!instance?.socket) return res.status(404).json({ error: 'Instance not found or not connected' })
    
    try {
        const resolvedJid = await resolveJid(instance.socket, jid)
        await instance.socket.sendMessage(resolvedJid, { audio: { url }, ptt })
        res.json({ success: true })
    } catch (error) {
        res.status(500).json({ error: 'Failed to send audio' })
    }
})

// Send document
app.post('/api/instances/:id/send-document', async (req: Request, res: Response) => {
    const id = req.params.id
    const { jid, url, filename, mimetype } = req.body
    
    const instance = instanceManager.getInstance(id)
    if (!instance?.socket) return res.status(404).json({ error: 'Instance not found or not connected' })
    
    try {
        const resolvedJid = await resolveJid(instance.socket, jid)
        await instance.socket.sendMessage(resolvedJid, { document: { url }, fileName: filename, mimetype })
        res.json({ success: true })
    } catch (error) {
        res.status(500).json({ error: 'Failed to send document' })
    }
})

// Send location
app.post('/api/instances/:id/send-location', async (req: Request, res: Response) => {
    const id = req.params.id
    const { jid, latitude, longitude, name, address } = req.body
    
    const instance = instanceManager.getInstance(id)
    if (!instance?.socket) return res.status(404).json({ error: 'Instance not found or not connected' })
    
    try {
        const resolvedJid = await resolveJid(instance.socket, jid)
        await instance.socket.sendMessage(resolvedJid, { 
            location: { degreesLatitude: latitude, degreesLongitude: longitude, name, address }
        })
        res.json({ success: true })
    } catch (error) {
        res.status(500).json({ error: 'Failed to send location' })
    }
})

// Send contact
app.post('/api/instances/:id/send-contact', async (req: Request, res: Response) => {
    const id = req.params.id
    const { jid, name, phone } = req.body
    
    const instance = instanceManager.getInstance(id)
    if (!instance?.socket) return res.status(404).json({ error: 'Instance not found or not connected' })
    
    try {
        const resolvedJid = await resolveJid(instance.socket, jid)
        const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL;type=CELL;type=VOICE;waid=${phone.replace(/\D/g, '')}:${phone}\nEND:VCARD`
        await instance.socket.sendMessage(resolvedJid, { 
            contacts: { displayName: name, contacts: [{ vcard }] }
        })
        res.json({ success: true })
    } catch (error) {
        res.status(500).json({ error: 'Failed to send contact' })
    }
})

// Send reaction
app.post('/api/instances/:id/send-reaction', async (req: Request, res: Response) => {
    const id = req.params.id
    const { jid, messageId, emoji } = req.body
    
    const instance = instanceManager.getInstance(id)
    if (!instance?.socket) return res.status(404).json({ error: 'Instance not found or not connected' })
    
    try {
        const resolvedJid = await resolveJid(instance.socket, jid)
        await instance.socket.sendMessage(resolvedJid, { 
            react: { text: emoji, key: { remoteJid: resolvedJid, id: messageId } }
        })
        res.json({ success: true })
    } catch (error) {
        res.status(500).json({ error: 'Failed to send reaction' })
    }
})

// ==================== GRUPOS ====================

// Create group
app.post('/api/instances/:id/groups/create', async (req: Request, res: Response) => {
    const id = req.params.id
    const { name, participants } = req.body
    
    if (!name) return res.status(400).json({ error: 'Group name is required' })
    if (!participants || !Array.isArray(participants) || participants.length === 0) {
        return res.status(400).json({ error: 'At least one participant is required' })
    }
    
    const instance = instanceManager.getInstance(id)
    if (!instance?.socket) return res.status(404).json({ error: 'Instance not found or not connected' })
    
    try {
        const result = await instance.socket.groupCreate(name, participants)
        res.json({ success: true, group: result })
    } catch (error: any) {
        console.error('Error creating group:', error)
        res.status(500).json({ error: 'Failed to create group', details: error?.message || 'Unknown error' })
    }
})

// Get group metadata
app.get('/api/instances/:id/groups/:groupId/metadata', async (req: Request, res: Response) => {
    const { id, groupId } = req.params
    
    const instance = instanceManager.getInstance(id)
    if (!instance?.socket) return res.status(404).json({ error: 'Instance not found or not connected' })
    
    try {
        const metadata = await instance.socket.groupMetadata(groupId)
        res.json(metadata)
    } catch (error) {
        res.status(500).json({ error: 'Failed to get group metadata' })
    }
})

// Get group invite code
app.get('/api/instances/:id/groups/:groupId/invite-code', async (req: Request, res: Response) => {
    const { id, groupId } = req.params
    
    const instance = instanceManager.getInstance(id)
    if (!instance?.socket) return res.status(404).json({ error: 'Instance not found or not connected' })
    
    try {
        const code = await instance.socket.groupInviteCode(groupId)
        res.json({ code, link: `https://chat.whatsapp.com/${code}` })
    } catch (error) {
        res.status(500).json({ error: 'Failed to get invite code' })
    }
})

// Manage group participants
app.post('/api/instances/:id/groups/:groupId/participants', async (req: Request, res: Response) => {
    const { id, groupId } = req.params
    const { action, participants } = req.body
    
    const instance = instanceManager.getInstance(id)
    if (!instance?.socket) return res.status(404).json({ error: 'Instance not found or not connected' })
    
    try {
        const result = await instance.socket.groupParticipantsUpdate(groupId, participants, action)
        res.json({ success: true, result })
    } catch (error) {
        res.status(500).json({ error: 'Failed to update participants' })
    }
})

// Update group settings
app.put('/api/instances/:id/groups/:groupId/settings', async (req: Request, res: Response) => {
    const { id, groupId } = req.params
    const { subject, description, announce, restrict } = req.body
    
    const instance = instanceManager.getInstance(id)
    if (!instance?.socket) return res.status(404).json({ error: 'Instance not found or not connected' })
    
    try {
        if (subject) await instance.socket.groupUpdateSubject(groupId, subject)
        if (description !== undefined) await instance.socket.groupUpdateDescription(groupId, description)
        if (announce !== undefined) await instance.socket.groupSettingUpdate(groupId, announce ? 'announcement' : 'not_announcement')
        if (restrict !== undefined) await instance.socket.groupSettingUpdate(groupId, restrict ? 'locked' : 'unlocked')
        res.json({ success: true })
    } catch (error) {
        res.status(500).json({ error: 'Failed to update group settings' })
    }
})

// Leave group
app.post('/api/instances/:id/groups/:groupId/leave', async (req: Request, res: Response) => {
    const { id, groupId } = req.params
    
    const instance = instanceManager.getInstance(id)
    if (!instance?.socket) return res.status(404).json({ error: 'Instance not found or not connected' })
    
    try {
        await instance.socket.groupLeave(groupId)
        res.json({ success: true })
    } catch (error) {
        res.status(500).json({ error: 'Failed to leave group' })
    }
})

// ==================== PERFIL ====================

// Get profile picture
app.get('/api/instances/:id/profile-picture/:jid', async (req: Request, res: Response) => {
    const { id, jid } = req.params
    
    const instance = instanceManager.getInstance(id)
    if (!instance?.socket) return res.status(404).json({ error: 'Instance not found or not connected' })
    
    try {
        const url = await instance.socket.profilePictureUrl(jid, 'image')
        res.json({ url })
    } catch (error) {
        res.json({ url: null })
    }
})

// Update profile picture
app.put('/api/instances/:id/profile-picture', async (req: Request, res: Response) => {
    const id = req.params.id
    const { url } = req.body
    
    const instance = instanceManager.getInstance(id)
    if (!instance?.socket) return res.status(404).json({ error: 'Instance not found or not connected' })
    
    try {
        await instance.socket.updateProfilePicture(instance.socket.user?.id, { url })
        res.json({ success: true })
    } catch (error) {
        res.status(500).json({ error: 'Failed to update profile picture' })
    }
})

// Update profile status
app.put('/api/instances/:id/profile-status', async (req: Request, res: Response) => {
    const id = req.params.id
    const { status } = req.body
    
    const instance = instanceManager.getInstance(id)
    if (!instance?.socket) return res.status(404).json({ error: 'Instance not found or not connected' })
    
    try {
        await instance.socket.updateProfileStatus(status)
        res.json({ success: true })
    } catch (error) {
        res.status(500).json({ error: 'Failed to update profile status' })
    }
})

// Update profile name
app.put('/api/instances/:id/profile-name', async (req: Request, res: Response) => {
    const id = req.params.id
    const { name } = req.body
    
    const instance = instanceManager.getInstance(id)
    if (!instance?.socket) return res.status(404).json({ error: 'Instance not found or not connected' })
    
    try {
        await instance.socket.updateProfileName(name)
        res.json({ success: true })
    } catch (error) {
        res.status(500).json({ error: 'Failed to update profile name' })
    }
})

// ==================== PRIVACIDADE ====================

// Get privacy settings
app.get('/api/instances/:id/privacy-settings', async (req: Request, res: Response) => {
    const id = req.params.id
    
    const instance = instanceManager.getInstance(id)
    if (!instance?.socket) return res.status(404).json({ error: 'Instance not found or not connected' })
    
    try {
        const settings = await instance.socket.fetchPrivacySettings()
        res.json(settings)
    } catch (error) {
        res.status(500).json({ error: 'Failed to get privacy settings' })
    }
})

// Block/Unblock contact
app.post('/api/instances/:id/block', async (req: Request, res: Response) => {
    const id = req.params.id
    const { jid, action } = req.body
    
    const instance = instanceManager.getInstance(id)
    if (!instance?.socket) return res.status(404).json({ error: 'Instance not found or not connected' })
    
    try {
        await instance.socket.updateBlockStatus(jid, action)
        res.json({ success: true })
    } catch (error) {
        res.status(500).json({ error: 'Failed to update block status' })
    }
})

// ==================== OUTROS ====================

// Update presence
app.post('/api/instances/:id/presence', async (req: Request, res: Response) => {
    const id = req.params.id
    const { jid, presence } = req.body
    
    const instance = instanceManager.getInstance(id)
    if (!instance?.socket) return res.status(404).json({ error: 'Instance not found or not connected' })
    
    try {
        await instance.socket.sendPresenceUpdate(presence, jid)
        res.json({ success: true })
    } catch (error) {
        res.status(500).json({ error: 'Failed to update presence' })
    }
})

// Read messages
app.post('/api/instances/:id/read-messages', async (req: Request, res: Response) => {
    const id = req.params.id
    const { keys } = req.body
    
    const instance = instanceManager.getInstance(id)
    if (!instance?.socket) return res.status(404).json({ error: 'Instance not found or not connected' })
    
    try {
        await instance.socket.readMessages(keys)
        res.json({ success: true })
    } catch (error) {
        res.status(500).json({ error: 'Failed to read messages' })
    }
})

// Manage labels
app.post('/api/instances/:id/labels', async (req: Request, res: Response) => {
    const id = req.params.id
    const { jid, labelId, action } = req.body
    
    const instance = instanceManager.getInstance(id)
    if (!instance?.socket) return res.status(404).json({ error: 'Instance not found or not connected' })
    
    try {
        if (action === 'add') {
            await instance.socket.addChatLabel(jid, labelId)
        } else {
            await instance.socket.removeChatLabel(jid, labelId)
        }
        res.json({ success: true })
    } catch (error) {
        res.status(500).json({ error: 'Failed to manage label' })
    }
})

// Send sticker
app.post('/api/instances/:id/send-sticker', async (req: Request, res: Response) => {
    const id = req.params.id
    const { jid, url } = req.body
    
    const instance = instanceManager.getInstance(id)
    if (!instance?.socket) return res.status(404).json({ error: 'Instance not found or not connected' })
    
    try {
        const resolvedJid = await resolveJid(instance.socket, jid)
        await instance.socket.sendMessage(resolvedJid, { sticker: { url } })
        res.json({ success: true })
    } catch (error) {
        res.status(500).json({ error: 'Failed to send sticker' })
    }
})

// Get all groups
app.get('/api/instances/:id/groups', async (req: Request, res: Response) => {
    const id = req.params.id
    
    const instance = instanceManager.getInstance(id)
    if (!instance?.socket) return res.status(404).json({ error: 'Instance not found or not connected' })
    
    try {
        const groups = await instance.socket.groupFetchAllParticipating()
        res.json(groups)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch groups' })
    }
})

// Get blocked contacts
app.get('/api/instances/:id/blocked', async (req: Request, res: Response) => {
    const id = req.params.id
    
    const instance = instanceManager.getInstance(id)
    if (!instance?.socket) return res.status(404).json({ error: 'Instance not found or not connected' })
    
    try {
        const blocked = await instance.socket.fetchBlocklist()
        res.json(blocked)
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch blocked contacts' })
    }
})

// Delete message
app.post('/api/instances/:id/delete-message', async (req: Request, res: Response) => {
    const id = req.params.id
    const { jid, messageId, fromMe } = req.body
    
    const instance = instanceManager.getInstance(id)
    if (!instance?.socket) return res.status(404).json({ error: 'Instance not found or not connected' })
    
    try {
        await instance.socket.sendMessage(jid, { delete: { remoteJid: jid, id: messageId, fromMe } })
        res.json({ success: true })
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete message' })
    }
})

// Edit message
app.post('/api/instances/:id/edit-message', async (req: Request, res: Response) => {
    const id = req.params.id
    const { jid, messageId, newText } = req.body
    
    const instance = instanceManager.getInstance(id)
    if (!instance?.socket) return res.status(404).json({ error: 'Instance not found or not connected' })
    
    try {
        await instance.socket.sendMessage(jid, { 
            text: newText, 
            edit: { remoteJid: jid, id: messageId, fromMe: true } 
        })
        res.json({ success: true })
    } catch (error) {
        res.status(500).json({ error: 'Failed to edit message' })
    }
})

// Check if number exists on WhatsApp
app.get('/api/instances/:id/check-number/:phone', async (req: Request, res: Response) => {
    const { id, phone } = req.params
    
    const instance = instanceManager.getInstance(id)
    if (!instance?.socket) return res.status(404).json({ error: 'Instance not found or not connected' })
    
    try {
        const [result] = await instance.socket.onWhatsApp(phone)
        res.json({ exists: !!result?.exists, jid: result?.jid })
    } catch (error) {
        res.status(500).json({ error: 'Failed to check number' })
    }
})

// Logout instance (disconnect without deleting)
app.post('/api/instances/:id/logout', async (req: Request, res: Response) => {
    const id = req.params.id
    
    const instance = instanceManager.getInstance(id)
    if (!instance?.socket) return res.status(404).json({ error: 'Instance not found or not connected' })
    
    try {
        await instance.socket.logout()
        res.json({ success: true })
    } catch (error) {
        res.status(500).json({ error: 'Failed to logout' })
    }
})

// Toggle public link for QR Code
app.post('/api/instances/:id/toggle-public-link', (req: Request, res: Response) => {
    const id = req.params.id
    const { enabled } = req.body
    
    const success = instanceManager.togglePublicLink(id, enabled)
    if (!success) return res.status(404).json({ error: 'Instance not found' })
    
    res.json({ success: true, enabled })
})

// Configure webhook
app.post('/api/instances/:id/webhook', (req: Request, res: Response) => {
    const id = req.params.id
    const { url, enabled, events } = req.body
    
    const instance = instanceManager.getInstance(id)
    if (!instance) return res.status(404).json({ error: 'Instance not found' })
    
    const success = instanceManager.setWebhook(id, {
        url: url || '',
        enabled: enabled ?? false,
        events: events || ['messages', 'status']
    })
    
    if (!success) return res.status(500).json({ error: 'Failed to configure webhook' })
    
    res.json({ success: true, webhook: instanceManager.getWebhook(id) })
})

// Get webhook config
app.get('/api/instances/:id/webhook', (req: Request, res: Response) => {
    const id = req.params.id
    
    const instance = instanceManager.getInstance(id)
    if (!instance) return res.status(404).json({ error: 'Instance not found' })
    
    res.json({ webhook: instanceManager.getWebhook(id) || null })
})

// Get public status (for client QR page)
app.get('/api/instances/:id/public-status', (req: Request, res: Response) => {
    const id = req.params.id
    
    const instance = instanceManager.getInstance(id)
    if (!instance) return res.status(404).json({ error: 'Instance not found' })
    
    if (!instance.publicLinkEnabled) {
        return res.status(403).json({ error: 'Public link disabled' })
    }
    
    const { socket, isDeleting, ...rest } = instance as any
    res.json(rest)
})

// ==================== LICENSE ====================

// Get license status (public route)
app.get('/api/license/status', (_req: Request, res: Response) => {
    const status = licenseManager.getStatus()
    res.json(status)
})

// ==================== MONITORING ====================

// CPU usage tracking
let lastCpuInfo = os.cpus()
let lastCpuUsage = 0

function calculateCpuUsage(): number {
    const cpus = os.cpus()
    let totalIdleDiff = 0
    let totalTickDiff = 0
    
    cpus.forEach((cpu, i) => {
        const lastCpu = lastCpuInfo[i]
        if (!lastCpu) return
        
        const idleDiff = cpu.times.idle - lastCpu.times.idle
        let tickDiff = 0
        for (const type in cpu.times) {
            tickDiff += cpu.times[type as keyof typeof cpu.times] - lastCpu.times[type as keyof typeof lastCpu.times]
        }
        totalIdleDiff += idleDiff
        totalTickDiff += tickDiff
    })
    
    lastCpuInfo = cpus
    
    if (totalTickDiff === 0) return lastCpuUsage
    
    lastCpuUsage = Math.round((1 - totalIdleDiff / totalTickDiff) * 100)
    return lastCpuUsage
}

// Update CPU usage every 2 seconds
setInterval(calculateCpuUsage, 2000)

// Get server stats (CPU, Memory, etc)
app.get('/api/stats', (_req: Request, res: Response) => {
    const cpus = os.cpus()
    const totalMemory = os.totalmem()
    const freeMemory = os.freemem()
    const usedMemory = totalMemory - freeMemory
    const processMemory = process.memoryUsage()
    const uptime = process.uptime()
    
    // Get instances info
    const instances = instanceManager.getAllInstances()
    const connectedInstances = instances.filter(i => i.status === 'CONNECTED').length
    
    res.json({
        cpu: {
            usage: lastCpuUsage,
            cores: cpus.length,
            model: cpus[0]?.model || 'Unknown'
        },
        memory: {
            total: totalMemory,
            used: usedMemory,
            free: freeMemory,
            usagePercent: Math.round((usedMemory / totalMemory) * 100)
        },
        process: {
            heapUsed: processMemory.heapUsed,
            heapTotal: processMemory.heapTotal,
            rss: processMemory.rss,
            external: processMemory.external
        },
        system: {
            platform: os.platform(),
            arch: os.arch(),
            hostname: os.hostname(),
            uptime: os.uptime(),
            nodeVersion: process.version
        },
        api: {
            uptime: uptime,
            instances: instances.length,
            connectedInstances: connectedInstances
        }
    })
})

// Initialize and start server
async function startServer() {
    try {
        // Verificar e restaurar arquivos protegidos no startup
        verifyAndRestoreProtectedFiles()
        
        // Initialize license manager (now async - handles activation)
        await licenseManager.initialize()
        
        // Set callback for when license is blocked
        licenseManager.onBlock(() => {
            console.log('[Server] ⚠️ License has been BLOCKED - API is now disabled')
        })
        
        // Check if license allows operation
        const initialStatus = licenseManager.getStatus()
        if (initialStatus.status === 'PENDING_ACTIVATION') {
            console.log('')
            console.log('╔═══════════════════════════════════════════════════════════════╗')
            console.log('║           ⏳ AGUARDANDO ATIVAÇÃO DA LICENÇA                   ║')
            console.log('║                                                               ║')
            console.log('║  Uma solicitação de ativação foi enviada ao administrador.   ║')
            console.log('║  O servidor iniciará normalmente após a aprovação.           ║')
            console.log('║                                                               ║')
            console.log('║  O sistema verificará a cada 60 segundos.                    ║')
            console.log('╚═══════════════════════════════════════════════════════════════╝')
            console.log('')
        } else if (initialStatus.status === 'MACHINE_MISMATCH') {
            console.log('')
            console.log('╔═══════════════════════════════════════════════════════════════╗')
            console.log('║           ❌ LICENÇA VINCULADA A OUTRO SERVIDOR               ║')
            console.log('║                                                               ║')
            console.log('║  Esta licença já está ativada em outro servidor.             ║')
            console.log('║  Contate o administrador para desvincular a licença.         ║')
            console.log('╚═══════════════════════════════════════════════════════════════╝')
            console.log('')
        }
        
        // Initialize instance manager (connects to database if configured)
        await instanceManager.initialize()
        
        // Update license manager with instance count
        const updateInstanceCount = () => {
            const instances = instanceManager.getAllInstances()
            licenseManager.setInstancesCount(instances.length)
        }
        
        // Update count periodically
        setInterval(updateInstanceCount, 30000)
        updateInstanceCount()
        
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`)
            console.log(`Storage type: ${process.env.STORAGE_TYPE || 'file'}`)
            
            const licenseStatus = licenseManager.getStatus()
            if (licenseStatus.status === 'ACTIVE' && licenseStatus.clientName) {
                console.log(`License: ${licenseStatus.clientName} (${licenseStatus.status})`)
            } else if (licenseStatus.status === 'PENDING_ACTIVATION') {
                console.log(`License: Aguardando ativação...`)
            } else {
                console.log(`License: ${licenseStatus.message}`)
            }
        })
    } catch (error) {
        console.error('Failed to start server:', error)
        process.exit(1)
    }
}

startServer()
