
const CHAVE_PRODUTOS = "taverna3d_produtos";

const campoPesquisa = document.getElementById("pesquisa");
const filtroCategoria = document.getElementById("filtroCategoria");
const listaProdutos = document.getElementById("listaProdutos");
const totalProdutos = document.getElementById("totalProdutos");
const mensagemVazia = document.getElementById("mensagemVazia");

// Recupera os produtos salvos no cadastro
function obterProdutos() {
    return JSON.parse(localStorage.getItem(CHAVE_PRODUTOS)) || [];
}

// Salva as alterações
function salvarProdutos(produtos) {
    localStorage.setItem(CHAVE_PRODUTOS, JSON.stringify(produtos));
}

// Formata o preço em reais
function formatarPreco(preco) {
    return Number(preco).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// Atualiza as opções de categoria
function atualizarCategorias(produtos) {
    const categoriaSelecionada = filtroCategoria.value;

    filtroCategoria.replaceChildren();

    const opcaoTodas = document.createElement("option");
    opcaoTodas.value = "";
    opcaoTodas.textContent = "Todas as categorias";
    filtroCategoria.appendChild(opcaoTodas);

    const categorias = [...new Set(
        produtos.map(produto => produto.categoria).filter(Boolean)
    )];

    categorias.forEach(categoria => {
        const opcao = document.createElement("option");
        opcao.value = categoria;
        opcao.textContent = categoria;
        filtroCategoria.appendChild(opcao);
    });

    filtroCategoria.value = categorias.includes(categoriaSelecionada)
        ? categoriaSelecionada
        : "";
}

// Exibe os produtos na tabela
function exibirProdutos() {
    const produtos = obterProdutos();

    atualizarCategorias(produtos);

    const pesquisa = campoPesquisa.value.toLowerCase().trim();
    const categoria = filtroCategoria.value;

    const produtosFiltrados = produtos.filter(produto => {
        const nome = String(produto.nome || "").toLowerCase();

        const correspondeNome = nome.includes(pesquisa);
        const correspondeCategoria =
            !categoria || produto.categoria === categoria;

        return correspondeNome && correspondeCategoria;
    });

    listaProdutos.replaceChildren();

    produtosFiltrados.forEach(produto => {
        const linha = document.createElement("tr");

        const dados = [
            produto.nome,
            produto.categoria,
            produto.descricao,
            formatarPreco(produto.preco),
            produto.estoque
        ];

        dados.forEach(valor => {
            const celula = document.createElement("td");
            celula.textContent = valor ?? "";
            linha.appendChild(celula);
        });

        const celulaAcoes = document.createElement("td");

        const botaoEditar = document.createElement("button");
        botaoEditar.textContent = "Editar";
        botaoEditar.className = "btn-editar";
        botaoEditar.addEventListener("click", () => editarProduto(produto.id));

        const botaoExcluir = document.createElement("button");
        botaoExcluir.textContent = "Excluir";
        botaoExcluir.className = "btn-excluir";
        botaoExcluir.addEventListener("click", () => excluirProduto(produto.id));

        celulaAcoes.append(botaoEditar, botaoExcluir);
        linha.appendChild(celulaAcoes);

        listaProdutos.appendChild(linha);
    });

    totalProdutos.textContent = produtosFiltrados.length;

    mensagemVazia.hidden = produtosFiltrados.length !== 0;
}

// Edita um produto cadastrado
function editarProduto(id) {
    const produtos = obterProdutos();
    const produto = produtos.find(item => item.id === id);

    if (!produto) return;

    const nome = prompt("Nome do produto:", produto.nome);
    if (nome === null) return;

    const categoria = prompt("Categoria:", produto.categoria);
    if (categoria === null) return;

    const precoTexto = prompt("Preço:", produto.preco);
    if (precoTexto === null) return;

    const estoqueTexto = prompt("Estoque:", produto.estoque);
    if (estoqueTexto === null) return;

    const preco = Number(precoTexto.replace(",", "."));
    const estoque = Number(estoqueTexto);

    if (!nome.trim() || !categoria.trim() ||
        precoTexto.trim() === "" || estoqueTexto.trim() === "" ||
        !Number.isFinite(preco) || preco < 0 ||
        !Number.isInteger(estoque) || estoque < 0) {
        alert("Preencha os dados corretamente.");
        return;
    }

    produto.nome = nome.trim();
    produto.categoria = categoria.trim();
    produto.preco = preco;
    produto.estoque = estoque;

    salvarProdutos(produtos);
    exibirProdutos();

    alert("Produto atualizado com sucesso!");
}

// Exclui um produto
function excluirProduto(id) {
    const confirmar = confirm(
        "Tem certeza que deseja excluir este produto?"
    );

    if (!confirmar) return;

    const produtos = obterProdutos();
    const produtosAtualizados = produtos.filter(
        produto => produto.id !== id
    );

    salvarProdutos(produtosAtualizados);
    exibirProdutos();

    alert("Produto excluído com sucesso!");
}

// Eventos dos filtros
campoPesquisa.addEventListener("input", exibirProdutos);
filtroCategoria.addEventListener("change", exibirProdutos);

// Carrega os produtos ao abrir a página
exibirProdutos();
