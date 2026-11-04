const formulario = document.getElementById("formProduto");
const mensagem = document.getElementById("mensagem");

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const categoria = document.getElementById("categoria").value;
  const descricao = document.getElementById("descricao").value.trim();
  const preco = Number(document.getElementById("preco").value);
  const estoque = Number(document.getElementById("estoque").value);

  if (
    !nome ||
    !categoria ||
    !Number.isFinite(preco) ||
    preco < 0 ||
    !Number.isInteger(estoque) ||
    estoque < 0
  ) {
    mensagem.textContent = "Confira os dados informados.";
    return;
  }

  const produtos = JSON.parse(
    localStorage.getItem("taverna3d_produtos") || "[]",
  );

  produtos.push({
    id: crypto.randomUUID(),
    nome,
    categoria,
    descricao,
    preco,
    estoque,
  });

  localStorage.setItem("taverna3d_produtos", JSON.stringify(produtos));

  mensagem.textContent = "Produto cadastrado com sucesso!";
  formulario.reset();
});
