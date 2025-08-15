import { createMercadoPagoPayment } from "@/lib/mercadopago";
import { NextRequest, NextResponse } from "next/server";

interface ZapiWebhookBody {
  phone: string;
  text?: {
    message?: string;
  };
  fromMe?: boolean;
  listResponseMessage?: {
    title?: string;
  };
}

export async function POST(request: NextRequest) {
  const body: ZapiWebhookBody = await request.json();

  const phone = body.phone;
  const message = body.listResponseMessage?.title || "";
  const fromMe = body.fromMe || false;

  // Evita loop
  if (fromMe) {
    return NextResponse.json({
      message: "Mensagem ignorada (foi enviada por mim)",
    });
  }

  // Responde apenas se tiver "pix"
  if (message.toLowerCase().includes("pix")) {
    await fetch(
      `https://api.z-api.io/instances/3E5B6CA5E4C6D09F694EAEF0CD5229F7/token/5EB75083B0368AAAC6083A84/send-text`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "client-token": process.env.ZAPI_CLIENT_TOKEN!,
        },
        body: JSON.stringify({
          phone,
          message:
            "Segue o link para pagamento via Pix: https://exemplo.com/pix",
        }),
      }
    );

    const pixPayment = await createMercadoPagoPayment(10.0, "Pagamento Tivius");
    await fetch(
      `https://api.z-api.io/instances/3E5B6CA5E4C6D09F694EAEF0CD5229F7/token/5EB75083B0368AAAC6083A84/send-text`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "client-token": process.env.ZAPI_CLIENT_TOKEN!,
        },
        body: JSON.stringify({
          phone,
          message: `Seu Pix foi gerado! \nCódigo: ${pixPayment.point_of_interaction.transaction_data.qr_code}`,
        }),
      }
    );

    return NextResponse.json({ message: "Resposta Pix enviada" });
  }

  return NextResponse.json({
    message: "Mensagem recebida, mas não era sobre Pix",
  });
}
