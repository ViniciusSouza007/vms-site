# Briefing — integrar os leads do site ao Portal VMS (Prospecção)

> Para quem desenvolve o Portal. Objetivo: todo diagnóstico concluído no site
> institucional vira automaticamente um prospect no módulo **Prospecção**,
> com as respostas anexadas — sem depender de a pessoa enviar WhatsApp.

## Contexto

- **Site:** estático (HTML/CSS/JS), hospedado na Vercel. Hoje em `vms-site-one.vercel.app`, irá para `vmsconsultoria.com`.
- **Portal:** `portal.vmsconsultoria.com` (app próprio, Vercel + Supabase).
- **Hoje:** o site monta uma mensagem de WhatsApp/e-mail pré-preenchida. Se o usuário
  não enviar, o lead se perde e não há registro nenhum.

## O que precisa ser criado no Portal

Um endpoint HTTP que **recebe um lead e cria um prospect** em Prospecção.

```
POST https://portal.vmsconsultoria.com/api/leads
Content-Type: application/json
```

### Corpo enviado pelo site (JSON)

```json
{
  "origem": "site",
  "pagina": "https://vmsconsultoria.com/",
  "tipo": "fiscal",
  "nome": "Maria Souza",
  "telefone": "11999999999",
  "email": "maria@construtora.com.br",
  "resultado": "Alto potencial — vale uma análise com prioridade.",
  "servicos_interesse": ["Gestão fiscal (ISS/INSS)", "Isenção de ISS"],
  "respostas": [
    { "pergunta": "Qual o tipo da sua obra?", "resposta": "Residencial (MCMV/HIS)" },
    { "pergunta": "Em que fase a obra está?", "resposta": "Em execução" },
    { "pergunta": "Quem cuida do ISS/INSS da obra hoje?", "resposta": "Ninguém definido" },
    { "pergunta": "Já teve pendência ou passivo em fiscalização?", "resposta": "Sim" }
  ],
  "enviado_em": "2026-11-10T22:40:00.000Z",
  "hp": ""
}
```

Campos:

| Campo | Tipo | Observação |
|---|---|---|
| `origem` | string | sempre `"site"` |
| `pagina` | string | URL de onde o lead saiu |
| `tipo` | string | `"fiscal"` ou `"engenharia"` |
| `nome` | string | obrigatório |
| `telefone` | string | WhatsApp/telefone com DDD — **obrigatório** (validado no site) |
| `email` | string | e-mail — **obrigatório** (validado no site) |
| `resultado` | string | classificação do diagnóstico |
| `servicos_interesse` | array de string | seleção múltipla do último passo |
| `respostas` | array de objetos | pergunta + resposta, na ordem |
| `enviado_em` | string ISO | horário do envio |
| `hp` | string | **honeypot** — se vier preenchido, é bot: descartar silenciosamente |

### Resposta esperada

```json
{ "ok": true, "id": "<id do prospect criado>" }
```

Em erro, devolver status 4xx/5xx com `{ "ok": false, "erro": "..." }`.

## Comportamento no Portal

1. Validar campos obrigatórios (`nome`, `telefone`, `email`) e descartar se `hp` vier preenchido.
2. Criar registro em **Prospecção** com status inicial (ex.: `novo`) e origem `site — diagnóstico`.
3. Guardar `respostas` e `servicos_interesse` (JSON) no registro, para o comercial ver o contexto.
4. Se já existir prospect com o mesmo e-mail ou telefone, **não duplicar** — anexar como nova interação.
5. Notificar o comercial (e-mail para `mariana@vmsconsultoria.com` e/ou alerta no portal).

## Segurança (importante)

O site é estático e público: **qualquer chave colocada no JavaScript fica visível**.
Portanto a proteção precisa ser no servidor:

- **CORS**: aceitar apenas as origens `https://vmsconsultoria.com`, `https://www.vmsconsultoria.com`
  e o domínio atual da Vercel (`https://vms-site-one.vercel.app`). Rejeitar o resto.
- **Rate limit** por IP (ex.: 5 envios / 10 min).
- **Honeypot** (campo `hp`) já previsto no payload.
- **Limite de tamanho** do corpo (ex.: 8 KB) e validação de tipos.
- Não confiar em nada vindo do cliente: sanitizar antes de gravar/exibir.
- Sem dados sensíveis: o site envia apenas nome, telefone, e-mail e as respostas do diagnóstico.

## O que o site fará depois que o endpoint existir

1. Ao concluir o diagnóstico, enviar o JSON acima para o endpoint.
2. Mostrar confirmação ("recebemos seu diagnóstico") apenas se o envio retornar `ok`.
3. Manter o botão de WhatsApp como atalho para quem quiser falar na hora
   (o lead já terá sido registrado de qualquer forma).
4. Se o endpoint falhar, cair no fluxo atual (WhatsApp/e-mail) para não perder o contato.

## Pendências a confirmar com a VMS

- Nome/status inicial do prospect no funil.
- Quem deve ser notificado e por qual canal.
- Se o lead de engenharia e o de fiscal entram no mesmo funil ou separados.
