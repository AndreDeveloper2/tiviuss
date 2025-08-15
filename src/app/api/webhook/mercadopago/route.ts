// api/webhook/mercadopago/route.ts
import { NextRequest, NextResponse } from "next/server";

interface MercadoPagoNotification {
  id: string;
  live_mode: boolean;
  type: string;
  date_created: string;
  application_id: string;
  user_id: string;
  version: string;
  api_version: string;
  action: string;
  data: {
    id: string;
  };
}

interface PaymentStatus {
  id: number;
  status: string;
  status_detail: string;
  transaction_amount: number;
  external_reference?: string;
  payer: {
    email?: string;
  };
  date_approved?: string;
  date_created: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: MercadoPagoNotification = await request.json();
    console.log("🔔 Notificação do Mercado Pago recebida:", body);

    // Verificar se é uma notificação de payment
    if (body.type === "payment") {
      const paymentId = body.data.id;
      console.log("💳 Processando notificação de pagamento ID:", paymentId);

      // Buscar detalhes do pagamento
      const paymentDetails = await getPaymentDetails(paymentId);

      if (paymentDetails) {
        await handlePaymentStatusChange(paymentDetails);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Notificação processada com sucesso",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Erro ao processar notificação do Mercado Pago:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao processar notificação",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Endpoint para validação do webhook pelo Mercado Pago
  const searchParams = request.nextUrl.searchParams;
  const challenge = searchParams.get("challenge");

  if (challenge) {
    return new NextResponse(challenge, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  return NextResponse.json({
    message: "Webhook Mercado Pago ativo",
    status: "online",
    timestamp: new Date().toISOString(),
  });
}

// Função para buscar detalhes do pagamento
async function getPaymentDetails(
  paymentId: string
): Promise<PaymentStatus | null> {
  try {
    const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

    if (!accessToken) {
      console.error("❌ Token de acesso do Mercado Pago não configurado");
      return null;
    }

    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error(
        "❌ Erro ao buscar detalhes do pagamento:",
        response.status
      );
      return null;
    }

    const paymentDetails: PaymentStatus = await response.json();
    console.log("✅ Detalhes do pagamento obtidos:", paymentDetails);

    return paymentDetails;
  } catch (error) {
    console.error("❌ Erro ao buscar detalhes do pagamento:", error);
    return null;
  }
}

// Função para lidar com mudanças de status de pagamento
async function handlePaymentStatusChange(payment: PaymentStatus) {
  try {
    console.log(`📊 Status do pagamento ${payment.id}: ${payment.status}`);

    // Aqui você pode implementar sua lógica de negócio baseada no status
    switch (payment.status) {
      case "approved":
        console.log("✅ Pagamento aprovado!");
        await notifyPaymentApproved(payment);
        break;

      case "pending":
        console.log("⏳ Pagamento pendente");
        await notifyPaymentPending(payment);
        break;

      case "rejected":
        console.log("❌ Pagamento rejeitado");
        await notifyPaymentRejected(payment);
        break;

      case "cancelled":
        console.log("🚫 Pagamento cancelado");
        await notifyPaymentCancelled(payment);
        break;

      default:
        console.log(`❓ Status desconhecido: ${payment.status}`);
    }
  } catch (error) {
    console.error("❌ Erro ao processar mudança de status:", error);
  }
}

// Função para notificar pagamento aprovado
async function notifyPaymentApproved(payment: PaymentStatus) {
  try {
    // Aqui você deveria ter uma forma de associar o pagamento ao cliente
    // Por exemplo, usando o external_reference para encontrar o número de telefone
    const phone = await findPhoneByReference(payment.external_reference || "");

    if (phone) {
      await sendApprovalNotification(phone, payment);
    }
  } catch (error) {
    console.error("❌ Erro ao notificar pagamento aprovado:", error);
  }
}

// Função para notificar pagamento pendente
async function notifyPaymentPending(payment: PaymentStatus) {
  try {
    const phone = await findPhoneByReference(payment.external_reference || "");

    if (phone) {
      await sendPendingNotification(phone, payment);
    }
  } catch (error) {
    console.error("❌ Erro ao notificar pagamento pendente:", error);
  }
}

// Função para notificar pagamento rejeitado
async function notifyPaymentRejected(payment: PaymentStatus) {
  try {
    const phone = await findPhoneByReference(payment.external_reference || "");

    if (phone) {
      await sendRejectionNotification(phone, payment);
    }
  } catch (error) {
    console.error("❌ Erro ao notificar pagamento rejeitado:", error);
  }
}

// Função para notificar pagamento cancelado
async function notifyPaymentCancelled(payment: PaymentStatus) {
  try {
    const phone = await findPhoneByReference(payment.external_reference || "");

    if (phone) {
      await sendCancellationNotification(phone, payment);
    }
  } catch (error) {
    console.error("❌ Erro ao notificar pagamento cancelado:", error);
  }
}

// Função auxiliar para encontrar telefone pela referência
async function findPhoneByReference(reference: string): Promise<string | null> {
  // IMPLEMENTAR: Aqui você deve implementar a lógica para associar
  // a referência externa (external_reference) ao número de telefone do cliente
  // Isso pode ser feito através de um banco de dados, cache, etc.

  // Por enquanto, retornando null - você deve implementar sua própria lógica
  console.log("🔍 Procurando telefone para referência:", reference);

  // Exemplo de implementação com um Map em memória (NÃO recomendado para produção):
  // const phoneMap = new Map([
  //   ["TIV1234567890", "5511999999999"]
  // ]);
  // return phoneMap.get(reference) || null;

  return null;
}

// Função para enviar notificação de aprovação via Z-API
async function sendApprovalNotification(phone: string, payment: PaymentStatus) {
  try {
    const zapiUrl =
      "https://api.z-api.io/instances/3E5B6CA5E4C6D09F694EAEF0CD5229F7/token/5EB75083B0368AAAC6083A84/send-text";

    const message = `🎉 **PAGAMENTO APROVADO!**

✅ **Status:** Pagamento confirmado
💰 **Valor:** R$ ${payment.transaction_amount.toFixed(2)}
🆔 **ID:** ${payment.id}
📅 **Aprovado em:** ${
      payment.date_approved
        ? new Date(payment.date_approved).toLocaleString("pt-BR")
        : "Agora"
    }

🔥 **Seu pedido está sendo processado!**

Obrigado por escolher a Tivius! 
Em breve você receberá mais informações.

💬 Dúvidas? Digite "atendente"`;

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
      console.log("✅ Notificação de aprovação enviada");
    } else {
      console.error("❌ Erro ao enviar notificação de aprovação");
    }
  } catch (error) {
    console.error("❌ Erro ao enviar notificação via Z-API:", error);
  }
}

// Função para enviar notificação de pendência
async function sendPendingNotification(phone: string, payment: PaymentStatus) {
  try {
    const zapiUrl =
      "https://api.z-api.io/instances/3E5B6CA5E4C6D09F694EAEF0CD5229F7/token/5EB75083B0368AAAC6083A84/send-text";

    const message = `⏳ **PAGAMENTO PENDENTE**

🔄 **Status:** Aguardando confirmação
💰 **Valor:** R$ ${payment.transaction_amount.toFixed(2)}
🆔 **ID:** ${payment.id}

⚠️ **Ação necessária:**
Seu PIX ainda não foi processado. 
Verifique se você completou o pagamento no seu app bancário.

💡 **O que fazer:**
1. Abra seu app bancário
2. Verifique se o PIX foi enviado
3. Se não, complete o pagamento

🔍 Digite "status" para verificar novamente
💬 Digite "atendente" se precisar de ajuda`;

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
      console.log("✅ Notificação de pendência enviada");
    } else {
      console.error("❌ Erro ao enviar notificação de pendência");
    }
  } catch (error) {
    console.error("❌ Erro ao enviar notificação de pendência:", error);
  }
}

// Função para enviar notificação de rejeição
async function sendRejectionNotification(
  phone: string,
  payment: PaymentStatus
) {
  try {
    const zapiUrl =
      "https://api.z-api.io/instances/3E5B6CA5E4C6D09F694EAEF0CD5229F7/token/5EB75083B0368AAAC6083A84/send-text";

    const message = `❌ **PAGAMENTO NÃO APROVADO**

🚫 **Status:** Rejeitado
💰 **Valor:** R$ ${payment.transaction_amount.toFixed(2)}
🆔 **ID:** ${payment.id}
📝 **Motivo:** ${getStatusDetailMessage(payment.status_detail)}

💡 **O que fazer:**
1. Verifique seus dados bancários
2. Certifique-se que há saldo suficiente
3. Tente novamente em alguns minutos

🔄 Digite "pix" para gerar um novo pagamento
💬 Digite "atendente" para suporte`;

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
      console.log("✅ Notificação de rejeição enviada");
    } else {
      console.error("❌ Erro ao enviar notificação de rejeição");
    }
  } catch (error) {
    console.error("❌ Erro ao enviar notificação de rejeição:", error);
  }
}

// Função para enviar notificação de cancelamento
async function sendCancellationNotification(
  phone: string,
  payment: PaymentStatus
) {
  try {
    const zapiUrl =
      "https://api.z-api.io/instances/3E5B6CA5E4C6D09F694EAEF0CD5229F7/token/5EB75083B0368AAAC6083A84/send-text";

    const message = `🚫 **PAGAMENTO CANCELADO**

❌ **Status:** Cancelado
💰 **Valor:** R$ ${payment.transaction_amount.toFixed(2)}
🆔 **ID:** ${payment.id}

ℹ️ **Informação:**
Seu pagamento foi cancelado. Nenhum valor foi debitado.

🔄 Digite "pix" para gerar um novo pagamento
💬 Digite "atendente" se tiver dúvidas`;

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
      console.log("✅ Notificação de cancelamento enviada");
    } else {
      console.error("❌ Erro ao enviar notificação de cancelamento");
    }
  } catch (error) {
    console.error("❌ Erro ao enviar notificação de cancelamento:", error);
  }
}

// Função auxiliar para converter status_detail em mensagem amigável
function getStatusDetailMessage(statusDetail: string): string {
  const statusMessages: Record<string, string> = {
    cc_rejected_insufficient_amount: "Saldo insuficiente",
    cc_rejected_bad_filled_date: "Data de vencimento inválida",
    cc_rejected_bad_filled_security_code: "Código de segurança inválido",
    cc_rejected_bad_filled_other: "Dados do cartão inválidos",
    rejected_by_regulations: "Rejeitado por regulamentações",
    rejected_high_risk: "Transação de alto risco",
    pix_rejected: "PIX rejeitado pelo banco",
    expired: "Pagamento expirado",
  };

  return statusMessages[statusDetail] || "Motivo não especificado";
}
