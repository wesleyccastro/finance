/**
 * FinanceContext – Contexto Financeiro.
 *
 * Gerencia categorias e transações do app.
 * Todos os dados são mantidos em memória (useState) com valores iniciais
 * mockados, o que é suficiente para este protótipo educacional.
 */
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Category, Transaction, TransactionType } from "@/constants/types";
import { generateId, getCurrentDateISO } from "@/utils/formatters";

// ------------------------------------------------------------------
// Dados mockados iniciais
// ------------------------------------------------------------------

/** Categorias padrão que já vêm carregadas no app */
const INITIAL_CATEGORIES: Category[] = [
  { id: "cat-1", name: "Alimentação",   type: "expense", icon: "🍔" },
  { id: "cat-2", name: "Transporte",    type: "expense", icon: "🚗" },
  { id: "cat-3", name: "Moradia",       type: "expense", icon: "🏠" },
  { id: "cat-4", name: "Lazer",         type: "expense", icon: "🎮" },
  { id: "cat-5", name: "Salário",       type: "income",  icon: "💼" },
  { id: "cat-6", name: "Freelance",     type: "income",  icon: "💻" },
];

/** Transações de exemplo para demonstração */
const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-1",
    description: "Supermercado",
    amount: 350.00,
    type: "expense",
    categoryId: "cat-1",
    date: "2024-03-10",
  },
  {
    id: "tx-2",
    description: "Uber",
    amount: 45.50,
    type: "expense",
    categoryId: "cat-2",
    date: "2024-03-11",
  },
  {
    id: "tx-3",
    description: "Salário março",
    amount: 4500.00,
    type: "income",
    categoryId: "cat-5",
    date: "2024-03-05",
  },
  {
    id: "tx-4",
    description: "Netflix",
    amount: 55.90,
    type: "expense",
    categoryId: "cat-4",
    date: "2024-03-08",
  },
  {
    id: "tx-5",
    description: "Projeto freelance",
    amount: 1200.00,
    type: "income",
    categoryId: "cat-6",
    date: "2024-03-12",
  },
  {
    id: "tx-6",
    description: "Aluguel",
    amount: 1500.00,
    type: "expense",
    categoryId: "cat-3",
    date: "2024-03-01",
  },
];

// ------------------------------------------------------------------
// Tipos do contexto
// ------------------------------------------------------------------

/** Dados e funções disponíveis para os componentes que consomem o contexto */
interface FinanceContextData {
  categories: Category[];
  transactions: Transaction[];
  /** Adiciona uma nova categoria */
  addCategory: (
    name: string,
    type: TransactionType,
    icon: string
  ) => void;
  /** Remove uma categoria pelo id */
  deleteCategory: (id: string) => void;
  /** Adiciona uma nova transação */
  addTransaction: (
    description: string,
    amount: number,
    type: TransactionType,
    categoryId: string,
    date?: string
  ) => void;
  /** Remove uma transação pelo id */
  deleteTransaction: (id: string) => void;
}

// ------------------------------------------------------------------
// Criação do contexto
// ------------------------------------------------------------------

const FinanceContext = createContext({} as FinanceContextData);

// ------------------------------------------------------------------
// Provider
// ------------------------------------------------------------------

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] =
    useState<Category[]>(INITIAL_CATEGORIES);

  const [transactions, setTransactions] =
    useState<Transaction[]>(INITIAL_TRANSACTIONS);

  // ----------------------------------------------------------------
  // Funções de Categoria
  // ----------------------------------------------------------------

  function addCategory(
    name: string,
    type: TransactionType,
    icon: string
  ): void {
    const newCategory: Category = {
      id: generateId(),
      name: name.trim(),
      type,
      icon,
    };
    // Adiciona ao início da lista para aparecer primeiro
    setCategories((prev) => [newCategory, ...prev]);
  }

  function deleteCategory(id: string): void {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  }

  // ----------------------------------------------------------------
  // Funções de Transação
  // ----------------------------------------------------------------

  function addTransaction(
    description: string,
    amount: number,
    type: TransactionType,
    categoryId: string,
    date: string = getCurrentDateISO() // valor padrão: hoje
  ): void {
    const newTransaction: Transaction = {
      id: generateId(),
      description: description.trim(),
      amount,
      type,
      categoryId,
      date,
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  }

  function deleteTransaction(id: string): void {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  }

  // ----------------------------------------------------------------
  // Retorno do Provider
  // ----------------------------------------------------------------
  return (
    <FinanceContext.Provider
      value={{
        categories,
        transactions,
        addCategory,
        deleteCategory,
        addTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

// ------------------------------------------------------------------
// Hook personalizado
// ------------------------------------------------------------------

/**
 * useFinance simplifica o consumo do FinanceContext.
 *
 * Exemplo de uso:
 *   const { transactions, addTransaction } = useFinance();
 */
export function useFinance() {
  return useContext(FinanceContext);
}
