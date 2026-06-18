import './ListUsuarioPage.css'
import { createHeader } from '../../shared/Header.js'
import { createFooter } from '../../shared/Footer.js'
import { logout } from '../../shared/util.js'; 
import { api } from '../../shared/api.js'

const pageName = 'Usuário';

class ListUsuarioPage extends HTMLElement {
    connectedCallback() {
        this.classList.add('ion-page');
        const cabecalho = createHeader(pageName);
        this.innerHTML = `
            ${cabecalho}
            <ion-content>
                <div class="ion-padding">
                    <ion-button expand="block" id="btn-add-usuario">
                        <ion-icon slot="start" name="add"></ion-icon>
                        Novo Usuário
                    </ion-button>
                </div>
                <div class="list-usuario"></div>
            </ion-content>
            ${createFooter()}
        `;
        
        this.querySelector('#btn-add-usuario').addEventListener('click', () => {
            document.querySelector('ion-router').push('/usuario/create', 'forward');
        });

        this.querySelector('#btn-back-footer').addEventListener('click', () => {
            document.querySelector('ion-router').push('/home', 'root');
        });

        this.loadUsuarios();
        // Atualização automática a cada 1 segundo
        this.refreshInterval = setInterval(() => this.loadUsuarios(), 1000);
    }

    disconnectedCallback() {
        clearInterval(this.refreshInterval);
    }

    async loadUsuarios() {
        try {
            const usuarios = await api.get('/usuario');
            // Organiza por nome em ordem alfabética
            usuarios.sort((a, b) => a.nome.localeCompare(b.nome));
            this.renderUsuarios(usuarios);
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
        }
    }

    renderUsuarios(usuarios) {
        const container = this.querySelector(".list-usuario");

        if (usuarios.length === 0) {
            container.innerHTML = '<p> Nenhum usuario encontrado </p>'
            return;
        }
        
        const usuarioItems = usuarios.map(usuario => `
            <ion-item>
                <ion-label>
                <h2 style="display: flex; align-items: center; gap: 8px;">
                    <ion-icon
                    name="${usuario.perfil == 0 ? 'restaurant' : 'person'}"
                    color="${usuario.perfil == 0 ? 'primary' : 'secondary'}"
                    style="flex-shrink: 0;"
                    ></ion-icon>
                    <span>${usuario.nome}</span>
                </h2>
                <p>${usuario.usuario}</p>
                </ion-label>

                <ion-buttons slot="end">
                <ion-button fill="clear" class="btn-edit" data-id="${usuario.id}">
                    <ion-icon slot="icon-only" name="create-outline"></ion-icon>
                </ion-button>
                <ion-button fill="clear" color="danger" class="btn-delete" data-id="${usuario.id}">
                    <ion-icon slot="icon-only" name="trash-outline"></ion-icon>
                </ion-button>
                </ion-buttons>
            </ion-item>
            `).join('');
    
        container.innerHTML = `<ion-list>${usuarioItems}</ion-list>`;

        // Eventos de Edição
        this.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                localStorage.setItem('edit_usuario_id', btn.dataset.id);
                document.querySelector('ion-router').push('/usuario/edit', 'forward');
            });
        });

        // Eventos de Exclusão
        this.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.id;
                if (confirm('Deseja realmente excluir este usuário?')) {
                    try {
                        await api.delete(`/usuario/${id}`);
                        this.loadUsuarios();
                    } catch (error) {
                        alert('Erro ao excluir usuário');
                    }
                }
            });
        });
    }
}

customElements.define('list-usuario-page', ListUsuarioPage);