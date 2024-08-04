
const mobileScreen = window.matchMedia("(max-width: 990px )");
    $(document).ready(function () {
        $(".dashboard-nav-dropdown-toggle").click(function () {
            $(this).closest(".dashboard-nav-dropdown")
                .toggleClass("show")
                .find(".dashboard-nav-dropdown")
                .removeClass("show");
            $(this).parent()
                .siblings()
                .removeClass("show");
        });
        $(".menu-toggle").click(function () {
            if (mobileScreen.matches) {
                $(".dashboard-nav").toggleClass("mobile-show");
            } else {
                $(".dashboard").toggleClass("dashboard-compact");
            }
        });
    });

function toggleMoreContentStakeholder() {
var checkbox = document.getElementById("dados");
if (checkbox.checked) {
    addMoreInput();
} else {
    removeAllInput();
}
}

//Essa função está pegando os dados coletados nos campos do GITHUB
document.getElementById('github-connect').addEventListener('click', function() {
const user = document.getElementById('github-user').value;
const repo = document.getElementById('github-repo').value;
const token = document.getElementById('github-token').value;

// Nessa Parte, é onde pode acrescentar a lógica para verificar se o login está correto com o BD, talvez.
if (user && repo && token) {
    // Acrescentei essa linha abaixo pq se o login for bem sucedido ali encima (depois de arrumado a lógica)
    //Ele some com os campos de digitar logins e token e repositorio porque não precisa mais deles
    document.getElementById('github-login').style.display = 'none';          
} else {
    alert('Por favor, preencha todos os campos.');
}
});

//Abrir Modal de confirmação de cadastro
$(document).ready(function(){
$('#myModal').modal('hide');
$('.cadastrar').click(function(){
    $('#myModal').modal('show');

    var progressbar = $('.progress-bar');
    progressbar.animate({width:'100%'}, 3000, function(){
        $('#myModal').modal('hide');
        progressbar.css('width', '0%');
    })
})
})

//Dados do formulário
document.getElementById('formulário').addEventListener('submit', function(event) {
const titulo = document.querySelector('.titulo-texto.name').value;
console.log('Nome:', titulo);
const descrcao = document.querySelector('.description-texto').value;
console.log('Descrição', descrcao);

const inputs = document.querySelectorAll('.nome');
inputs.forEach((input, index) => {
    console.log(`Stakeholder ${index+1}: ${input.value}`);
});
});

//Add inputs para digitar os nomes dos stakeholders associados, se necessário. 
//Add dinamicamente, quando clica no botão plus
//E chama a função de pesquisar os nomes no banco também
var countInputs = 0;

function addMoreInput() {
countInputs++;
var input = `
<div class="input-container row row-cols-12 container-sm" id="stakeholder">
    <p class="h6 titulo col-1 nome-texto">Nome do Stakeholder:</p>
    <textarea class="form-control titulo-texto col textarea-container nome" id="exampleFormControlTextarea${countInputs}" name="stakeholders" rows="1" style="margin-top: 15px;" oninput="buscarStakeholdersSemelhantes(this)"></textarea>
    <div class="col-1" style="margin-top: 4vh;">
        <i class="bi bi-plus-circle-fill plus plus-click" id= "inputCounter" onclick="addMoreInput()"></i>
        <i class="bi bi-dash-circle-fill" id= "inputCounter" onclick="removeInput(this)"></i>
    </div>
    <select class="col-sm-8 offset-md-3" id="opcoesStakeholder" style="display: none;" onchange="preencherTextArea(this)">
        <!-- Opções de nomes de stakeholders semelhantes serão adicionadas dinamicamente aqui -->
    </select>
</div>`;
$('#stakeholder').after(input);
}

function removeInput(button) {
$(button).closest('.input-container').remove();
countInputs--;
if (countInputs === 0) {
    $('#dados').prop('checked', false);
    toggleMoreContentStakeholder();
}
}

function removeAllInput() {
    countInputs = 0;
    $('.input-container').css('display', 'none');
}


//Envio dos dados para o backend
$(document).ready(function(){
$('#formulário').submit(async function(event){
    event.preventDefault(); 

    var name;
    var description;

    // Obtem os valores dos campos de entrada
    name = $('.titulo-texto.name').val();
    description = $('.description-texto').val();
    var stakeholder = await obterStakeholders();
    console.log('Stakeholders ID:', stakeholder);


    console.log('Nome:', name);
    console.log('Descrição:', description);
    console.log('Stakeholders:', stakeholder);

    // Envia os dados para o back-end via AJAX
    $.ajax({
        type: 'POST',
        url: 'http://localhost:3000/provsw/softproc/softwareProcess',
        contentType: 'application/json', // Define o tipo de conteúdo como JSON
        data: JSON.stringify({
            name: name,
            description: description,
            stakeholders: stakeholder 
        }),
        success: function(response) {
            console.log('Dados enviados com sucesso para o backend:', response);
            window.location.href = "./listar_softprocess.html";

        },
        error: function(xhr, status, error) {
            console.error('Erro ao enviar dados para o backend:', error);
        }
    });
});

// Função para obter os nomes dos stakeholders
async function obterStakeholders() {
    var stakeholders = [];
    const inputs = document.querySelectorAll('.nome');
    for (const input of inputs) {
        let nomeStakeholder = $(input).val();
        console.log("Entrando em obterStakeholders");
        let stakeholderData  = await buscarStakeholder(nomeStakeholder);
        console.log('Stakeholders ID:', stakeholderData);
        if (stakeholderData && stakeholderData.length>0) {
            stakeholderData.forEach(function(stakeholder) {
                stakeholders.push(stakeholder.idStakeholder);
                console.log("Stakeholders associados: ", stakeholders);
            });
        }
    }
    return stakeholders;
}

//Função para buscar o id do stakeholder no backend para cadastrar na tabela relacional
async function buscarStakeholder(nomeStakeholder) {
    console.log("Buscando stakeholder para:", nomeStakeholder);
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'http://localhost:3000/provsw/softproc/softwareProcess/' + nomeStakeholder,
            type: 'GET',
            success: function(response) {
                if (response.result && response.result.length > 0) {
                    resolve(response.result);
                } else {
                    console.error('Stakeholder não encontrado:', nomeStakeholder);
                    resolve([]);
                }
            },
            error: function(xhr, status, error) {
                console.error('Erro ao buscar ID do stakeholder:', error);
                reject(error);
            }
        });
    });
}



});

//Função para buscar os stakeholders com nome semehante e colocar no drop do select
function buscarStakeholdersSemelhantes(textarea) {
let nomeStakeholder = textarea.value;

if (nomeStakeholder.length > 0) {   
    // Envia a solicitação AJAX para o backend para buscar stakeholders semelhantes
    $.ajax({

        url: 'http://localhost:3000/provsw/softproc/softwareProcess/' + nomeStakeholder,
        type: 'GET',
        success: function(response) {
            console.log('Dados recebidos do backend:', response);
            
            let select = $(textarea).closest('.input-container').find('select');
            select.empty();
            select.append($('<option>', {
                value: '',
                text: 'Selecione um stakeholder',
                disabled: 'disabled',
                selected: 'selected'
            }));

            // Adiciona as opções no select
            if (response.result && response.result.length > 0) {
                response.result.forEach(function(stakeholder) {
                    console.log('Nome do stakeholder:', stakeholder.name);

                    select.append($('<option>', {
                        value: stakeholder.idStakeholder,
                        text: stakeholder.name
                    }));
                });
            } else {
                // Se não houver stakeholders retornados, adiciona uma opção indicando que nenhum foi encontrado
                select.append($('<option>', {
                    value: '',
                    text: 'Nenhum stakeholder encontrado'
                }));
            }
            select.show();
        },
    
        error: function(xhr, status, error) {
            console.error(error);
        }
    });
}else{
    $(textarea).next('select').hide();
}
}

//Função para preencher o input textarea depois que seleciona o nome.
function preencherTextArea(comboBox) {
let selectedName = $(comboBox).find('option:selected').text().trim();; 
let textarea = $(comboBox).closest('.input-container').find('textarea');

if (selectedName !== '') { 
    textarea.val(selectedName); 
} else { // Se o valor selecionado estiver vazio
    let firstOption = $(comboBox).find('option').first(); 
    let firstOptionText = firstOption.text().trim(); 
    textarea.val(firstOptionText); 
}

$(comboBox).find('option').prop('disabled', false); // Habilitar todas as opções do select
$(comboBox).hide(); 
}
