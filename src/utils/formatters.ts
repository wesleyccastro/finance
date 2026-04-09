/**
 * Funções utilitárias de formatação.
 *
 * Funções "puras": recebem um valor e retornam outro, sem efeitos colaterais.
 * São fáceis de testar e reutilizar em qualquer parte do app.
 */

// ------------------------------------------------------------------
// Moeda
// ------------------------------------------------------------------

/**
 * Formata um número como moeda brasileira (R$).
 *
 * Exemplo: formatCurrency(1234.5) → "R$ 1.234,50"
 *
 * `Intl.NumberFormat` é a API nativa do JavaScript para internacionalização.
 * "pt-BR" define o locale brasileiro; "BRL" é o código da moeda.
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

// ------------------------------------------------------------------
// Datas
// ------------------------------------------------------------------

/**
 * Formata uma data ISO ("YYYY-MM-DD") para o formato brasileiro ("DD/MM/YYYY").
 *
 * Exemplo: formatDate("2024-03-15") → "15/03/2024"
 *
 * O parâmetro `{ timeZone: "UTC" }` evita que a data "salte" um dia
 * por causa da diferença de fuso horário.
 */
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

/**
 * Retorna a data atual no formato ISO ("YYYY-MM-DD").
 *
 * Útil para preencher o campo de data ao criar uma nova transação.
 * Exemplo: getCurrentDateISO() → "2024-03-15"
 */
export function getCurrentDateISO(): string {
  return new Date().toISOString().split("T")[0];
}

// ------------------------------------------------------------------
// IDs
// ------------------------------------------------------------------

/**
 * Gera um ID único simples baseado em timestamp + número aleatório.
 *
 * Exemplo: generateId() → "1710500123456-4872"
 *
 * ⚠️ Para produção, use bibliotecas como `uuid` para IDs realmente únicos.
 * Aqui usamos essa solução simples por ser um app educacional sem banco de dados.
 */
export function generateId(): string {
  return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}
