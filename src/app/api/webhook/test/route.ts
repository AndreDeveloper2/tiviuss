import { NextRequest, NextResponse } from "next/server";

// GET - Para verificação do webhook (challenge)
export async function GET(request: NextRequest) {
  console.log("🔍 Webhook GET chamado");

  // Pegar parâmetros da URL
  const searchParams = request.nextUrl.searchParams;
  const challenge = searchParams.get("hub.challenge");
  const verify_token = searchParams.get("hub.verify_token");

  console.log("Challenge:", challenge);
  console.log("Verify token:", verify_token);

  // Se tem challenge, retorna ele (verificação do webhook)
  if (challenge) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({
    message: "Webhook de teste funcionando!",
    timestamp: new Date().toISOString(),
  });
}

// POST - Para receber dados do webhook
export async function POST(request: NextRequest) {
  try {
    console.log("📨 Webhook POST recebido");

    // Pegar o corpo da requisição
    const body = await request.json();

    console.log("Dados recebidos:", JSON.stringify(body, null, 2));

    // Responder que recebeu com sucesso
    return NextResponse.json({
      success: true,
      message: "Dados recebidos com sucesso!",
      received_at: new Date().toISOString(),
      data_preview: body,
    });
  } catch (error) {
    console.error("❌ Erro no webhook:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Erro ao processar webhook",
      },
      { status: 500 }
    );
  }
}
