/**
 * TransactionsScreen – Tela de listagem de transações.
 *
 * Exibe todas as transações com possibilidade de deletar.
 * O FAB navega para a tela de nova transação.
 */
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ListRenderItem,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS } from "@/constants/colors";
import { Transaction } from "@/constants/types";
import { TransactionsStackParamList } from "@/navigation/types";
import { useFinance } from "@/context/FinanceContext";
import { AppHeader } from "@/components/layout/AppHeader";
import { formatCurrency, formatDate } from "@/utils/formatters";

type TransactionsNavProp = NativeStackNavigationProp<
  TransactionsStackParamList,
  "Transactions"
>;

export function TransactionsScreen() {
  const navigation = useNavigation<TransactionsNavProp>();
  const { transactions, categories, deleteTransaction } = useFinance();

  function getCategoryIcon(categoryId: string): string {
    return categories.find((c) => c.id === categoryId)?.icon ?? "💸";
  }

  function getCategoryName(categoryId: string): string {
    return categories.find((c) => c.id === categoryId)?.name ?? "Sem categoria";
  }

  function handleDelete(id: string) {
    Alert.alert(
      "Excluir transação",
      "Tem certeza que deseja excluir esta transação?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => deleteTransaction(id),
        },
      ]
    );
  }

  const renderItem: ListRenderItem<Transaction> = ({ item }) => {
    const isIncome = item.type === "income";

    return (
      <View style={styles.item}>
        <View style={styles.itemIcon}>
          <Text style={{ fontSize: 20 }}>{getCategoryIcon(item.categoryId)}</Text>
        </View>

        <View style={styles.itemInfo}>
          <Text style={styles.itemDescription} numberOfLines={1}>
            {item.description}
          </Text>
          <Text style={styles.itemCategory}>
            {getCategoryName(item.categoryId)} · {formatDate(item.date)}
          </Text>
        </View>

        <Text
          style={[
            styles.itemAmount,
            isIncome ? styles.amountIncome : styles.amountExpense,
          ]}
        >
          {isIncome ? "+" : "-"}
          {formatCurrency(item.amount)}
        </Text>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.deleteIcon}>🗑️</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <AppHeader title="Transações" subtitle={`${transactions.length} registros`} />

      <FlatList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>Nenhuma transação ainda.</Text>
          </View>
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("NewTransaction")}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  list: { padding: 16, paddingBottom: 80 },

  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  itemIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  itemInfo: { flex: 1 },
  itemDescription: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  itemCategory: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  itemAmount: { fontSize: 14, fontWeight: "700", marginRight: 8 },
  amountIncome: { color: COLORS.success },
  amountExpense: { color: COLORS.danger },
  deleteButton: { padding: 4 },
  deleteIcon: { fontSize: 16 },

  empty: { alignItems: "center", paddingVertical: 48 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 15, color: COLORS.textSecondary },

  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  fabIcon: {
    fontSize: 28,
    color: COLORS.white,
    lineHeight: 32,
    marginTop: -2,
  },
});
