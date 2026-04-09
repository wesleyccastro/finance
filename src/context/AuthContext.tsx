/**
 * AuthContext – Contexto de Autenticação.
 *
 * O Context API do React permite compartilhar dados entre componentes
 * sem precisar passar props manualmente por vários níveis da árvore.
 *
 * Aqui gerenciamos:
 * - O usuário logado (ou null se não houver)
 * - As funções de login, cadastro e logout
 * - Uma lista de usuários mockados (simulando um banco de dados)
 */
import React, { createContext, useContext, useState, ReactNode } from "react";
import { User } from "@/constants/types";
import { generateId } from "@/utils/formatters";

// ------------------------------------------------------------------
// Dados mockados
// ------------------------------------------------------------------

/**
 * Lista inicial de usuários "cadastrados".
 * Em um app real, esses dados viriam de uma API ou banco de dados.
 * O sufixo `Mock` indica que é dado simulado.
 */
const INITIAL_USERS_MOCK: User[] = [
  {
    id: "1",
    name: "Admin",
    email: "admin@teste.com",
    password: "123456",
  },
];

// ------------------------------------------------------------------
// Tipos do contexto
// ------------------------------------------------------------------

interface AuthContextData {
  /** Usuário atualmente logado. null = não autenticado */
  user: User | null;
  /** Tenta fazer login. Retorna true se as credenciais são válidas */
  login: (email: string, password: string) => boolean;
  /**
   * Cadastra um novo usuário.
   * Retorna objeto com sucesso/erro para mostrar feedback na tela.
   */
  register: (name: string, email: string, password: string) => {
    success: boolean;
    error?: string;
  };
  /** Desloga o usuário atual */
  logout: () => void;
}

// ------------------------------------------------------------------
// Criação do contexto
// ------------------------------------------------------------------

/**
 * createContext cria o "canal" de comunicação.
 * O valor inicial ({} as AuthContextData) é um placeholder;
 * o valor real será fornecido pelo AuthProvider abaixo.
 */
const AuthContext = createContext({} as AuthContextData);

// ------------------------------------------------------------------
// Provider
// ------------------------------------------------------------------

/**
 * AuthProvider é o componente que "fornece" os dados do contexto
 * para toda a sua árvore de filhos. Ele deve envolver o app inteiro
 * (ou pelo menos as telas que precisam de autenticação).
 *
 * { children }: { children: ReactNode } é a forma de aceitar qualquer
 * componente filho no React com TypeScript.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  // Estado do usuário logado
  const [user, setUser] = useState<User | null>(null);

  /**
   * Lista de usuários cadastrados.
   * Usamos useState para que novos cadastros persistam durante a sessão.
   * (Ao fechar o app, os dados são perdidos – isso é esperado neste protótipo)
   */
  const [users, setUsers] = useState<User[]>(INITIAL_USERS_MOCK);

  // ----------------------------------------------------------------
  // login
  // ----------------------------------------------------------------
  function login(email: string, password: string): boolean {
    // Busca um usuário com email E senha correspondentes
    const foundUser = users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password
    );

    if (foundUser) {
      setUser(foundUser); // atualiza o estado → o app detecta o login
      return true;
    }

    return false; // credenciais inválidas
  }

  // ----------------------------------------------------------------
  // register
  // ----------------------------------------------------------------
  function register(
    name: string,
    email: string,
    password: string
  ): { success: boolean; error?: string } {
    // Verifica se o e-mail já está em uso (case-insensitive)
    const emailExists = users.some(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (emailExists) {
      return { success: false, error: "Este e-mail já está cadastrado." };
    }

    // Cria o novo usuário
    const newUser: User = {
      id: generateId(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
    };

    // Adiciona à lista e loga automaticamente
    setUsers((prev) => [...prev, newUser]);
    setUser(newUser);

    return { success: true };
  }

  // ----------------------------------------------------------------
  // logout
  // ----------------------------------------------------------------
  function logout() {
    setUser(null); // limpa o usuário → o app redireciona para o login
  }

  // ----------------------------------------------------------------
  // Retorno do Provider
  // ----------------------------------------------------------------
  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ------------------------------------------------------------------
// Hook personalizado
// ------------------------------------------------------------------

/**
 * useAuth é um hook personalizado que simplifica o consumo do contexto.
 *
 * Em vez de escrever `useContext(AuthContext)` em cada componente,
 * basta importar e chamar `useAuth()`.
 *
 * Exemplo de uso:
 *   const { user, login, logout } = useAuth();
 */
export function useAuth() {
  return useContext(AuthContext);
}
