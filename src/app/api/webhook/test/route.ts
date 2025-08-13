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

      console.log("👤 Cliente:", clienteNome);
      console.log("📱 Número:", clienteNumero);
      console.log("💬 Mensagem:", mensagem);

      // Processar mensagem e gerar resposta
      if (mensagem) {
        const mensagemLower = mensagem.toLowerCase();
        let resposta = "";

        if (
          mensagemLower.includes("fatura") ||
          mensagemLower.includes("boleto")
        ) {
          console.log("🧾 Cliente pediu fatura!");
          resposta = `Olá ${clienteNome}! 🧾\n\nVou verificar sua fatura. Aguarde um momento...\n\n📋 Status: Consultando sistema...`;
        } else if (
          mensagemLower.includes("débito") ||
          mensagemLower.includes("divida")
        ) {
          console.log("💰 Cliente perguntou sobre débito!");
          resposta = `Olá ${clienteNome}! 💰\n\nConsultando seus débitos...\n\n⏳ Processando...`;
        } else if (
          mensagemLower.includes("pagar") ||
          mensagemLower.includes("pagamento")
        ) {
          console.log("💳 Cliente quer pagar!");
          resposta = `Olá ${clienteNome}! 💳\n\nGerando link de pagamento...\n\n🔗 Link será enviado em breve!`;
        } else {
          resposta = `Olá ${clienteNome}! 👋\n\nRecebemos: "${mensagem}"\n\n📋 Opções disponíveis:\n• "fatura" - Ver sua conta\n• "débito" - Consultar pendências\n• "pagar" - Quitar mensalidade`;
        }

        console.log("📤 Preparando resposta:", resposta.substring(0, 50));

        // Tentar retornar resposta que o Umbler possa processar
        return NextResponse.json({
          success: true,
          message: "Mensagem processada!",
          reply: {
            to: clienteNumero,
            message: resposta,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Mensagem recebida!",
    });
  } catch (error) {
    console.error("❌ Erro:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
