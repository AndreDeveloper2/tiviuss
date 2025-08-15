// src/app/api/webhook/mercadopago/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("🔔 Mercado Pago mandou:", JSON.stringify(body, null, 2));

    // 🎯 Só processa se for notificação de pagamento
    if (body.type === "payment") {
      const paymentId = body.data?.id;

      if (paymentId) {
        console.log(`💰 Verificando pagamento: ${paymentId}`);

        // 🔍 Buscar status do pagamento
        const paymentStatus = await getPaymentStatus(paymentId);

        // ✅ Se foi aprovado, avisar no WhatsApp
        if (paymentStatus === "approved") {
          console.log("🎉 Pagamento aprovado! Enviando confirmação...");
          await sendWhatsAppConfirmation();
        }
      }
    }

    return NextResponse.json({
      status: "received",
      message: "Webhook processado",
    });
  } catch (error) {
    console.error("❌ Erro:", error);
    return NextResponse.json({ error: "Erro no webhook" }, { status: 500 });
  }
}

// 🔍 Buscar status do pagamento no Mercado Pago
async function getPaymentStatus(paymentId: string) {
  try {
    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.ok) {
      const payment = await response.json();
      console.log(
        `📊 Status: ${payment.status}, Valor: R$ ${payment.transaction_amount}`
      );
      return payment.status;
    }

    return null;
  } catch (error) {
    console.error("❌ Erro ao buscar pagamento:", error);
    return null;
  }
}

// 📱 Enviar confirmação no WhatsApp
async function sendWhatsAppConfirmation() {
  try {
    // ⚠️ FIXO para teste - substitua pelo número real do cliente
    const phoneNumber = "5511918511927"; // <- MUDE AQUI

    const message = `🎉 **PAGAMENTO APROVADO!**

✅ **Status:** Confirmado  
💰 **Valor:** R$ 25,00
📅 **Data:** ${new Date().toLocaleString("pt-BR")}

🛍️ **Seu pedido foi confirmado!**
📦 Processando seu pedido...

💚 Obrigado pela preferência!`;

    await fetch(
      `https://api.z-api.io/instances/3E5B6CA5E4C6D09F694EAEF0CD5229F7/token/5EB75083B0368AAAC6083A84/send-text`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "client-token": process.env.ZAPI_CLIENT_TOKEN!,
        },
        body: JSON.stringify({
          phone: phoneNumber,
          message: message,
        }),
      }
    );

    console.log("✅ Confirmação enviada no WhatsApp!");
  } catch (error) {
    console.error("❌ Erro ao enviar WhatsApp:", error);
  }
}

// 🧪 GET para testar se está funcionando
export async function GET() {
  return NextResponse.json({
    message: "✅ Webhook Mercado Pago está online!",
    url: "https://tiviuss.vercel.app/api/webhook/mercadopago",
    timestamp: new Date().toLocaleString("pt-BR"),
  });
}
