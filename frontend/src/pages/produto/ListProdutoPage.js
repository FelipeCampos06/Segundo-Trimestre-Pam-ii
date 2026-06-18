import './ListProdutoPage.css'
import { createHeader } from '../../shared/Header.js'
import { createFooter } from '../../shared/Footer.js'
import { logout } from '../../shared/util.js';
import { api } from '../../shared/api.js'

const pageName = 'Produto';

class ListProdutoPage extends HTMLElement {
    connectedCallback() {
        this.classList.add('ion-page');
        const cabecalho = createHeader(pageName);
        this.innerHTML = `
            ${cabecalho}
            <ion-content>
                <div class="ion-padding">
                    <ion-button expand="block" id="btn-add-produto">
                        <ion-icon slot="start" name="add"></ion-icon>
                        Novo Produto
                    </ion-button>
                </div>
                <div class="list-produto"></div>
            </ion-content>
            ${createFooter()}
        `;

        this.querySelector('#btn-add-produto').addEventListener('click', () => {
            document.querySelector('ion-router').push('/produto/create', 'forward');
        });

        this.querySelector('#btn-back-footer').addEventListener('click', () => {
            document.querySelector('ion-router').push('/home', 'root');
        });

        this.loadProdutos();
        // Atualização automática a cada 1 segundo
        this.refreshInterval = setInterval(() => this.loadProdutos(), 1000);
    }

    disconnectedCallback() {
        clearInterval(this.refreshInterval);
    }

    async loadProdutos() {
        try {
            const produtos = await api.get('/produto');
            // Organiza por descrição em ordem alfabética
            produtos.sort((a, b) => a.dsc_produto.localeCompare(b.dsc_produto));
            this.renderProdutos(produtos);
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
        }
    }

    renderProdutos(produtos) {
        const container = this.querySelector(".list-produto");

        if (produtos.length === 0) {
            container.innerHTML = '<p> Nenhum produto encontrado </p>'
            return;
        }

        const formatMoeda = (value) => {
            return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }
        
        const produtoItems = produtos.map(produto => `
            <ion-item>
                <ion-label>
                    <h2 style="display: flex; align-items: center; gap: 8px;">
                        <ion-icon
                            name="${produto.status ? 'checkmark-circle' : 'close-circle'}"
                            color="${produto.status ? 'success' : 'danger'}"
                            style="flex-shrink: 0;"
                        ></ion-icon>
                        <span>${produto.dsc_produto}</span>
                    </h2>
                    <p>${formatMoeda(produto.valor_unit)}</p>
                </ion-label>

                <ion-buttons slot="end">
                    <ion-button fill="clear" class="btn-edit" data-id="${produto.id}">
                        <ion-icon slot="icon-only" name="create-outline"></ion-icon>
                    </ion-button>
                    <ion-button fill="clear" color="danger" class="btn-delete" data-id="${produto.id}">
                        <ion-icon slot="icon-only" name="trash-outline"></ion-icon>
                    </ion-button>
                </ion-buttons>
            </ion-item>`).join('');
    
        container.innerHTML = `<ion-list>${produtoItems}</ion-list>`;

        // Eventos de Edição
        this.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                localStorage.setItem('edit_produto_id', btn.dataset.id);
                document.querySelector('ion-router').push('/produto/edit', 'forward');
            });
        });

        // Eventos de Exclusão
        this.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                if (confirm('Deseja realmente excluir este produto?')) {
                    try {
                        await api.delete(`/produto/${id}`);
                        this.loadProdutos();
                    } catch (error) {
                        alert('Erro ao excluir produto');
                    }
                }
            });
        });
    }
}

customElements.define('list-produto-page', ListProdutoPage);