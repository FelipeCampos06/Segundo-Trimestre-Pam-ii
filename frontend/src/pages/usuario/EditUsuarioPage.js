import './EditUsuarioPage.css'
import { createHeader } from '../../shared/Header.js'
import { logout } from '../../shared/util.js';
import { api } from '../../shared/api.js'

const pageName = 'Editar Usuario';

class EditUsuarioPage extends HTMLElement {
    connectedCallback() {
        this.classList.add('ion-page');
        const cabecalho = createHeader(pageName);
        this.innerHTML = `
            ${cabecalho}
            <ion-content class="ion-padding">
                <form id="form-usuario">
                <ion-list>
                    <ion-item>
                    <ion-input type="text" name="nome" label="Nome Completo" label-placement="floating" required></ion-input>
                    </ion-item>

                    <ion-item>
                    <ion-input type="text" name="usuario" label="Usuário" label-placement="floating" required></ion-input>
                    </ion-item>

                    <ion-item>
                    <ion-input type="password" name="senha" label="Senha" label-placement="floating" required></ion-input>
                    </ion-item>

                    <ion-item>
                    <ion-select name="perfil" label="Perfil" label-placement="floating">
                        <ion-select-option value="0">Administrador</ion-select-option>
                        <ion-select-option value="1">Atendente</ion-select-option>
                    </ion-select>
                    </ion-item>
                </ion-list>

                <div class="ion-padding">
                    <ion-button expand="block" type="submit" class="ion-margin-top">
                    <ion-icon name="checkmark-circle" slot="start" style="margin-right: 8px;"></ion-icon>
                    Salvar Usuário
                    </ion-button>
                    <ion-button expand="block" color="danger" id="btn-cancelar">
                    <ion-icon name="close-circle" slot="start" style="margin-right: 8px;"></ion-icon>
                    Cancelar
                    </ion-button>
                </div>
                </form>
            </ion-content>
        `;

        const btnCancelar = this.querySelector('#btn-cancelar');
        btnCancelar.addEventListener('click', () => window.history.back());

        this.loadUsuario();

        const form = this.querySelector('#form-usuario');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = localStorage.getItem('edit_usuario_id');
            if (!id) {
                toast('Erro: Usuário não identificado');
                return;
            }

            const formData = new FormData(form);
            const data = {
                nome: formData.get('nome'),
                usuario: formData.get('usuario'),
                senha: formData.get('senha'),
                perfil: parseInt(formData.get('perfil'))
            };

            const loading = document.createElement('ion-loading');
            loading.message = 'Atualizando usuário...';
            loading.duration = 2000;
            document.body.appendChild(loading);
            await loading.present();

            try {
                await api.patch(`/usuario/${id}`, data);
                toast('Usuário atualizado com sucesso!', 'success');
                document.querySelector('ion-router').push('/usuario/list', 'forward');
            } catch (error) {
                toast(error.message || 'Erro ao atualizar usuário');
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

    async loadUsuario() {
        const id = localStorage.getItem('edit_usuario_id');
        if (!id) return;

        try {
            const usuario = await api.get(`/usuario/${id}`);
            const form = this.querySelector('#form-usuario');
            
            form.querySelector('[name="nome"]').value = usuario.nome;
            form.querySelector('[name="usuario"]').value = usuario.usuario;
            form.querySelector('[name="senha"]').value = usuario.senha;
            form.querySelector('[name="perfil"]').value = usuario.perfil.toString();
        } catch (error) {
            console.error('Erro ao carregar usuário:', error);
        }
    }
}

customElements.define('edit-usuario-page', EditUsuarioPage);