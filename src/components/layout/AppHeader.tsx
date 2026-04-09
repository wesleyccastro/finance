/**
 * Componente AppHeader – cabeçalho padrão das telas.
 *
 * Usado no topo das telas para exibir título, subtítulo opcional,
 * botão de voltar e ícone de ação à direita.
 */
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "@/constants/colors";

// ------------------------------------------------------------------
// Tipos das props
// ------------------------------------------------------------------

interface AppHeaderProps {
  /** Título principal do cabeçalho */
  title: string;
  /** Subtítulo opcional (exibido abaixo do título) */
  subtitle?: string;
  /** Quando true, exibe o botão de voltar (←) no canto esquerdo */
  showBack?: boolean;
  /** Função chamada ao pressionar o botão de voltar */
  onBack?: () => void;
  /** Conteúdo opcional no canto direito (ex.: ícone de configurações) */
  rightIcon?: React.ReactNode;
}

// ------------------------------------------------------------------
// Componente
// ------------------------------------------------------------------

export function AppHeader({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightIcon,
}: AppHeaderProps) {
  /**
   * useSafeAreaInsets retorna as margens de segurança do dispositivo.
   * Isso garante que o conteúdo não fique atrás do "notch" ou da
   * barra de status em celulares modernos.
   */
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      {/* Configura a barra de status (hora, bateria) para branca */}
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View style={styles.row}>
        {/* Botão de voltar (lado esquerdo) */}
        {showBack ? (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        ) : (
          // Espaço vazio para manter o título centralizado quando não há botão
          <View style={styles.backButton} />
        )}

        {/* Títulos (centro) */}
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        {/* Ícone de ação (lado direito) */}
        <View style={styles.rightContainer}>
          {rightIcon ? rightIcon : <View style={styles.backButton} />}
        </View>
      </View>
    </View>
  );
}

// ------------------------------------------------------------------
// Estilos
// ------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    fontSize: 22,
    color: COLORS.white,
    fontWeight: "bold",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.white,
  },
  subtitle: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 2,
  },
  rightContainer: {
    width: 40,
    alignItems: "center",
  },
});
