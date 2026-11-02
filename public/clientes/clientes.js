
const formCliente = document.getElementById("formCliente");
const mensagem = document.getElementById("mensagem");

formCliente.addEventListener("submit", function(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const cpf = document.getElementById("cpf").value.trim();
    const telefone = document.getElementById("telefone").value.trim();

    if (!nome || !cpf || !telefone) {
        mensagem.textContent = "Preencha todos os campos!";
        return;
    }

    // Recupera os clientes já cadastrados
    const clientes = JSON.parse(localStorage.getItem("clientes")) || [];

    // Verifica se o CPF já está cadastrado
    const cpfExistente = clientes.some(cliente => cliente.cpf === cpf);

    if (cpfExistente) {
        mensagem.textContent = "Este CPF já está cadastrado!";
        return;
    }

    // Cria o novo cliente
    const novoCliente = {
        nome: nome,
        cpf: cpf,
        telefone: telefone
    };

    clientes.push(novoCliente);

    // Salva os clientes no navegador
    localStorage.setItem("clientes", JSON.stringify(clientes));

    mensagem.textContent = "Cliente cadastrado com sucesso!";

    formCliente.reset();
});
