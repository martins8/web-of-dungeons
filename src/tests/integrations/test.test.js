function somador(a, b) {
  const somatoria = a + b;
  return somatoria;
}

test("soamtoria", () => {
  const resultado = somador(2, 5);
  console.log(resultado);
  expect(resultado).toEqual(7);
});
