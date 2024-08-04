
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

        //Modal do Cadastro com sucesso
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

    //Abrir os inputs depois de clicar no checkbox
    const hardwareCheckbox = document.getElementById('hardwareCheckbox');
    const softwareCheckbox = document.getElementById('softwareCheckbox');
    
    //Abrir somente um por vez
    hardwareCheckbox.addEventListener('click', function(){
        if(this.checked){
            softwareCheckbox.checked=false; 
            document.getElementById('collapseWidthExample1').classList.remove('show');
        }
        document.getElementById('collapseWidthExample').classList.toggle('show');
        document.getElementById('hardwareTextarea').value='';
        $('#showMoreContentUsedResource').prop('checked', false);
        toggleMoreContentUsedResource()
    });

    softwareCheckbox.addEventListener('click', function(){
        if(this.checked){
            hardwareCheckbox.checked=false; 
            document.getElementById('collapseWidthExample').classList.remove('show');
        }
        document.getElementById('collapseWidthExample1').classList.toggle('show');
        document.getElementById('exampleFormControlTextarea2').value='';
        document.getElementById('exampleFormControlTextarea3').value='';
        document.getElementById('exampleFormControlTextarea4').value='';
        $('#showMoreContentUsed').prop('checked', false);
        $('#showMoreContentChanged').prop('checked', false);
        toggleMoreContentUsed();
        toggleMoreContentChanged();
    });

    softwareCheckbox.addEventListener('click', function(){
        if(!this.checked){
            document.getElementById('collapseWidthExample1').classList.remove('show');
        }
    });

    hardwareCheckbox.addEventListener('click', function(){
        if(!this.checked){
            document.getElementById('collapseWidthExample').classList.remove('show');
        }
    });
    

    // Função Genérica de Buscar Dados Semelhantes para preencher no Select
    function buscarSemelhantes(textarea, endpoint, classItem) {
        let nomeItem = textarea.value;

        if (nomeItem.length > 0) {   
            // Envia a solicitação AJAX para o backend para buscar atividades semelhantes
            $.ajax({
                url: endpoint + nomeItem,
                type: 'GET',
                success: function(response) {                            
                    let select = $(textarea).closest(classItem).find('select');
                    select.empty();
                    select.append($('<option>', {
                        value: '',
                        text: `Selecione uma Activity`,
                        disabled: 'disabled',
                        selected: 'selected'
                    }));

                    // Adiciona as opções no select
                    if (response.result && response.result.length > 0) {
                        response.result.forEach(function(item) {
                            select.append($('<option>', {
                                value: item.idActivity,
                                text: item.name
                            }));
                        });
                    } else {
                        // Se não houver atividades retornadas, adiciona uma opção indicando que nenhum foi encontrado
                        select.append($('<option>', {
                            value: '',
                            text: `Nenhuma Activity encontrada`
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

    // Controla o funcionamento do checkbox dos relacionais
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

    function toggleMoreContentUsedResource(){
        var checkbox = document.getElementById("showMoreContentUsedResource");
        if (checkbox.checked) {
            addMoreInputUsedResource();
            
        } else {
            removeAllInputsUsedResource();
        }
    }

    // Add inputs dinamicamentes no checkbox.
    //Add inputs para digitar os nomes das atividades associadas, se necessário. 
    //Add dinamicamente, quando clica no botão plus
    //E chama a função de pesquisar os nomes no banco também
    var countInputUsed=0;
    var countInputChanged=0;
    var countInputUsedResource=0;

    function trimLeadingWhitespace(textarea) {
        textarea.value = textarea.value.trimStart();
    }

    //USED ARTIFACT
    function addMoreInputActivityUsed() {
        countInputUsed++;
        var novoInput = `
        <div class="input-container row row-cols-12 used revisao" id="activityused">
            <p class="h6 titulo col-1 nome-texto" style="margin-top: 20px;" >Nome da Atividade:</p>
            <textarea class="form-control titulo-texto col textarea-container titulo-actv" id="formUsedTextarea${countInputUsed}" rows="1" name="usou" style="margin-top: 15px;" oninput="trimLeadingWhitespace(this), buscarAtividadesUsadasSemelhantes(this)"></textarea>
            <div class="col-1" style="margin-top: 2vh;">
                <i class="bi bi-plus-circle-fill plus plus-click small-icon" id= "inputCounter" onclick="addMoreInputActivityUsed(this)"></i>
                <i class="bi bi-dash-circle-fill small-icon" onclick="removeInputActivityUsed(this)"></i>
            </div>
            <select class="col-9 offset-md-1" id="opcoesActivity" style="display: none; margin-left:12vw; font-size:16px; margin-top: -2vh;" onchange="preencherTextArea(this, '.input-container.used')">
                <!-- Opções dos nomes dos stakeholders semelhantes serão adicionadas aqui quando começarem a digitar-->
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
            <p class="h6 titulo col-1 nome-texto" style="margin-top: 20px;">Nome da Atividade:</p>
            <textarea class="form-control titulo-texto col textarea-container titulo-chang" id="formChangedTextarea${countInputChanged}" rows="1" name="mudou" style="margin-top: 15px" oninput="trimLeadingWhitespace(this), buscarAtividadesMudadasSemelhantes(this)"></textarea>
            <div class="col-1" style="margin-top: 2vh;">
                <i class="bi bi-plus-circle-fill plus plus-click small-icon" id= "inputCounter" onclick="addMoreInputChanged(this)"></i>
                <i class="bi bi-dash-circle-fill small-icon" onclick="removeInputChanged(this)"></i>
            </div>
            <select class="col-9 offset-md-1" id="opcoesActivity" style="display: none; margin-left:12vw; font-size:16px; margin-top: -2vh;" onchange="preencherTextArea(this, '.input-container.changed')">
                <!-- Opções dos nomes dos stakeholders semelhantes serão adicionadas aqui quando começarem a digitar-->
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

    // Buscar Dados específicos semelhantes
    function buscarAtividadesSemelhantes(textarea){
        buscarSemelhantes(textarea, 'http://localhost:3000/provsw/res/resources/activity/', '.input-container.generated');
    }
    function buscarAtividadesUsadasSemelhantes(textarea){
        buscarSemelhantes(textarea, 'http://localhost:3000/provsw/res/resources/activity/', '.input-container.used');
    }

    function buscarAtividadesMudadasSemelhantes(textarea){
        buscarSemelhantes(textarea, 'http://localhost:3000/provsw/res/resources/activity/', '.input-container.changed');
    }

    function buscarAtividadesUsadasRecursoSemelhantes(textarea){
        buscarSemelhantes(textarea, 'http://localhost:3000/provsw/res/resources/activity/', '.input-container.usedRecurso');
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


    //Inserção de um novo cadastro de recurso de software
    //Função para tranformar o arquivo em base64 (Veio do ChatGPT)
    function readFileAsBase64(file, callback) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const base64Data = event.target.result.split(',')[1];
            callback(base64Data);
        };
        reader.readAsDataURL(file);
    }

    // Busca do SHA e envio dos Arquivos Upados para o GitHub
    document.addEventListener('DOMContentLoaded', function() {

        document.getElementById('formulário').addEventListener('submit', async function(event) {
            event.preventDefault(); // Impede o envio padrão do formulário
            await submitResource();
        });

        //Envio do Arquivo para o GitHUB
        function commitFile(file, sha) { 
            
            readFileAsBase64(file, async function(base64Data) {
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
                    url: 'https://api.github.com/repos/LazMDS/Testes/contents/artifacts/resource/' + file.name,
                    headers: {
                        'Accept': 'application/vnd.github+json'
                    },
                    data: JSON.stringify(data),
                    processData: false,
                    contentType: 'application/json',
                    success: function(response) {
                        console.log('Arquivo enviado com sucesso para o GitHub:', response);
                        controleUploadsArchives();
                    },
                    error: function(xhr, status, error) {
                        console.error('Erro ao enviar arquivo para o GitHub:', error);
                    }
                });
            });
        }

        async function submitResource (){
            var nome;
            var tipo;
            if ($('#hardwareCheckbox').is(':checked')) {
                nome = $('#hardwareTextarea').val();
                tipo = 2;
            } else if ($('#softwareCheckbox').is(':checked')) {
                nome = $('#exampleFormControlTextarea2').val();
                tipo = 1;
            }

            try {
                var activityUsed = await obterActivityUsed();
                var artifact;

                if(tipo===1){
                    const fileInput = document.getElementById('formFile');
                    const file = fileInput.files[0];

                    if(file){
                        $.ajax({
                            url: 'https://api.github.com/repos/LazMDS/Testes/contents/artifacts/resource/' + file.name,
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
                        artifact = await submitFormularioPrincipal();
                        console.log("artifact: ", artifact);

                    }else{
                        console.log("Não foi anexado arquivo.");
                        artifact = await submitFormularioPrincipal();
                        console.log("artifact: ", artifact);
                    } 
                }

                
                $.ajax({
                    type: 'POST',
                    url: 'http://localhost:3000/provsw/res/resources',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        name: nome,
                        idResource_Type: tipo,
                        usou: activityUsed,
                    }),
                    success: function(response) {
                        console.log('Dados da submitResource enviados com sucesso para o backend:', response);
                    },
                    error: function(xhr, status, error) {
                        console.error(error);
                    }
                });
            }catch (error) {
                console.error('Erro ao obter activityUsed:', error);
            }                     
        }
        
        //Submissão no Banco de Dados
        async function submitFormularioPrincipal(){
            const tipo = parseInt(1);
            const name = document.querySelector('.name').value;
            const description = document.querySelector('.description').value;
            const activityGerated = document.querySelector('.nome').value;
            var activityChanged = await obterActivityChanged();
            var activityUsed = await obterActivityUsed();
            var datesTimes;

            const dateElement = document.querySelector('.date-texto');
            if (dateElement) {
                const date = dateElement.value;
                const hourElement = document.querySelector('.hour-texto');
                console.log("hora 1:", hourElement);
                if (hourElement) {
                    const hour = document.getElementById('hora-cons').value;
                    console.log("hora 2:", hour);
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
                url: 'http://localhost:3000/provsw/res/resources/artifact',
                contentType: 'application/json',
                data: JSON.stringify({
                    name: name,
                    idArtifact_Type: tipo,
                    generatedAtTime: dateTime,
                    description: description,
                    nameActivity: activityGerated,
                    idArtifAntg: oldArtifactId,
                    mudou:activityChanged,
                    usou: activityUsed,
                }),
            
                success: function(response) {
                    const result = response.result.idArtifact;
                    console.log('Dados da submitFormularioPrincipal enviados com sucesso para o backend:', response);
                    $('#recursoAgora').val(result);                                                    
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
                        console.log("Activity associadas: ", activities);                
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
            console.log("Buscando stakeholder para:", nomeActivity);
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: 'http://localhost:3000/provsw/res/resources/activity/correct/' + nomeActivity,
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
                url: 'http://localhost:3000/provsw/res/resources/uploads',
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