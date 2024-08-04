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

//Função para controlar quais dos radios foi selecionado e quais campos aparecerão
$(document).ready(function(){
$('input[type=radio][name=tipo]').click(function() {
    $('.input-container.nome-stakeholder').hide();
    $('.radios-text').val('');
    if (this.id === 'flexRadioDefault1') {
        $('#organizacaoInput').show();
    }
    else if (this.id === 'flexRadioDefault2') {
        $('#pessoaInput').show();
    }
    else if (this.id === 'flexRadioDefault3') {
        $('#timeInput').show();
    }
});
});

//Funções para controlar os checkboxes, a abertura e fechamento
function toggleMoreContent() {
var checkbox = document.getElementById("showMoreContent");
if (checkbox.checked) {
    addMoreInput();
    
} else {
    removeAllInputs();
}
}
function toggleMoreContentSP() {
var checkbox = document.getElementById("showMoreContentSP");
if (checkbox.checked) {
    addMoreInputSP();
    
} else {
    removeAllInputsSP();
}
}
function toggleMoreContentActivity() {
var checkbox = document.getElementById("showMoreContentActivity");
if (checkbox.checked) {
    addMoreInputActivity();
    
} else {
    removeAllInputActivity();
}
}

//Add inputs para digitar os nomes dos stakeholders associados, processos associados e atividades assiciadas, se necessário. 
//Add dinamicamente, quando clica no botão plus
//E chama a função de pesquisar os nomes no banco também
var countInputsStake=0;
var countInputsSP=0;
var countInputActivity=0;

function trimLeadingWhitespace(textarea) {
textarea.value = textarea.value.trimStart();
}

//STAKEHOLDER
function addMoreInput() {
countInputsStake++;
var novoInput = `
<div class="input-container row row-cols-12 act" style="display:flex;" id="input-container">
    <p class="h6 titulo col-1 nome-texto">Nome do Stakeholder:</p>
    <textarea class="form-control titulo-texto col textarea-container nome" id="exampleFormControlTextarea${countInputsStake}" rows="1" name="agiu" style="margin-top: 15px" oninput="trimLeadingWhitespace(this), buscarStakeholdersSemelhantes(this)">
    </textarea>
    <div class="col-1" style="margin-top: 4vh;">
        <i class="bi bi-plus-circle-fill plus plus-click" id= "inputCounter" onclick="addMoreInput(this)"></i>
        <i class="bi bi-dash-circle-fill" id= "inputCounter" onclick="removeInput(this)"></i>
    </div>
    <select class="col-9 offset-md-1" id="opcoesStakeholder" style="display: none; margin-left:13vw;" onchange="preencherTextArea(this)">
        <!-- Opções dos nomes dos stakeholders semelhantes serão adicionadas aqui quando começarem a digitar-->
    </select>
</div>
`;
$('#dados').after(novoInput);
}

function removeInput(button) {
$(button).closest('.input-container.act').remove();
countInputsStake--;
if (countInputsStake === 0) {
    $('#showMoreContent').prop('checked', false);
    toggleMoreContent();
}
}

function removeAllInputs() {
$('.input-container.act').css('display', 'none');
}
//END STAKEHOLDER

//SOFTWARE PROCESS
function addMoreInputSP() {
countInputsSP++;
var novoInput = `
<div class="input-container row row-cols-12 attrib" id="softprocess">
    <p class="h6 titulo col-1 nome-texto">Nome do Processo de Software:</p>
    <textarea class="form-control titulo-texto col textarea-container titulo-sp" id="formControltextarea${countInputsSP}" rows="1" name="contribuiu" style="margin-top: 15px" oninput="trimLeadingWhitespace(this), buscarSPSemelhantes(this)"></textarea>
    <div class="col-1" style="margin-top: 4vh;">
        <i class="bi bi-plus-circle-fill plus plus-click" id= "inputCounter" onclick="addMoreInputSP(this)"></i>
        <i class="bi bi-dash-circle-fill" onclick="removeInputSP(this)"></i>
    </div>
    <select class="col-9 offset-md-1" id="opcoesSoftProcess" style="display: none; margin-left:13vw;" onchange="preencherTextAreaSP(this)">
        <!-- Opções dos nomes dos stakeholders semelhantes serão adicionadas aqui quando começarem a digitar-->
    </select>
</div>
`;
$('#softprocess').after(novoInput);
}

function removeInputSP(button) {
$(button).closest('.input-container.attrib').remove();
countInputsSP--;
if (countInputsSP === 0) {
    $('#showMoreContentSP').prop('checked', false);
    toggleMoreContentSP();
}
}

function removeAllInputsSP() {
$('.input-container.attrib').css('display', 'none');
}
//END SOFTWARE PROCESS

//ACTIVITY
function addMoreInputActivity() {
countInputActivity++;
var novoInput = `
<div class="input-container row row-cols-12 assoc" id="activity">
    <p class="h6 titulo col-1 nome-texto">Nome da Atividade:</p>
    <textarea class="form-control titulo-texto col textarea-container titulo-actv" id="formTextarea${countInputActivity}" rows="1" name="associou" style="margin-top: 15px;" oninput="trimLeadingWhitespace(this), buscarActivitySemelhantes(this)"></textarea>
    <div class="col-1" style="margin-top: 4vh;">
        <i class="bi bi-plus-circle-fill plus plus-click" id= "inputCounter" onclick="addMoreInputActivity(this)"></i>
        <i class="bi bi-dash-circle-fill" onclick="removeInputActivity(this)"></i>
    </div>
    <select class="col-9 offset-md-1" id="opcoesActivity" style="display: none; margin-left:13vw;" onchange="preencherTextAreaActivity(this)">
        <!-- Opções dos nomes dos stakeholders semelhantes serão adicionadas aqui quando começarem a digitar-->
    </select>
</div>
`;
$('#activity').after(novoInput);
}

function removeInputActivity(button) {
$(button).closest('.input-container.assoc').remove();
countInputActivity--;
if (countInputActivity === 0) {
    $('#showMoreContentActivity').prop('checked', false);
    toggleMoreContentActivity();
}
}

function removeAllInputActivity() {
$('.input-container.assoc').css('display', 'none');
}
// END ACTIVITY

//Função para abrir o MODAL
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

// Envio dos dados para o Backend
$(document).ready(function(){
$('#formulário').submit(async function(event){
    event.preventDefault();
    const tipo = document.querySelector('input[type=radio][name=tipo]:checked');
    var name;
    var tipodesc;

    // Obtenha os valores dos campos de entrada
    if(tipo.id === "flexRadioDefault1"){
        tipodesc = "Organização";
        name = $('.organizacao').val();
    }else if (tipo.id === "flexRadioDefault2"){
        tipodesc = "Pessoa";
        name = $('.pessoa').val();
    }else if (tipo.id === "flexRadioDefault3"){
        tipodesc = "Time";
        name = $('.time').val();           
    }

    var stakeholder = await obterStakeholders();
    var softProcess = await obterSoftwareProcess();
    var activity = await obterActivity();

    // Envia os dados para o back-end via AJAX
    $.ajax({
        type: 'POST',
        url: 'http://localhost:3000/provsw/stakeholder',
        contentType: 'application/json',
        data: JSON.stringify({
            name: name,
            tipo: tipodesc,
            agiu: stakeholder,
            contribuiu: softProcess,
            associou: activity,

        }),

    
        success: function(response) {
            console.log('Dados enviados com sucesso para o backend:');
            window.location.href = "./listar_stakehold.html";
        },
        error: function(xhr, status, error) {
            console.error('Erro ao enviar dados para o backend:', error);
        }
    });
});

async function obterStakeholders() {
    var stakeholders = [];
    const inputs = document.querySelectorAll('.nome');
    for (const input of inputs) {
        let nomeStakeholder = $(input).val().trim();
        if (nomeStakeholder !== '') {
            let stakeholderData  = await buscarStakeholder(nomeStakeholder);
            if (stakeholderData && stakeholderData.length>0) {
                stakeholderData.forEach(function(stakeholder) {
                    stakeholders.push(stakeholder.idStakeholder);
                    console.log("Stakeholders associados: ", stakeholders);
                });
            }
        }
    }
    return stakeholders;
}

async function obterSoftwareProcess() {
    var softProcess = [];
    const inputs = document.querySelectorAll('.titulo-sp');
    for (const input of inputs) {
        let nomeSoftProcess = $(input).val().trim();
        if (nomeSoftProcess !== '') {
            let SoftProcessData  = await buscarSoftProcess(nomeSoftProcess);
            if (SoftProcessData) { 
                softProcess.push(SoftProcessData.idSoftware_Process);
                console.log("Software Process associados: ", softProcess);
            }
        }
    }
    return softProcess;
}

async function obterActivity() {
    var activities = [];
    const inputs = document.querySelectorAll('.titulo-actv');
    for (const input of inputs) {
        let nomeActivity = $(input).val().trim();
        if (nomeActivity !== '') {
            let activityData  = await buscarActivity(nomeActivity);
            if (activityData) {
                activities.push(activityData.idActivity);
                console.log("Activity associadas: ", activities);                
            }
        }
    }
    return activities;
}

async function buscarStakeholder(nomeStakeholder) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'http://localhost:3000/provsw/stak/stakeholder/' + nomeStakeholder,
            type: 'GET',
            success: function(response) {
                if (response.result && Array.isArray(response.result)&& response.result.length > 0) {
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


async function buscarSoftProcess(nomeSoftProcess) {
    console.log("Buscando stakeholder para:", nomeSoftProcess);
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'http://localhost:3000/provsw/stak/stakeholder/atribuicao/correct/' + nomeSoftProcess,
            type: 'GET',
            success: function(response) {
                if (response.result) {
                    resolve(response.result);
                } else {
                    console.error('Software Process não encontrado:', nomeSoftProcess);
                    resolve([]);
                }
            },
            error: function(xhr, status, error) {
                console.error('Erro ao buscar Software Process:', error);
                reject(error);
            }
        });
    });
}


async function buscarActivity(nomeActivity) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'http://localhost:3000/provsw/stak/stakeholder/associacao/correct/' + nomeActivity,
            type: 'GET',
            success: function(response) {
                if (response.result) {
                    resolve(response.result);
                } else {
                    console.error('Activity não encontrada:', nomeActivity);
                    resolve([]);
                }
            },
            error: function(xhr, status, error) {
                console.error('Erro ao buscar ID da Activity:', error);
                reject(error);
            }
        });
    });
}

//Função para buscar os stakeholders com nome semehante e colocar no drop do select
function buscarStakeholdersSemelhantes(textarea) {
let nomeStakeholder = textarea.value;

if (nomeStakeholder.length > 0) {   
    // Envia a solicitação AJAX para o backend para buscar stakeholders semelhantes
    $.ajax({

        url: 'http://localhost:3000/provsw/stak/stakeholder/' + nomeStakeholder,
        type: 'GET',
        success: function(response) {
            
            let select = $(textarea).closest('.input-container.act').find('select');
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
let textarea = $(comboBox).closest('.input-container.act').find('textarea');

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
 
//Função para buscar os processos de software com nome semelhante e colocar no drop do select
function buscarSPSemelhantes(textarea) {
let nomeSoftProcess = textarea.value;

if (nomeSoftProcess.length > 0) {   
    // Envia a solicitação AJAX para o backend para buscar processos de software semelhantes
    $.ajax({

        url: 'http://localhost:3000/provsw/stak/stakeholder/atribuicao/' + nomeSoftProcess,
        type: 'GET',
        success: function(response) {                        
            let select = $(textarea).closest('.input-container.attrib').find('select');
            select.empty();
            select.append($('<option>', {
                value: '',
                text: 'Selecione um software process',
                disabled: 'disabled',
                selected: 'selected'
            }));

            // Adiciona as opções no select
            if (response.result && response.result.length > 0) {
                response.result.forEach(function(softProcess) {
                    select.append($('<option>', {
                        value: softProcess.idSoftwareProcess,
                        text: softProcess.name
                    }));
                });
            } else {
                // Se não houver software process retornados, adiciona uma opção indicando que nenhum foi encontrado
                select.append($('<option>', {
                    value: '',
                    text: 'Nenhum software process encontrado'
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
function preencherTextAreaSP(comboBox) {
let selectedName = $(comboBox).find('option:selected').text().trim();; 
let textarea = $(comboBox).closest('.input-container.attrib').find('textarea');

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

//Função para buscar os atividades com nome semelhante e colocar no drop do select
function buscarActivitySemelhantes(textarea) {
let nomeActivity = textarea.value;

if (nomeActivity.length > 0) {   
    // Envia a solicitação AJAX para o backend para buscar atividades semelhantes
    $.ajax({

        url: 'http://localhost:3000/provsw/stak/stakeholder/associacao/' + nomeActivity,
        type: 'GET',
        success: function(response) {                        
            let select = $(textarea).closest('.input-container.assoc').find('select');
            select.empty();
            select.append($('<option>', {
                value: '',
                text: 'Selecione uma activity',
                disabled: 'disabled',
                selected: 'selected'
            }));

            // Adiciona as opções no select
            if (response.result && response.result.length > 0) {
                response.result.forEach(function(activity) {
                    select.append($('<option>', {
                        value: activity.idActivity,
                        text: activity.name
                    }));
                });
            } else {
                // Se não houver atividades retornadas, adiciona uma opção indicando que nenhum foi encontrado
                select.append($('<option>', {
                    value: '',
                    text: 'Nenhuma activity encontrado'
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
function preencherTextAreaActivity(comboBox) {
let selectedName = $(comboBox).find('option:selected').text().trim();; 
let textarea = $(comboBox).closest('.input-container.assoc').find('textarea');

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