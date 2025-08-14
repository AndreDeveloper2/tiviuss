"use client";

import { useState } from "react";

export default function TesteWebhook() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [testType, setTestType] = useState<"waseller" | "zapi">("waseller");

  const testWebhook = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setResponse("");

    try {
      const webhookUrl =
        testType === "waseller" ? "/api/webhook/waseller" : "/api/webhook/zapi";

      const testData = {
        message: message,
        customer: {
          phone: "5511999999999",
          name: "Cliente Teste",
        },
        type: "text",
        timestamp: new Date().toISOString(),
      };

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      });

      const data = await response.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (error) {
      setResponse(
        `Erro: ${error instanceof Error ? error.message : "Erro desconhecido"}`
      );
    } finally {
      setLoading(false);
    }
  };

  const testPixFlow = async () => {
    setLoading(true);
    setResponse("");

    try {
      // Primeiro, testar o webhook do Waseller com "pix"
      const wasellerResponse = await fetch("/api/webhook/waseller", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "pix",
          customer: {
            phone: "5511999999999",
            name: "Cliente Teste",
          },
          type: "text",
          timestamp: new Date().toISOString(),
        }),
      });

      const wasellerData = await wasellerResponse.json();

      // Depois, testar o webhook do Z-API
      const zapiResponse = await fetch("/api/webhook/zapi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "pix",
          customer: {
            phone: "5511999999999",
            name: "Cliente Teste",
          },
          type: "text",
          timestamp: new Date().toISOString(),
        }),
      });

      const zapiData = await zapiResponse.json();

      setResponse(`🔄 **FLUXO COMPLETO TESTADO**

📱 **Resposta do Waseller:**
${JSON.stringify(wasellerData, null, 2)}

🤖 **Resposta do Z-API:**
${JSON.stringify(zapiData, null, 2)}

✅ Fluxo testado com sucesso!`);
    } catch (error) {
      setResponse(
        `Erro no fluxo: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            🧪 Teste de Webhooks - Tivius
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Teste Individual */}
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-800 mb-4">
                🔍 Teste Individual
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Webhook:
                </label>
                <select
                  value={testType}
                  onChange={(e) =>
                    setTestType(e.target.value as "waseller" | "zapi")
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="waseller">Waseller</option>
                  <option value="zapi">Z-API</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensagem de Teste:
                </label>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Digite uma mensagem para testar..."
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <button
                onClick={testWebhook}
                disabled={loading || !message.trim()}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Testando..." : "Testar Webhook"}
              </button>
            </div>

            {/* Teste de Fluxo */}
            <div className="bg-green-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-green-800 mb-4">
                🔄 Teste de Fluxo Completo
              </h2>

              <p className="text-sm text-gray-600 mb-4">
                Testa o fluxo completo: cliente solicita PIX → Waseller detecta
                → Z-API gera PIX
              </p>

              <button
                onClick={testPixFlow}
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Testando Fluxo..." : "Testar Fluxo PIX"}
              </button>
            </div>
          </div>

          {/* Resultado */}
          {response && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                📋 Resultado do Teste:
              </h3>
              <pre className="bg-white p-4 rounded-md border overflow-x-auto text-sm">
                {response}
              </pre>
            </div>
          )}

          {/* Instruções */}
          <div className="mt-8 bg-yellow-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-800 mb-4">
              📚 Como Usar:
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                • <strong>Teste Individual:</strong> Testa um webhook específico
                com uma mensagem personalizada
              </p>
              <p>
                • <strong>Teste de Fluxo:</strong> Simula o fluxo completo de
                solicitação de PIX
              </p>
              <p>
                • <strong>Mensagens de Teste:</strong> &apos;pix&apos; (para
                acionar Z-API)
              </p>
              <p>
                • <strong>Logs:</strong> Verifique o console do servidor para
                logs detalhados
              </p>
            </div>
          </div>

          {/* Status dos Webhooks */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border text-center">
              <h4 className="font-semibold text-gray-800">Waseller</h4>
              <p className="text-sm text-gray-600">/api/webhook/waseller</p>
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ✅ Ativo
                </span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border text-center">
              <h4 className="font-semibold text-gray-800">Z-API</h4>
              <p className="text-sm text-gray-600">/api/webhook/zapi</p>
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ✅ Ativo
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
