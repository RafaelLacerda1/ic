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
    // Teste do envio dos inputs para o console
    document.addEventListener('DOMContentLoaded', function() {
        document.getElementById('formulário').addEventListener('submit', function(event) {
            const tipo = document.querySelector('.tipo').value;
            console.log(tipo);
            if(tipo === "1"){
                console.log("Tipo: 1 - Document Template");
            }else if (tipo === "3"){
                console.log("Tipo: 3 - Method");
            }else if (tipo === "2"){
                console.log("Tipo: 2 - Technique");
            }

            const name = document.querySelector('.name').value;
            console.log('Nome:', name);
            const dateElement = document.querySelector('.date-texto');
            if (dateElement) {
                const date = dateElement.value;
                console.log('Data:', date);
                const hourElement = document.querySelector('.hour-texto');
                if (hourElement) {
                    const hour = hourElement.value;
                    console.log('Hora:', hour);
                    console.log('Generated in: ', date+ 'T'+ hour+ 'Z');
                } else {
                    console.log('Elemento .hour-texto não encontrado.');
                }
            } else {
                console.log('Elemento .date-texto não encontrado.');
            }
        });
    });

    //Controle do Modal
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
// Controla o funcionamento do checkbox.
    function toggleMoreContentActivity() {
        var checkbox = document.getElementById("showMoreContentActivity");
        if (checkbox.checked) {
            addMoreInputActivity();
            
        } else {
            removeAllInputActivity();
        }
    }
 // Add inputs dinamicamentes no checkbox.
    //Add inputs para digitar os nomes das atividades associadas, se necessário. 
    //Add dinamicamente, quando clica no botão plus
    //E chama a função de pesquisar os nomes no banco também
    var countInputActivity=0;

    function trimLeadingWhitespace(textarea) {
        textarea.value = textarea.value.trimStart();
    }

    //ACTIVITY
    function addMoreInputActivity() {
        countInputActivity++;
        var novoInput = `
        <div class="input-container container-sm row row-cols-12 assoc" id="activity">
            <p class="h6 titulo col-1 nome-texto">Nome da Atividade:</p>
            <textarea class="form-control titulo-texto col textarea-container titulo-actv" id="formTextarea${countInputActivity}" rows="1" name="associou" style="margin-top: 15px;" oninput="trimLeadingWhitespace(this), buscarActivitySemelhantes(this)"></textarea>
            <div class="col-1" style="margin-top: 4vh;">
                <i class="bi bi-plus-circle-fill plus plus-click" id= "inputCounter" onclick="addMoreInputActivity(this)"></i>
                <i class="bi bi-dash-circle-fill" onclick="removeInputActivity(this)"></i>
            </div>
            <select class="col-9 offset-md-1" id="opcoesActivity" style="display: none; margin-left: 15vw;" onchange="preencherTextAreaActivity(this)">
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
 //Função para buscar os atividades com nome semelhante e colocar no drop do select
    function buscarActivitySemelhantes(textarea) {
        let nomeActivity = textarea.value;
        
        if (nomeActivity.length > 0) {   
            // Envia a solicitação AJAX para o backend para buscar atividades semelhantes
            $.ajax({

                url: 'http://localhost:3000/provsw/proc/procedures/adocao/' + nomeActivity,
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
 // //Inserção de um novo cadastro

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
        var idProcedures = urlParams.get('id');
        var nome = urlParams.get('nome');
        var tipo = urlParams.get('tipo');

        // Preenche os campos do formulário com os dados recuperados
        $('#exampleFormControlTextarea2').val(nome);
        $('#inputGroupSelect01').val(tipo);
        $('#oldProcedureId').val(idProcedures);

        const oldProcedureId = $('#oldProcedureId').val();

        // Exibe o formulário de inserção com os dados preenchidos
        $('#formulário').show();

    });

    // Envio dos Arquivos Upados para o GitHub
    document.addEventListener('DOMContentLoaded', function() {
        // Envio dos Arquivos Upados para o GitHub
        document.getElementById('formulário').addEventListener('submit', function(event) {
            event.preventDefault(); // Impede o envio padrão do formulário

            // Obtém o arquivo selecionado
            const fileInput = document.getElementById('formFile');
            const file = fileInput.files[0];

            if(file){
                $.ajax({
                    url: 'https://api.github.com/repos/LazMDS/Teste_Piloto/contents/procedures/' + file.name,
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
                submitMainForm();
            }                
        });

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
                    url: 'https://api.github.com/repos/LazMDS/Teste_Piloto/contents/procedures/' + file.name,
                    headers: {
                        'Accept': 'application/vnd.github+json'
                    },
                    data: JSON.stringify(data),
                    processData: false,
                    contentType: 'application/json',
                    success: function(response) {
                        console.log('Arquivo enviado com sucesso para o GitHub:', response);
                        controleUploadsArchives();
                        submitMainForm();
                    },
                    error: function(xhr, status, error) {
                        console.error('Erro ao enviar arquivo para o GitHub:', error);
                    }
                });
            });
        }


        //Submissão no Banco de Dados
        async function submitMainForm(){
            const tipo = document.querySelector('.tipo').value;
            const name = document.querySelector('.name').value;
            var datesTimes;

            const idProcedures_Type = parseInt(tipo); 

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
            const oldProcedureId = $('#oldProcedureId').val();

            var activity = await obterActivity();

            // Envia os dados para o back-end via AJAX
            $.ajax({
                type: 'POST',
                url: 'http://localhost:3000/provsw/proc/procedures',
                contentType: 'application/json',
                data: JSON.stringify({
                    name: name,
                    idProcedures_Type: idProcedures_Type,
                    generatedAtTime: dateTime,
                    idProcAntg: oldProcedureId,
                    associou: activity,
                }),
            
                success: function(response) {
                    console.log('Dados enviados com sucesso para o backend:', response);
                    //window.location.href = "./listar_proced.html";
                    
                },
                error: function(xhr, status, error) {
                    console.error('Erro ao enviar dados para o backend:', error);
                }
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
                url: 'http://localhost:3000/provsw/proc/procedures/uploads',
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

    async function buscarActivity(nomeActivity) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: 'http://localhost:3000/provsw/proc/procedures/adocao/correct/' + nomeActivity,
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