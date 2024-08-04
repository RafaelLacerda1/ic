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

// Controle dos Checkboxes, abertura e fechamento!
function toggleMoreContentAdopt() {
    var checkbox = document.getElementById("showMoreContentAdopt");
    if (checkbox.checked) {
        addMoreInputProcedures();
    } else {
        removeAllInputProcedures();
    }
}

function toggleMoreContentChanged() {
    var checkbox = document.getElementById("showMoreContentChangArtif");
    if (checkbox.checked) {
        addMoreInputChanged();
    } else {
        removeAllInputChanged();
    }
}

function toggleMoreContentUsedArtif() {
    var checkbox = document.getElementById("showMoreContentUsedArtif");
    if (checkbox.checked) {
        addMoreInputUsedArtifact();
    } else {
        removeAllInputUsedArtifact();
    }
}

function toggleMoreContentUsedResour() {
    var checkbox = document.getElementById("showMoreContentUsedResour");
    if (checkbox.checked) {
        addMoreInputUsedResource();
    } else {
        removeAllInputUsedResource();
    }
}

function toggleMoreContentStakeholder() {
    var checkbox = document.getElementById("showMoreContentStakeholder");
    if (checkbox.checked) {
        addMoreInputStakeholder();
    } else {
        removeAllInputUsedStakeholder();
    }
}

// Controle do Modal de Envio de Dados
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


// Função Genérica de Buscar Dados Semelhantes para preencher no Select
function buscarSemelhantes(textarea, endpoint, classItem, tipoItem) {
    let nomeItem = textarea.value;

    if (nomeItem.length > 0) {   
        // Envia a solicitação AJAX para o backend para buscar atividades semelhantes
        $.ajax({
            url: endpoint + encodeURIComponent(nomeItem),
            type: 'GET',
            success: function(response) {
                
                let select = $(textarea).closest(classItem).find('select');
                select.empty();
                select.append($('<option>', {
                    value: '',
                    text: `Selecione um ${tipoItem}`,
                    disabled: 'disabled',
                    selected: 'selected'
                }));

                // Adiciona as opções no select
                if (response.result && response.result.length > 0) {
                    response.result.forEach(function(item) {
                        select.append($('<option>', {
                            value: item[`id${tipoItem.charAt(0).toUpperCase() + tipoItem.slice(1)}`],
                            text: item.name
                        }));
                    });
                } else {
                    // Se não houver atividades retornadas, adiciona uma opção indicando que nenhum foi encontrado
                    select.append($('<option>', {
                        value: '',
                        text: `Nenhum ${tipoItem} encontrado`
                    }));
                }
                select.show();
            },
        
            error: function(xhr, status, error) {
                console.error(error);
            }
        });
    } else {
        $(textarea).next('select').hide();
    }
}

function preencherTextArea(comboBox, classItem) {
    let selectedName = $(comboBox).find('option:selected').text().trim();
    let textarea = $(comboBox).closest(classItem).find('textarea');

    if (selectedName !== '') { 
        textarea.val(selectedName); 
    } else { 
        let firstOption = $(comboBox).find('option').first(); 
        let firstOptionText = firstOption.text().trim(); 
        textarea.val(firstOptionText); 
    }

    $(comboBox).find('option').prop('disabled', false); // Habilitar todas as opções do select
    $(comboBox).hide(); 
}

// Processo de Software

function trimLeadingWhitespace(textarea) {
    textarea.value = textarea.value.trimStart();
}

function buscarSPSemelhantes(textarea) {
    buscarSemelhantes(textarea, 'http://localhost:3000/provsw/act/activity/composed/', '.input-container.compos', 'software process');
}

//Função para preencher o input textarea depois que seleciona o nome.
function preencherTextAreaSP(comboBox) {
    preencherTextArea(comboBox, '.input-container.compos');
}

// Hora e Data atual (Veio do Chat GPT)
function formatarDataISO(data) {
    var partes = data.split('/');
    return partes[2] + '-' + partes[1] + '-' + partes[0];
}

document.addEventListener('DOMContentLoaded', function() {
    // Obtém a data atual no formato YYYY-MM-DD para preencher o campo de data
    var currentDate = new Date().toLocaleDateString('pt-BR');
    var currentDateISO = formatarDataISO(currentDate);
    document.getElementById('date1').value = currentDateISO;
    console.log(document.getElementById('date1').value);

    // Obtém a hora atual no formato HH:MM para preencher o campo de hora
    var currentHour = new Date().toTimeString().slice(0, 5);
    document.getElementById('hora-cons1').value = currentHour;
    console.log(document.getElementById('hora-cons1').value);
});

// Add inputs dinamicamentes no checkbox de Adopt, Changed, Used Artifact e Used Resource. 
//Add inputs para digitar os nomes dos procedimentos, artefatos e recursos, se necessário. 
//Add dinamicamente, quando clica no botão plus
//E chama a função de pesquisar os nomes no banco também
var countInputProcedures=0;
var countInputChanged=0;
var countInputUsedArtifact=0;
var countInputUsedResource = 0;
var countInputStakeholder=0;

//PROCEDURES
function addMoreInputProcedures() {
    countInputProcedures++;
    var novoInput = `
    <div class="input-container row row-cols-12 container-sm adotou revisao" id="procedAdopt">
        <p class="h6 titulo col-1 nome-texto">Nome do Procedimento:</p>
        <textarea class="form-control titulo-texto col textarea-container adopt" id="textareaAdopt${countInputProcedures}" rows="1" name="adotou" style="margin-top: 15px"oninput="trimLeadingWhitespace(this), buscarProceduresSemelhantes(this)"></textarea>
        <div class="col-1" style="margin-top: 4vh;">
            <i class="bi bi-plus-circle-fill plus plus-click" id= "inputCounter" onclick="addMoreInputProcedures(this)"></i>
            <i class="bi bi-dash-circle-fill" onclick="removeInputProcedures(this)"></i>
        </div>
        <select class="col-sm-9 offset-md-2" id="opcoesAdopt" style="display: none;" onchange="preencherTextArea(this, '.input-container.adotou')">
            <!-- Opções dos nomes dos stakeholders semelhantes serão adicionadas aqui quando começarem a digitar-->
        </select>
    </div>
    `;
    $('#procedAdopt').after(novoInput);
}

function removeInputProcedures(button) {
    $(button).closest('.input-container.adotou').remove();
    countInputProcedures--;
    if (countInputProcedures === 0) {
        $('#showMoreContentAdopt').prop('checked', false);
        toggleMoreContentAdopt();
    }
}

function removeAllInputProcedures() {
    countInputProcedures=0;
    $('.input-container.adotou').css('display', 'none');
}
// END PROCEDURES

//CHANGED ARTIFACT
function addMoreInputChanged() {
    countInputChanged++;
    var novoInput = `
    <div class="input-container row row-cols-12 container-sm mudou revisao" id="artifactChanged">
        <p class="h6 titulo col-1 nome-texto">Nome do Artefato:</p>
        <textarea class="form-control titulo-texto textarea-container col changed" id="textareaChanged${countInputChanged}" rows="1"  name="mudou" style="margin-top: 15px;" oninput="trimLeadingWhitespace(this); buscarArtifactChangedSemelhantes(this)"></textarea>
        <div class="col-1" style="margin-top: 4vh;">
            <i class="bi bi-plus-circle-fill plus plus-click" id= "inputCounter" onclick="addMoreInputChanged(this)"></i>
            <i class="bi bi-dash-circle-fill" onclick="removeInputChanged(this)"></i>
        </div>
        <select class="col-sm-9 offset-md-2" id="opcoesChanged" style="display: none;" onchange="preencherTextArea(this, '.input-container.mudou')">
            <!-- Opções dos nomes dos stakeholders semelhantes serão adicionadas aqui quando começarem a digitar-->
        </select>
    </div>`;
    $('#artifactChanged').after(novoInput);
}

function removeInputChanged(button) {
    $(button).closest('.input-container.mudou').remove();
    countInputChanged--;
    if (countInputChanged === 0) {
        $('#showMoreContentChangArtif').prop('checked', false);
        toggleMoreContentAdopt();
    }
}

function removeAllInputChanged() {
    countInputChanged = 0;
    $('.input-container.mudou').css('display', 'none');
}
//END CHANGED ARTIFACT

//USED ARTIFACT
function addMoreInputUsedArtifact() {
    countInputUsedArtifact++;
    var novoInput = `
    <div class="input-container container-sm row row-cols-12 usedArtif" id="artifactUsed">
        <p class="h6 titulo col-1 nome-texto">Nome do Artefato:</p>
        <textarea class="form-control titulo-texto col textarea-container usedArtif" id="textareaUsedArtif${countInputUsedArtifact}" rows="1"  name="usouartefato" style="margin-top: 15px;" oninput="trimLeadingWhitespace(this); buscarArtifactUsedSemelhantes(this)"></textarea>
        <div class="col-1" style="margin-top: 4vh;">
            <i class="bi bi-plus-circle-fill plus plus-click" id= "inputCounter" onclick="addMoreInputUsedArtifact(this)"></i>
            <i class="bi bi-dash-circle-fill" onclick="removeInputUsedArtifact(this)"></i>
        </div>
        <select class="col-9 offset-md-2" id="opcoesUsedArt" style="display: none;" onchange="preencherTextArea(this, '.input-container.usedArtif')">
            <!-- Opções dos nomes dos stakeholders semelhantes serão adicionadas aqui quando começarem a digitar-->
        </select>

    </div>`;
    $('#artifactUsed').after(novoInput);
}

function removeInputUsedArtifact(button) {
    $(button).closest('.input-container.usedArtif').remove();
    countInputUsedArtifact--;
    if (countInputUsedArtifact === 0) {
        $('#showMoreContentUsedArtif').prop('checked', false);
        toggleMoreContentUsedArtif();
    }
}

function removeAllInputUsedArtifact() {
    countInputUsedArtifact=0;
    $('.input-container.usedArtif').css('display', 'none');
}
// END USED ARTIFACT

//USED RESOURCE
function addMoreInputUsedResource() {
    countInputUsedResource++;
    var novoInput = `
    <div class="input-container container-sm row row-cols-12 usedResor" id="resourceUsed">
        <p class="h6 titulo col-1 nome-texto">Nome do Recurso:</p>
        <textarea class="form-control titulo-texto textarea-container col usedResor" id="textareaUsedResource${countInputUsedResource}" rows="1"  name="usourecurso" style="margin-top: 15px;" oninput="trimLeadingWhitespace(this); buscarResourceUsedSemelhantes(this)"></textarea>
        <div class="col-1" style="margin-top: 4vh;">
            <i class="bi bi-plus-circle-fill plus plus-click" id= "inputCounter" onclick="addMoreInputUsedResource(this)"></i>
            <i class="bi bi-dash-circle-fill" onclick="removeInputUsedResource(this)"></i>
        </div>
        <select class="col-9 offset-md-2" id="opcoesUsedArt" style="display: none;" onchange="preencherTextArea(this, '.input-container.usedResor')">
            <!-- Opções dos nomes dos stakeholders semelhantes serão adicionadas aqui quando começarem a digitar-->
        </select>
    </div>`;
    $('#resourceUsed').after(novoInput);
}

function removeInputUsedResource(button) {
    $(button).closest('.input-container.usedResor').remove();
    countInputUsedResource--;
    if (countInputUsedResource === 0) {
        $('#showMoreContentUsedResour').prop('checked', false);
        toggleMoreContentUsedResour();
    }
}

function removeAllInputUsedResource() {
    countInputUsedResource=0;
    $('.input-container.usedResor').css('display', 'none');
}
//END USED RESOURCE

//STAKEHOLDER ASSOCIADOS
function addMoreInputStakeholder() {
    countInputStakeholder++;
    var novoInput = `
    <div class="input-container container-sm row row-cols-12 stakehold" id="stakeholderAssociated">
        <p class="h6 titulo col-1 nome-texto">Nome do Stakeholder:</p>
        <textarea class="form-control titulo-texto col textarea-container stakehold" id="textareaStakeholderAssociated${countInputStakeholder}" rows="1"  name="stakeholders" style="margin-top: 15px;" oninput="trimLeadingWhitespace(this); buscarStakeholderSemelhantes(this)"></textarea>
        <div class="col-1" style="margin-top: 4vh;">
            <i class="bi bi-plus-circle-fill plus plus-click" id= "inputCounter" onclick="addMoreInputStakeholder(this)"></i>
            <i class="bi bi-dash-circle-fill" onclick="removeInputUsedStakeholder(this)"></i>
        </div>
        <select class="col-9 offset-md-1" id="opcoesStakeholder" style="display: none;margin-left: 12vw;" onchange="preencherTextArea(this, '.input-container.stakehold')">
            <!-- Opções dos nomes dos stakeholders semelhantes serão adicionadas aqui quando começarem a digitar-->
        </select>
    </div>`;
    $('#stakeholderAssociated').after(novoInput);
}

function removeInputUsedStakeholder(button) {
    $(button).closest('.input-container.stakehold').remove();
    countInputStakeholder--;
    if (countInputStakeholder === 0) {
        $('#showMoreContentStakeholder').prop('checked', false);
        toggleMoreContentStakeholder();
    }
}

function removeAllInputUsedStakeholder() {
    countInputStakeholder=0;
    $('.input-container.stakehold').css('display', 'none');
}
//END STAKEHOLDER ASSOCIADOS

// Buscar Dados específicos semelhantes
function buscarProceduresSemelhantes(textarea){
    buscarSemelhantes(textarea, 'http://localhost:3000/provsw/act/activity/adopted/', '.input-container.adotou', 'procedures');
}
function buscarArtifactChangedSemelhantes(textarea){
    buscarSemelhantes(textarea, 'http://localhost:3000/provsw/act/activity/artifact/', '.input-container.mudou', 'artifact');
}

function buscarArtifactUsedSemelhantes(textarea){
    buscarSemelhantes(textarea, 'http://localhost:3000/provsw/act/activity/artifact/', '.input-container.usedArtif', 'artifact');
}

function buscarResourceUsedSemelhantes(textarea){
    buscarSemelhantes(textarea, 'http://localhost:3000/provsw/act/activity/resource/', '.input-container.usedResor', 'resource');
}

function buscarStakeholderSemelhantes(textarea){
    buscarSemelhantes(textarea, 'http://localhost:3000/provsw/act/activity/stakeholder/', '.input-container.stakehold', 'stakeholder');
}

 //Inserir Dados no Banco de Dados
    
//Submissão no Banco de Dados
$(document).ready(function(){
    $('#formulário').submit(async function(event){
        event.preventDefault();
        const titulo = document.querySelector('.titulo-atv').value;
        const softprocessComposed= document.querySelector('.softprocess').value;
        var proceduresAdopt = await obterProceduresAdopt();
        var artifactChanged = await obterArtifactChanged();
        var artifactUsed = await obterArtifactUsed();
        var resourcetUsed = await obterResourceUsed();
        var stakeholderAssociated = await obterStakeholderAssociated();
        var datesTimesStart = null;
        var datesTimesEnd= null;

        const softProcess = await buscarExato(softprocessComposed, 'http://localhost:3000/provsw/act/activity/soft-process/correct/', 'Software_Process')

        const dateElementStart = document.getElementById('date1');
        const dateElementEnd = document.getElementById('date2');
        if (dateElementStart.value) {
            const date = dateElementStart.value;
            const hourElement = document.getElementById('hora-cons1');
            if (hourElement) {
                const hour = hourElement.value;
                const dateParts = date.split('-'); //Divide uma string contendo uma data no formato 'YYYY-MM-DD' em partes separadas com base no caractere de hífen '-'.
                const formattedDate = dateParts[0] + '-' + dateParts[1].padStart(2, '0') + '-' + dateParts[2].padStart(2, '0');
                datesTimesStart = formattedDate + ' ' + hour;
            } else {
                console.log('Elemento .hour-texto não encontrado.');
            }
        } else {
            console.log('Elemento .date-texto não encontrado.');
        }

        if (dateElementEnd.value) {
            const date = dateElementEnd.value;
            const hourElement = document.getElementById('hora-cons2');
            if (hourElement) {
                const hour = hourElement.value;
                const dateParts = date.split('-'); //Divide uma string contendo uma data no formato 'YYYY-MM-DD' em partes separadas com base no caractere de hífen '-'.
                const formattedDate = dateParts[0] + '-' + dateParts[1].padStart(2, '0') + '-' + dateParts[2].padStart(2, '0');
                datesTimesEnd = formattedDate + ' ' + hour;
            } else {
                console.log('Elemento .hour-texto não encontrado.');
            }
        } else {
            console.log('Elemento .date-texto não encontrado.');
        }
        const dateTimeInicio = datesTimesStart;
        const dateTimeFim = datesTimesEnd;
        
        const oldActivityId = $('#oldActivityId').val();

        // Envia os dados para o back-end via AJAX
        $.ajax({
            type: 'POST',
            url: 'http://localhost:3000/provsw/act/activity',
            contentType: 'application/json',
            data: JSON.stringify({
                nome: titulo,
                softprocess: softProcess,
                startedAtTime: dateTimeInicio,
                endedAtTime: dateTimeFim,
                idActivityAntg: oldActivityId,
                adotou:proceduresAdopt,
                mudou:artifactChanged,
                usouartefato: artifactUsed,
                usourecurso: resourcetUsed,
                stakeholders: stakeholderAssociated,
            }),
        
            success: function(response) {
                console.log('Dados enviados com sucesso para o backend:', response);
                //window.location.href = "./listar_artefatos.html";
                
            },
            error: function(xhr, status, error) {
                console.error('Erro ao enviar dados para o backend:', error);
            }
        });
    });

    //Função para obter todos os artefatos Usados
    async function obterArtifactUsed() {
        var artifacts = [];
        const inputs = document.querySelectorAll('.textarea-container.usedArtif');
        for (const input of inputs) {
            let nomeArtifact = $(input).val().trim();
            if (nomeArtifact !== '') {
                let artifactData  = await buscarExato(nomeArtifact, 'http://localhost:3000/provsw/act/activity/artifact/correct/', 'Artifact');
                if (artifactData) {
                    artifacts.push(artifactData.idArtifact);
                    console.log("Activity associadas: ", artifacts);                
                }
            }
        }
        return artifacts;
    }
    
    //Função para obter todos os artefatos mudados
    async function obterArtifactChanged() {
        var artifacts = [];
        const inputs = document.querySelectorAll('.changed');
        for (const input of inputs) {
            let nomeArtifact = $(input).val().trim();
            if (nomeArtifact !== '') {
                let artifactData  = await buscarExato(nomeArtifact, 'http://localhost:3000/provsw/act/activity/artifact/correct/', 'Artifact');
                if (artifactData) {
                    artifacts.push(artifactData.idArtifact);
                    console.log("Activity associadas: ", artifacts);                
                }
            }
        }
        return artifacts;
    }

    async function obterProceduresAdopt() {
        var procedures = [];
        const inputs = document.querySelectorAll('.adopt');
        for (const input of inputs) {
            let nomeProcedures = $(input).val().trim();
            if (nomeProcedures !== '') {
                let proceduresData  = await buscarExato(nomeProcedures, 'http://localhost:3000/provsw/act/activity/procedures/correct/', 'Procedures');
                if (proceduresData) {
                    procedures.push(proceduresData.idProcedures);
                    console.log("Activity associadas: ", procedures);                
                }
            }
        }
        return procedures;
    }

    async function obterResourceUsed() {
        var resurces = [];
        const inputs = document.querySelectorAll('.textarea-container.usedResor');
        for (const input of inputs) {
            let nomeResource = $(input).val().trim();
            if (nomeResource !== '') {
                let resourceData  = await buscarExato(nomeResource, 'http://localhost:3000/provsw/act/activity/resource/correct/', 'Resource');
                if (resourceData) {
                    resurces.push(resourceData.idResource);
                    console.log("Resource associados: ", resurces);                
                }
            }
        }
        return resurces;
    }

    async function obterStakeholderAssociated() {
        var stakeholders = [];
        const inputs = document.querySelectorAll('.textarea-container.stakehold');
        for (const input of inputs) {
            let nomeStakeholder = $(input).val().trim();
            if (nomeStakeholder !== '') {
                let stakeholderData  = await buscarExato(nomeStakeholder, 'http://localhost:3000/provsw/act/activity/stakeholder/correct/', 'Stakeholder');
                if (stakeholderData) {
                    stakeholders.push(stakeholderData.idStakeholder);
                    console.log("Stakeholder associados: ", stakeholders);                
                }
            }
        }
        return stakeholders;
    }
});

// Função Genérica de Buscar Dados exatos para enviar os dados pro backend
async function buscarExato(nomeItem, endpoint, tipoItem) {
    console.log("Buscando Dados para:", nomeItem);
    return new Promise((resolve, reject) => {
        $.ajax({
            url: endpoint + encodeURIComponent(nomeItem),
            type: 'GET',
            success: function(response) {
                if (response.result) {
                    resolve(response.result);
                } else {
                    console.error('Dados não encontrado para:', nomeItem);
                    resolve([]);
                }
            },
            error: function(xhr, status, error) {
                console.error(`Erro ao buscar ID de ${tipoItem}:`, error);
                reject(error);
            }
        });
    });
}