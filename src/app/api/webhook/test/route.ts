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

        if (
          mensagemLower.includes("fatura") ||
          mensagemLower.includes("boleto")
        ) {
          console.log("🧾 Cliente pediu fatura!");

          // TODO: Aqui você buscaria a fatura real do banco de dados
          return NextResponse.json({
            success: true,
            tipo: "fatura",
            mensagem: `🧾 *Sua Fatura - ${clienteNome}*\n\n📅 Vencimento: 15/01/2025\n💰 Valor: R$ 89,90\n📋 Status: Em aberto\n\n💳 Para pagar, digite *pagar*`,
            valor: "R$ 89,90",
            vencimento: "15/01/2025",
            status: "Em aberto",
          });
        } else if (
          mensagemLower.includes("débito") ||
          mensagemLower.includes("divida")
        ) {
          console.log("💰 Cliente perguntou sobre débito!");

          // TODO: Consultar débitos reais do banco
          return NextResponse.json({
            success: true,
            tipo: "debito",
            mensagem: `💰 *Situação Financeira - ${clienteNome}*\n\n✅ Você não possui débitos em aberto!\n📅 Próximo vencimento: 15/01/2025\n💰 Valor: R$ 89,90`,
            temDebito: false,
            proximoVencimento: "15/01/2025",
          });
        } else if (
          mensagemLower.includes("pagar") ||
          mensagemLower.includes("pagamento")
        ) {
          console.log("💳 Cliente quer pagar!");

          // TODO: Gerar link real do Mercado Pago
          return NextResponse.json({
            success: true,
            tipo: "pagamento",
            mensagem: `💳 *Link de Pagamento - ${clienteNome}*\n\n💰 Valor: R$ 89,90\n📅 Vencimento: 15/01/2025\n\n🔗 Link para pagamento:\nhttps://mercadopago.com.br/checkout/exemplo123\n\n⚠️ Link válido por 24 horas`,
            linkPagamento: "https://mercadopago.com.br/checkout/exemplo123",
            valor: "R$ 89,90",
          });
        } else {
          // Resposta padrão
          return NextResponse.json({
            success: true,
            tipo: "menu",
            mensagem: `👋 Olá ${clienteNome}!\n\nPara te ajudar, digite:\n\n🧾 *fatura* - Ver sua conta\n💰 *débito* - Consultar pendências\n💳 *pagar* - Quitar mensalidade\n\n❓ Como posso ajudar?`,
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      tipo: "erro",
      mensagem: "Não consegui processar sua mensagem. Tente novamente.",
    });
  } catch (error) {
    console.error("❌ Erro:", error);
    return NextResponse.json({
      success: false,
      tipo: "erro",
      mensagem: "Ops! Ocorreu um erro. Tente novamente em alguns instantes.",
    });
  }
}
