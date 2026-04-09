/**
 * NewCategoryScreen – Tela para criar nova categoria.
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
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS } from "@/constants/colors";
import { TransactionType } from "@/constants/types";
import { CategoriesStackParamList } from "@/navigation/types";
import { useFinance } from "@/context/FinanceContext";
import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/common/Button";
import { CustomInput } from "@/components/common/CustomInput";

type NewCategoryNavProp = NativeStackNavigationProp<
  CategoriesStackParamList,
  "NewCategory"
>;

// Emojis disponíveis para seleção
const EMOJI_OPTIONS = [
  "🍔","🍕","🍜","☕","🚗","🚌","🏠","💡","👕","💊","🎮","🎬",
  "📚","💻","💼","💰","🎁","✈️","🏋️","🐾","💅","🎵","🛒","💸",
];

export function NewCategoryScreen() {
  const navigation = useNavigation<NewCategoryNavProp>();
  const { addCategory } = useFinance();

  const [name, setName] = useState("");
  const [type, setType] = useState<TransactionType>("expense");
  const [selectedEmoji, setSelectedEmoji] = useState("💸");
  const [errors, setErrors] = useState<{ name?: string }>({});

  function handleSave() {
    if (!name.trim()) {
      setErrors({ name: "Informe o nome da categoria." });
      return;
    }

    addCategory(name.trim(), type, selectedEmoji);
    Alert.alert("Sucesso", "Categoria criada!", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <AppHeader
        title="Nova Categoria"
        showBack
        onBack={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Toggle tipo */}
          <View style={styles.typeToggle}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                type === "expense" && styles.typeButtonExpenseActive,
              ]}
              onPress={() => setType("expense")}
            >
              <Text style={styles.typeButtonText}>📉 Despesa</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                type === "income" && styles.typeButtonIncomeActive,
              ]}
              onPress={() => setType("income")}
            >
              <Text style={styles.typeButtonText}>📈 Receita</Text>
            </TouchableOpacity>
          </View>

          <CustomInput
            label="Nome da categoria"
            placeholder="Ex: Alimentação, Salário..."
            value={name}
            onChangeText={(t) => {
              setName(t);
              if (errors.name) setErrors({});
            }}
            error={errors.name}
          />

          {/* Seletor de emoji */}
          <Text style={styles.emojiLabel}>Ícone</Text>
          <View style={styles.emojiGrid}>
            {EMOJI_OPTIONS.map((emoji) => (
              <TouchableOpacity
                key={emoji}
                style={[
                  styles.emojiItem,
                  selectedEmoji === emoji && styles.emojiItemSelected,
                ]}
                onPress={() => setSelectedEmoji(emoji)}
              >
                <Text style={styles.emojiText}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Button title="Salvar categoria" onPress={handleSave} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  flex: { flex: 1 },
  container: { padding: 20, paddingBottom: 40 },

  typeToggle: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
    elevation: 1,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  typeButtonExpenseActive: { backgroundColor: COLORS.dangerLight },
  typeButtonIncomeActive: { backgroundColor: COLORS.successLight },
  typeButtonText: { fontSize: 14, fontWeight: "600", color: COLORS.textSecondary },

  emojiLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  emojiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  emojiItem: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  emojiItemSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  emojiText: { fontSize: 22 },
});
