/**
 * AuthNavigator – Navegador de Autenticação.
 *
 * createNativeStackNavigator cria uma pilha (stack) de telas.
 * Funciona como uma pilha de cartões: você empilha novas telas
 * e pode remover do topo para voltar.
 *
 * Este navigator só contém as telas de Login e Cadastro.
 * Quando o usuário fizer login, o RootNavigator trocará para o AppNavigator.
 */
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthStackParamList } from "@/navigation/types";
import { LoginScreen } from "@/screens/auth/LoginScreen";
import { RegisterScreen } from "@/screens/auth/RegisterScreen";

/**
 * Stack é um objeto com dois componentes:
 * - Stack.Navigator: define as configurações do navegador
 * - Stack.Screen: registra cada tela dentro do navegador
 */
const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <Stack.Navigator
      // A tela inicial é o Login
      initialRouteName="Login"
      screenOptions={{
        // Ocultamos o header padrão do React Navigation
        // pois usamos nosso próprio componente AppHeader
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}
