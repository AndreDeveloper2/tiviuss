# 🚀 Sistema de Webhooks - Tivius

Este sistema implementa a integração entre **Waseller** e **Z-API** para automatizar a geração de PIX quando detectada a palavra-chave.

## 📋 Funcionalidades

- **Webhook Waseller**: Detecta a palavra "pix" e aciona o Z-API
- **Webhook Z-API**: Gera PIX fictício e envia via WhatsApp
- **Fluxo Automatizado**: Cliente digita "pix" → Waseller detecta → Z-API gera PIX
- **Página de Teste**: Interface para testar webhooks e fluxos

## 🏗️ Arquitetura

```
Cliente WhatsApp → Waseller (gerencia respostas) → Webhook Waseller (detecta "pix") → Z-API gera PIX
```

## 📁 Estrutura dos Arquivos

```
src/app/api/webhook/
├── waseller/
│   └── route.ts          # Webhook do Waseller (detecta "pix")
└── zapi/
    └── route.ts          # Webhook do Z-API (gera PIX)

src/app/teste-webhook/
└── page.tsx              # Página de teste

config.example.ts          # Configurações de exemplo
```

## 🚀 Como Usar

### 1. Configuração dos Webhooks

#### Waseller

- URL: `https://tiviuss.vercel.app/api/webhook/waseller`
- Método: POST
- Formato: JSON
- **Função**: Detecta palavra "pix" e aciona Z-API

#### Z-API

- URL: `https://tiviuss.vercel.app/api/webhook/zapi`
- Método: POST
- Formato: JSON
- **Função**: Gera PIX e envia via WhatsApp

### 2. Testando o Sistema

1. Acesse: `https://tiviuss.vercel.app/teste-webhook`
2. Use o **Teste Individual** para testar webhooks específicos
3. Use o **Teste de Fluxo** para simular o fluxo completo de PIX

### 3. Mensagens de Teste

- `"pix"` → Aciona geração de PIX via Z-API

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local` com:

```bash
ZAPI_INSTANCE_URL=https://api.z-api.io/instances/3E5B6CA5E4C6D09F694EAEF0CD5229F7/token/5EB75083B0368AAAC6083A84
ZAPI_TOKEN=5EB75083B0368AAAC6083A84
MERCADOPAGO_ACCESS_TOKEN=your_token
MERCADOPAGO_PUBLIC_KEY=your_key
```

### Dados de Teste

- **Instância Z-API**: `3E5B6CA5E4C6D09F694EAEF0CD5229F7`
- **Token**: `5EB75083B0368AAAC6083A84`
- **URL Base**: `https://api.z-api.io/instances/`

## 📱 Fluxo de Funcionamento

### 1. Cliente Configura Bot no Waseller

```
Waseller: Configura fluxo de conversa e respostas
```

### 2. Cliente Solicita PIX

```
Cliente: "pix"
Waseller: Processa resposta (configurada na plataforma)
Webhook Waseller: Detecta "pix" → Aciona Z-API
```

### 3. Z-API Gera PIX

```
Z-API: Gera PIX fictício e envia para cliente
Cliente: Recebe código PIX para pagamento
```

## 🧪 Testando

### Teste Individual

1. Selecione o tipo de webhook (Waseller ou Z-API)
2. Digite uma mensagem de teste
3. Clique em "Testar Webhook"
4. Veja a resposta no painel de resultados

### Teste de Fluxo

1. Clique em "Testar Fluxo PIX"
2. O sistema testa automaticamente:
   - Webhook Waseller com mensagem "pix"
   - Webhook Z-API com mensagem "pix"
3. Veja os resultados de ambos os webhooks

## 📊 Logs e Monitoramento

- **Console do Servidor**: Logs detalhados de todas as requisições
- **Respostas dos Webhooks**: JSON com status e dados
- **Timestamps**: Todas as operações são registradas com data/hora

## 🔒 Segurança

- Validação de entrada em todos os webhooks
- Tratamento de erros com respostas apropriadas
- Logs para auditoria e debugging
- Rate limiting recomendado para produção

## 🚧 Próximos Passos

1. **Integração Real com Mercado Pago**

   - Substituir PIX fictício por PIX real
   - Implementar webhook de confirmação de pagamento

2. **Melhorias no Sistema**

   - Mais palavras-chave para diferentes ações
   - Integração com banco de dados
   - Sistema de logs mais detalhado

3. **Monitoramento**
   - Dashboard de métricas
   - Alertas de erro
   - Relatórios de uso

## 📞 Suporte

Para dúvidas ou problemas:

- Verifique os logs do servidor
- Teste os webhooks individualmente
- Use a página de teste para debugging
- Consulte a documentação da API Z-API

---

**Desenvolvido para Tivius** 🚀
