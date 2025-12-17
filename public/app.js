// API URL - usa o mesmo host/porta que está servindo a página
const API_URL = '/api';

// ==================== TEMPLATES DE CARROSSEL ====================
const carouselTemplates = {
    ecommerce: {
        title: '🛍️ Ofertas Especiais',
        body: 'Confira nossos produtos em destaque!',
        footer: 'Loja Virtual - Entrega em todo Brasil',
        preview: '<strong>E-commerce:</strong> 3 cards de produtos (iPhone, MacBook, Apple Watch) com imagens e botões de compra.',
        cards: [
            {
                imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
                title: '📱 iPhone 15 Pro Max',
                body: '256GB - Titânio Natural\n💰 R$ 8.999,00 à vista\n💳 12x R$ 833,25',
                footer: 'Frete Grátis',
                buttons: [{ id: 'comprar_iphone', title: '🛒 Comprar' }, { id: 'info_iphone', title: '📋 Detalhes' }]
            },
            {
                imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
                title: '💻 MacBook Air M3',
                body: '8GB RAM - 256GB SSD\n💰 R$ 12.499,00 à vista\n💳 12x R$ 1.166,58',
                footer: 'Garantia 1 ano',
                buttons: [{ id: 'comprar_macbook', title: '🛒 Comprar' }, { id: 'info_macbook', title: '📋 Detalhes' }]
            },
            {
                imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400',
                title: '⌚ Apple Watch Series 9',
                body: 'GPS + Cellular - 45mm\n💰 R$ 5.299,00 à vista\n💳 12x R$ 491,58',
                footer: 'Pronta Entrega',
                buttons: [{ id: 'comprar_watch', title: '🛒 Comprar' }, { id: 'info_watch', title: '📋 Detalhes' }]
            }
        ]
    },
    restaurante: {
        title: '🍽️ Cardápio do Dia',
        body: 'Escolha seu prato favorito!',
        footer: 'Restaurante Sabor & Arte - Delivery',
        preview: '<strong>Restaurante:</strong> 4 cards de pratos (Picanha, Lasanha, Sushi, Sobremesa) com preços e botões.',
        cards: [
            {
                imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400',
                title: '🥩 Picanha na Brasa',
                body: 'Picanha grelhada 400g\nAcompanha: arroz, feijão, farofa\n⭐ Mais Pedido!',
                footer: 'R$ 89,90 - Serve 2',
                buttons: [{ id: 'pedir_picanha', title: '🛒 Pedir' }, { id: 'add_bebida', title: '🍺 + Bebida' }]
            },
            {
                imageUrl: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400',
                title: '🍝 Lasanha Bolonhesa',
                body: 'Massa fresca artesanal\nMolho bolonhesa caseiro\nQueijo gratinado',
                footer: 'R$ 49,90',
                buttons: [{ id: 'pedir_lasanha', title: '🛒 Pedir' }, { id: 'ver_massas', title: '🍝 Outras' }]
            },
            {
                imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400',
                title: '🍣 Combo Sushi',
                body: '30 peças variadas:\n• 10 Hot Rolls\n• 10 Uramakis\n• 10 Niguiris',
                footer: 'R$ 79,90 - Serve 2',
                buttons: [{ id: 'pedir_sushi', title: '🛒 Pedir' }, { id: 'personalizar', title: '✏️ Editar' }]
            },
            {
                imageUrl: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400',
                title: '🍰 Petit Gateau',
                body: 'Bolo de chocolate cremoso\nAcompanha sorvete de creme',
                footer: 'R$ 29,90',
                buttons: [{ id: 'pedir_sobremesa', title: '🛒 Adicionar' }, { id: 'ver_sobremesas', title: '🍨 Mais' }]
            }
        ]
    },
    imobiliaria: {
        title: '🏠 Imóveis Selecionados',
        body: 'Encontramos opções perfeitas para você!',
        footer: 'Imobiliária Premium - CRECI 12345',
        preview: '<strong>Imobiliária:</strong> 3 cards de imóveis (Apartamento, Casa, Sala Comercial) com fotos e botões.',
        cards: [
            {
                imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400',
                title: '🏢 Apartamento Alto Padrão',
                body: '📍 Jardins - São Paulo\n🛏️ 3 suítes | 🚗 2 vagas\n📐 180m² | 🏊 Lazer completo',
                footer: 'R$ 2.500.000',
                buttons: [{ id: 'visita_apt', title: '📅 Agendar' }, { id: 'fotos_apt', title: '📸 Fotos' }]
            },
            {
                imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
                title: '🏡 Casa em Condomínio',
                body: '📍 Alphaville - Barueri\n🛏️ 4 suítes | 🚗 4 vagas\n📐 450m² | 🌳 Terreno 800m²',
                footer: 'R$ 4.200.000',
                buttons: [{ id: 'visita_casa', title: '📅 Agendar' }, { id: 'fotos_casa', title: '📸 Fotos' }]
            },
            {
                imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
                title: '🏬 Sala Comercial',
                body: '📍 Av. Paulista - SP\n📐 120m² | 🚗 2 vagas\n🏢 Edifício Triple A',
                footer: 'R$ 18.000/mês',
                buttons: [{ id: 'visita_sala', title: '📅 Agendar' }, { id: 'proposta', title: '💼 Proposta' }]
            }
        ]
    },
    servicos: {
        title: '📋 Nossos Planos',
        body: 'Escolha o plano ideal para sua empresa',
        footer: 'Marketing Digital Pro',
        preview: '<strong>Serviços:</strong> 3 cards de planos (Starter, Professional, Enterprise) com benefícios e preços.',
        cards: [
            {
                imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
                title: '🥉 Plano Starter',
                body: '✅ 10 posts/mês\n✅ 2 redes sociais\n✅ Relatório mensal\n✅ Suporte por email',
                footer: 'R$ 497/mês',
                buttons: [{ id: 'contratar_starter', title: '✅ Contratar' }, { id: 'info_starter', title: 'ℹ️ Saiba +' }]
            },
            {
                imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
                title: '🥈 Plano Professional',
                body: '✅ 20 posts/mês\n✅ 4 redes sociais\n✅ Gestão de tráfego\n⭐ Mais Popular!',
                footer: 'R$ 997/mês',
                buttons: [{ id: 'contratar_pro', title: '✅ Contratar' }, { id: 'info_pro', title: 'ℹ️ Saiba +' }]
            },
            {
                imageUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400',
                title: '🥇 Plano Enterprise',
                body: '✅ Posts ilimitados\n✅ Todas as redes\n✅ Equipe dedicada\n✅ Suporte 24/7',
                footer: 'R$ 2.497/mês',
                buttons: [{ id: 'contratar_enterprise', title: '✅ Contratar' }, { id: 'reuniao', title: '📞 Reunião' }]
            }
        ]
    }
};

// Função para atualizar preview e campos do carrossel
function updateCarouselPreview() {
    const templateKey = document.getElementById('carouselTemplate').value;
    const template = carouselTemplates[templateKey];
    if (template) {
        document.getElementById('carouselTitle').value = template.title;
        document.getElementById('carouselBody').value = template.body;
        document.getElementById('carouselFooter').value = template.footer;
        document.getElementById('carouselPreview').innerHTML = '<i class="fa-solid fa-info-circle"></i> ' + template.preview;
    }
}

// Expor função globalmente
window.updateCarouselPreview = updateCarouselPreview;

// Get API key from cookie or URL query param
function getApiKey() {
    // Try to get from cookie first
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'panelKey') {
            return decodeURIComponent(value);
        }
    }
    // Fallback to URL param
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('key') || '';
}

const API_KEY = getApiKey();

// Helper function to make authenticated API calls
async function apiFetch(url, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...(API_KEY ? { 'x-api-key': API_KEY } : {}),
        ...options.headers
    };
    return fetch(url, { ...options, headers });
}

const instancesGrid = document.getElementById('instancesGrid');
const addInstanceBtn = document.getElementById('addInstanceBtn');
const modal = document.getElementById('qrModal');
const closeModal = document.querySelector('.close');
const qrImage = document.getElementById('qrImage');
const qrLoader = document.getElementById('qrLoader');
const qrStatus = document.getElementById('qrStatus');

let currentPollInterval = null;

// ==================== SERVER STATS ====================

function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
}

async function fetchServerStats() {
    try {
        const response = await apiFetch(`${API_URL}/stats`);
        const stats = await response.json();
        
        // CPU
        document.getElementById('cpuUsage').textContent = stats.cpu.usage + '%';
        document.getElementById('cpuCores').textContent = stats.cpu.cores + ' cores';
        
        // Memory
        document.getElementById('memUsage').textContent = stats.memory.usagePercent + '%';
        document.getElementById('memDetail').textContent = formatBytes(stats.memory.used) + ' / ' + formatBytes(stats.memory.total);
        
        // Process
        document.getElementById('processMemory').textContent = formatBytes(stats.process.rss);
        document.getElementById('nodeVersion').textContent = stats.system.nodeVersion;
        
        // Uptime
        document.getElementById('apiUptime').textContent = formatUptime(stats.api.uptime);
        document.getElementById('instancesCount').textContent = stats.api.connectedInstances + '/' + stats.api.instances + ' conectadas';
        
    } catch (error) {
        console.error('Error fetching stats:', error);
    }
}

// Stats refresh interval
let statsInterval = null;

function changeRefreshRate() {
    const rate = parseInt(document.getElementById('refreshRate').value);
    if (statsInterval) clearInterval(statsInterval);
    statsInterval = setInterval(fetchServerStats, rate);
    // Save preference
    localStorage.setItem('statsRefreshRate', rate);
}

// Initialize stats refresh
function initStatsRefresh() {
    // Load saved preference
    const savedRate = localStorage.getItem('statsRefreshRate');
    if (savedRate) {
        document.getElementById('refreshRate').value = savedRate;
    }
    const rate = parseInt(document.getElementById('refreshRate').value);
    fetchServerStats();
    statsInterval = setInterval(fetchServerStats, rate);
}

initStatsRefresh();

// ==================== INSTANCES ====================

// Fetch and render instances
async function fetchInstances() {
    try {
        const response = await apiFetch(`${API_URL}/instances`);
        const instances = await response.json();
        renderInstances(instances);
    } catch (error) {
        console.error('Error fetching instances:', error);
    }
}

function renderInstances(instances) {
    instancesGrid.innerHTML = instances.map(instance => `
        <div class="card">
            <div class="card-header">
                <span class="status-badge ${instance.status === 'CONNECTED' ? 'status-connected' : 'status-disconnected'}">
                    ${instance.status}
                </span>
                <div style="display: flex; gap: 8px;">
                    <button class="btn-icon btn-settings" onclick="openSettings('${instance.id}')" title="Configurações">
                        <i class="fa-solid fa-gear"></i>
                    </button>
                    <button class="btn-icon btn-delete" onclick="deleteInstance('${instance.id}')" title="Excluir">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="card-body">
                <h3>${instance.name || 'Desconhecido'}</h3>
                <p>${instance.id}</p>
                <p>${instance.phoneNumber ? '+' + instance.phoneNumber : 'Sem número'}</p>
            </div>
            <div class="card-actions">
                <button class="btn-primary" onclick="testCarousel('${instance.id}')" ${instance.status !== 'CONNECTED' ? 'disabled' : ''} style="flex: 1">
                    <i class="fa-solid fa-paper-plane"></i> Testar
                </button>
                <div style="width: 10px;"></div>
                <button class="btn-secondary" onclick="reconnectInstance('${instance.id}')" title="Reconectar / QR Code" style="flex: 1">
                    <i class="fa-solid fa-qrcode"></i> Reconectar
                </button>
            </div>
            <div class="card-link-section" style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1);">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
                    <span style="font-size: 0.85rem; color: #aaa;">
                        <i class="fa-solid fa-link"></i> Link Público QR
                    </span>
                    <label class="toggle-switch">
                        <input type="checkbox" ${instance.publicLinkEnabled ? 'checked' : ''} onchange="togglePublicLink('${instance.id}', this.checked)">
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                <button class="btn-link-copy" onclick="copyPublicLink('${instance.id}')" ${!instance.publicLinkEnabled ? 'disabled' : ''} style="width: 100%; padding: 8px; font-size: 0.85rem;">
                    <i class="fa-solid fa-copy"></i> Copiar Link para Cliente
                </button>
            </div>
        </div>
    `).join('');
}

// Create Instance & Poll QR
async function createInstance(existingId = null) {
    const id = existingId || `instance_${Date.now()}`;
    modal.style.display = 'flex';
    qrStatus.innerText = 'Iniciando instância...';
    qrLoader.style.display = 'block';
    qrImage.style.display = 'none';

    try {
        await apiFetch(`${API_URL}/instances`, {
            method: 'POST',
            body: JSON.stringify({ id })
        });

        startQrPolling(id);
    } catch (error) {
        qrStatus.innerText = 'Erro ao criar instância';
    }
}

function reconnectInstance(id) {
    if (!confirm('Deseja gerar um novo QR Code para esta instância?')) return;
    createInstance(id);
}

function startQrPolling(id) {
    if (currentPollInterval) clearInterval(currentPollInterval);

    const pollQr = async () => {
        try {
            // Check instance status first
            const listRes = await apiFetch(`${API_URL}/instances`);
            const instances = await listRes.json();
            const instance = instances.find(i => i.id === id);

            if (instance) {
                console.log(`[Polling] Instance ${id} status: ${instance.status}`);
                
                if (instance.status === 'CONNECTED') {
                    clearInterval(currentPollInterval);
                    currentPollInterval = null;
                    modal.style.display = 'none';
                    qrStatus.innerText = 'Conectado!';
                    fetchInstances();
                    return;
                }
                
                if (instance.status === 'CONNECTING') {
                    qrStatus.innerText = 'Conectando... aguarde';
                    qrLoader.style.display = 'block';
                    qrImage.style.display = 'none';
                    return;
                }
            }

            // Get QR
            const qrRes = await apiFetch(`${API_URL}/instances/${id}/qr`);
            if (qrRes.ok) {
                const data = await qrRes.json();
                qrImage.src = data.qrImage;
                qrImage.style.display = 'block';
                qrLoader.style.display = 'none';
                qrStatus.innerText = 'Escaneie o QR Code no WhatsApp';
            } else {
                // QR não disponível ainda
                const errorData = await qrRes.json().catch(() => ({}));
                if (errorData.error === 'QR not ready or already connected') {
                    qrStatus.innerText = 'Aguardando QR Code...';
                }
            }
        } catch (error) {
            console.error('Polling error', error);
        }
    };

    // Primeira verificação imediata
    pollQr();
    
    // Polling mais rápido (1.5 segundos) para melhor responsividade
    currentPollInterval = setInterval(pollQr, 1500);
}

// Delete Instance
async function deleteInstance(id) {
    if (!confirm('Tem certeza que deseja remover esta instância?')) return;

    await apiFetch(`${API_URL}/instances/${id}`, { method: 'DELETE' });
    fetchInstances();
}

// Toggle Public Link
async function togglePublicLink(id, enabled) {
    console.log(`[Toggle] Setting public link for ${id} to ${enabled}`);
    try {
        const response = await apiFetch(`${API_URL}/instances/${id}/toggle-public-link`, {
            method: 'POST',
            body: JSON.stringify({ enabled })
        });
        const data = await response.json();
        console.log('[Toggle] Response:', data);
        if (!response.ok) {
            throw new Error(data.error || 'Failed to toggle');
        }
        fetchInstances();
    } catch (error) {
        console.error('Error toggling public link:', error);
        alert('Erro ao alterar configuração: ' + error.message);
    }
}

// Copy Public Link
function copyPublicLink(id) {
    const link = `${window.location.origin}/qr-client.html?id=${id}`;
    navigator.clipboard.writeText(link).then(() => {
        alert('Link copiado!\n\n' + link);
    }).catch(() => {
        prompt('Copie o link abaixo:', link);
    });
}

const sendModal = document.getElementById('sendModal');
const sendClose = document.querySelector('.send-close');
const sendMessageBtn = document.getElementById('sendMessageBtn');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const btnHeaderType = document.getElementById('btnHeaderType');
const mediaUrlGroup = document.getElementById('mediaUrlGroup');

let currentInstanceId = null;

// ... existing fetchInstances ...

// Open Send Modal
function testCarousel(id) {
    currentInstanceId = id;
    sendModal.style.display = 'flex';
}

// Tab Switching
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(`${btn.dataset.tab}Tab`).classList.add('active');
    });
});

// Toggle Media Input
btnHeaderType.addEventListener('change', (e) => {
    if (e.target.value === 'image' || e.target.value === 'video') {
        mediaUrlGroup.style.display = 'block';
    } else {
        mediaUrlGroup.style.display = 'none';
    }
});

// Send Message Logic
sendMessageBtn.addEventListener('click', async () => {
    const jid = document.getElementById('targetJid').value;
    if (!jid) return alert('Digite um número!');

    const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
    const url = `${API_URL}/instances/${currentInstanceId}`;
    let endpoint = '';
    let body = { jid };

    if (activeTab === 'carousel') {
        endpoint = '/send-carousel';
        const templateKey = document.getElementById('carouselTemplate').value;
        const template = carouselTemplates[templateKey];
        body = {
            ...body,
            title: document.getElementById('carouselTitle').value || template.title,
            body: document.getElementById('carouselBody').value || template.body,
            footer: document.getElementById('carouselFooter').value || template.footer,
            cards: template.cards
        };
    } else if (activeTab === 'list') {
        endpoint = '/send-list';
        body = {
            ...body,
            title: document.getElementById('listTitle').value || '🍔 Cardápio',
            body: document.getElementById('listText').value || 'Escolha uma categoria',
            footer: document.getElementById('listFooter').value || 'Delivery',
            buttonText: document.getElementById('listButtonParams').value || '📋 Ver Cardápio',
            sections: [
                {
                    title: '🍔 Hambúrgueres',
                    rows: [
                        { id: 'burger_classico', title: 'Clássico', description: 'Pão, carne 180g, queijo, alface - R$ 28,90' },
                        { id: 'burger_bacon', title: 'Bacon Lovers', description: 'Pão, carne 180g, bacon, cheddar - R$ 34,90' },
                        { id: 'burger_vegano', title: 'Veggie Burger', description: 'Hambúrguer de grão de bico - R$ 32,90' }
                    ]
                },
                {
                    title: '🍕 Pizzas',
                    rows: [
                        { id: 'pizza_margherita', title: 'Margherita', description: 'Molho, mussarela, tomate - R$ 49,90' },
                        { id: 'pizza_pepperoni', title: 'Pepperoni', description: 'Molho, mussarela, pepperoni - R$ 54,90' }
                    ]
                },
                {
                    title: '🥤 Bebidas',
                    rows: [
                        { id: 'bebida_refri', title: 'Refrigerante 350ml', description: 'Coca, Guaraná, Sprite - R$ 6,90' },
                        { id: 'bebida_suco', title: 'Suco Natural 500ml', description: 'Laranja, Limão, Maracujá - R$ 12,90' }
                    ]
                }
            ]
        };
    } else if (activeTab === 'buttons') {
        endpoint = '/send-buttons';
        body = {
            ...body,
            title: document.getElementById('btnTitle').value || '👋 Bem-vindo!',
            body: document.getElementById('btnText').value || 'Como posso ajudar?',
            footer: document.getElementById('btnFooter').value || 'Atendimento 24h',
            headerType: document.getElementById('btnHeaderType').value,
            mediaUrl: document.getElementById('btnMediaUrl').value || '',
            buttons: [
                { id: 'vendas', title: '🛒 Fazer Pedido' },
                { id: 'suporte', title: '🔧 Suporte Técnico' },
                { id: 'financeiro', title: '💰 Financeiro' }
            ]
        };
    }

    try {
        const res = await apiFetch(url + endpoint, {
            method: 'POST',
            body: JSON.stringify(body)
        });
        const data = await res.json();
        if (data.success) {
            alert('Mensagem enviada com sucesso!');
            sendModal.style.display = 'none';
        } else {
            alert('Erro ao enviar: ' + (data.error || 'Desconhecido'));
        }
    } catch (error) {
        console.error(error);
        alert('Erro ao enviar requisição');
    }
});

sendClose.addEventListener('click', () => {
    sendModal.style.display = 'none';
});

// ... existing code ...

// Event Listeners
addInstanceBtn.addEventListener('click', () => createInstance());
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    if (currentPollInterval) clearInterval(currentPollInterval);
});

// Settings Modal
const settingsModal = document.getElementById('settingsModal');
const settingsClose = document.querySelector('.settings-close');
let settingsInstanceId = null;

async function openSettings(id) {
    settingsInstanceId = id;
    settingsModal.style.display = 'flex';
    
    // Reset all checkboxes first
    document.querySelectorAll('.event-checkbox').forEach(cb => {
        cb.checked = false;
    });
    
    // Carrega configurações atuais
    try {
        const res = await apiFetch(`${API_URL}/instances/${id}/webhook`);
        const data = await res.json();
        
        if (data.webhook) {
            document.getElementById('webhookUrl').value = data.webhook.url || '';
            document.getElementById('webhookEnabled').checked = data.webhook.enabled || false;
            
            // Marca os eventos configurados
            const events = data.webhook.events || [];
            
            // Se "all" está nos eventos, marca apenas o checkbox "all"
            if (events.includes('all')) {
                document.querySelector('[data-event="all"]').checked = true;
            } else {
                // Marca os eventos individuais
                document.querySelectorAll('.event-checkbox').forEach(cb => {
                    const eventName = cb.dataset.event;
                    if (eventName !== 'all') {
                        cb.checked = events.includes(eventName);
                    }
                });
            }
        } else {
            document.getElementById('webhookUrl').value = '';
            document.getElementById('webhookEnabled').checked = false;
            // Marca apenas mensagens e status por padrão
            document.querySelector('[data-event="messages"]').checked = true;
            document.querySelector('[data-event="message_status"]').checked = true;
        }
    } catch (error) {
        console.error('Error loading webhook config:', error);
    }
}

// Lógica para o checkbox "all" - quando marcado, desmarca os outros
document.addEventListener('DOMContentLoaded', function() {
    const allCheckbox = document.querySelector('[data-event="all"]');
    const otherCheckboxes = document.querySelectorAll('.event-checkbox:not([data-event="all"])');
    
    if (allCheckbox) {
        allCheckbox.addEventListener('change', function() {
            if (this.checked) {
                // Desmarca todos os outros
                otherCheckboxes.forEach(cb => cb.checked = false);
            }
        });
    }
    
    // Quando marca qualquer outro, desmarca "all"
    otherCheckboxes.forEach(cb => {
        cb.addEventListener('change', function() {
            if (this.checked && allCheckbox) {
                allCheckbox.checked = false;
            }
        });
    });
});

async function saveWebhookSettings() {
    const url = document.getElementById('webhookUrl').value;
    const enabled = document.getElementById('webhookEnabled').checked;
    let events = [];
    
    // Verifica se "all" está marcado
    const allCheckbox = document.querySelector('[data-event="all"]');
    if (allCheckbox && allCheckbox.checked) {
        events = ['all'];
    } else {
        // Coleta todos os eventos marcados (exceto "all")
        document.querySelectorAll('.event-checkbox:checked').forEach(cb => {
            if (cb.dataset.event !== 'all') {
                events.push(cb.dataset.event);
            }
        });
    }
    
    // Validação
    if (enabled && !url) {
        alert('Por favor, informe a URL do webhook');
        return;
    }
    
    if (enabled && events.length === 0) {
        alert('Por favor, selecione pelo menos um evento');
        return;
    }
    
    try {
        const res = await apiFetch(`${API_URL}/instances/${settingsInstanceId}/webhook`, {
            method: 'POST',
            body: JSON.stringify({ url, enabled, events })
        });
        
        const data = await res.json();
        if (data.success) {
            alert('Configurações salvas com sucesso!');
            settingsModal.style.display = 'none';
        } else {
            alert('Erro ao salvar: ' + (data.error || 'Desconhecido'));
        }
    } catch (error) {
        console.error('Error saving webhook:', error);
        alert('Erro ao salvar configurações');
    }
}

if (settingsClose) {
    settingsClose.addEventListener('click', () => {
        settingsModal.style.display = 'none';
    });
}

// Settings Tab Switching
document.querySelectorAll('.settings-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.settings-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.settings-tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(`${btn.dataset.settingsTab}SettingsTab`).classList.add('active');
    });
});

// Initial load
fetchInstances();
setInterval(fetchInstances, 5000); // Auto refresh list
