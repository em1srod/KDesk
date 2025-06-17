let indexEditando = null;

function novoCliente() {
  indexEditando = null;
  document.getElementById("modalTitulo").innerText = "Novo Cliente";
  document.getElementById("clienteNome").value = "";
  document.getElementById("clienteTelefone").value = "";
  document.getElementById("clienteEmail").value = "";
  document.getElementById("clienteObservacoes").value = "";
  document.getElementById("clienteModal").style.display = "flex";
}

function editarCliente(index) {
  const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
  const cliente = clientes[index];
  indexEditando = index;

  document.getElementById("modalTitulo").innerText = "Editar Cliente";
  document.getElementById("clienteNome").value = cliente.nome;
  document.getElementById("clienteTelefone").value = cliente.telefone;
  document.getElementById("clienteEmail").value = cliente.email;
  document.getElementById("clienteObservacoes").value = cliente.observacoes;
  document.getElementById("clienteModal").style.display = "flex";
}

function salvarCliente() {
  const nome = document.getElementById("clienteNome").value;
  const telefone = document.getElementById("clienteTelefone").value;
  const email = document.getElementById("clienteEmail").value;
  const observacoes = document.getElementById("clienteObservacoes").value;

  if (!nome.trim()) {
    alert("Nome é obrigatório.");
    return;
  }

  const clientes = JSON.parse(localStorage.getItem("clientes")) || [];

  const cliente = { nome, telefone, email, observacoes };

  if (indexEditando !== null) {
    clientes[indexEditando] = cliente;
  } else {
    clientes.push(cliente);
  }

  localStorage.setItem("clientes", JSON.stringify(clientes));
  fecharModal();
  listarClientes();
}

function fecharModal() {
  document.getElementById("clienteModal").style.display = "none";
}

function listarClientes() {
  const lista = document.getElementById("listaClientes");
  const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
  lista.innerHTML = "";

  if (clientes.length === 0) {
    lista.innerHTML = "<p>Nenhum cliente cadastrado.</p>";
    return;
  }

  clientes.forEach((cliente, index) => {
    const div = document.createElement("div");
    div.className = "cliente-card";
    div.innerHTML = `
      <strong>${cliente.nome}</strong><br/>
      📞 ${cliente.telefone || "-"}<br/>
      ✉️ ${cliente.email || "-"}<br/>
      📝 ${cliente.observacoes || "-"}<br/>
      <button onclick="editarCliente(${index})">Editar</button>
      <button onclick="excluirCliente(${index})">Excluir</button>
      <hr/>
    `;
    lista.appendChild(div);
  });
}
