import { NextRequest, NextResponse } from "next/server";

interface PixPaymentResponse {
  id: number;
  status: string;
  transaction_amount: number;
  description: string;
  payment_method_id: string;
  payer: {
    email: string;
  };
  point_of_interaction: {
    transaction_data: {
      qr_code_base64: string;
      qr_code: string;
      ticket_url: string;
    };
  };
  date_created: string;
  date_of_expiration: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Webhook Z-API recebido:", body);

    // Extrair informações da mensagem de múltiplas fontes (compatível com Z-API)
    const rawMessage: string =
      (typeof body?.message === "string" ? body.message : "") ||
      (body?.text?.message ?? "") ||
      (body?.listResponseMessage?.title ?? "") ||
      (body?.buttonResponseMessage?.title ?? "");

    const normalizedText = (rawMessage || "").toLowerCase();

    // Extrair número do telefone do payload do Z-API ou do formato legado
    const phoneFromPayload: string | undefined =
      body?.phone || body?.customer?.phone;

    // Se a mensagem contiver "pix" de qualquer uma das origens acima, gerar PIX
    if (normalizedText.includes("pix")) {
      try {
        const pixPayment = await createMercadoPagoPix();
        await sendPixViaZApi(phoneFromPayload || "5511999999999", pixPayment);

        return NextResponse.json({
          success: true,
          message: "PIX gerado via Mercado Pago e enviado com sucesso",
          pixData: {
            id: pixPayment.id,
            amount: pixPayment.transaction_amount,
            status: pixPayment.status,
            qr_code: pixPayment.point_of_interaction.transaction_data.qr_code,
          },
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Erro ao gerar PIX no Mercado Pago:", error);
        return NextResponse.json(
          {
            success: false,
            error: "Erro ao gerar PIX",
            timestamp: new Date().toISOString(),
          },
          { status: 500 }
        );
      }
    }

    // Compatibilidade com o formato legado usado nos testes locais
    const { message, customer, type } = body;
    if (type === "text" && typeof message === "string") {
      const msg = message.toLowerCase();
      if (msg.includes("pix")) {
        try {
          const pixPayment = await createMercadoPagoPix();
          await sendPixViaZApi(
            customer?.phone || phoneFromPayload || "5511999999999",
            pixPayment
          );

          return NextResponse.json({
            success: true,
            message: "PIX gerado via Mercado Pago e enviado com sucesso",
            pixData: {
              id: pixPayment.id,
              amount: pixPayment.transaction_amount,
              status: pixPayment.status,
              qr_code: pixPayment.point_of_interaction.transaction_data.qr_code,
            },
            timestamp: new Date().toISOString(),
          });
        } catch (error) {
          console.error("Erro ao gerar PIX no Mercado Pago:", error);
          return NextResponse.json(
            {
              success: false,
              error: "Erro ao gerar PIX",
              timestamp: new Date().toISOString(),
            },
            { status: 500 }
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Webhook Z-API recebido com sucesso (sem ação)",
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

// Função para criar PIX no Mercado Pago
async function createMercadoPagoPix(): Promise<PixPaymentResponse> {
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error("Token de acesso do Mercado Pago não configurado");
  }

  const amount = Math.floor(Math.random() * 1000) + 50; // Valor entre R$ 50 e R$ 1050
  const transactionId = `TIV${Date.now()}`;

  const paymentData = {
    transaction_amount: amount,
    description: `Pagamento Tivius - ${new Date().toLocaleDateString("pt-BR")}`,
    payment_method_id: "pix",
    external_reference: transactionId,
    notification_url: "https://tiviuss.vercel.app/api/webhook/mercadopago",
    payer: {
      email: "cliente@tivius.com",
      first_name: "Cliente",
      last_name: "Tivius",
    },
    date_of_expiration: new Date(
      Date.now() + 24 * 60 * 60 * 1000
    ).toISOString(), // Expira em 24h
  };

  console.log("📤 Criando PIX no Mercado Pago:", paymentData);

  const response = await fetch("https://api.mercadopago.com/v1/payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-Idempotency-Key": transactionId, // Evita duplicação de pagamentos
    },
    body: JSON.stringify(paymentData),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error(
      "❌ Erro na API do Mercado Pago:",
      response.status,
      errorData
    );
    throw new Error(`Erro na API do Mercado Pago: ${response.status}`);
  }

  const pixPayment: PixPaymentResponse = await response.json();
  console.log("✅ PIX criado no Mercado Pago:", pixPayment);

  return pixPayment;
}

// Função para enviar PIX via Z-API com botão de copiar
async function sendPixViaZApi(phone: string, pixData: PixPaymentResponse) {
  try {
    const zapiUrl =
      "https://api.z-api.io/instances/3E5B6CA5E4C6D09F694EAEF0CD5229F7/token/5EB75083B0368AAAC6083A84/send-button-list";

    // Formatar número de telefone corretamente
    let formattedPhone = phone;
    if (phone) {
      formattedPhone = phone.replace(/\D/g, "");
      if (!formattedPhone.startsWith("55")) {
        formattedPhone = `55${formattedPhone}`;
      }
    } else {
      formattedPhone = "5511999999999";
    }

    console.log("📱 Enviando PIX para:", formattedPhone);

    const message = `🟢 **PIX GERADO COM SUCESSO!**

💰 **Valor:** R$ ${pixData.transaction_amount.toFixed(2)}
📝 **Descrição:** ${pixData.description}
🆔 **ID do Pagamento:** ${pixData.id}
⏰ **Expira em:** ${new Date(pixData.date_of_expiration).toLocaleString(
      "pt-BR"
    )}

💡 **Como pagar:**
1. Clique em "📋 Copiar PIX" abaixo
2. Abra seu app bancário
3. Escolha "PIX" → "Copia e Cola"
4. Cole o código e confirme

✅ Após o pagamento, você receberá confirmação automática.`;

    // Dados para enviar mensagem com botões
    const requestBody = {
      phone: formattedPhone,
      message: message,
      buttonList: {
        buttons: [
          {
            id: "copy_pix",
            title: "📋 Copiar PIX",
          },
          {
            id: "check_status",
            title: "🔍 Verificar Status",
          },
          {
            id: "help",
            title: "❓ Ajuda",
          },
        ],
      },
    };

    console.log("📤 Enviando mensagem com botões para Z-API");

    const headers = {
      "Content-Type": "application/json",
      "Client-Token":
        process.env.ZAPI_CLIENT_TOKEN || "F519caa90c16e4e738d4f596c9222d2cbS",
    };

    const response = await fetch(zapiUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(requestBody),
    });

    console.log("📥 Status da resposta Z-API:", response.status);

    if (response.ok) {
      const responseData = await response.json();
      console.log("✅ Mensagem com botões enviada via Z-API:", responseData);

      // Enviar o código PIX separadamente para facilitar a cópia
      await sendPixCodeMessage(
        formattedPhone,
        pixData.point_of_interaction.transaction_data.qr_code
      );
    } else {
      const errorText = await response.text();
      console.error("❌ Erro ao enviar via Z-API:", response.status, errorText);
    }
  } catch (error) {
    console.error("❌ Erro ao enviar PIX via Z-API:", error);
  }
}

// Função para enviar o código PIX separadamente
async function sendPixCodeMessage(phone: string, pixCode: string) {
  try {
    const zapiUrl =
      "https://api.z-api.io/instances/3E5B6CA5E4C6D09F694EAEF0CD5229F7/token/5EB75083B0368AAAC6083A84/send-text";

    const message = `📋 **CÓDIGO PIX (TOQUE E SEGURE PARA COPIAR)**

\`\`\`${pixCode}\`\`\`

💡 **Dica:** Toque e segure no código acima para copiá-lo rapidamente!

🔄 Digite "status" para verificar o pagamento
❓ Digite "ajuda" se precisar de suporte`;

    const requestBody = {
      phone: phone,
      message: message,
    };

    const headers = {
      "Content-Type": "application/json",
      "Client-Token":
        process.env.ZAPI_CLIENT_TOKEN || "F519caa90c16e4e738d4f596c9222d2cbS",
    };

    const response = await fetch(zapiUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(requestBody),
    });

    if (response.ok) {
      console.log("✅ Código PIX enviado separadamente");
    } else {
      console.error("❌ Erro ao enviar código PIX");
    }
  } catch (error) {
    console.error("❌ Erro ao enviar código PIX:", error);
  }
}
