// form (Erros "Config" Name, Email, Telefone, CPF, Select)

// Primeira Letra Maiuscula No Input Nome
const input = document.getElementById('nome');

input.addEventListener('input', (e) => {
    let valor = e.target.value;

    valor = valor.toLowerCase().replace(/(?:^|\s)\S/g, function (letra) {
        return letra.toUpperCase();
    });

    e.target.value = valor;
});

// 
// 
// Mensagem de Erro No Input Email
const email = document.getElementById('email');
const erroEmail = document.getElementById('erroEmail');

function validarEmail() {
    let textoEmail = '';

    if (email.validity.valueMissing) {
        textoEmail = 'Informe seu e-mail.';
    } else if (email.validity.typeMismatch) {
        textoEmail = 'Digite um e-mail válido, como nome@site.com.';
    }

    erroEmail.textContent = textoEmail;
    email.setAttribute('aria-invalid', textoEmail ? 'true' : 'false');
    return !textoEmail;
}

email.addEventListener('blur', validarEmail);

email.addEventListener('input', () => {
    if (email.getAttribute('aria-invalid') === 'true') validarEmail();
});

email.addEventListener('invalid', (e) => {
    e.preventDefault();
    validarEmail();
});

// 
// 
// 
// 
// Mensagem de Erro No Input CPF
const cpf = document.getElementById('cpf-cnpj');
const erroCpf = document.getElementById('erroCpf');

function mascararCpf(valor) {
    const d = valor.replace(/\D/g, '').slice(0, 14);

    if (d.length <= 11) {
        return d.replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return d.replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
}


function cpfValido(c) {
    if (/^(\d)\1+$/.test(c)) return false;
    for (const t of [9, 10]) {
        let soma = 0;
        for (let i = 0; i < t; i++) soma += Number(c[i]) * (t + 1 - i);
        if (((soma * 10) % 11) % 10 !== Number(c[t])) return false;
    }
    return true;
}

function cnpjValido(c) {
    if (/^(\d)\1+$/.test(c)) return false;
    const calc = (qtd) => {
        const pesos = qtd === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
        let soma = 0;
        for (let i = 0; i < qtd; i++) soma += Number(c[i]) * pesos[i];
        const resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
    };
    return calc(12) === Number(c[12]) && calc(13) === Number(c[13]);
}

function mensagemDeErroCpf(valor) {
    const d = valor.replace(/\D/g, '');

    if (d.length === 0) return 'Informe seu CPF ou CNPJ.';
    if (d.length < 11) return 'CPF incompleto. Ele tem 11 números.';
    if (d.length === 11) return cpfValido(d) ? '' : 'CPF inválido. Confira os números.';
    if (d.length < 14) return 'CNPJ incompleto. Ele tem 14 números.';
    return cnpjValido(d) ? '' : 'CNPJ inválido. Confira os números.';
}

function validarCpf() {
    const textoCpf = mensagemDeErroCpf(cpf.value);

    erroCpf.textContent = textoCpf;
    cpf.setAttribute('aria-invalid', textoCpf ? 'true' : 'false');
    return textoCpf === '';
}

cpf.addEventListener('input', () => {
    cpf.value = mascararCpf(cpf.value);
    if (cpf.getAttribute('aria-invalid') === 'true') validarCpf();
});
cpf.addEventListener('blur', validarCpf);
//
//
//
//
// Mensagem de Erro No Input Telefone
const tel = document.getElementById('telefone');
const erroTel = document.getElementById('erroTel');

// DDDs que existem no Brasil
const DDDS = new Set([
    11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28,
    31, 32, 33, 34, 35, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 49,
    51, 53, 54, 55, 61, 62, 63, 64, 65, 66, 67, 68, 69,
    71, 73, 74, 75, 77, 79, 81, 82, 83, 84, 85, 86, 87, 88, 89,
    91, 92, 93, 94, 95, 96, 97, 98, 99
]);

function limpar(valor) {
    let d = valor.replace(/\D/g, '');
    if (d.length > 11 && d.startsWith('55')) d = d.slice(2);
    return d.slice(0, 11);
}

function mascararTel(valor) {
    const d = limpar(valor);
    if (d.length > 7) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    if (d.length > 2) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length > 0) return `(${d}`;
    return '';
}

function mensagemDeErro(valor) {
    const d = limpar(valor);

    if (d.length === 0) return 'Informe seu telefone com WhatsApp.';
    if (d.length < 2) return 'Digite o DDD e depois o número.';
    if (!DDDS.has(Number(d.slice(0, 2)))) return 'DDD inválido. Confira os dois primeiros números.';
    if (d.length < 11) return 'Número incompleto. Use DDD + 9 dígitos, como (11) 91234-5678.';
    if (d[2] !== '9') return 'Celular inválido. Depois do DDD, o número deve começar com 9.';
    return '';
}

function validarTel() {
    const textoTel = mensagemDeErro(tel.value);

    erroTel.textContent = textoTel;
    tel.setAttribute('aria-invalid', textoTel ? 'true' : 'false');
    return !textoTel;
}

tel.addEventListener('input', () => {
    tel.value = mascararTel(tel.value);
    if (tel.getAttribute('aria-invalid') === 'true') validarTel();  // atualiza enquanto corrige
});
tel.addEventListener('blur', validarTel);

// 
// 
// 
// 
// Mensagem de Erro No Input Assunto
const assunto = document.getElementById('assunto');
const erroAssunto = document.getElementById('erroAssunto');

function mensagemDeErroAssunto(valor) {
    if (valor === '') return 'Escolha um assunto.';
    return '';
}

function validarAssunto() {
    const textoAss = mensagemDeErroAssunto(assunto.value);

    erroAssunto.textContent = textoAss;
    assunto.setAttribute('aria-invalid', textoAss ? 'true' : 'false');
    return !textoAss;
}

assunto.addEventListener('change', validarAssunto);
assunto.addEventListener('blur', validarAssunto);

//
//
//
//
// Mensagem de Erro No Input Menssagem
const mensagem = document.getElementById('mensagem');
const erroMensagem = document.getElementById('erroMensagem');

const MINIMO_MENSAGEM = 20;

function mensagemDeErroMensagem(valor) {
    const textoSend = valor.trim();

    if (textoSend.length === 0) return 'Escreva sua mensagem.';
    if (textoSend.length < MINIMO_MENSAGEM) {
        return `Descreva um pouco mais. Faltam ${MINIMO_MENSAGEM - textoSend.length} caracteres.`;
    }
    return '';
}

function validarMensagem() {
    const textoMens = mensagemDeErroMensagem(mensagem.value);

    erroMensagem.textContent = textoMens;
    mensagem.setAttribute('aria-invalid', textoMens ? 'true' : 'false');
    return textoMens === '';
}

mensagem.addEventListener('input', () => {
    if (mensagem.classList.contains('invalido')) validarMensagem();
});
mensagem.addEventListener('blur', validarMensagem);

//
//
//
//
// Botao enviar email
emailjs.init("mtr2t8dJ0Q_ZhJ4bJ");

document.getElementById("formDatas").addEventListener("submit", function (event) {
    event.preventDefault();

    const formData = {
        name: document.getElementById("nome").value,
        email: document.getElementById("email").value,
        fone: document.getElementById("telefone").value,
        document: document.getElementById("cpf-cnpj").value,
        subject: document.getElementById("assunto").value,
        message: document.getElementById("mensagem").value,
        // Endereco
        cep: document.getElementById("cep").value,
        rua: document.getElementById("rua").value,
        num: document.getElementById("numero").value,
        comple: document.getElementById("complemento").value,
        bairro: document.getElementById("bairro").value,
        city: document.getElementById("cidade").value,
    }

    const serviceID = ('service_r13o4be');
    const templateID = ('template_sffcl9v');
    const submitBtn = document.getElementById("btn-enviar");
    submitBtn.textContent = "Enviado...";
    submitBtn.disable = true;


    emailjs.send(serviceID, templateID, formData)
        .then(() => {
            Toastify({

                text: "Email Enviado Com Sucesso",
                duration: 2500,
                close: true,
                position: "center",
                style: {
                    background: "#1c1c1c",
                    color: "#f9f9f9",
                },

            }).showToast();

            document.getElementById("formDatas").reset();
        }).catch((error) => {

            Toastify({

                text: "Erro Ao Enviar O Email",
                duration: 2500,
                close: true,
                position: "center",
                style: {
                    background: "#1c1c1c",
                    color: "#f9f9f9",
                },

            }).showToast();

            console.error("Erro No Envio", error)
        })
        .finally(() => {
            submitBtn.textContent = "Enviar"
            submitBtn.disable = false;
        })
})

//
//
//
//
// 
// endereco

const cepInput = document.getElementById("cep");

cepInput.addEventListener("input", function () {
    let valor = cepInput.value.replace(/\D/g, "");
    if (valor.length > 5) {
        valor = valor.slice(0, 5) + "-" + valor.slice(5, 8);
    }
    cepInput.value = valor;
});

cepInput.addEventListener("blur", async function () {
    const cep = cepInput.value.replace(/\D/g, "");
    if (cep.length !== 8) return;

    try {
        const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const dados = await resposta.json();

        if (dados.erro) {
            alert("CEP não encontrado.");
            return;
        }

        document.getElementById("rua").value = dados.logradouro;
        document.getElementById("bairro").value = dados.bairro;
        document.getElementById("cidade").value = dados.localidade;
        document.getElementById("estado").value = dados.uf;
        document.getElementById("numero").focus();
    } catch (erro) {
        alert("Erro ao buscar o CEP.");
    }
});