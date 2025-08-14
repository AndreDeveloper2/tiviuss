import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Webhook Waseller recebido:", body);

    // Extrair informações da mensagem
    const { message, customer, type } = body;

    // Verificar se é uma mensagem de texto
    if (type === "text" && message) {
      const messageText = message.toLowerCase();

      // Se a mensagem contém "pix", acionar o Z-API
      if (messageText.includes("pix")) {
        console.log("Palavra 'pix' detectada! Acionando Z-API...");

        try {
          // Chamar o webhook do Z-API
          const zapiResponse = await fetch(
            `https://tiviuss.vercel.app/api/webhook/zapi`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                message: message,
                customer: customer,
                type: type,
                timestamp: new Date().toISOString(),
              }),
            }
          );

          if (zapiResponse.ok) {
            console.log("Z-API acionado com sucesso!");
          } else {
            console.error("Erro ao acionar Z-API:", zapiResponse.statusText);
          }
        } catch (error) {
          console.error("Erro ao chamar Z-API:", error);
        }
      }
    }

    // Sempre retornar sucesso para o Waseller
    // O Waseller vai gerenciar as respostas diretamente
    return NextResponse.json({
      success: true,
      message: "Webhook processado com sucesso",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Erro no webhook Waseller:", error);
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
    message: "Webhook Waseller ativo",
    status: "online",
    timestamp: new Date().toISOString(),
  });
}
