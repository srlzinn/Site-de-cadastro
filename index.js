const cadastroForm = document.getElementById('cadastroForm');
const tabelaMoradores = document.getElementById('tabelaMoradores').getElementsByTagName('tbody')[0];
const ordenarBtn = document.getElementById('ordenarBtn');
const celularInput = document.getElementById('celular');
const cpfInput = document.getElementById('cpf');
let moradores = [];

// Máscara para o campo de celular
celularInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 10) {
        value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 6) {
        value = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
    } else if (value.length > 2) {
        value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
        value = `(${value}`;
    }

    e.target.value = value;
});

// Máscara para o campo de CPF
cpfInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 9) {
        value = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6, 9)}-${value.slice(9)}`;
    } else if (value.length > 6) {
        value = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6)}`;
    } else if (value.length > 3) {
        value = `${value.slice(0, 3)}.${value.slice(3)}`;
    }

    e.target.value = value;
});

// Validação do CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, "");
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0, resto;

    for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i - 1]) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[9])) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i - 1]) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[10])) return false;

    return true;
}

// Evento de envio do formulário
cadastroForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const celular = celularInput.value.replace(/\D/g, "");
    const cpf = cpfInput.value.replace(/\D/g, "");
    const mesPago = document.getElementById('mesPago').value;
    const vencimento = document.getElementById('vencimento').value;
    const predio = document.getElementById('predio').value;
    const editIndex = document.getElementById('editIndex').value;

    if (!validarCPF(cpf)) {
        alert("CPF inválido!");
        return;
    }

    if (editIndex == -1) {
        moradores.push({ nome, celular, cpf, mesPago, vencimento, predio, anotacoes: "" });
    } else {
        moradores[editIndex] = { nome, celular, cpf, mesPago, vencimento, predio, anotacoes: moradores[editIndex].anotacoes };
        document.getElementById('editIndex').value = -1;
    }

    cadastroForm.reset();
    atualizarTabela();
});

function atualizarTabela() {
    tabelaMoradores.innerHTML = '';

    moradores.forEach((morador, index) => {
        const tr = document.createElement('tr');
        const tdNome = document.createElement('td');
        const tdCelular = document.createElement('td');
        const tdCpf = document.createElement('td');
        const tdPredio = document.createElement('td');
        const tdMesPago = document.createElement('td');
        const tdVencimento = document.createElement('td');
        const tdAnotacoes = document.createElement('td');
        const tdAcoes = document.createElement('td');

        tdNome.textContent = morador.nome;
        tdCelular.textContent = `(${morador.celular.slice(0, 2)}) ${morador.celular.slice(2, 7)}-${morador.celular.slice(7)}`;
        tdCpf.textContent = `${morador.cpf.slice(0, 3)}.${morador.cpf.slice(3, 6)}.${morador.cpf.slice(6, 9)}-${morador.cpf.slice(9)}`;
        tdPredio.textContent = morador.predio;
        tdMesPago.textContent = morador.mesPago ? new Date(morador.mesPago + "-01").toLocaleString('default', { month: 'long', year: 'numeric' }) : '-';
        tdVencimento.textContent = morador.vencimento;

        const txtAnotacoes = document.createElement('textarea');
        txtAnotacoes.value = morador.anotacoes;
        txtAnotacoes.oninput = (e) => {
            moradores[index].anotacoes = e.target.value;
        };
        tdAnotacoes.appendChild(txtAnotacoes);

        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        btnEditar.onclick = () => editarMorador(index);

        const btnExcluir = document.createElement('button');
        btnExcluir.textContent = 'Excluir';
        btnExcluir.onclick = () => excluirMorador(index);

        tdAcoes.appendChild(btnEditar);
        tdAcoes.appendChild(btnExcluir);

        tr.appendChild(tdNome);
        tr.appendChild(tdCelular);
        tr.appendChild(tdCpf);
        tr.appendChild(tdPredio);
        tr.appendChild(tdMesPago);
        tr.appendChild(tdVencimento);
        tr.appendChild(tdAnotacoes);
        tr.appendChild(tdAcoes);

        tabelaMoradores.appendChild(tr);
    });
}

function editarMorador(index) {
    const morador = moradores[index];
    document.getElementById('nome').value = morador.nome;
    document.getElementById('celular').value = `(${morador.celular.slice(0, 2)}) ${morador.celular.slice(2, 7)}-${morador.celular.slice(7)}`;
    document.getElementById('cpf').value = `${morador.cpf.slice(0, 3)}.${morador.cpf.slice(3, 6)}.${morador.cpf.slice(6, 9)}-${morador.cpf.slice(9)}`;
    document.getElementById('mesPago').value = morador.mesPago;
    document.getElementById('vencimento').value = morador.vencimento;
    document.getElementById('predio').value = morador.predio;
    document.getElementById('editIndex').value = index;
}

function excluirMorador(index) {
    moradores.splice(index, 1);
    atualizarTabela();
}
