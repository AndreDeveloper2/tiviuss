// Script de teste para os webhooks
// Execute com: node test-webhooks.js

const BASE_URL = "http://localhost:3000";

async function testWebhook(url, data) {
  try {
    console.log(`\n🧪 Testando: ${url}`);
    console.log("📤 Dados enviados:", JSON.stringify(data, null, 2));

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("✅ Status:", response.status);
    console.log("📥 Resposta:", JSON.stringify(result, null, 2));

    return result;
  } catch (error) {
    console.error("❌ Erro:", error.message);
    return null;
  }
}

async function runTests() {
  console.log("🚀 Iniciando testes dos webhooks...\n");

  const testData = {
    message: "pix",
    customer: {
      phone: "5511999999999",
      name: "Cliente Teste",
    },
    type: "text",
    timestamp: new Date().toISOString(),
  };

  // Teste 1: Webhook Waseller (detecta "pix")
  console.log("=".repeat(50));
  console.log("📱 TESTE 1: Webhook Waseller (detecta 'pix')");
  console.log("=".repeat(50));
  await testWebhook(`${BASE_URL}/api/webhook/waseller`, testData);

  // Teste 2: Webhook Z-API (gera PIX)
  console.log("\n" + "=".repeat(50));
  console.log("🤖 TESTE 2: Webhook Z-API (gera PIX)");
  console.log("=".repeat(50));
  await testWebhook(`${BASE_URL}/api/webhook/zapi`, testData);

  // Teste 3: Fluxo Completo (Waseller → Z-API)
  console.log("\n" + "=".repeat(50));
  console.log("💳 TESTE 3: Fluxo Completo (Waseller → Z-API)");
  console.log("=".repeat(50));

  console.log("📤 Enviando 'pix' para Waseller...");
  const wasellerResult = await testWebhook(
    `${BASE_URL}/api/webhook/waseller`,
    testData
  );

  if (wasellerResult && wasellerResult.success) {
    console.log("✅ Waseller processou com sucesso e deve ter acionado Z-API");
  }

  console.log("\n" + "=".repeat(50));
  console.log("✅ Testes concluídos!");
  console.log("=".repeat(50));
  console.log(
    "\n💡 Dica: Acesse http://localhost:3000/teste-webhook para interface visual"
  );
  console.log("🔍 Verifique os logs do servidor para ver o fluxo completo");
}

// Executar testes se o script for chamado diretamente
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testWebhook, runTests };
