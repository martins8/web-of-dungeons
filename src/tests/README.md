# 🔧 Comandos Úteis

## Executar todos os testes

npm test
npx jest

## Executar testes em modo watch

npm test -- --watch
npx jest --watch

## Executar um arquivo específico

npx jest meu-arquivo.test.js

## Executar testes com cobertura

npx jest --coverage

## Executar testes que contenham um nome específico

npx jest -t "nome do teste"

# 📝 Estrutura de Testes

```js
describe("Grupo de testes", () => {
  beforeAll(() => {
    // Executa uma vez antes de todos os testes
  });
  beforeEach(() => {
    // Executa antes de cada teste
  });
  afterEach(() => {
    // Executa depois de cada teste
  });
  afterAll(() => {
    // Executa uma vez depois de todos os testes
  });
  test("deve fazer algo", () => {
    expect(algo).toBe(algo);
  });
  it('também pode usar "it"', () => {
    // Mesma coisa que test()
  });
});
```

# ✅ Matchers Comuns

```js
// Igualdade
expect(valor).toBe(esperado); // Comparação estrita (===)
expect(valor).toEqual(esperado); // Comparação profunda de objetos/arrays
// Verdade/Falsidade
expect(valor).toBeTruthy();
expect(valor).toBeFalsy();
expect(valor).toBeNull();
expect(valor).toBeUndefined();
expect(valor).toBeDefined();
// Números
expect(valor).toBeGreaterThan(3);
expect(valor).toBeGreaterThanOrEqual(3.5);
expect(valor).toBeLessThan(5);
expect(valor).toBeLessThanOrEqual(4.5);
expect(valor).toBeCloseTo(0.3); // Para números de ponto flutuante
// Strings
expect(valor).toMatch(/regex/);
expect(valor).toContain("substring");
// Arrays
expect(array).toContain(item);
expect(array).toHaveLength(3);
// Objetos
expect(obj).toHaveProperty("chave", valor);
// Exceções
expect(funcao).toThrow();
expect(funcao).toThrowError("mensagem de erro");
// Negação
expect(valor).not.toBe(esperado);
```

# 🎯 Testes Assíncronos

```js
// Promises
test("teste assíncrono", () => {
  return fetchData().then((data) => {
    expect(data).toBe("dados");
  });
});
// Async/Await
test("teste async/await", async () => {
  const data = await fetchData();
  expect(data).toBe("dados");
});
// Callbacks
test("teste com callback", (done) => {
  fetchData((data) => {
    expect(data).toBe("dados");
    done();
  });
});
```

# 🚦 Boas Práticas

## Nome descritivo:

Use nomes que descrevam o comportamento esperado

## Um assert por teste:

Idealmente, cada teste deve verificar uma coisa

## Arrange-Act-Assert:

Organize seu teste em 3 fases claras

## Testes independentes:

Cada teste deve poder rodar isoladamente

## Evitar lógica complexa:

Testes devem ser simples e diretos

## Usar describe para agrupar:

Organize testes relacionados
