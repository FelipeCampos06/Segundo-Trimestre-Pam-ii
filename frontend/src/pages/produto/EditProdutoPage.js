import './EditProdutoPage.css'
import { createHeader } from '../../shared/Header.js'
import { logout } from '../../shared/util.js';
import { api } from '../../shared/api.js'

const pageName = 'Editar Produto';

class EditProdutoPage extends HTMLElement {
    connectedCallback() {
        this.classList.add('ion-page');
        const cabecalho = createHeader(pageName);
        this.innerHTML = `
            ${cabecalho}
            <ion-content class="ion-padding">
                <form id="form-produto">
                    <ion-list>
                        <ion-item>
                            <ion-input type="text" name="dsc_produto"
                            label="Descrição do Produto" label-placement="floating" required>
                            </ion-input>
                        </ion-item>
                        <ion-item>
                            <ion-input type="number" step="0.01" name="valor_unit"
                            label="Valor Unitário" label-placement="floating" required>
                            </ion-input>
                        </ion-item>
                        <ion-item>
                            <ion-label>Ativo</ion-label>
                            <ion-toggle slot="end" name="status" checked></ion-toggle>
                        </ion-item>
                    </ion-list>
                    <div class="ion-padding">
                        <ion-button expand="block" type="submit" class="ion-margin-top">
                        Salvar Produto
                        </ion-button>
                        <ion-button expand="block" color="danger" id="btn-cancelar">
                        Cancelar
                        </ion-button>
                    </div>
                </form>
            </ion-content>
        `;
        this.querySelector('#btn-cancelar').addEventListener('click', () => window.history.back());

        this.loadProduto();

        const form = this.querySelector('#form-produto');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = localStorage.getItem('edit_produto_id');
            if (!id) {
                toast('Erro: Produto não identificado');
                return;
            }

            const formData = new FormData(form);
            const data = {
                dsc_produto: formData.get('dsc_produto'),
                valor_unit: parseFloat(formData.get('valor_unit')),
                status: form.querySelector('[name="status"]').checked
            };

            const loading = document.createElement('ion-loading');
            loading.message = 'Atualizando produto...';
            loading.duration = 2000;
            document.body.appendChild(loading);
            await loading.present();

            try {
                await api.patch(`/produto/${id}`, data);
                toast('Produto atualizado com sucesso!', 'success');
                document.querySelector('ion-router').push('/produto/list', 'forward');
            } catch (error) {
                toast(error.message || 'Erro ao atualizar produto');
            }
        });

        async function toast(mensagem, color = 'danger') {
            const toast = document.createElement('ion-toast');
            toast.message = mensagem;
            toast.color = color;
            toast.duration = 2000;
            toast.position = 'bottom';
            document.body.appendChild(toast);
            return toast.present();
        }
    }

    async loadProduto() {
        const id = localStorage.getItem('edit_produto_id');
        if (!id) return;

        try {
            const produto = await api.get(`/produto/${id}`);
            const form = this.querySelector('#form-produto');
            
            form.querySelector('[name="dsc_produto"]').value = produto.dsc_produto;
            form.querySelector('[name="valor_unit"]').value = produto.valor_unit;
            form.querySelector('[name="status"]').checked = produto.status;
        } catch (error) {
            console.error('Erro ao carregar produto:', error);
        }
    }
}

customElements.define('edit-produto-page', EditProdutoPage);