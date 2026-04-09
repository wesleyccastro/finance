/**
 * DashboardScreen – Tela inicial do app (após login).
 *
 * Exibe um resumo financeiro com:
 * - Saudação personalizada ao usuário
 * - Card de saldo atual
 * - Cards de receitas e despesas do período
 * - Lista das últimas 5 transações
 * - Botão flutuante (FAB) para adicionar nova transação
 *
 * Demonstra:
 * - Consumo de múltiplos contextos (useAuth, useFinance)
 * - Uso de hook personalizado (useFinanceSummary)
 * - FlatList para listas performáticas
 * - Formatação de moeda e data com funções utilitárias
 */
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ListRenderItem,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";

import { COLORS } from "@/constants/colors";
import { Transaction } from "@/constants/types";
import { DashboardStackParamList } from "@/navigation/types";
import { useAuth } from "@/context/AuthContext";
import { useFinance } from "@/context/FinanceContext";
import { useFinanceSummary } from "@/hooks/useFinanceSummary";
import { formatCurrency, formatDate } from "@/utils/formatters";

type DashboardNavigationProp = NativeStackNavigationProp<
  DashboardStackParamList,
  "Dashboard"
>;

export function DashboardScreen() {
  const navigation = useNavigation<DashboardNavigationProp>();
  const { user, logout } = useAuth();
  const { categories } = useFinance();
  const { totalIncome, totalExpense, balance, recentTransactions } =
    useFinanceSummary();

  // ------------------------------------------------------------------
  // Helpers
  // ------------------------------------------------------------------

  /** Retorna o nome da categoria pelo id */
  function getCategoryName(categoryId: string): string {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name ?? "Sem categoria";
  }

  /** Retorna o ícone da categoria pelo id */
  function getCategoryIcon(categoryId: string): string {
    const category = categories.find((c) => c.id === categoryId);
    return category?.icon ?? "💸";
  }

  /** Retorna a hora do dia para a saudação */
  function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  }

  // ------------------------------------------------------------------
  // Renderização de cada item da lista de transações
  // ------------------------------------------------------------------

  /**
   * renderItem é chamado pelo FlatList para cada item da lista.
   * O tipo ListRenderItem<Transaction> garante tipagem correta.
   */
  const renderTransaction: ListRenderItem<Transaction> = ({ item }) => {
    const isIncome = item.type === "income";

    return (
      <View style={styles.transactionItem}>
        {/* Ícone da categoria */}
        <View style={styles.transactionIcon}>
          <Text style={styles.transactionIconText}>
            {getCategoryIcon(item.categoryId)}
          </Text>
        </View>

        {/* Descrição e categoria */}
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionDescription} numberOfLines={1}>
            {item.description}
          </Text>
          <Text style={styles.transactionCategory}>
            {getCategoryName(item.categoryId)} · {formatDate(item.date)}
          </Text>
        </View>

        {/* Valor colorido conforme tipo */}
        <Text
          style={[
            styles.transactionAmount,
            isIncome ? styles.amountIncome : styles.amountExpense,
          ]}
        >
          {isIncome ? "+" : "-"}
          {formatCurrency(item.amount)}
        </Text>
      </View>
    );
  };

  // ------------------------------------------------------------------
  // Cabeçalho da lista (renderizado como listHeaderComponent)
  // ------------------------------------------------------------------

  function ListHeader() {
    return (
      <>
        {/* ---- Header azul com saudação ---- */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>
                {getGreeting()}, {user?.name?.split(" ")[0]}! 👋
              </Text>
              <Text style={styles.headerSubtitle}>Confira seu resumo</Text>
            </View>

            {/* Botão de logout */}
            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
              <Text style={styles.logoutText}>Sair</Text>
            </TouchableOpacity>
          </View>

          {/* Card de saldo */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Saldo atual</Text>
            <Text
              style={[
                styles.balanceValue,
                balance < 0 && styles.balanceNegative,
              ]}
            >
              {formatCurrency(balance)}
            </Text>
          </View>
        </View>

        {/* ---- Cards de receita e despesa ---- */}
        <View style={styles.summaryRow}>
          {/* Card de receitas */}
          <View style={[styles.summaryCard, styles.incomeCard]}>
            <Text style={styles.summaryIcon}>📈</Text>
            <Text style={styles.summaryLabel}>Receitas</Text>
            <Text style={[styles.summaryValue, styles.incomeValue]}>
              {formatCurrency(totalIncome)}
            </Text>
          </View>

          {/* Card de despesas */}
          <View style={[styles.summaryCard, styles.expenseCard]}>
            <Text style={styles.summaryIcon}>📉</Text>
            <Text style={styles.summaryLabel}>Despesas</Text>
            <Text style={[styles.summaryValue, styles.expenseValue]}>
              {formatCurrency(totalExpense)}
            </Text>
          </View>
        </View>

        {/* ---- Título da lista ---- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Últimas transações</Text>
        </View>
      </>
    );
  }

  // ------------------------------------------------------------------
  // Renderização da tela completa
  // ------------------------------------------------------------------

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      {/**
       * FlatList é mais eficiente que ScrollView para listas longas,
       * pois só renderiza os itens visíveis na tela (virtualização).
       *
       * ListHeaderComponent: conteúdo renderizado antes da lista
       * ListEmptyComponent: exibido quando a lista está vazia
       * keyExtractor: função que retorna uma chave única por item
       */}
      <FlatList
        data={recentTransactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<ListHeader />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>Nenhuma transação ainda.</Text>
            <Text style={styles.emptySubtext}>
              Toque no botão + para adicionar.
            </Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Botão flutuante (FAB – Floating Action Button) */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          // Navega para a tela de nova transação usando a aba de Transações
          // Como estamos em stacks separados, usamos o parent navigator
          navigation.getParent()?.navigate("TransactionsTab", {
            screen: "NewTransaction",
          });
        }}
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
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
  listContent: {
    paddingBottom: 80, // espaço para o FAB não cobrir o último item
  },

  // ---- Header ----
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.white,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  logoutText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "600",
  },

  // Card de saldo
  balanceCard: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  balanceLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.white,
    letterSpacing: -0.5,
  },
  balanceNegative: {
    color: "#FFB3B3", // vermelho claro para saldo negativo
  },

  // ---- Cards de resumo ----
  summaryRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  incomeCard: {
    backgroundColor: COLORS.successLight,
  },
  expenseCard: {
    backgroundColor: COLORS.dangerLight,
  },
  summaryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "700",
  },
  incomeValue: {
    color: COLORS.success,
  },
  expenseValue: {
    color: COLORS.danger,
  },

  // ---- Seção de transações ----
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },

  // ---- Item de transação ----
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 14,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  transactionIconText: {
    fontSize: 20,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  transactionCategory: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 15,
    fontWeight: "700",
  },
  amountIncome: {
    color: COLORS.success,
  },
  amountExpense: {
    color: COLORS.danger,
  },

  // ---- Estado vazio ----
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 4,
    textAlign: "center",
  },

  // ---- FAB ----
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
