
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
    
    $('#myModal').modal('hide');

    $('.cadastrar').click(function(){
        $('#myModal').modal('show');

        var progressbar = $('.progress-bar');
        progressbar.animate({width:'100%'}, 3000, function(){
            $('#myModal').modal('hide');
            progressbar.css('width', '0%');
        })
    })

    $('#fecharModal, #pararModal').on('click', function() {
        $('#myModal').modal('hide');
    });
});  

//Pegar data e hora atual (Veio do ChatGPT)
    function formatarDataISO(data) {
        var partes = data.split('/');
        return partes[2] + '-' + partes[1] + '-' + partes[0];
    }

    document.addEventListener('DOMContentLoaded', function() {
        // Obtém a data atual no formato YYYY-MM-DD para preencher o campo de data
        var currentDate = new Date().toLocaleDateString('pt-BR');
        var currentDateISO = formatarDataISO(currentDate);
        document.getElementById('date').value = currentDateISO;
        console.log(document.getElementById('date').value);

        // Obtém a hora atual no formato HH:MM para preencher o campo de hora
        var currentHour = new Date().toTimeString().slice(0, 5);
        document.getElementById('hora-cons').value = currentHour;
        console.log(document.getElementById('hora-cons').value);
    });


// Buscar as atividades que gerou, usou e mudou esse artefato
    //Função para buscar os stakeholders com nome semehante e colocar no drop do select
    function buscarAtividadesSemelhantes(textarea) {
        let nomeAtividade = textarea.value;
        
        if (nomeAtividade.length > 0) {   
            // Envia a solicitação AJAX para o backend para buscar Atividades semelhantes
            $.ajax({

                url: 'https://ic-prov-teste.onrender.com/provsw/art/artifact/activity/' + encodeURIComponent(nomeAtividade),
                type: 'GET',
                success: function(response) {                            
                    let select = $(textarea).closest('.revisao').find('select');
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
                        // Se não houver stakeholders retornados, adiciona uma opção indicando que nenhum foi encontrado
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
    function preencherTextArea(comboBox) {
        let selectedName = $(comboBox).find('option:selected').text().trim();; 
        let textarea = $(comboBox).closest('.revisao').find('textarea');

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

//Inserção de um novo cadastro

    //Função para tranformar o arquivo em base64 (Veio do ChatGPT)
    function readFileAsBase64(file, callback) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const base64Data = event.target.result.split(',')[1];
            callback(base64Data);
        };
        reader.readAsDataURL(file);
    }

    //Preenchimento da Tela para fazer o Editar (Update) que sera uma nova inserção
    $(document).ready(function() {
        // Recupera os parâmetros da URL
        var urlParams = new URLSearchParams(window.location.search);
        var idArtifact = urlParams.get('id');
        var nome = urlParams.get('nome');
        var tipo = urlParams.get('tipo');
        var description = urlParams.get('description');
        var activity = urlParams.get('nameActivity');

        // Preenche os campos do formulário com os dados recuperados
        $('#exampleFormControlTextarea2').val(nome);
        $('#inputGroupSelect01').val(tipo);
        $('#oldArtifactId').val(idArtifact);
        $('#exampleFormControlTextarea3').val(description);
        $('#exampleFormControlTextarea4').val(activity);

        const oldArtifactId = $('#oldArtifactId').val();

        // Exibe o formulário de inserção com os dados preenchidos
        $('#formulário').show();

    });

    // Busca do SHA e envio dos Arquivos Upados para o GitHub
    document.addEventListener('DOMContentLoaded', function() {

        document.getElementById('formulário').addEventListener('submit', function(event) {
            event.preventDefault(); // Impede o envio padrão do formulário

            // Obtém o arquivo selecionado
            const fileInput = document.getElementById('formFile');
            const file = fileInput.files[0];

            if(file){
                $.ajax({
                    url: 'https://api.github.com/repos/LazMDS/Teste_Piloto/contents/artifacts/' + file.name,
                    type: 'GET',
                    headers: {
                    },
                    success: function(data) {   
                        var sha = data.sha;
                        commitFile(file, sha)
                    },
                    error:function(xhr, status, error) {
                        if (xhr.status === 404) {
                            // Arquivo não existe, então não há SHA, passa a função sem SHA
                            commitFile(file, null);
                        } else {
                            console.error('Erro ao obter o SHA do arquivo:', status, error);
                        }
                    }
                });

            }else{
                console.log("Não foi anexado arquivo.");
                submitFormularioPrincipal();
            }                
        });

        //Envio do Arquivo para o GitHUB
        function commitFile(file, sha) { 
            
            readFileAsBase64(file, function(base64Data) {
                // Cria um objeto FormData e adiciona o arquivo a ele
                const formData = new FormData();
                formData.append('file', file);

                var data = {
                    message: 'Commit do arquivo ' + file.name,
                    content: base64Data,
                };

                if (sha) {
                    data.sha = sha;
                }

                $.ajax({
                    type: 'PUT',
                    url: 'https://api.github.com/repos/LazMDS/Teste_Piloto/contents/artifacts/' + file.name,
                    headers: {
                        'Accept': 'application/vnd.github+json'
                    },
                    data: JSON.stringify(data),
                    processData: false,
                    contentType: 'application/json',
                    success: function(response) {
                        console.log('Arquivo enviado com sucesso para o GitHub:', response);
                        controleUploadsArchives();
                        submitFormularioPrincipal();
                    },
                    error: function(xhr, status, error) {
                        console.error('Erro ao enviar arquivo para o GitHub:', error);
                    }
                });
            });
        }
        
        //Submissão no Banco de Dados
        async function submitFormularioPrincipal(){
            const tipo = document.querySelector('.tipo').value;
            const name = document.querySelector('.name').value;
            const description = document.querySelector('.description').value;
            const activityGerated = document.querySelector('.nome').value;
            var activityUsed = await obterActivityUsed();
            var activityChanged = await obterActivityChanged();
            var datesTimes;

            const idArtifact_Type = parseInt(tipo); 

            const dateElement = document.querySelector('.date-texto');
            if (dateElement) {
                const date = dateElement.value;
                const hourElement = document.querySelector('.hour-texto');
                if (hourElement) {
                    const hour = document.getElementById('hora-cons').value;
                    const dateParts = date.split('-'); //Divide uma string contendo uma data no formato 'YYYY-MM-DD' em partes separadas com base no caractere de hífen '-'.
                    const formattedDate = dateParts[0] + '-' + dateParts[1].padStart(2, '0') + '-' + dateParts[2].padStart(2, '0');
                    datesTimes = formattedDate + ' ' + hour;
                } else {
                    console.log('Elemento .hour-texto não encontrado.');
                }
            } else {
                console.log('Elemento .date-texto não encontrado.');
            }
            const dateTime = datesTimes;
            const oldArtifactId = $('#oldArtifactId').val();

            // Envia os dados para o back-end via AJAX
            $.ajax({
                type: 'POST',
                url: 'https://ic-prov-teste.onrender.com/provsw/art/artifact',
                contentType: 'application/json',
                data: JSON.stringify({
                    name: name,
                    idArtifact_Type: idArtifact_Type,
                    generatedAtTime: dateTime,
                    description: description,
                    nameActivity: activityGerated,
                    idArtifAntg: oldArtifactId,
                    usou:activityUsed,
                    mudou:activityChanged,

                }),
            
                success: function(response) {
                    console.log('Dados enviados com sucesso para o backend:', response);
                    //window.location.href = "./listar_artefatos.html";
                    
                },
                error: function(xhr, status, error) {
                    console.error('Erro ao enviar dados para o backend:', error);
                }
            });
        }

        async function obterActivityUsed() {
            var activities = [];
            const inputs = document.querySelectorAll('.titulo-actv');
            for (const input of inputs) {
                let nomeActivity = $(input).val().trim();
                if (nomeActivity !== '') {
                    let activityData  = await buscarActivity(nomeActivity);
                    if (activityData) {
                        activities.push(activityData.idActivity);
                    }
                }
            }
            return activities;
        }

        async function obterActivityChanged() {
            var activities = [];
            const inputs = document.querySelectorAll('.titulo-chang');
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

        //Função para buscar ATividade
        async function buscarActivity(nomeActivity) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: 'https://ic-prov-teste.onrender.com/provsw/art/artifact/activity/' + encodeURIComponent(nomeActivity),
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

        //Formata a data para YYYY-MM-DD
        function formatarDataISO(data) {
            var partes = data.split('/');
            return partes[2] + '-' + partes[1] + '-' + partes[0];
        }
        //Função para enviar dados de envio de file uploads para o banco de dados para a tabela archive
        function controleUploadsArchives() {
            // Obtém a data atual com o fuso horário que condiz com o site para preencher o campo de data
            var currentDate = new Date().toLocaleDateString('pt-BR');
            var currentDateISO = formatarDataISO(currentDate);

            // Obtém a hora atual no formato HH:MM para preencher o campo de hora
            var currentHour = new Date().toTimeString().slice(0, 5);

            const dateParts = currentDateISO.split('-'); //Divide uma string contendo uma data no formato 'YYYY-MM-DD' em partes separadas com base no caractere de hífen '-'.
            const formattedDate = dateParts[0] + '-' + dateParts[1].padStart(2, '0') + '-' + dateParts[2].padStart(2, '0');
            const dateCorrect = formattedDate + ' ' + currentHour;
            
            const fileInput = document.getElementById('formFile');
            const file = fileInput.files[0];

            $.ajax({
                url: 'https://ic-prov-teste.onrender.com/provsw/art/artifact/uploads',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    name: file.name,
                    upload: dateCorrect
                }),
                success: function(response) {
                    if (response.error) {
                        console.error('Erro na requisição:', response.error);
                        return;
                    }
                    if (!response.result) {
                        console.error('Dados inválidos ou ausentes na resposta.');
                        return;
                    }

                },
                error: function(xhr, status, error) {
                    console.error(error);
                }
            });
        }
    });

// Controla o funcionamento do checkbox.
    function toggleMoreContentUsed() {
        var checkbox = document.getElementById("showMoreContentUsed");
        if (checkbox.checked) {
            addMoreInputActivityUsed();
            
        } else {
            removeAllInputActivityUsed();
        }
    }
    function toggleMoreContentChanged() {
        var checkbox = document.getElementById("showMoreContentChanged");
        if (checkbox.checked) {
            addMoreInputChanged();
            
        } else {
            removeAllInputsChanged();
        }
    }

// Add inputs dinamicamentes no checkbox.
    //Add inputs para digitar os nomes das atividades associadas, se necessário. 
    //Add dinamicamente, quando clica no botão plus
    //E chama a função de pesquisar os nomes no banco também
    var countInputUsed=0;
    var countInputChanged=0;

    function trimLeadingWhitespace(textarea) {
        textarea.value = textarea.value.trimStart();
    }

    //USED
    function addMoreInputActivityUsed() {
        countInputUsed++;
        var novoInput = `
        <div class="input-container row row-cols-10 used revisao" id="activityused">
            <div class="div col-2">
                <p class="h6">Nome da Atividade:</p>
            </div>
            <div class="col-9">
                <label for="formUsedTextarea${countInputUsed}" class="form-label"></label>
                <textarea class="form-control titulo-texto textarea-container titulo-actv" id="formUsedTextarea${countInputUsed}" rows="3" name="usou" oninput="trimLeadingWhitespace(this), buscarAtividadesSemelhantes(this)"></textarea>
            </div>
            <div class="col-1">
                <i class="bi bi-plus-circle-fill plus plus-click" id= "inputCounter" onclick="addMoreInputActivityUsed(this)"></i>
                <i class="bi bi-dash-circle-fill" onclick="removeInputActivityUsed(this)"></i>
            </div>
            <select class="col-sm-9 offset-md-2" id="opcoesActivity" style="display: none;" onchange="preencherTextArea(this)">
                <!-- Opções dos nomes das activities semelhantes serão adicionadas aqui quando começarem a digitar-->
            </select>

        </div>
        `;
        $('#activityused').after(novoInput);

    }

    function removeInputActivityUsed(button) {
        $(button).closest('.input-container.used').remove();
        countInputUsed--;
        if (countInputUsed === 0) {
            $('#showMoreContentUsed').prop('checked', false);
            toggleMoreContentUsed();
        }
    }

    function removeAllInputActivityUsed() {
        $('.input-container.used').css('display', 'none');
    }
    // END USED

    //CHANGED
    function addMoreInputChanged() {
        countInputChanged++;
        var novoInput = `
        <div class="input-container row row-cols-12 changed revisao" id="activitychanged">
            <div class="div col-2">
                <p class="h6">Nome da Atividade:</p>
            </div>
            <div class="col-9">
                <label for="formChangedTextarea${countInputUsed}" class="form-label"></label>
                <textarea class="form-control titulo-texto textarea-container titulo-actv" id="formChangedTextarea${countInputUsed}" rows="3" name="mudou" oninput="trimLeadingWhitespace(this), buscarAtividadesSemelhantes(this)"></textarea>
            </div>
            <div class="col-1">
                <i class="bi bi-plus-circle-fill plus plus-click" id= "inputCounter" onclick="addMoreInputChanged(this)"></i>
                <i class="bi bi-dash-circle-fill" onclick="removeInputChanged(this)"></i>
            </div>
            <select class="col-sm-9 offset-md-2" id="opcoesActivity" style="display: none;" onchange="preencherTextArea(this)">
                <!-- Opções dos nomes das activities semelhantes serão adicionadas aqui quando começarem a digitar-->
            </select>
        </div>
        `;
        $('#activitychanged').after(novoInput);
        
    }

    function removeInputChanged(button) {
        $(button).closest('.input-container.changed').remove();
        countInputChanged--;
        if (countInputChanged === 0) {
            $('#showMoreContentChanged').prop('checked', false);
            toggleMoreContentChanged();
        }
    }

    function removeAllInputsChanged() {
        $('.input-container.changed').css('display', 'none');
    }
    //END CHANGED
    function carregarDados() {
        $.ajax({
            url: 'https://ic-prov-teste.onrender.com/provsw/art/artifact',
            type: 'GET',
            success: function(response) {
                $('#tabelaArtifact tbody').empty();
                
                // Verifique se há erros
                if (response.error) {
                    console.error('Erro na requisição:', response.error);
                    return;
                }

                // Verifique se há dados
                if (!response.result || !Array.isArray(response.result)) {
                    console.error('Dados inválidos ou ausentes na resposta.');
                    return;
                }

                // Adiciona os novos dados à tabela
                response.result.forEach(function(artefato) {
                    var newRow = $(' <tr class="table align-middle" id="row' + artefato.codigo +  '">'+
                                    '<td class="col-auto">'+ artefato.codigo + '</td>'+
                                    '<td class="col-auto">'+ artefato.name + '</td>'+
                                    '<td class="col-auto">' + artefato.tipo + '</td>'+
                                    '<td class="col-auto">'+ artefato.description +'</td>'+
                                    '<td class="col-auto">'+ artefato.generate +'</td>'+
                                    '<td class="col-auto">'+ artefato.invalidated+'</td>'+
                                    '<td class="col-auto">'+ artefato.activity.name +'</td>'+
                                    '<td class=" col-auto acao-btns botoes justify-content-center container-fluid">'+
                                        '<button type="button" class="btn btn-success botoes rounded">Editar</button>'+
                                        '<button type="button" class="btn btn-danger botoes rounded" onclick="exibirModal(\'row' + artefato.codigo + '\')">Apagar</button>'+
                                    '</td>'+
                                '</tr>'
                                );
                    $('#tabelaArtifact tbody').append(newRow);
                });
            },
            error: function(xhr, status, error) {
                console.error(error);
            }
        });
    }
    // Chama a função para carregar os dados ao carregar a página
    $(document).ready(function() {
        carregarDados();
    });

    $(document).on('click', '.btn-success', function () {
        var row = $(this).closest('tr'); // Encontra a linha da tabela mais próxima
        var idArtifact = row.find('td:eq(0)').text(); // Captura o ID do Stakeholder na primeira célula da linha
        var nome = row.find('td:eq(1)').text(); // Captura o nome do Stakeholder na segunda célula da linha
        var tipo = row.find('td:eq(2)').text();
        var description = row.find('td:eq(3)').text();
        var activity = row.find('td:eq(6)').text();
        
        // Redireciona para a página do formulário principal com os dados como parâmetros de consulta na URL
        window.location.href = 'artefatos.html?id=' + encodeURIComponent(idArtifact) + '&nome=' + encodeURIComponent(nome) + '&tipo=' + encodeURIComponent(tipo) + '&description=' + encodeURIComponent(description) + '&nameActivity=' + encodeURIComponent(activity) ;
    });

    let idToDelete;

    $(document).ready(function() {
        // Adiciona um evento para fechar o modal ao clicar no botão de fechar (X) ou no botão "Cancelar"
        $('#fecharModal, #cancelarExclusao').on('click', function() {
            $('#confirmacaoModal').modal('hide');
        });
    });

    function exibirModal(id) {
        idToDelete = id;
        $('#confirmacaoModal').modal('show');
        $('#confirmarExclusao').on('click', function() {
            deletar(idToDelete);
        });
    };

    $(document).on('click', '.btn-danger', function () {
        var row = $(this).closest('tr'); // Encontra a linha da tabela mais próxima
        var idArtifact = row.find('td:eq(0)').text(); // Captura o ID do recurso na primeira célula da linha
                
        exibirModal(idArtifact);
    });

    async function deletar(idToDelete) {
        // Fecha o modal de confirmação
        $('#confirmacaoModal').modal('hide');

        // Chama a função de exclusão no backend passando o id como parâmetro
        $.ajax({
            url: 'https://ic-prov-teste.onrender.com/provsw/art/artifact/'+ idToDelete,
            type: 'PUT',
            success: function(response) {
                // Remove a linha da tabela
                //$('#' + idToDelete).remove();
                carregarDados();
            },
            error: function(xhr, status, error) {
                console.error('Erro ao deletar procedimento!');
            }
        });
    }

    // Adiciona um listener para o botão de confirmar exclusão
    //document.getElementById('confirmarExclusao').addEventListener('click', deletar);
