import { NeonButton } from "@/components/ui/neon-button";

export default function ButtonTest() {
  return (
    <NeonButton
      backgroundColor="#8b5cf6"
      textColor="#fff" // texto roxo claro
      borderStartColor="rgba(255, 255, 255, 0.1)" // início do gradiente (branco quase invisível)
      borderEndColor="rgba(255, 255, 255, 0.7)" // fim do gradiente (branco mais visível)
    >
      Teste Gratuito!
    </NeonButton>
  );
}
