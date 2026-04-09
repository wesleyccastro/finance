/**
 * Paleta de cores do aplicativo.
 *
 * Centralizar as cores em um único arquivo é uma boa prática:
 * - Facilita a manutenção (muda aqui, reflete em todo o app)
 * - Garante consistência visual
 * - Facilita a criação de temas (claro/escuro)
 */
export const COLORS = {
  // --- Cores principais (marca) ---
  primary: "#2563EB",       // Azul principal – botões, cabeçalhos
  primaryDark: "#1D4ED8",   // Azul mais escuro – estados pressionados
  primaryLight: "#DBEAFE",  // Azul claro – fundos de destaque

  // --- Feedback semântico ---
  success: "#16A34A",       // Verde – receitas, confirmações
  successLight: "#DCFCE7",  // Verde claro – fundo de cards de receita
  danger: "#DC2626",        // Vermelho – despesas, erros, exclusões
  dangerLight: "#FEE2E2",   // Vermelho claro – fundo de cards de despesa
  warning: "#D97706",       // Âmbar – alertas

  // --- Neutros ---
  white: "#FFFFFF",
  background: "#F1F5F9",    // Cinza bem claro – fundo das telas
  card: "#FFFFFF",          // Fundo dos cards
  border: "#E2E8F0",        // Bordas e separadores
  inputBackground: "#F8FAFC", // Fundo dos inputs

  // --- Textos ---
  textPrimary: "#0F172A",   // Texto principal (quase preto)
  textSecondary: "#64748B", // Texto secundário (cinza médio)
  textLight: "#94A3B8",     // Texto desabilitado / placeholder

  // --- Outros ---
  overlay: "rgba(0, 0, 0, 0.5)", // Sobreposição de modais
};
