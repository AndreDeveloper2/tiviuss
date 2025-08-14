// Configurações de exemplo para o sistema de webhooks
export const config = {
  // Configurações do Z-API
  zapi: {
    instanceUrl:
      "https://api.z-api.io/instances/3E5B6CA5E4C6D09F694EAEF0CD5229F7/token/5EB75083B0368AAAC6083A84",
    token: "5EB75083B0368AAAC6083A84",
    webhookUrl: "https://tiviuss.vercel.app/api/webhook/zapi",
  },

  // Configurações do Waseller
  waseller: {
    webhookUrl: "https://tiviuss.vercel.app/api/webhook/waseller",
  },

  // Configurações do Mercado Pago (para PIX real)
  mercadopago: {
    accessToken: "your_mercadopago_access_token",
    publicKey: "your_mercadopago_public_key",
  },
};

// Para usar em produção, crie um arquivo .env.local com estas variáveis:
/*
ZAPI_INSTANCE_URL=https://api.z-api.io/instances/3E5B6CA5E4C6D09F694EAEF0CD5229F7/token/5EB75083B0368AAAC6083A84
ZAPI_TOKEN=5EB75083B0368AAAC6083A84
MERCADOPAGO_ACCESS_TOKEN=your_mercadopago_access_token
MERCADOPAGO_PUBLIC_KEY=your_mercadopago_public_key
*/
