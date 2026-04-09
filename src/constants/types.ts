/**
 * Tipos (interfaces) globais do aplicativo.
 *
 * Definir os tipos em um lugar só garante que todas as partes do app
 * "falem a mesma língua". Se precisar mudar a estrutura de um dado,
 * basta alterar aqui e o TypeScript apontará todos os locais afetados.
 */

// ------------------------------------------------------------------
// Usuário
// ------------------------------------------------------------------

/** Representa um usuário cadastrado no app */
export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // Em produção NUNCA armazene senha em texto puro!
}

// ------------------------------------------------------------------
// Transações
// ------------------------------------------------------------------

/**
 * Tipo de transação financeira.
 * Usando "union type" do TypeScript: só aceita esses dois valores.
 */
export type TransactionType = "income" | "expense";

/** Representa uma categoria (ex.: Alimentação, Salário) */
export interface Category {
  id: string;
  name: string;
  type: TransactionType; // A categoria pertence a receita ou despesa
  icon: string;          // Emoji usado como ícone (ex.: "🍔")
}

/** Representa uma transação financeira (entrada ou saída) */
export interface Transaction {
  id: string;
  description: string;
  amount: number;        // Valor sempre positivo; o tipo define se é entrada/saída
  type: TransactionType;
  categoryId: string;    // Referência à categoria
  date: string;          // Data no formato ISO 8601: "YYYY-MM-DD"
}
