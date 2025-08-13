import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const challenge = searchParams.get("hub.challenge");

  if (challenge) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ message: "OK" });
}

export async function POST(request: NextRequest) {
  try {
    console.log(request);
    console.log("📨 Webhook recebido");

    // Retorno SUPER simples
    return NextResponse.json({
      success: true,
      message: "Teste funcionando!",
    });
  } catch (error) {
    console.error("Erro:", error);
    return NextResponse.json({ success: false });
  }
}
