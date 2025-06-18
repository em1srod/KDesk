// kdesk.js - Controle completo com cadastro, login e gestão de clientes/projetos por usuário

let userEmail = null;
let indexEditandoCliente = null;
let indexEditandoProjeto = null;

function cadastrarUsuario() {
  const nome = document.getElementById("nomeCadastro").value.trim();
  const email = document.getElementById("emailCadastro").value.trim().toLowerCase();
  const senha = document.getElementById("senhaCadastro").value;

  if (!nome || !email || !senha) {
    alert("Preencha todos os campos.");
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const existente = usuarios.find(u => u.email === email);

  if (existente) {
    alert("Já existe um usuário com este e-mail.");
    return;
  }

  usuarios.push({ nome, email, senha });
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  alert("Usuário cadastrado com sucesso!");
  mostrarLogin();
}

function login() {
  const email = document.getElementById("emailLogin").value.trim().toLowerCase();
  const senha = document.getElementById("senhaLogin").value;
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const user = usuarios.find(u => u.email === email && u.senha === senha);

  if (!user) {
    alert("E-mail ou senha inválidos.");
    return;
  }

  userEmail = email;
  document.getElementById("loginSection").style.display = "none";
  document.getElementById("navbar").style.display = "block";

  listarClientes();
  listarProjetos();
  atualizarDashboard();

  mostrarSecao("panorama");
}

function logout() {
  userEmail = null;
  document.getElementById("navbar").style.display = "none";
  document.querySelectorAll(".pagina").forEach(sec => sec.style.display = "none");
  mostrarLogin();
}

function mostrarSecao(id) {
  document.querySelectorAll(".pagina").forEach(secao => secao.style.display = "none");
  document.getElementById(id).style.display = "block";

  if (id === "clientes") listarClientes();
  if (id === "projetos") listarProjetos();
  if (id === "panorama") atualizarDashboard();
}


function keyClientes() {
  return `clientes_${userEmail}`;
}

function keyProjetos() {
  return `projetos_${userEmail}`;
}

// CLIENTES
function abrirModalCliente() {
  indexEditandoCliente = null;
  document.getElementById("clienteNome").value = "";
  document.getElementById("clienteTelefone").value = "";
  document.getElementById("clienteEmail").value = "";
  document.getElementById("clienteObservacoes").value = "";
  document.getElementById("clienteModal").style.display = "flex";
}

function salvarCliente() {
  const nome = document.getElementById("clienteNome").value;
  const telefone = document.getElementById("clienteTelefone").value;
  const email = document.getElementById("clienteEmail").value;
  const observacoes = document.getElementById("clienteObservacoes").value;

  if (!nome.trim()) return alert("Nome é obrigatório.");

  const clientes = JSON.parse(localStorage.getItem(keyClientes())) || [];
  const cliente = { nome, telefone, email, observacoes };

  if (indexEditandoCliente !== null) {
    clientes[indexEditandoCliente] = cliente;
  } else {
    clientes.push(cliente);
  }
  localStorage.setItem(keyClientes(), JSON.stringify(clientes));
  fecharModal();
  listarClientes();
}

function editarCliente(index) {
  const clientes = JSON.parse(localStorage.getItem(keyClientes())) || [];
  const c = clientes[index];
  indexEditandoCliente = index;

  document.getElementById("clienteNome").value = c.nome;
  document.getElementById("clienteTelefone").value = c.telefone;
  document.getElementById("clienteEmail").value = c.email;
  document.getElementById("clienteObservacoes").value = c.observacoes;
  document.getElementById("clienteModal").style.display = "flex";
}

function excluirCliente(index) {
  const clientes = JSON.parse(localStorage.getItem(keyClientes())) || [];
  if (confirm("Excluir este cliente?")) {
    clientes.splice(index, 1);
    localStorage.setItem(keyClientes(), JSON.stringify(clientes));
    listarClientes();
  }
}

function listarClientes() {
  const lista = document.getElementById("listaClientes");
  const clientes = JSON.parse(localStorage.getItem(keyClientes())) || [];
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
      <hr/>`;
    lista.appendChild(div);
  });
}

function exportarClientesPDF() {
  const { jsPDF } = window.jspdf;
  const clientes = JSON.parse(localStorage.getItem(keyClientes())) || [];
  if (clientes.length === 0) return alert("Nenhum cliente para exportar.");

  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text("Clientes - KDesk", 10, 15);
  let y = 25;

  clientes.forEach((c, i) => {
    doc.text(`${i + 1}. ${c.nome} | ${c.telefone || "-"} | ${c.email || "-"} | ${c.observacoes || "-"}`, 10, y);
    y += 10;
    if (y > 270) { doc.addPage(); y = 20; }
  });

  doc.save("clientes-kdesk.pdf");
}

// PROJETOS
function abrirModalProjeto() {
  indexEditandoProjeto = null;
  document.getElementById("projetoNome").value = "";
  document.getElementById("projetoPrazo").value = "";
  document.getElementById("projetoValor").value = "";
  document.getElementById("projetoPago").value = "";
  document.getElementById("projetoObs").value = "";

  const clientes = JSON.parse(localStorage.getItem(keyClientes())) || [];
  const select = document.getElementById("projetoCliente");
  select.innerHTML = '<option value="">Selecione um cliente</option>';
  clientes.forEach(c => {
    const option = document.createElement("option");
    option.value = c.nome;
    option.textContent = c.nome;
    select.appendChild(option);
  });

  document.getElementById("projetoModal").style.display = "flex";
}


function salvarProjeto() {
  const nome = document.getElementById("projetoNome").value;
  const prazo = document.getElementById("projetoPrazo").value;
  const valor = parseFloat(document.getElementById("projetoValor").value);
  const pago = parseFloat(document.getElementById("projetoPago").value);
  const obs = document.getElementById("projetoObs").value;
  const restante = valor - pago;
  const cliente = document.getElementById("projetoCliente").value;

  const projetos = JSON.parse(localStorage.getItem(keyProjetos())) || [];
  const projeto = { nome, prazo, valor, pago, restante, obs, cliente };

  if (indexEditandoProjeto !== null) {
    projetos[indexEditandoProjeto] = projeto;
  } else {
    projetos.push(projeto);
  }

  localStorage.setItem(keyProjetos(), JSON.stringify(projetos));
  fecharModal();
  listarProjetos();
}

function editarProjeto(index) {
  const projetos = JSON.parse(localStorage.getItem(keyProjetos())) || [];
  const p = projetos[index];
  indexEditandoProjeto = index;

  document.getElementById("projetoNome").value = p.nome;
  document.getElementById("projetoPrazo").value = p.prazo;
  document.getElementById("projetoValor").value = p.valor;
  document.getElementById("projetoPago").value = p.pago;
  document.getElementById("projetoObs").value = p.obs;
  document.getElementById("projetoModal").style.display = "flex";
  document.getElementById("projetoCliente").value = p.cliente || "";

}

function excluirProjeto(index) {
  const projetos = JSON.parse(localStorage.getItem(keyProjetos())) || [];
  if (confirm("Excluir este projeto?")) {
    projetos.splice(index, 1);
    localStorage.setItem(keyProjetos(), JSON.stringify(projetos));
    listarProjetos();
  }
}

function listarProjetos() {
  const lista = document.getElementById("listaProjetos");
  const projetos = JSON.parse(localStorage.getItem(keyProjetos())) || [];
  lista.innerHTML = "";

if (projetos.length === 0) {
  lista.innerHTML = "<p>Nenhum projeto cadastrado.</p>";
  return;
}


  projetos.forEach((p, index) => {
    const div = document.createElement("div");
    div.className = "cliente-card";
    div.innerHTML = `
      <strong>${p.nome}</strong><br/>
      📁 Cliente: ${p.cliente || "-"}<br/>
      📅 Prazo: ${p.prazo || "-"}<br/>
      💰 Total: R$ ${p.valor || 0} | Pago: R$ ${p.pago || 0} | Restante: R$ ${p.restante || 0}<br/>
      📝 ${p.obs || "-"}<br/>
      <button onclick="editarProjeto(${index})">Editar</button>
      <button onclick="excluirProjeto(${index})">Excluir</button>
      <hr/>`;
    lista.appendChild(div);
  });
}

function exportarProjetosPDF() {
  const { jsPDF } = window.jspdf;
  const projetos = JSON.parse(localStorage.getItem(keyProjetos())) || [];
  if (projetos.length === 0) return alert("Nenhum projeto para exportar.");

  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text("Projetos - KDesk", 10, 15);
  let y = 25;

  projetos.forEach((p, i) => {
    doc.text(`${i + 1}. ${p.nome} | R$${p.valor} | Pago: R$${p.pago} | Restante: R$${p.restante} | ${p.prazo} | ${p.obs}`, 10, y);
    y += 10;
    if (y > 270) { doc.addPage(); y = 20; }
  });

  doc.save("projetos-kdesk.pdf");
}

function fecharModal() {
  document.getElementById("clienteModal").style.display = "none";
  document.getElementById("projetoModal").style.display = "none";
}
function atualizarDashboard() {
  const container = document.getElementById("indicadores");
  const clientes = JSON.parse(localStorage.getItem(keyClientes())) || [];
  const projetos = JSON.parse(localStorage.getItem(keyProjetos())) || [];

  let totalProjetos = projetos.length;
  let totalClientes = clientes.length;

  let valorTotal = projetos.reduce((acc, p) => acc + (p.valor || 0), 0);
  let valorPago = projetos.reduce((acc, p) => acc + (p.pago || 0), 0);
  let restante = valorTotal - valorPago;

  container.innerHTML = `
    <p><strong>Total de Projetos:</strong> ${totalProjetos}</p>
    <p><strong>Total de Clientes:</strong> ${totalClientes}</p>
    <p><strong>Balanço Financeiro:</strong></p>
    <ul>
      <li><strong>Valor Total:</strong> R$ ${valorTotal.toFixed(2)}</li>
      <li><strong>Pago:</strong> R$ ${valorPago.toFixed(2)}</li>
      <li><strong>Restante:</strong> R$ ${restante.toFixed(2)}</li>
    </ul>
  `;
}
