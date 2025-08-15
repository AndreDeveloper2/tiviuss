export async function createMercadoPagoPayment(
  amount: number,
  description: string
) {
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  if (!accessToken) throw new Error("Token não configurado!");

  const transactionID = `TIV${Date.now()}`;
  const body = {
    transaction_amount: amount,
    description,
    payment_method_id: "pix",
    external_reference: transactionID,
    notification_url: "https://tiviuss.vercel.app/api/webhook/mercadopago",
    payer: {
      email: "cliente@tivius.com",
    },
  };

  const res = await fetch("https://api.mercadopago.com/v1/payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "X-Idempotency-Key": transactionID,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Erro ao criar PIX:", err);
    throw new Error("Erro ao criar PIX");
  }

  const data = await res.json();
  return data; // aqui vem o qr_code e demais infos
}
