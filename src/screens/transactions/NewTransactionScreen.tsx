/**
 * NewTransactionScreen – Tela de nova transação.
 *
 * Formulário para adicionar uma receita ou despesa.
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
import { TransactionsStackParamList } from "@/navigation/types";
import { useFinance } from "@/context/FinanceContext";
import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/common/Button";
import { CustomInput } from "@/components/common/CustomInput";
import { getCurrentDateISO } from "@/utils/formatters";

type NewTransactionNavProp = NativeStackNavigationProp<
  TransactionsStackParamList,
  "NewTransaction"
>;

export function NewTransactionScreen() {
  const navigation = useNavigation<NewTransactionNavProp>();
  const { categories, addTransaction } = useFinance();

  // Estado do formulário
  const [type, setType] = useState<TransactionType>("expense");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [date, setDate] = useState(getCurrentDateISO());
  const [errors, setErrors] = useState<{
    description?: string;
    amount?: string;
    category?: string;
  }>({});

  // Filtra categorias pelo tipo selecionado
  const filteredCategories = categories.filter((c) => c.type === type);

  function validate(): boolean {
    const newErrors: typeof errors = {};

    if (!description.trim()) newErrors.description = "Informe uma descrição.";

    const numAmount = parseFloat(amount.replace(",", "."));
    if (!amount) newErrors.amount = "Informe o valor.";
    else if (isNaN(numAmount) || numAmount <= 0)
      newErrors.amount = "Digite um valor válido maior que zero.";

    if (!selectedCategoryId) newErrors.category = "Selecione uma categoria.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSave() {
    if (!validate()) return;

    const numAmount = parseFloat(amount.replace(",", "."));
    addTransaction(description.trim(), numAmount, type, selectedCategoryId, date);

    Alert.alert("Sucesso", "Transação adicionada!", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <AppHeader
        title="Nova Transação"
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
          {/* Toggle Receita / Despesa */}
          <View style={styles.typeToggle}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                type === "expense" && styles.typeButtonExpenseActive,
              ]}
              onPress={() => {
                setType("expense");
                setSelectedCategoryId("");
              }}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  type === "expense" && styles.typeButtonTextActive,
                ]}
              >
                📉 Despesa
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeButton,
                type === "income" && styles.typeButtonIncomeActive,
              ]}
              onPress={() => {
                setType("income");
                setSelectedCategoryId("");
              }}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  type === "income" && styles.typeButtonTextActive,
                ]}
              >
                📈 Receita
              </Text>
            </TouchableOpacity>
          </View>

          {/* Campos */}
          <CustomInput
            label="Descrição"
            placeholder="Ex: Almoço, Salário..."
            value={description}
            onChangeText={(t) => {
              setDescription(t);
              if (errors.description)
                setErrors((p) => ({ ...p, description: undefined }));
            }}
            error={errors.description}
          />

          <CustomInput
            label="Valor (R$)"
            placeholder="0,00"
            value={amount}
            onChangeText={(t) => {
              setAmount(t);
              if (errors.amount) setErrors((p) => ({ ...p, amount: undefined }));
            }}
            error={errors.amount}
            keyboardType="decimal-pad"
          />

          <CustomInput
            label="Data"
            placeholder="AAAA-MM-DD"
            value={date}
            onChangeText={setDate}
          />

          {/* Seleção de categoria */}
          <Text style={styles.categoryLabel}>Categoria</Text>
          {errors.category ? (
            <Text style={styles.categoryError}>{errors.category}</Text>
          ) : null}
          <View style={styles.categoryGrid}>
            {filteredCategories.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryItem,
                  selectedCategoryId === cat.id && styles.categoryItemSelected,
                ]}
                onPress={() => {
                  setSelectedCategoryId(cat.id);
                  if (errors.category)
                    setErrors((p) => ({ ...p, category: undefined }));
                }}
              >
                <Text style={styles.categoryItemIcon}>{cat.icon}</Text>
                <Text
                  style={[
                    styles.categoryItemName,
                    selectedCategoryId === cat.id &&
                      styles.categoryItemNameSelected,
                  ]}
                  numberOfLines={1}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Button
            title="Salvar transação"
            onPress={handleSave}
            style={styles.saveButton}
          />
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
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
  typeButtonTextActive: { color: COLORS.textPrimary },

  categoryLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  categoryError: {
    fontSize: 12,
    color: COLORS.danger,
    marginBottom: 8,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 24,
  },
  categoryItem: {
    width: "30%",
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  categoryItemSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  categoryItemIcon: { fontSize: 22, marginBottom: 4 },
  categoryItemName: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  categoryItemNameSelected: { color: COLORS.primary, fontWeight: "600" },
  saveButton: { marginTop: 8 },
});
