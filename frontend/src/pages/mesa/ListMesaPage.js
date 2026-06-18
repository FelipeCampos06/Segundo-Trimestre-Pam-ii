import './ListMesaPage.css'
import { createHeader } from '../../shared/Header.js'
import { createFooter } from '../../shared/Footer.js'
import { logout } from '../../shared/util.js';
import { api } from '../../shared/api.js'

const pageName = 'Mesa';

class ListMesaPage extends HTMLElement {
    connectedCallback() {
        this.classList.add('ion-page');
        const cabecalho = createHeader(pageName);
        this.innerHTML = `
            ${cabecalho}
            <ion-content>
                <div class="list-mesa"></div>
            </ion-content>
            ${createFooter()}
        `;
        this.querySelector('#logout-btn')
        .addEventListener('click', logout);

        this.querySelector('#btn-back-footer').addEventListener('click', () => {
            document.querySelector('ion-router').push('/home', 'root');
        });

        this.loadMesas();
    }

    async loadMesas() {
        try {
            const mesas = await api.get('/mesa');
            this.renderMesas(mesas);
        } catch (error) {
            console.error('Erro ao carregar mesas:', error);
        }
    }

    renderMesas(mesas) {
        const container = this.querySelector(".list-mesa");

        if (mesas.length === 0) {
            container.innerHTML = '<p> Nenhuma mesa encontrada </p>'
            return;
        }

        const mesaItems = mesas.map(mesa => `
            <ion-item>
                <ion-label>
                    <h2 style="display: flex; align-items: center; gap: 8px;">
                        <ion-icon name="restaurant-outline" color="primary"></ion-icon>
                        Mesa ${mesa.id}
                    </h2>
                    <p>${mesa.qtd_cadeiras} cadeiras</p>
                </ion-label>

                <ion-buttons slot="end">
                    <ion-button fill="clear" class="btn-comanda" data-id="${mesa.id}">
                        <ion-icon slot="icon-only" name="receipt-outline"></ion-icon>
                    </ion-button>
                    <ion-button fill="clear" class="btn-edit" data-id="${mesa.id}">
                        <ion-icon slot="icon-only" name="create-outline"></ion-icon>
                    </ion-button>
                    <ion-button fill="clear" color="danger" class="btn-delete" data-id="${mesa.id}">
                        <ion-icon slot="icon-only" name="trash-outline"></ion-icon>
                    </ion-button>
                </ion-buttons>
            </ion-item>`).join('');
    
        container.innerHTML = `<ion-list>${mesaItems}</ion-list>`;

        // Evento para abrir Comanda
        this.querySelectorAll('.btn-comanda').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id_mesa = btn.dataset.id;
                try {
                    // Tenta encontrar comanda ativa para esta mesa
                    const comanda = await api.get(`/comanda/mesa/${id_mesa}`);
                    localStorage.setItem('current_comanda_id', comanda.id);
                    document.querySelector('ion-router').push('/comanda', 'forward');
                } catch (error) {
                    // Se não houver comanda, abre com a mesa pré-selecionada
                    localStorage.setItem('selected_mesa_id', id_mesa);
                    document.querySelector('ion-router').push('/comanda', 'forward');
                }
            });
        });

        // Outros eventos (Editar/Excluir)
        this.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                localStorage.setItem('edit_mesa_id', btn.dataset.id);
                document.querySelector('ion-router').push('/mesa/edit', 'forward');
            });
        });

        this.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                if (confirm('Deseja realmente excluir esta mesa?')) {
                    try {
                        await api.delete(`/mesa/${id}`);
                        this.loadMesas();
                    } catch (error) {
                        alert('Erro ao excluir mesa');
                    }
                }
            });
        });
    }
}

customElements.define('list-mesa-page', ListMesaPage);
