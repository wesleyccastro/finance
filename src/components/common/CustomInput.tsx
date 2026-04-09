/**
 * Componente CustomInput – campo de texto estilizado.
 *
 * Encapsula o TextInput nativo com label e mensagem de erro,
 * seguindo o padrão visual do app.
 */
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from "react-native";
import { COLORS } from "@/constants/colors";

// ------------------------------------------------------------------
// Tipos das props
// ------------------------------------------------------------------

interface CustomInputProps extends TextInputProps {
  /** Label exibida acima do input */
  label: string;
  /** Mensagem de erro exibida abaixo do input (deixe vazio para ocultar) */
  error?: string;
  /** Quando true, exibe botão para mostrar/ocultar a senha */
  isPassword?: boolean;
}

// ------------------------------------------------------------------
// Componente
// ------------------------------------------------------------------

export function CustomInput({
  label,
  error,
  isPassword = false,
  ...rest // repassa todas as outras props do TextInput (value, onChangeText, etc.)
}: CustomInputProps) {
  // Controla se a senha está visível ou oculta
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      {/* Label do campo */}
      <Text style={styles.label}>{label}</Text>

      {/* Container do input (precisamos posicionar o botão de olho) */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={[
            styles.input,
            error ? styles.inputError : null, // borda vermelha se houver erro
          ]}
          placeholderTextColor={COLORS.textLight}
          // Se for campo de senha, alterna entre ocultar/mostrar
          secureTextEntry={isPassword && !showPassword}
          autoCapitalize="none" // não capitaliza automaticamente
          {...rest}
        />

        {/* Botão de olho – só aparece em campos de senha */}
        {isPassword && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword((prev) => !prev)}
          >
            <Text style={styles.eyeIcon}>{showPassword ? "🙈" : "👁️"}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Mensagem de erro – só aparece quando há erro */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

// ------------------------------------------------------------------
// Estilos
// ------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  inputWrapper: {
    position: "relative", // necessário para posicionar o botão de olho
    justifyContent: "center",
  },
  input: {
    height: 50,
    backgroundColor: COLORS.inputBackground,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  inputError: {
    borderColor: COLORS.danger, // borda vermelha quando há erro
  },
  eyeButton: {
    position: "absolute",
    right: 14,
    padding: 4,
  },
  eyeIcon: {
    fontSize: 18,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.danger,
  },
});
