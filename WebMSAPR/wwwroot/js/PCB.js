var flagInput=0
var numberOfInput = -1;
var numberOfElement=1;
cy = cytoscape({

    container: document.getElementById('cy'),

    elements: [],
    style: cytoscape.stylesheet()
        .selector('node')
        .css({
            'height': 'data(height)',
            'width': 'data(width)',
            'background-fit': 'cover',
            'border-color': '#000',
            'border-width': 0,
            'border-opacity': 0.5,
            'shape':'rectangle',
            'background-opacity': 0,
            'content': 'data(label)',
            'font-size': '15px',
        })
        .selector('edge')
        .css({
            'width': 10,
            'line-color': 'orange',
            'content': 'data(label)',
            'font-size': '15px',
            'color': 'black'
        })
        .selector('node[id1="module"]')
        .css({
            'height': 1,
            'width': 1,
            'background-opacity': 1,
            'background-color': 'green'
        })
        .selector('node[id1="chip"]')
        .css({
            'background-image': '/img/chip.png',
        })
        .selector('node[id1="pcb"]')
        .css({
            'background-image': '/img/pcb.png',
        })
        .selector('node[id1="pcb2"]')
        .css({
            'background-image': '/img/pcb2.png',
        })
        .selector('node[id1="pcb3"]')
        .css({
            'background-image': '/img/pcb3.png',
        })
        .selector('node[id1="cpu"]')
        .css({
            'background-image': '/img/cpu.png',
        })
        .selector('node[id1="processor"]')
        .css({
            'background-image': '/img/processor.png',
        })
})

var el = ['pcb','pcb2','chip','processor','pcb3','cpu']

async function  PCB(){
    if (newPCB()){
        return;
    }
    const response = await fetch("/api/PCB/PCB", {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    if (response.ok) {
        const PCB = await response.json();
        for (let i = 0; i <PCB.elements.length;i++){
            var rand = Math.floor(Math.random() * el.length);
            var length=PCB.elements[i].length==0?10:PCB.elements[i].length;
            var width = PCB.elements[i].width==0?10:PCB.elements[i].width;
            cy.add([{group: 'nodes',
                data: {id: 'g' + numberOfElement,
                    id1:el[rand],
                    label:'g' + numberOfElement+' '+length+'×'+width,
                    width:5*length,
                    height: 5*width}}])
            numberOfElement++;
        }
        for (let i = 0; i <PCB.connections.length;i++){
            cy.add([{group: 'edges',
                data: {
                    id: 'e' + (i+1),
                    source: 'g' + (PCB.connections[i]._element1.number+1),
                    target: 'g' + (PCB.connections[i]._element2.number+1),
                    label: PCB.connections[i]._value
                }
            }])
        }
        cy.layout({name: 'circle'}).run();
        cy.layout({name: 'circle'}).stop();
    }
    
}

async function  genPCB(){
    document.getElementById('inputsEdge').style.display = 'none';
    document.getElementById('inputsSizes').style.display = 'none';
    document.getElementById('saveScheme').style.display = 'none';
    document.getElementById('inputsModule').style.display = 'none';
    while (numberOfInput>-1){
        delInput();
    }
    flagInput=0;
    cy.off('tap')
    cy.off('cxttap')
    cy.remove(cy.elements())

    var $inputs = $('#parameters :input');
    var parameters={};
    var check = true
    $inputs.each(function() {
        if (this.id=="CountOfGenome"||this.id=="CountOfPopulation"){
            if ($(this).val()>0 && $(this).val()% 1 == 0){
                parameters[this.id]=$(this).val();
            }
            else{
                alert("В кол-ве введите целое, не отрицательное число!")                
                return check=false;
            }
        }
        if (this.id=="ChanсeCrosover"||this.id=="ChanсeMutation"){
            if ($(this).val()>0 && $(this).val()<1){
                parameters[this.id]=$(this).val();
            }
            else{
                alert("В шансах введите число больше 0 и меньше 1!")
                return check=false;
            }
        }
    })
    if (!check){
        return
    }
    debugger;
    const response = await fetch("/api/PCB/genPCB", {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(parameters)
    });
    if (response.ok) {
        const resp = await response.json();
        if (resp.resultCode==-1){
            alert(resp.message)
            return;
        }
        const PCB = resp.entity;

        let x = 0;
        for (let i = 0; i <PCB.modules.length;i++)
        {
            cy.add([{group: 'nodes', data: {id: 'v' + (i + 1),
                    id1:'module',
                    label:'v' + (i + 1) +' V='+PCB.modules[i].square}}])
            for (let j =0;j<PCB.modules[i].elements.length;j++)
            {
                var rand = Math.floor(Math.random() * el.length);
                cy.add([{group: 'nodes',
                    data: {id: 'g' + PCB.modules[i].elements[j].number,
                        parent: 'v' + (i + 1),
                        id1:el[rand],
                        label:'g' + PCB.modules[i].elements[j].number+' '+PCB.modules[i].elements[j].length+'×'+PCB.modules[i].elements[j].width,
                        width:5*PCB.modules[i].elements[j].width,
                        height: 5*PCB.modules[i].elements[j].length}}])
            }

            for (let j =0;j<PCB.modules[i].connectionsInModules.length;j++)
            {
                cy.add([{group: 'edges',
                    data: {
                        id: 'e' + (x+1),
                        source: 'g' + PCB.modules[i].connectionsInModules[j]._element1.number,
                        target: 'g' + PCB.modules[i].connectionsInModules[j]._element2.number,
                        label: PCB.modules[i].connectionsInModules[j]._value
                    }
                }])
                x+=1;
            }
        }
        for (let i =0; i<PCB.connectionsBeetwenModules.length;i++){
            cy.add([{group: 'edges',
                data: {
                    source: 'v' + (PCB.connectionsBeetwenModules[i].module1.number+1),
                    target: 'v' + (PCB.connectionsBeetwenModules[i].module2.number+1),
                    label: PCB.connectionsBeetwenModules[i].value
                }
            }])
            x+=1;
        }
        var layout = cy.layout({
            name: 'fcose',
            quality: "default",
            randomize: true,
            animate: false,
            animationDuration: 1000,
            animationEasing: undefined,
            fit: true,
            padding: 30,
            nestingFactor: 0.1,
            gravityRangeCompound: 3,
            gravityCompound: 3
        });
        layout.run();

    }
    else{
        alert("Ошибка при запросе")
    }
}

async function saveScheme() {
    if (!confirm("Старая схема будет удалена из файла, вы уверены?")){
        return;
    }
    var nodes = cy.nodes();
    var arrOfNodes = []
    var arrOfSizes=[]
    for (let i = 0; i < nodes.length; i++) {
        arrOfNodes.push(nodes[i].data().id)
        arrOfSizes.push([nodes[i].data().height/5,nodes[i].data().width/5])
    }
    if (arrOfNodes.length<2){
        alert("Введите как минимум 2 вершины!")
        return
    }
    var edges = cy.edges();
    var matrix = new Array(arrOfNodes.length);
    for (let i = 0; i < arrOfNodes.length; i++) {
        matrix[i] = []
    }
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix.length; j++) {
            matrix[i].push('0')
        }
    }
    for (let i = 0; i < edges.length; i++) {
        var l = arrOfNodes.indexOf(edges[i].data().source)
        var l1 = arrOfNodes.indexOf(edges[i].data().target)
        matrix[l][l1] = String( edges[i].data().label);
        matrix[l1][l] = String(edges[i].data().label);
    }
    var $inputs = $('#profile :input');
    if ($inputs.length<1){
        alert("Нужно больше 1 модуля!")
        return;
    }
    var valuesSizes = [];
    var valuesCounts = [];
    var check=true;
    $inputs.each(function() {
        if (this.className=="count"){
            if ($(this).val()>0 && $(this).val()% 1 == 0){
                valuesCounts.push($(this).val());
            }
            else{
                alert("Вы ввели нецелое число или <0 или ничего в кол-ве")
                
                return check=false;
            }
        }

        if (this.className=="square")
        {
            if ($(this).val()>-1){
                valuesSizes.push($(this).val()==0?String(2147483647):String($(this).val()));
            }
            else{
                alert("Вы ввели отрицательное число в площади")
                return check=false;
            }
        }
    });
    if (!check){
        return
    }
    var sumCount = valuesCounts.reduce((partialSum, a) => partialSum + parseInt(a), 0);
    if (sumCount!=arrOfNodes.length){
        alert("Сумма кол-ва элементов в модулях не равна кол-ву элементов в схеме!")
        return;
    }
    var v= JSON.stringify({'Matrix':matrix, 
                                'SizesElements':arrOfSizes,
                                'CountElements':valuesCounts,
                                'SizeModule':valuesSizes})
    const response = await fetch("/api/PCB/LoadMatrix", {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: v
    });
}



function newPCB(){
    if (flagInput==0){
        document.getElementById('inputsEdge').style.display = 'block';
        document.getElementById('inputsSizes').style.display = 'block';
        document.getElementById('saveScheme').style.display = 'block';
        document.getElementById('inputsModule').style.display = 'block';        
        flagInput=1;
        numberOfElement=1;
        cy.remove(cy.elements())
    }
    else{
        document.getElementById('inputsEdge').style.display = 'none';
        document.getElementById('inputsSizes').style.display = 'none';
        document.getElementById('saveScheme').style.display = 'none';
        document.getElementById('inputsModule').style.display = 'none';
        while (numberOfInput>-1){
            delInput();
        }
        flagInput=0;
        cy.off('tap')
        cy.off('cxttap')
        cy.remove(cy.elements())
        numberOfElement=1;
        return true;
    }

    cy.zoom({                       // Zoom to the specified position
        level: 1
    });

    cy.on('tap', function( evt ){
        var tgt = evt.target || evt.cyTarget; // 3.x || 2.x

        if( tgt === cy ){
            var rand = Math.floor(Math.random() * (el.length));
            cy.add({
                group: 'nodes',
                data: { id: 'g' + numberOfElement,
                    id1:el[rand],
                    label:'g'+numberOfElement+' 10×10',
                    width:50,
                    height: 50,
                },
                position: {
                    x: evt.position.x,
                    y: evt.position.y
                }
            });
           
        }
        numberOfElement+=1;
    });


    cy.on('cxttap', 'node', function( evt ){
        var tgt = evt.target || evt.cyTarget; 
        tgt.remove();
    })

    cy.on('cxttap', 'edge', function( evt ){
        var tgt = evt.target || evt.cyTarget; 
        tgt.remove();
    })

    var x=0;
    document.querySelector('#start').addEventListener('click', function() {
        try {
            if ((document.getElementById('source').value>0) &&
                (document.getElementById('target').value>0) && 
                (document.getElementById('number').value>0)) {
                cy.add([{
                    group: 'edges',
                    data: {
                        source: 'g' + document.getElementById('source').value,
                        target: 'g' + document.getElementById('target').value,
                        label: document.getElementById('number').value
                    }
                }])
                var edge = cy.elements()[cy.elements().length-1]
                var dataEdge = edge.data();
                edges = cy.edges()
                for (let j =0;j<edges.length-1;j++){
                    var data1 = edges[j].data()
                    if ((data1.source==dataEdge.source && data1.target==dataEdge.target)||
                        (data1.source==dataEdge.target && data1.target==dataEdge.source))
                    {
                        cy.remove(edge)
                        alert("Между этими элементами уже есть соединение! Удалите его и создайте заново")
                        return;
                    }
                }
                x += 1;
            }
            else{
                alert("Вы ввели не число или пустоту!")
            }
        }
        catch (ex)  {
            alert("Таких вершин нет!")
        }        
    });

    document.querySelector('#SetSize').addEventListener('click', function() {
        try {
            if ((document.getElementById('element').value >0) &&
                (document.getElementById('length').value >0) &&
                (document.getElementById('width').value >0)) {
                var id=document.getElementById('element').value;
                var length = document.getElementById('length').value==0?10:document.getElementById('length').value
                var width = document.getElementById('width').value==0?10:document.getElementById('width').value
                cy.nodes(`[id="g${id}"]`).data('width',5*width)
                cy.nodes(`[id="g${id}"]`).data('height',5*length)
                cy.nodes(`[id="g${id}"]`).data('label','g' + id+' '+length+'×'+width)
            } 
            else {
                alert("Вы ввели не число или пустоту!")
            }
        }
        catch (ex){
            alert("Такой вершины нет!")
        }

    });

        
}

function addInput() {
    var profile = document.getElementById('profile');
    var div = document.createElement('div');
    div.id = 'input' + (++numberOfInput);    
    div.innerHTML = '<input type="number" class="count" placeholder="Кол-во эл" min="0"> <input type="number" class="square" placeholder="Площадь" min="0">';
    profile.appendChild(div);
}

function delInput() {
    if (numberOfInput==-1){
        return
    }
    var div = document.getElementById('input' + numberOfInput);
    div.remove();
    --numberOfInput;
}

