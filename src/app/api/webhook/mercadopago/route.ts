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

  const amount = 10.0; // Valor fixo para testes
  const transactionId = `TIV${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)}`;

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
  console.log("🔑 Idempotency Key:", transactionId);

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

    // Se for erro 400 e contiver idempotency, pode ser pagamento duplicado
    if (response.status === 400 && errorData.includes("idempotency")) {
      console.warn("⚠️ Possível pagamento duplicado detectado");
    }

    throw new Error(`Erro na API do Mercado Pago: ${response.status}`);
  }

  const pixPayment: PixPaymentResponse = await response.json();
  console.log("✅ PIX criado no Mercado Pago:", pixPayment);

  return pixPayment;
}

// Função para enviar PIX via Z-API com botão de copiar
async function sendPixViaZApi(phone: string, pixData: PixPaymentResponse) {
  try {
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

    // Primeira mensagem: Informações do PIX
    await sendPixInfoMessage(formattedPhone, pixData);

    // Segunda mensagem: Código PIX com botão de copiar
    await sendPixCodeWithButton(
      formattedPhone,
      pixData.point_of_interaction.transaction_data.qr_code
    );
  } catch (error) {
    console.error("❌ Erro ao enviar PIX via Z-API:", error);
    // Fallback: enviar mensagem simples
    await sendPixCodeMessage(
      phone,
      pixData.point_of_interaction.transaction_data.qr_code
    );
  }
}

// Função para enviar informações do PIX
async function sendPixInfoMessage(phone: string, pixData: PixPaymentResponse) {
  try {
    const zapiUrl =
      "https://api.z-api.io/instances/3E5B6CA5E4C6D09F694EAEF0CD5229F7/token/5EB75083B0368AAAC6083A84/send-text";

    const message = `🟢 **PIX GERADO COM SUCESSO!**

💰 **Valor:** R$ ${pixData.transaction_amount.toFixed(2)}
📝 **Descrição:** ${pixData.description}
🆔 **ID do Pagamento:** ${pixData.id}
⏰ **Expira em:** ${new Date(pixData.date_of_expiration).toLocaleString(
      "pt-BR"
    )}

💡 **Como pagar:**
1. Clique no botão "Copiar PIX" na próxima mensagem
2. Abra seu app bancário
3. Escolha PIX → Copia e Cola
4. Cole o código e confirme

✅ Você receberá confirmação quando o pagamento for aprovado!`;

    const requestBody = {
      phone: phone,
      message: message,
    };

    console.log("📤 Enviando informações do PIX");

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
      console.log("✅ Informações do PIX enviadas");
    } else {
      const errorText = await response.text();
      console.error(
        "❌ Erro ao enviar informações:",
        response.status,
        errorText
      );
    }
  } catch (error) {
    console.error("❌ Erro ao enviar informações do PIX:", error);
  }
}

// Função CORRIGIDA para enviar código PIX com botão de copiar
async function sendPixCodeWithButton(phone: string, pixCode: string) {
  try {
    const zapiUrl =
      "https://api.z-api.io/instances/3E5B6CA5E4C6D09F694EAEF0CD5229F7/token/5EB75083B0368AAAC6083A84/send-button-actions";

    const message = `📋 **CÓDIGO PIX COPIA E COLA**

Clique no botão abaixo para copiar automaticamente:`;

    // CORREÇÃO: Usar a URL correta do WhatsApp para copiar código
    const copyUrl = `https://www.whatsapp.com/otp/code/?otp_type=COPY_CODE&code=${encodeURIComponent(
      pixCode
    )}`;

    // CORREÇÃO: Estrutura correta do payload conforme documentação Z-API
    const requestBody = {
      phone: phone,
      message: message,
      buttonActions: [
        {
          type: "URL", // Tipo correto
          url: copyUrl, // URL para copiar
          label: "📋 Copiar PIX", // Texto do botão
          // Removido o campo 'phone' que não é necessário para tipo URL
        },
      ],
      // ADICIONADO: Campos opcionais que podem ajudar
      title: "PIX Copia e Cola", // Título opcional
      footer: "Toque no botão para copiar", // Rodapé opcional
    };

    console.log("📤 Enviando código PIX com botão de copiar");
    console.log("🔗 URL de cópia:", copyUrl);
    console.log("📋 Payload completo:", JSON.stringify(requestBody, null, 2));

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

    console.log("📥 Status da resposta Z-API (botão):", response.status);

    if (response.ok) {
      const responseData = await response.json();
      console.log("✅ Código PIX com botão enviado:", responseData);
    } else {
      const errorText = await response.text();
      console.error("❌ Erro ao enviar botão:", response.status, errorText);
      console.error("❌ Headers enviados:", headers);
      console.error("❌ Body enviado:", JSON.stringify(requestBody, null, 2));

      // Fallback: enviar código como texto simples
      console.log("🔄 Tentando fallback...");
      await sendPixCodeMessage(phone, pixCode);
    }
  } catch (error) {
    console.error("❌ Erro ao enviar código com botão:", error);
    // Fallback: enviar código como texto simples
    await sendPixCodeMessage(phone, pixCode);
  }
}

// Função para enviar o código PIX separadamente (fallback)
async function sendPixCodeMessage(phone: string, pixCode: string) {
  try {
    console.log("🔄 Enviando mensagem fallback (texto simples)");

    const zapiUrl =
      "https://api.z-api.io/instances/3E5B6CA5E4C6D09F694EAEF0CD5229F7/token/5EB75083B0368AAAC6083A84/send-text";

    const message = `🟢 **PIX GERADO COM SUCESSO!**

💰 **Valor:** R$ 10.00
📝 **Pagamento Tivius**

📋 **CÓDIGO PIX (COPIE ABAIXO):**

\`\`\`${pixCode}\`\`\`

💡 **Como pagar:**
1. Copie o código acima
2. Abra seu app bancário  
3. Escolha PIX → Copia e Cola
4. Cole e confirme

✅ Você receberá confirmação quando o pagamento for aprovado!

🔍 Digite "status" para verificar
❓ Digite "ajuda" para suporte`;

    const requestBody = {
      phone: phone,
      message: message,
    };

    console.log("📤 Enviando fallback para:", phone);

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

    console.log("📥 Status fallback Z-API:", response.status);

    if (response.ok) {
      const responseData = await response.json();
      console.log("✅ Mensagem fallback enviada:", responseData);
    } else {
      const errorText = await response.text();
      console.error("❌ Erro no fallback Z-API:", response.status, errorText);
      console.error(
        "❌ Request fallback:",
        JSON.stringify(requestBody, null, 2)
      );
    }
  } catch (error) {
    console.error("❌ Erro ao enviar mensagem fallback:", error);
  }
}
