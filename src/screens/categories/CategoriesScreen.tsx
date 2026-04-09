/**
 * CategoriesScreen – Tela de listagem de categorias.
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
import { Category } from "@/constants/types";
import { CategoriesStackParamList } from "@/navigation/types";
import { useFinance } from "@/context/FinanceContext";
import { AppHeader } from "@/components/layout/AppHeader";

type CategoriesNavProp = NativeStackNavigationProp<
  CategoriesStackParamList,
  "Categories"
>;

export function CategoriesScreen() {
  const navigation = useNavigation<CategoriesNavProp>();
  const { categories, deleteCategory } = useFinance();

  function handleDelete(id: string, name: string) {
    Alert.alert(
      "Excluir categoria",
      `Deseja excluir "${name}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => deleteCategory(id),
        },
      ]
    );
  }

  const renderItem: ListRenderItem<Category> = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemIcon}>{item.icon}</Text>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <View
          style={[
            styles.typeBadge,
            item.type === "income" ? styles.badgeIncome : styles.badgeExpense,
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              item.type === "income"
                ? styles.badgeTextIncome
                : styles.badgeTextExpense,
            ]}
          >
            {item.type === "income" ? "Receita" : "Despesa"}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id, item.name)}
      >
        <Text style={{ fontSize: 16 }}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <AppHeader
        title="Categorias"
        subtitle={`${categories.length} cadastradas`}
      />

      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📂</Text>
            <Text style={styles.emptyText}>Nenhuma categoria ainda.</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("NewCategory")}
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
  itemIcon: { fontSize: 28, marginRight: 14 },
  itemInfo: { flex: 1 },
  itemName: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  typeBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 20,
  },
  badgeIncome: { backgroundColor: COLORS.successLight },
  badgeExpense: { backgroundColor: COLORS.dangerLight },
  badgeText: { fontSize: 11, fontWeight: "600" },
  badgeTextIncome: { color: COLORS.success },
  badgeTextExpense: { color: COLORS.danger },
  deleteButton: { padding: 4 },

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
