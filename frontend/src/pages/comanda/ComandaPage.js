import './ComandaPage.css'
import { createHeader } from '../../shared/Header.js'
import { api } from '../../shared/api.js'
import { getUser } from '../../shared/auth.js'

const pageName = 'Cozinha';

class ComandaPage extends HTMLElement {
    connectedCallback() {
        this.classList.add('ion-page');
        const cabecalho = createHeader(pageName);
        this.innerHTML = `
            ${cabecalho}
            <ion-content class="ion-padding">
                <div id="setup-comanda" style="display: none;">
                    <h3>Iniciar Nova Comanda</h3>
                    <ion-item>
                        <ion-label position="stacked">Usuário</ion-label>
                        <ion-select id="usuario-select" placeholder="Selecione o Usuário">
                        </ion-select>
                    </ion-item>
                    <ion-item>
                        <ion-label position="stacked">Número da Mesa</ion-label>
                        <ion-input type="number" id="mesa-id" placeholder="Ex: 1"></ion-input>
                    </ion-item>
                    <ion-button expand="block" id="btn-start-comanda" class="ion-margin-top">
                        Iniciar Comanda
                    </ion-button>
                </div>

                <div id="manage-comanda" style="display: none;">
                    <div class="comanda-info">
                        <p><strong>Mesa:</strong> <span id="info-mesa">-</span></p>
                        <p><strong>Total:</strong> <span id="info-total">R$ 0,00</span></p>
                    </div>

                    <ion-list id="comanda-items">
                        <!-- Itens da comanda entram aqui -->
                    </ion-list>

                    <ion-list id="available-products">
                        <ion-list-header>
                            <ion-label>Adicionar Produtos</ion-label>
                        </ion-list-header>
                        <!-- Produtos entram aqui -->
                    </ion-list>

                    <ion-button expand="block" color="danger" id="btn-close-comanda" class="ion-margin-top">
                        Fechar Comanda
                    </ion-button>
                </div>
            </ion-content>
        `;

        this.querySelector('#btn-start-comanda').addEventListener('click', () => this.startComanda());
        this.querySelector('#btn-close-comanda').addEventListener('click', () => this.closeComanda());

        this.init();
    }

    async init() {
        try {
            const comandaAtiva = await api.get('/comanda'); // Assume a first active one or a specific logic
            if (comandaAtiva && comandaAtiva.length > 0) {
                 this.showManageComanda(comandaAtiva[0]);
            } else {
                this.showSetupComanda();
            }
        } catch (error) {
            this.showSetupComanda();
        }
    }

    async showSetupComanda(defaultMesa = '') {
        this.querySelector('#setup-comanda').style.display = 'block';
        this.querySelector('#manage-comanda').style.display = 'none';
        
        const mesaInput = this.querySelector('#mesa-id');
        mesaInput.value = defaultMesa;

        // Carregar usuários para o select
        try {
            const usuarios = await api.get('/usuario');
            const select = this.querySelector('#usuario-select');
            select.innerHTML = usuarios.map(u => `
                <ion-select-option value="${u.id}">${u.nome}</ion-select-option>
            `).join('');
        } catch (error) {
            console.error('Erro ao carregar usuários para a comanda:', error);
        }
    }

    async showManageComanda(comanda) {
        this.querySelector('#setup-comanda').style.display = 'none';
        this.querySelector('#manage-comanda').style.display = 'block';
        
        document.getElementById('info-mesa').innerText = comanda.id_mesa;
        
        await this.loadItems(comanda.id);
        await this.loadProducts();
    }

    async startComanda() {
        const id_usuario = this.querySelector('#usuario-select').value;
        const id_mesa = this.querySelector('#mesa-id').value;
        
        if (!id_usuario) {
            alert('Selecione um usuário');
            return;
        }
        if (!id_mesa) {
            alert('Informe o número da mesa');
            return;
        }

        try {
            const comanda = await api.post('/comanda/usuario', {
                id_usuario: parseInt(id_usuario),
                id_mesa: parseInt(id_mesa)
            });
            this.showManageComanda(comanda);
        } catch (error) {
            alert(`Erro ao iniciar comanda: ${error.message}`);
        }
    }

    async loadItems(comandaId) {
        try {
            // Assuming there's a way to get items for a comanda. 
            // We'll use the comanda-item endpoint.
            // Note: The backend currently doesn't have a 'findAll' by comandaId in the controller based on previous reads.
            // Let's assume the comanda output includes the items due to cascade.
            const comanda = await api.get(`/comanda/${comandaId}`);
            this.renderItems(comanda.itens || []);
        } catch (error) {
            console.error('Erro ao carregar itens:', error);
        }
    }

    renderItems(itens) {
        const container = this.querySelector('#comanda-items');
        let total = 0;

        container.innerHTML = itens.map(item => {
            const subtotal = item.qtd_item * item.valor_venda;
            total += subtotal;
            return `
                <ion-item>
                    <ion-label>
                        <h2>${item.produto?.dsc_produto || 'Produto'}</h2>
                        <p>${item.qtd_item}x ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor_venda)}</p>
                    </ion-label>
                    <ion-note slot="end">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}</ion-note>
                    <ion-item-option slot="end" onclick="window.dispatchEvent(new CustomEvent('toggle-delivery', {detail: {id_comanda: ${item.id_comanda}, id_produto: ${item.id_produto}, status: ${!item.statusEntrega}}}))">
                        <ion-checkbox slot="start" ${item.statusEntrega ? 'checked' : ''}></ion-checkbox>
                        Entregue
                    </ion-item-option>
                    <ion-button slot="end" fill="clear" color="danger" onclick="window.dispatchEvent(new CustomEvent('remove-item', {detail: {id_comanda: ${item.id_comanda}, id_produto: ${item.id_produto}}}))">
                        <ion-icon slot="icon-only" name="trash-outline"></ion-icon>
                    </ion-button>
                </ion-item>
            `;
        }).join('');

        document.getElementById('info-total').innerText = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total);
    }

    async loadProducts() {
        try {
            const produtos = await api.get('/produto');
            // Organiza por descrição em ordem alfabética
            produtos.sort((a, b) => a.dsc_produto.localeCompare(b.dsc_produto));
            const container = this.querySelector('#available-products');
            
            // Keep the header
            container.innerHTML = `<ion-list-header><ion-label>Adicionar Produtos</ion-label></ion-list-header>`;
            
            produtos.forEach(produto => {
                const item = document.createElement('ion-item');
                item.innerHTML = `
                    <ion-label>
                        <h2>${produto.dsc_produto}</h2>
                        <p>${produto.tipo || 'Geral'} - ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.valor_unit)}</p>
                    </ion-label>
                    <ion-button slot="end" onclick="window.dispatchEvent(new CustomEvent('add-item', {detail: {id_produto: ${produto.id}}}))">
                        Adicionar
                    </ion-button>
                `;
                container.appendChild(item);
            });
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
        }
    }

    async closeComanda() {
        const user = getUser();
        try {
            const comanda = await api.get(`/comanda/usuario/${user.id}`);
            await api.delete(`/comanda/${comanda.id}`);
            alert('Comanda fechada com sucesso!');
            this.showSetupComanda();
        } catch (error) {
            alert('Erro ao fechar comanda');
        }
    }
}

// Add global listeners for the dynamic buttons in the HTML strings
window.addEventListener('add-item', async (e) => {
    const { id_produto } = e.detail;
    const user = getUser();
    try {
        const comanda = await api.get(`/comanda/usuario/${user.id}`);
        await api.post('/comanda-item', {
            id_comanda: comanda.id,
            id_produto: id_produto,
            qtd_item: 1,
            valor_venda: 0 // Service will sync this
        });
        document.querySelector('comanda-page').loadItems(comanda.id);
    } catch (error) {
        alert('Erro ao adicionar produto');
    }
});

window.addEventListener('remove-item', async (e) => {
    const { id_comanda, id_produto } = e.detail;
    try {
        await api.delete(`/comanda-item/${id_comanda}/${id_produto}`);
        const comanda = await api.get(`/comanda/${id_comanda}`);
        document.querySelector('comanda-page').loadItems(comanda.id);
    } catch (error) {
        alert('Erro ao remover produto');
    }
});

window.addEventListener('toggle-delivery', async (e) => {
    const { id_comanda, id_produto, status } = e.detail;
    try {
        await api.patch(`/comanda-item/${id_comanda}/${id_produto}`, {
            statusEntrega: status
        });
        const comanda = await api.get(`/comanda/${id_comanda}`);
        document.querySelector('comanda-page').loadItems(comanda.id);
    } catch (error) {
        alert('Erro ao atualizar status de entrega');
    }
});

customElements.define('comanda-page', ComandaPage);
