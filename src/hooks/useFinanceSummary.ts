/**
 * useFinanceSummary – Hook personalizado de resumo financeiro.
 *
 * Hooks personalizados são funções que começam com "use" e encapsulam
 * lógica reutilizável. Aqui calculamos os totais financeiros com base
 * nas transações do contexto.
 *
 * useMemo é usado para otimização: os cálculos só são refeitos quando
 * a lista de transações mudar, evitando processamento desnecessário.
 */
import { useMemo } from "react";
import { useFinance } from "@/context/FinanceContext";
import { Transaction } from "@/constants/types";

/** Estrutura retornada pelo hook */
interface FinanceSummary {
  /** Soma de todas as receitas */
  totalIncome: number;
  /** Soma de todas as despesas */
  totalExpense: number;
  /** Saldo = receitas - despesas */
  balance: number;
  /** Últimas 5 transações (para exibir no dashboard) */
  recentTransactions: Transaction[];
}

export function useFinanceSummary(): FinanceSummary {
  const { transactions } = useFinance();

  /**
   * useMemo recebe uma função de cálculo e uma lista de dependências.
   * O cálculo só é executado novamente quando `transactions` mudar.
   * Isso é chamado de "memoização" (cache de resultados).
   */
  const summary = useMemo(() => {
    // Calcula total de receitas somando apenas transações do tipo "income"
    const totalIncome = transactions
      .filter((tx) => tx.type === "income")
      .reduce((acc, tx) => acc + tx.amount, 0);
    //        ^^^         ^^^^^^^^^^^^^^^^^^^
    //        acumulador  adiciona o valor ao acumulador

    // Calcula total de despesas somando apenas transações do tipo "expense"
    const totalExpense = transactions
      .filter((tx) => tx.type === "expense")
      .reduce((acc, tx) => acc + tx.amount, 0);

    // Saldo = receitas - despesas
    const balance = totalIncome - totalExpense;

    // Pega as últimas 5 transações (as primeiras do array, pois inserimos no início)
    const recentTransactions = transactions.slice(0, 5);

    return { totalIncome, totalExpense, balance, recentTransactions };
  }, [transactions]); // ← só recalcula quando `transactions` mudar

  return summary;
}
