import './CadProdutoPage.css'
import { createHeader } from '../../shared/Header.js'
import { logout } from '../../shared/util.js';
import { api } from '../../shared/api.js'

const pageName = 'Cadastrar Produto';

class CadProdutoPage extends HTMLElement {
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
        this.querySelector('#btn-cancelar').addEventListener('click', () =>  window.history.back());

        const form = this.querySelector('#form-produto');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const data = {
                dsc_produto: formData.get('dsc_produto'),
                valor_unit: parseFloat(formData.get('valor_unit')),
                status: form.querySelector('[name="status"]').checked
            };

            const loading = document.createElement('ion-loading');
            loading.message = 'Salvando produto...';
            loading.duration = 2000;
            document.body.appendChild(loading);
            await loading.present();

            try {
                await api.post('/produto', data);
                toast('Produto cadastrado com sucesso!', 'success');
                document.querySelector('ion-router').push('/produto/list', 'forward');
            } catch (error) {
                toast(error.message || 'Erro ao cadastrar produto');
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
}

customElements.define('cad-produto-page', CadProdutoPage);