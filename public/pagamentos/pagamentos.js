
const form = document.getElementById("formPagamento");
const selectPedido = document.getElementById("pedido");
const valorInput = document.getElementById("valor");
const informacoesPedido = document.getElementById("informacoesPedido");
const mensagem = document.getElementById("mensagem");
const historico = document.getElementById("historicoPagamentos");

function carregarDados(chave) {
    return JSON.parse(localStorage.getItem(chave)) || [];
}

// Carrega os pedidos e pagamentos
function carregarPedidos() {
    return carregarDados("pedidos");
}

function carregarPagamentos() {
    return carregarDados("pagamentos");
}

// Calcula quanto já foi pago em determinado pedido
function calcularValorPago(idPedido) {
    const pagamentos = carregarPagamentos();

    return pagamentos
        .filter(p => String(p.pedidoId) === String(idPedido))
        .reduce((total, p) => total + Number(p.valor), 0);
}

// Preenche a lista de pedidos
function carregarListaPedidos() {
    const pedidos = carregarPedidos();

    selectPedido.innerHTML =
        '<option value="">Selecione um pedido</option>';

    pedidos.forEach(pedido => {
        const opcao = document.createElement("option");

        opcao.value = pedido.id;
        opcao.textContent =
            `Pedido #${pedido.id} - ${pedido.cliente}`;

        selectPedido.appendChild(opcao);
    });
}

// Mostra os valores do pedido selecionado
function mostrarInformacoesPedido() {
    const pedido = carregarPedidos().find(
        p => String(p.id) === selectPedido.value
    );

    if (!pedido) {
        informacoesPedido.textContent = "";
        return;
    }

    const totalPago = calcularValorPago(pedido.id);
    const saldo = Number(pedido.total) - totalPago;

    informacoesPedido.textContent =
        `Total: R$ ${Number(pedido.total).toFixed(2)} | ` +
        `Pago: R$ ${totalPago.toFixed(2)} | ` +
        `Restante: R$ ${saldo.toFixed(2)}`;

    valorInput.max = Math.max(0, saldo).toFixed(2);
}

selectPedido.addEventListener("change", mostrarInformacoesPedido);

// Define a data atual
document.getElementById("dataPagamento").value =
    new Date().toLocaleDateString("en-CA");

// Registra o pagamento
form.addEventListener("submit", function(event) {
    event.preventDefault();

    const pedidos = carregarPedidos();

    const pedido = pedidos.find(
        p => String(p.id) === selectPedido.value
    );

    const valor = Number(valorInput.value);
    const metodo = document.getElementById("metodo").value;
    const data = document.getElementById("dataPagamento").value;

    if (!pedido) {
        mensagem.textContent = "Selecione um pedido válido.";
        return;
    }

    if (!Number.isFinite(valor) || valor <= 0) {
        mensagem.textContent =
            "O valor do pagamento deve ser maior que zero.";
        return;
    }

    const totalPago = calcularValorPago(pedido.id);
    const saldo = Number(pedido.total) - totalPago;

    if (valor > saldo + 0.000001) {
        mensagem.textContent =
            "O pagamento ultrapassa o valor restante do pedido.";
        return;
    }

    const pagamento = {
        id: Date.now(),
        pedidoId: pedido.id,
        cliente: pedido.cliente,
        valor: valor,
        metodo: metodo,
        data: data
    };

    const pagamentos = carregarPagamentos();

    pagamentos.push(pagamento);

    localStorage.setItem(
        "pagamentos",
        JSON.stringify(pagamentos)
    );

    mensagem.textContent =
        "Pagamento registrado com sucesso!";

    form.reset();

    document.getElementById("dataPagamento").value =
        new Date().toLocaleDateString("en-CA");

    mostrarInformacoesPedido();
    mostrarHistoricoPagamentos();
});

// Mostra o histórico de pagamentos
function mostrarHistoricoPagamentos() {
    const pagamentos = carregarPagamentos();

    historico.innerHTML = "";

    if (pagamentos.length === 0) {
        historico.textContent = "Nenhum pagamento registrado.";
        return;
    }

    pagamentos.forEach(pagamento => {
        const item = document.createElement("div");

        const titulo = document.createElement("h3");
        titulo.textContent = `Pagamento #${pagamento.id}`;

        const pedido = document.createElement("p");
        pedido.textContent = `Pedido: #${pagamento.pedidoId}`;

        const cliente = document.createElement("p");
        cliente.textContent = `Cliente: ${pagamento.cliente}`;

        const valor = document.createElement("p");
        valor.textContent =
            `Valor: R$ ${Number(pagamento.valor).toFixed(2)}`;

        const metodo = document.createElement("p");
        metodo.textContent =
            `Forma de pagamento: ${pagamento.metodo}`;

        const data = document.createElement("p");
        data.textContent = `Data: ${pagamento.data}`;

        item.append(
            titulo,
            pedido,
            cliente,
            valor,
            metodo,
            data
        );

        historico.appendChild(item);
    });
}

// Inicializa a tela
carregarListaPedidos();
mostrarHistoricoPagamentos();
