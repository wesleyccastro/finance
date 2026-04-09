/**
 * Tipos de navegação.
 *
 * O React Navigation usa TypeScript para garantir que passemos os
 * parâmetros corretos ao navegar entre telas.
 *
 * Cada "ParamList" define as rotas de um navigator e os parâmetros
 * que cada rota aceita. `undefined` significa "sem parâmetros".
 */

// ------------------------------------------------------------------
// Stack de Autenticação (Login e Cadastro)
// ------------------------------------------------------------------

/**
 * Rotas disponíveis antes do login.
 * Ao navegar: navigation.navigate("Register")
 */
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

// ------------------------------------------------------------------
// Tabs principais do app (após login)
// ------------------------------------------------------------------

/**
 * Abas da barra de navegação inferior.
 * Cada aba pode ter seu próprio Stack interno.
 */
export type AppTabParamList = {
  DashboardTab: undefined;
  TransactionsTab: undefined;
  CategoriesTab: undefined;
};

// ------------------------------------------------------------------
// Stacks internos de cada aba
// ------------------------------------------------------------------

/** Stack da aba Dashboard */
export type DashboardStackParamList = {
  Dashboard: undefined;
};

/** Stack da aba Transações */
export type TransactionsStackParamList = {
  Transactions: undefined;
  NewTransaction: undefined;
};

/** Stack da aba Categorias */
export type CategoriesStackParamList = {
  Categories: undefined;
  NewCategory: undefined;
};
