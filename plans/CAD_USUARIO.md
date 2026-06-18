# Plano de Implementação: Integração de Cadastro de Usuários

## Visão Geral
Implementar a conexão entre a página de cadastro de usuários no Ionic (frontend) e o endpoint de criação de usuários no NestJS (backend), substituindo a interface puramente visual por uma funcional.

## Etapas de Implementação

### 1. Documentação
- Salvar este plano em `plans/CAD_USUARIO.md` antes de iniciar as alterações.

### 2. Modificações no Frontend (`frontend/src/pages/usuario/CadUsuarioPage.js`)
- **Importações**: Adicionar `import { api } from '../../shared/api.js'`.
- **Lógica de Submissão**:
    - Adicionar listener de `submit` ao formulário `#form-usuario`.
    - Capturar dados via `FormData` (`nome`, `usuario`, `senha`, `perfil`).
    - Converter `perfil` para `number`.
    - Chamar `api.post('/usuario', data)`.
- **Interface e UX**:
    - Implementar `ion-loading` durante a requisição.
    *   Implementar função `toast(mensagem, color)` para feedbacks de sucesso/erro.
    *   Redirecionar para `/usuario/list` após sucesso usando `ion-router`.
- **Correções**:
    - Corrigir `windows.history.back()` para `window.history.back()`.
    - Remover referência a `#logout-btn`.

### 3. Validação de Backend
- Garantir que o `CreateUsuarioDto` no backend seja compatível com os campos enviados.

## Critérios de Aceite
- Usuário cadastrado com sucesso no banco de dados.
- Feedback visual (Loading e Toast) funcionando.
- Redirecionamento automático para a lista de usuários após cadastro.
