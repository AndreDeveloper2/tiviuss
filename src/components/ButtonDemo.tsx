import { NeonButton } from "@/components/ui/neon-button";

export default function ButtonDemo() {
  return (
    <NeonButton
      backgroundColor="transparent"
      textColor="#fff" // texto roxo claro
      borderStartColor="rgba(162, 0, 255, 0.1)" // início do gradiente (roxo escuro transparente)
      borderEndColor="rgba(162, 0, 255, 0.7)" // fim do gradiente (roxo neon semi-transparente)
    >
      Começar Grátis
    </NeonButton>
  );
}
