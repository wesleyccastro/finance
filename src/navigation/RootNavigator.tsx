/**
 * RootNavigator – Navegador raiz do app.
 *
 * É responsável por decidir qual navegador exibir:
 * - Se o usuário está logado → AppNavigator (telas do app)
 * - Se não está logado → AuthNavigator (login/cadastro)
 *
 * Sempre que `user` mudar (login ou logout), o React re-renderiza
 * este componente e exibe o navigator correto automaticamente.
 */
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { AuthNavigator } from "@/navigation/AuthNavigator";
import { AppNavigator } from "@/navigation/AppNavigator";

export function RootNavigator() {
  /**
   * Lemos o usuário do contexto de autenticação.
   * - user !== null → está logado
   * - user === null → não está logado
   */
  const { user } = useAuth();

  // Condicional simples: exibe o app ou o fluxo de autenticação
  if (user) {
    return <AppNavigator />;
  }

  return <AuthNavigator />;
}
