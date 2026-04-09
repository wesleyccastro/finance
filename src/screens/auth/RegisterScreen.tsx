/**
 * RegisterScreen – Tela de Cadastro.
 *
 * Permite que novos usuários se registrem no app.
 * Demonstra:
 * - Validação de formulário mais complexa (confirmação de senha)
 * - Feedback visual de erros por campo
 * - Redirecionamento automático após cadastro
 */
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS } from "@/constants/colors";
import { AuthStackParamList } from "@/navigation/types";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/common/Button";
import { CustomInput } from "@/components/common/CustomInput";

type RegisterNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "Register"
>;

export function RegisterScreen() {
  // ------------------------------------------------------------------
  // Estado local do formulário
  // ------------------------------------------------------------------

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  // ------------------------------------------------------------------
  // Hooks
  // ------------------------------------------------------------------

  const navigation = useNavigation<RegisterNavigationProp>();
  const { register } = useAuth();

  // ------------------------------------------------------------------
  // Validação
  // ------------------------------------------------------------------

  function validate(): boolean {
    const newErrors: typeof errors = {};

    // Valida nome
    if (!name.trim()) {
      newErrors.name = "O nome é obrigatório.";
    } else if (name.trim().length < 2) {
      newErrors.name = "O nome deve ter pelo menos 2 caracteres.";
    }

    // Valida e-mail
    if (!email.trim()) {
      newErrors.email = "O e-mail é obrigatório.";
    } else if (!email.includes("@") || !email.includes(".")) {
      newErrors.email = "Digite um e-mail válido.";
    }

    // Valida senha
    if (!password) {
      newErrors.password = "A senha é obrigatória.";
    } else if (password.length < 6) {
      newErrors.password = "A senha deve ter pelo menos 6 caracteres.";
    }

    // Valida confirmação de senha
    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirme sua senha.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // ------------------------------------------------------------------
  // Submissão do formulário
  // ------------------------------------------------------------------

  function handleRegister() {
    if (!validate()) return;

    setLoading(true);

    setTimeout(() => {
      // Chama a função register do AuthContext
      const result = register(name.trim(), email.trim(), password);

      if (!result.success) {
        // Exibe o erro retornado pelo contexto (ex.: e-mail já cadastrado)
        setErrors({ general: result.error });
      }
      // Se bem-sucedido, o register() já faz o login automático,
      // e o RootNavigator redireciona para o app.

      setLoading(false);
    }, 800);
  }

  // ------------------------------------------------------------------
  // Renderização
  // ------------------------------------------------------------------

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Botão de voltar */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backText}>← Voltar</Text>
          </TouchableOpacity>

          {/* Cabeçalho */}
          <View style={styles.header}>
            <Text style={styles.logo}>📝</Text>
            <Text style={styles.title}>Criar Conta</Text>
            <Text style={styles.subtitle}>
              Preencha os dados abaixo para se cadastrar
            </Text>
          </View>

          {/* Formulário */}
          <View style={styles.card}>
            {/* Erro geral */}
            {errors.general ? (
              <View style={styles.errorBanner}>
                <Text style={styles.errorBannerText}>⚠️ {errors.general}</Text>
              </View>
            ) : null}

            {/* Campo nome */}
            <CustomInput
              label="Nome completo"
              placeholder="Seu nome"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              error={errors.name}
              autoCapitalize="words" // capitaliza cada palavra
            />

            {/* Campo e-mail */}
            <CustomInput
              label="E-mail"
              placeholder="seu@email.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              error={errors.email}
              keyboardType="email-address"
              autoComplete="email"
            />

            {/* Campo senha */}
            <CustomInput
              label="Senha"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              error={errors.password}
              isPassword
            />

            {/* Campo confirmar senha */}
            <CustomInput
              label="Confirmar senha"
              placeholder="Digite a senha novamente"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword)
                  setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }}
              error={errors.confirmPassword}
              isPassword
            />

            {/* Botão de cadastro */}
            <Button
              title="Criar conta"
              onPress={handleRegister}
              loading={loading}
              style={styles.registerButton}
            />
          </View>

          {/* Link para login */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Já tem uma conta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.footerLink}>Entrar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ------------------------------------------------------------------
// Estilos
// ------------------------------------------------------------------

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 24,
  },

  // Botão voltar
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 16,
    padding: 4,
  },
  backText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: "600",
  },

  // Cabeçalho
  header: {
    alignItems: "center",
    marginBottom: 28,
  },
  logo: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: "center",
  },

  // Card do formulário
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },

  // Banner de erro geral
  errorBanner: {
    backgroundColor: COLORS.dangerLight,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  errorBannerText: {
    color: COLORS.danger,
    fontSize: 14,
  },

  registerButton: {
    marginTop: 8,
  },

  // Rodapé
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 16,
  },
  footerText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  footerLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "700",
  },
});
