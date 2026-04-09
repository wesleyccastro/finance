/**
 * AppNavigator – Navegador principal (após login).
 *
 * Usa Bottom Tabs (abas na parte inferior) com um Stack interno
 * em cada aba, permitindo navegação como:
 *   Transactions (lista) → NewTransaction (formulário)
 *
 * Estrutura:
 *   Bottom Tabs
 *   ├── DashboardTab   → Stack → DashboardScreen
 *   ├── TransactionsTab → Stack → TransactionsScreen → NewTransactionScreen
 *   └── CategoriesTab  → Stack → CategoriesScreen   → NewCategoryScreen
 */
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text } from "react-native";

import {
  AppTabParamList,
  DashboardStackParamList,
  TransactionsStackParamList,
  CategoriesStackParamList,
} from "@/navigation/types";

import { COLORS } from "@/constants/colors";

// Importação das telas
import { DashboardScreen } from "@/screens/dashboard/DashboardScreen";
import { TransactionsScreen } from "@/screens/transactions/TransactionsScreen";
import { NewTransactionScreen } from "@/screens/transactions/NewTransactionScreen";
import { CategoriesScreen } from "@/screens/categories/CategoriesScreen";
import { NewCategoryScreen } from "@/screens/categories/NewCategoryScreen";

// ------------------------------------------------------------------
// Stacks internos de cada aba
// ------------------------------------------------------------------

const DashboardStack = createNativeStackNavigator<DashboardStackParamList>();
const TransactionsStack = createNativeStackNavigator<TransactionsStackParamList>();
const CategoriesStack = createNativeStackNavigator<CategoriesStackParamList>();

/** Stack interno da aba Dashboard */
function DashboardNavigator() {
  return (
    <DashboardStack.Navigator screenOptions={{ headerShown: false }}>
      <DashboardStack.Screen name="Dashboard" component={DashboardScreen} />
    </DashboardStack.Navigator>
  );
}

/** Stack interno da aba Transações */
function TransactionsNavigator() {
  return (
    <TransactionsStack.Navigator screenOptions={{ headerShown: false }}>
      <TransactionsStack.Screen
        name="Transactions"
        component={TransactionsScreen}
      />
      <TransactionsStack.Screen
        name="NewTransaction"
        component={NewTransactionScreen}
      />
    </TransactionsStack.Navigator>
  );
}

/** Stack interno da aba Categorias */
function CategoriesNavigator() {
  return (
    <CategoriesStack.Navigator screenOptions={{ headerShown: false }}>
      <CategoriesStack.Screen
        name="Categories"
        component={CategoriesScreen}
      />
      <CategoriesStack.Screen
        name="NewCategory"
        component={NewCategoryScreen}
      />
    </CategoriesStack.Navigator>
  );
}

// ------------------------------------------------------------------
// Bottom Tab Navigator
// ------------------------------------------------------------------

const Tab = createBottomTabNavigator<AppTabParamList>();

export function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        // Estilos da barra de abas
        tabBarActiveTintColor: COLORS.primary,    // cor da aba ativa
        tabBarInactiveTintColor: COLORS.textLight, // cor das abas inativas
        tabBarStyle: {
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.border,
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardNavigator}
        options={{
          tabBarLabel: "Início",
          // Usamos Text com emoji como ícone (simples e sem dependências extras)
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20 }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="TransactionsTab"
        component={TransactionsNavigator}
        options={{
          tabBarLabel: "Transações",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20 }}>💰</Text>
          ),
        }}
      />
      <Tab.Screen
        name="CategoriesTab"
        component={CategoriesNavigator}
        options={{
          tabBarLabel: "Categorias",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20 }}>📂</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
