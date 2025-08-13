import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  console.log("🔍 Webhook GET chamado - Verificação");

  const searchParams = request.nextUrl.searchParams;
  const challenge = searchParams.get("hub.challenge");

  if (challenge) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ message: "Webhook funcionando!" });
}

export async function POST(request: NextRequest) {
  try {
    console.log("📨 Webhook POST recebido");

    const body = await request.json();

    // Extrair dados importantes do Umbler Talk
    if (body.Type === "Message" && body.Payload?.Content) {
      const content = body.Payload.Content;

      const clienteNumero = content.Contact?.PhoneNumber;
      const clienteNome = content.Contact?.Name;
      const mensagem = content.LastMessage?.Content;
      const timestamp = body.EventDate;

      console.log("👤 Cliente:", clienteNome);
      console.log("📱 Número:", clienteNumero);
      console.log("💬 Mensagem:", mensagem);
      console.log("🕐 Data:", timestamp);

      // Aqui você pode processar a mensagem
      if (mensagem) {
        const mensagemLower = mensagem.toLowerCase();

        if (
          mensagemLower.includes("fatura") ||
          mensagemLower.includes("boleto")
        ) {
          console.log("🧾 Cliente pediu fatura!");
          // TODO: Gerar fatura
        }

        if (
          mensagemLower.includes("débito") ||
          mensagemLower.includes("divida")
        ) {
          console.log("💰 Cliente perguntou sobre débito!");
          // TODO: Consultar débitos
        }

        if (
          mensagemLower.includes("pagar") ||
          mensagemLower.includes("pagamento")
        ) {
          console.log("💳 Cliente quer pagar!");
          // TODO: Enviar link de pagamento
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Mensagem processada com sucesso!",
    });
  } catch (error) {
    console.error("❌ Erro:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
