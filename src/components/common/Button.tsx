/**
 * Componente Button reutilizável.
 *
 * Um dos princípios do React é criar componentes que possam ser
 * reaproveitados em diferentes partes do app. Assim, se precisarmos
 * mudar o visual dos botões, alteramos apenas este arquivo.
 */
import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";
import { COLORS } from "@/constants/colors";

// ------------------------------------------------------------------
// Tipos das props
// ------------------------------------------------------------------

interface ButtonProps {
  /** Texto exibido no botão */
  title: string;
  /** Função chamada quando o botão é pressionado */
  onPress: () => void;
  /**
   * Estilo visual do botão:
   * - "primary"  → azul sólido (ação principal)
   * - "outline"  → borda azul, fundo transparente (ação secundária)
   * - "danger"   → vermelho (ação destrutiva, ex.: excluir)
   */
  variant?: "primary" | "outline" | "danger";
  /** Quando true, desabilita o botão e mostra um spinner de carregamento */
  loading?: boolean;
  /** Quando true, o botão fica desabilitado e com opacidade reduzida */
  disabled?: boolean;
  /** Estilos extras para o container do botão (opcional) */
  style?: ViewStyle;
}

// ------------------------------------------------------------------
// Componente
// ------------------------------------------------------------------

export function Button({
  title,
  onPress,
  variant = "primary", // valor padrão: "primary"
  loading = false,
  disabled = false,
  style,
}: ButtonProps) {
  // Seleciona os estilos corretos de acordo com a variante
  const containerStyle = [
    styles.base,
    variant === "primary" && styles.primary,
    variant === "outline" && styles.outline,
    variant === "danger" && styles.danger,
    (disabled || loading) && styles.disabled, // reduz opacidade se inativo
    style, // estilos extras passados pelo pai
  ];

  const textStyle: TextStyle =
    variant === "outline" ? styles.textOutline : styles.textSolid;

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={disabled || loading} // impede cliques durante carregamento
      activeOpacity={0.8} // feedback visual ao pressionar
    >
      {/* Exibe spinner ou texto dependendo do estado */}
      {loading ? (
        <ActivityIndicator
          color={variant === "outline" ? COLORS.primary : COLORS.white}
          size="small"
        />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

// ------------------------------------------------------------------
// Estilos
// ------------------------------------------------------------------

const styles = StyleSheet.create({
  base: {
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  // Variantes
  primary: {
    backgroundColor: COLORS.primary,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  danger: {
    backgroundColor: COLORS.danger,
  },

  // Estado inativo
  disabled: {
    opacity: 0.6,
  },

  // Textos
  textSolid: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  textOutline: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "600",
  },
});
