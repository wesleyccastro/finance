/**
 * App.tsx – Ponto de entrada do aplicativo.
 *
 * Aqui configuramos os "providers" que envolvem todo o app:
 *
 * 1. GestureHandlerRootView  → necessário para gestos (react-native-gesture-handler)
 * 2. SafeAreaProvider        → necessário para useSafeAreaInsets
 * 3. NavigationContainer     → necessário para o React Navigation funcionar
 * 4. AuthProvider            → fornece dados de autenticação para todo o app
 * 5. FinanceProvider         → fornece dados financeiros para todo o app
 * 6. RootNavigator           → decide qual tela mostrar (login ou app)
 *
 * A ordem dos providers importa: os mais externos ficam disponíveis
 * para todos os internos. Por isso os providers de contexto ficam
 * dentro do NavigationContainer, mas fora do RootNavigator.
 */
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";

import { AuthProvider } from "@/context/AuthContext";
import { FinanceProvider } from "@/context/FinanceContext";
import { RootNavigator } from "@/navigation/RootNavigator";

export default function App() {
  return (
    // GestureHandlerRootView deve ser o componente mais externo
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* SafeAreaProvider habilita o uso de áreas seguras em todo o app */}
      <SafeAreaProvider>
        {/* NavigationContainer gerencia o estado de navegação */}
        <NavigationContainer>
          {/* AuthProvider: torna os dados de autenticação disponíveis globalmente */}
          <AuthProvider>
            {/* FinanceProvider: torna os dados financeiros disponíveis globalmente */}
            <FinanceProvider>
              {/* RootNavigator: exibe Login ou App dependendo do estado de auth */}
              <RootNavigator />
            </FinanceProvider>
          </AuthProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
