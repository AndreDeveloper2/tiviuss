import { NextRequest, NextResponse } from "next/server";

// Interface para os dados do PIX
interface PixData {
  pixKey: string;
  amount: string;
  description: string;
  pixCode: string;
  expiresAt: string;
  customerName: string;
  transactionId: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Webhook Z-API recebido:", body);

    // Extrair informações da mensagem
    const { message, customer, type } = body;

    // Verificar se é uma mensagem de texto
    if (type === "text" && message) {
      const messageText = message.toLowerCase();

      // Se a mensagem contém "pix", gerar PIX fictício
      if (messageText.includes("pix")) {
        // Gerar dados fictícios do PIX
        const pixData = generateFakePix();

        // Enviar PIX via Z-API para o cliente
        await sendPixViaZApi(customer?.phone, pixData);

        return NextResponse.json({
          success: true,
          message: "PIX gerado e enviado com sucesso",
          pixData: pixData,
          timestamp: new Date().toISOString(),
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Webhook Z-API recebido com sucesso",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Erro no webhook Z-API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno do servidor",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Webhook Z-API ativo",
    status: "online",
    timestamp: new Date().toISOString(),
  });
}

// Função para gerar PIX fictício
function generateFakePix(): PixData {
  const now = new Date();
  const amount = Math.floor(Math.random() * 1000) + 50; // Valor entre R$ 50 e R$ 1050

  return {
    pixKey: "tivius@email.com",
    amount: amount.toFixed(2),
    description: `Pagamento Tivius - ${now.toLocaleDateString("pt-BR")}`,
    pixCode: generatePixCode(),
    expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(), // Expira em 24h
    customerName: "Cliente Tivius",
    transactionId: `TIV${Date.now()}`,
  };
}

// Função para gerar código PIX fictício
function generatePixCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Função para enviar PIX via Z-API
async function sendPixViaZApi(phone: string, pixData: PixData) {
  try {
    const zapiUrl =
      "https://api.z-api.io/instances/3E5B6CA5E4C6D09F694EAEF0CD5229F7/token/5EB75083B0368AAAC6083A84/send-text";

    // Formatar número de telefone corretamente (apenas números, sem formatação)
    let formattedPhone = phone;
    if (phone) {
      // Remove todos os caracteres não numéricos
      formattedPhone = phone.replace(/\D/g, "");

      // Se não começar com 55, adiciona
      if (!formattedPhone.startsWith("55")) {
        formattedPhone = `55${formattedPhone}`;
      }
    } else {
      formattedPhone = "5511999999999"; // Número padrão para teste
    }

    console.log("📱 Enviando PIX para:", formattedPhone);
    console.log("🔗 URL Z-API:", zapiUrl);

    const message = `🟢 **PIX GERADO COM SUCESSO!**

💰 **Valor:** R$ ${pixData.amount}
📝 **Descrição:** ${pixData.description}
🆔 **ID da Transação:** ${pixData.transactionId}
⏰ **Expira em:** ${new Date(pixData.expiresAt).toLocaleString("pt-BR")}

📋 **Código PIX (Copie e Cole):**
\`\`\`
${pixData.pixCode}
\`\`\`

💡 **Como pagar:**
1. Abra seu app bancário
2. Escolha "PIX"
3. Cole o código acima
4. Confirme o pagamento

✅ Após o pagamento, você receberá uma confirmação automática.

Dúvidas? Digite "atendente" para falar conosco.`;

    const requestBody = {
      phone: formattedPhone,
      message: message,
    };

    console.log(
      "📤 Dados enviados para Z-API:",
      JSON.stringify(requestBody, null, 2)
    );

    // Headers baseados na documentação oficial
    const headers = {
      "Content-Type": "application/json",
      // Client-Token é obrigatório conforme erro da API
      "Client-Token":
        process.env.ZAPI_CLIENT_TOKEN || "5EB75083B0368AAAC6083A84",
    };

    const response = await fetch(zapiUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(requestBody),
    });

    console.log("📥 Status da resposta Z-API:", response.status);
    console.log(
      "📥 Headers da resposta:",
      Object.fromEntries(response.headers.entries())
    );

    if (response.ok) {
      const responseData = await response.json();
      console.log("✅ PIX enviado via Z-API com sucesso:", responseData);

      // Verificar se a resposta contém os campos esperados
      if (responseData.zaapId || responseData.messageId || responseData.id) {
        console.log("✅ Resposta válida do Z-API:", {
          zaapId: responseData.zaapId,
          messageId: responseData.messageId,
          id: responseData.id,
        });
      } else {
        console.warn("⚠️ Resposta inesperada do Z-API:", responseData);
      }
    } else {
      const errorText = await response.text();
      console.error(
        "❌ Erro ao enviar PIX via Z-API:",
        response.status,
        response.statusText
      );
      console.error("❌ Resposta de erro:", errorText);

      // Tratamento específico de erros baseado na documentação
      if (response.status === 405) {
        console.error(
          "❌ Erro 405: Verifique se está usando o método POST corretamente"
        );
      } else if (response.status === 415) {
        console.error("❌ Erro 415: Verifique se o Content-Type está correto");
      }
    }
  } catch (error) {
    console.error("❌ Erro ao enviar PIX via Z-API:", error);
  }
}
