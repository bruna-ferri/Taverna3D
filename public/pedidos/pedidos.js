
const formPedido = document.getElementById("formPedido");
const selectCliente = document.getElementById("cliente");
const listaItens = document.getElementById("listaItens");
const totalElemento = document.getElementById("total");
const mensagem = document.getElementById("mensagem");
const historico = document.getElementById("historicoPedidos");

// Recupera os dados salvos no navegador
function carregarDados(chave) {
    return JSON.parse(localStorage.getItem(chave)) || [];
}

const clientes = carregarDados("clientes");
const produtos = carregarDados("produtos");

// Preenche a lista de clientes
clientes.forEach(cliente => {
    const opcao = document.createElement("option");
    opcao.value = cliente.cpf;
    opcao.textContent = cliente.nome;
    selectCliente.appendChild(opcao);
});

// Define a data atual
document.getElementById("dataPedido").value =
    new Date().toLocaleDateString("en-CA");

// Adiciona uma linha de produto
function adicionarProduto() {
    const linha = document.createElement("div");
    linha.className = "item-pedido";

    const selectProduto = document.createElement("select");
    selectProduto.className = "produto";
    selectProduto.required = true;

    const opcaoInicial = document.createElement("option");
    opcaoInicial.value = "";
    opcaoInicial.textContent = "Selecione um produto";
    selectProduto.appendChild(opcaoInicial);

    produtos.forEach(produto => {
        const opcao = document.createElement("option");
        opcao.value = produto.nome;
        opcao.textContent = `${produto.nome} - R$ ${Number(produto.preco).toFixed(2)}`;
        selectProduto.appendChild(opcao);
    });

    const quantidade = document.createElement("input");
    quantidade.type = "number";
    quantidade.className = "quantidade";
    quantidade.min = "1";
    quantidade.value = "1";
    quantidade.required = true;
    quantidade.placeholder = "Quantidade";

    const remover = document.createElement("button");
    remover.type = "button";
    remover.textContent = "Remover";

    remover.addEventListener("click", () => {
        linha.remove();
        calcularTotal();
    });

    selectProduto.addEventListener("change", calcularTotal);
    quantidade.addEventListener("input", calcularTotal);

    linha.appendChild(selectProduto);
    linha.appendChild(quantidade);
    linha.appendChild(remover);

    listaItens.appendChild(linha);

    calcularTotal();
}

// Calcula o valor total
function calcularTotal() {
    let total = 0;

    document.querySelectorAll(".item-pedido").forEach(linha => {
        const nomeProduto = linha.querySelector(".produto").value;
        const quantidade = Number(
            linha.querySelector(".quantidade").value
        );

        const produto = produtos.find(p => p.nome === nomeProduto);

        if (produto && quantidade > 0) {
            total += Number(produto.preco) * quantidade;
        }
    });

    totalElemento.textContent = total.toFixed(2).replace(".", ",");
}

// Botão para adicionar produtos
document.getElementById("btnAdicionarProduto")
    .addEventListener("click", adicionarProduto);

// Cadastra o pedido
formPedido.addEventListener("submit", function(event) {
    event.preventDefault();

    const cliente = clientes.find(
        c => c.cpf === selectCliente.value
    );

    if (!cliente) {
        mensagem.textContent = "Selecione um cliente válido.";
        return;
    }

    const itens = [];

    document.querySelectorAll(".item-pedido").forEach(linha => {
        const nomeProduto = linha.querySelector(".produto").value;
        const quantidade = Number(
            linha.querySelector(".quantidade").value
        );

        const produto = produtos.find(p => p.nome === nomeProduto);

        if (produto && quantidade > 0) {
            itens.push({
                produto: produto.nome,
                quantidade: quantidade,
                precoUnitario: Number(produto.preco),
                subtotal: Number(produto.preco) * quantidade
            });
        }
    });

    if (itens.length === 0) {
        mensagem.textContent = "Adicione pelo menos um produto.";
        return;
    }

    const total = itens.reduce(
        (soma, item) => soma + item.subtotal, 0
    );

    const pedido = {
        id: Date.now(),
        cliente: cliente.nome,
        cpfCliente: cliente.cpf,
        data: document.getElementById("dataPedido").value,
        itens: itens,
        total: total,
        status: "Aguardando pagamento"
    };

    const pedidos = carregarDados("pedidos");
    pedidos.push(pedido);

    localStorage.setItem("pedidos", JSON.stringify(pedidos));

    mensagem.textContent = "Pedido cadastrado com sucesso!";

    formPedido.reset();
    listaItens.innerHTML = "";
    totalElemento.textContent = "0,00";

    document.getElementById("dataPedido").value =
        new Date().toLocaleDateString("en-CA");

    mostrarPedidos();
});

// Mostra os pedidos cadastrados
function mostrarPedidos() {
    const pedidos = carregarDados("pedidos");

    historico.innerHTML = "";

    if (pedidos.length === 0) {
        historico.textContent = "Nenhum pedido cadastrado.";
        return;
    }

    pedidos.forEach(pedido => {
        const card = document.createElement("div");

        const titulo = document.createElement("h3");
        titulo.textContent = `Pedido #${pedido.id}`;

        const cliente = document.createElement("p");
        cliente.textContent = `Cliente: ${pedido.cliente}`;

        const data = document.createElement("p");
        data.textContent = `Data: ${pedido.data}`;

        const valor = document.createElement("p");
        valor.textContent = `Total: R$ ${pedido.total.toFixed(2)}`;

        const status = document.createElement("p");
        status.textContent = `Status: ${pedido.status}`;

        card.append(titulo, cliente, data, valor, status);

        pedido.itens.forEach(item => {
            const detalhe = document.createElement("p");
            detalhe.textContent =
                `${item.produto} - Quantidade: ${item.quantidade}`;
            card.appendChild(detalhe);
        });

        historico.appendChild(card);
    });
}

// Inicialização
mostrarPedidos();

if (produtos.length > 0) {
    adicionarProduto();
}
