# Next.js SaaS + RBAC

Este projeto contém todos os boilerplate necessários para configurar um SaaS multilocatário com Next.js incluindo autenticação e autorização RBAC.

## Características

### Autenticação

- [ ] Ele deve ser capaz de autenticar usando e-mail & senha;
- [ ] Ele deve ser capaz de autenticar usando a conta do Github;
- [ ] Ele deve ser capaz de recuperar senha usando e-mail;
- [ ] Deve ser capaz de criar uma conta (e-mail, nome e senha);

### Organizações

- [ ] Deve ser capaz de criar uma nova organização;
- [ ] Ele deve ser capaz de obter organizações às quais o usuário pertence;
- [ ] Ele deve ser capaz de atualizar uma organização;
- [ ] Ele deve ser capaz de encerrar uma organização;
- [ ] Deve ser capaz de transferir a propriedade da organização;

### Convida

- [ ] Ele deve ser capaz de convidar um novo membro (e-mail, função);
- [ ] Deve poder aceitar um convite;
- [ ] Deve poder revogar um convite pendente;

### Membros

- [ ] Deve ser capaz de obter membros da organização;
- [ ] Ele deve ser capaz de atualizar uma função de membro;

### Projetos

- [ ] Ele deve ser capaz de obter projetos dentro de uma organização;
- [ ] Ele deve ser capaz de criar um novo projeto (nome, url, descrição);
- [ ] Ele deve ser capaz de atualizar um projeto (nome, url, descrição);
- [ ] Ele deve ser capaz de excluir um projeto;

### Faturamento

- [ ] Ele deve ser capaz de obter detalhes de faturamento para a organização (US $ 20 por projeto / US $ 10 por membro, excluindo a função de faturamento);

## RBAC

Funções & permissões.

### Papéis

- Proprietário (contar como administrador)
- Administrador
- Membro
- Faturamento (um por organização)
- Anônimo

### Tabela de permissões

|                                  | Administrador | Membro | Faturamento | Anônimo |
| -------------------------------- | ------------- | ------ | ----------- | ------- |
| Atualizar organização            | ✅            | ❌     | ❌          | ❌      |
| Excluir organização              | ✅            | ❌     | ❌          | ❌      |
| Convide um membro                | ✅            | ❌     | ❌          | ❌      |
| Revogar um convite               | ✅            | ❌     | ❌          | ❌      |
| Lista de membros                 | ✅            | ✅     | ✅          | ❌      |
| Transferência de propriedade     | ⚠️            | ❌     | ❌          | ❌      |
| Atualizar função de membro       | ✅            | ❌     | ❌          | ❌      |
| Excluir membro                   | ✅            | ⚠️     | ❌          | ❌      |
| Listar projetos                  | ✅            | ✅     | ✅          | ❌      |
| Criar um novo projeto            | ✅            | ✅     | ❌          | ❌      |
| Atualizar um projeto             | ✅            | ⚠️     | ❌          | ❌      |
| Excluir um projeto               | ✅            | ⚠️     | ❌          | ❌      |
| Obter detalhes de faturamento    | ✅            | ❌     | ✅          | ❌      |
| Exportar detalhes de faturamento | ✅            | ❌     | ✅          | ❌      |

✅ > = permitido
❌ > = não permitido
⚠️ > = permitido c/ condições

#### Condições

- Somente os proprietários podem transferir a propriedade da organização;
- Somente administradores e autores do projeto podem atualizar/excluir o projeto;
- Os membros podem deixar sua própria organização;
