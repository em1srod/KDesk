document.getElementById("formCliente").addEventListener("submit", function (e) {
  e.preventDefault();
  const cliente = {
    nome: document.getElementById("nomeCliente").value,
    telefone: document.getElementById("telefoneCliente").value,
    email: document.getElementById("emailCliente").value,
    observacoes: document.getElementById("obsCliente").value,
  };
  localStorage.setItem("cliente_" + cliente.nome, JSON.stringify(cliente));
  alert("Cliente salvo com sucesso!");
  this.reset();
});

document.getElementById("formProjeto").addEventListener("submit", function (e) {
  e.preventDefault();
  const valorTotal = parseFloat(document.getElementById("valorTotal").value) || 0;
  const valorPago = parseFloat(document.getElementById("valorPago").value) || 0;
  const projeto = {
    nome: document.getElementById("nomeProjeto").value,
    inicio: document.getElementById("dataInicio").value,
    fim: document.getElementById("dataFim").value,
    prazo: document.getElementById("prazo").value,
    valorTotal: valorTotal,
    valorPago: valorPago,
    valorRestante: valorTotal - valorPago,
    formaPagamento: document.getElementById("formaPagamento").value,
    observacoes: document.getElementById("obsProjeto").value,
  };
  localStorage.setItem("projeto_" + projeto.nome, JSON.stringify(projeto));
  alert("Projeto salvo com sucesso!");
  this.reset();
});
