var flagInputElement=0
var flagInputModule=0
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
            'height': 25,
            'width': 25,
            'background-opacity': 1,
            'background-color': 'green',
            'text-wrap':"wrap"
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
    try {
        if (newPCB()){
            return;
        }
        const response = await fetch("/api/PCB/PCB", {
            method: "GET",
            headers: { "Accept": "application/json" }
        });
        if (response.ok) {

            const resp = await response.json();
            if (resp.resultCode==-1){
                alert(resp.message)
                return;
            }

            const PCB = resp.entity;
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
        else{
            alert("Ошибка при запросе")
        }
    }
    catch (ex){
        alert("Неизвестная ошибка!")
    }  
    
}

async function  genPCB(){
    try {
        if (cy.elements().length>0 && !confirm("Схема на экране будет удалена, вы уверены?")){
            return;
        }
        if (!confirm("Будет запущен ген алгоритм со схемой из файла. Вы уверены?")){
            return;
        }
        document.getElementById('inputsEdgeElement').style.display = 'none';
        document.getElementById('inputsSizesElement').style.display = 'none';
        document.getElementById('saveScheme').style.display = 'none';
        document.getElementById('inputsEdgeModule').style.display = 'none';
        document.getElementById('inputsSizesModule').style.display = 'none';
        flagInputElement=0;
        flagInputModule=0;
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
                if ($(this).val()>0 && $(this).val()<=1){
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
        document.getElementById("PCB").disabled = true
        document.getElementById("genPCB").disabled = true;
        document.getElementById("newPCB").disabled = true;
        document.getElementById("newModule").disabled = true;
        document.getElementById("Module").disabled = true;


        const response = await fetch("/api/PCB/genPCB", {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(parameters)
        });
        if (response.ok) {
            const resp = await response.json();
            if (resp.resultCode==-1){
                alert(resp.message)
                document.getElementById("PCB").disabled = false
                document.getElementById("genPCB").disabled = false;
                document.getElementById("newPCB").disabled = false;
                return;
            }
            const PCB = resp.entity;
            console.log(PCB)
            let x = 0;
            for (let i = 0; i <PCB.modules.length;i++)
            {
                cy.add([{group: 'nodes', data: {id: 'v' + (i + 1),
                        id1:'module',
                        label:'v' + (i + 1) +' S='+PCB.modules[i].square+"\nКол-во="+PCB.modules[i].cnt,
                        classes: 'multiline-manual'}}])
                for (let j =0;j<PCB.modules[i].elements.length;j++)
                {
                    var rand = Math.floor(Math.random() * el.length);
                    cy.add([{group: 'nodes',
                        data: {id: 'g' + (PCB.modules[i].elements[j].number+1),
                            parent: 'v' + (i + 1),
                            id1:el[rand],
                            label:'g' + (PCB.modules[i].elements[j].number+1)+' '+PCB.modules[i].elements[j].length+'×'+PCB.modules[i].elements[j].width,
                            width:5*PCB.modules[i].elements[j].width,
                            height: 5*PCB.modules[i].elements[j].length}}])
                }

                for (let j =0;j<PCB.modules[i].connectionsInModules.length;j++)
                {
                    cy.add([{group: 'edges',
                        data: {
                            source: 'g' + (PCB.modules[i].connectionsInModules[j]._element1.number+1),
                            target: 'g' + (PCB.modules[i].connectionsInModules[j]._element2.number+1),
                            label: PCB.modules[i].connectionsInModules[j]._value
                        }
                    }])
                    x+=1;
                }
            }
            for (let i =0; i<PCB.finalConnectionsBeetwenModules.length;i++){
                cy.add([{group: 'edges',
                    data: {
                        source: 'v' + (PCB.finalConnectionsBeetwenModules[i].module1.number+1),
                        target: 'v' + (PCB.finalConnectionsBeetwenModules[i].module2.number+1),
                        label: PCB.finalConnectionsBeetwenModules[i].value
                    }
                }])
                x+=1;
            }
            document.getElementById("CF").innerText = PCB.fitness;
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
    catch (ex){
        alert("Неизвестная ошибка!")
    }    
    document.getElementById("PCB").disabled = false
    document.getElementById("genPCB").disabled = false;
    document.getElementById("newPCB").disabled = false;
    document.getElementById("newModule").disabled = false;
    document.getElementById("Module").disabled = false;
}
function getMatrixAndSizes(){
    var nodes = cy.nodes();
    var arrOfNodes = []
    var arrOfSizes=[]
    for (let i = 0; i < nodes.length; i++) {
        arrOfNodes.push(nodes[i].data().id)
        arrOfSizes.push([nodes[i].data().height/5,nodes[i].data().width/5])
    }
    if (arrOfNodes.length<2){
        alert("Введите как минимум 2 элемента!")
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
    var v= JSON.stringify({'Matrix':matrix,
        'SizesElements':arrOfSizes,})
    return v;
}

function getMatrixModuleAndSizes(){
    var nodes = cy.nodes();
    var arrOfNodes = []
    var arrOfSizes=[]
    var arrOfCnt=[]
    for (let i = 0; i < nodes.length; i++) {
        arrOfNodes.push(nodes[i].data().id)
        arrOfSizes.push(nodes[i].data().square)
        arrOfCnt.push(nodes[i].data().cnt)
    }
    if (arrOfNodes.length<2){
        alert("Введите как минимум 2 модуля!")
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
        matrix[l][l1] = String( '1');
        matrix[l1][l] = String('1');
    }
    var v= JSON.stringify({'Matrix':matrix,
        'CountElements':arrOfCnt,
        'SizeModule':arrOfSizes})
    return v;
}
async function saveScheme() {
    try {
        if (!confirm("Старая схема будет удалена из файла, вы уверены?")){
            return;
        }
        if (flagInputElement===1){
            var v=getMatrixAndSizes()
            var name = 'element'
        }
        else if(flagInputModule===1){
            var v =getMatrixModuleAndSizes();
            var name = 'module'
        }
        const response = await fetch("/api/PCB/LoadMatrix"+name, {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: v
        });
        if (response.ok){
            const resp = await response.json();
            if (resp.resultCode==-1){
                alert(resp.message)
                return
            }
            alert("Схема сохранена!")
        }
        else {
            alert("Ошибка при запросе")
        }
    }
    catch (ex){
        alert("Неизвестная ошибка!")
    }
    
}



function newPCB(){
    try {
        if (cy.elements().length>0 && !confirm("Схема на экране будет удалена, вы уверены?")){
            return;
        }
        document.getElementById('inputsEdgeModule').style.display = 'none';
        document.getElementById('inputsSizesModule').style.display = 'none';
        document.getElementById('saveScheme').style.display = 'none';
        if (flagInputElement==0){
            document.getElementById('inputsEdgeElement').style.display = 'block';
            document.getElementById('inputsSizesElement').style.display = 'block';
            document.getElementById('saveScheme').style.display = 'block';
            flagInputElement=1;
            numberOfElement=1;
            cy.remove(cy.elements())
        }
        else{
            document.getElementById('inputsEdgeElement').style.display = 'none';
            document.getElementById('inputsSizesElement').style.display = 'none';
            document.getElementById('saveScheme').style.display = 'none';
            flagInputElement=0;
            cy.off('tap')
            cy.off('cxttap')
            cy.remove(cy.elements())
            numberOfElement=1;
            return true;
        }

        cy.zoom({                       
            level: 1
        });

        cy.on('tap', function( evt ){
            var tgt = evt.target || evt.cyTarget; 

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
                }
                else{
                    alert("Вы ввели не число или пустоту!")
                }
            }
            catch (ex)  {
                alert("Таких элементов нет!")
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
                alert("Такого элемента нет!")
            }

        });
    }
    catch (ex){
        alert("Неизвестная ошибка!")
    }         
}


async function Module() {
    try {


        if (newModule()) {
            return;
        }

        const response = await fetch("/api/PCB/Module", {
            method: "GET",
            headers: {"Accept": "application/json"}
        });
        if (response.ok) {
            const resp = await response.json();
            if (resp.resultCode == -1) {
                alert(resp.message)
                return
            }
            var modules = resp.entity.item1;
            var conections = resp.entity.item2;
            console.log(conections)
            for (let i = 0; i < modules.length; i++) {
                cy.add({
                    group: 'nodes',
                    data: {
                        id: 'v' + (i + 1),
                        id1: 'module',
                        label: 'v' + (i + 1) + ' S=' + modules[i].square + "\nКол-во=" + modules[i].cnt,
                        cnt: modules[i].cnt,
                        square: modules[i].square,
                        classes: 'multiline-manual',
                    }
                })
                numberOfElement += 1;
            }
            for (let i = 0; i < conections.length; i++) {
                cy.add([{
                    group: 'edges',
                    data: {
                        source: 'v' + (conections[i].module1.number + 1),
                        target: 'v' + (conections[i].module2.number + 1),
                        label: ""
                    }
                }])
            }
            cy.layout({name: 'circle'}).run();
            cy.layout({name: 'circle'}).stop();
        }
    }
    catch (e){
        alert("Неизвестная ошибка!")
    }
}

function newModule(){
    try {


        if (cy.elements().length > 0 && !confirm("Схема на экране будет удалена, вы уверены?")) {
            return;
        }
        document.getElementById('inputsEdgeElement').style.display = 'none';
        document.getElementById('inputsSizesElement').style.display = 'none';
        document.getElementById('saveScheme').style.display = 'none';
        if (flagInputModule == 0) {
            document.getElementById('inputsEdgeModule').style.display = 'block';
            document.getElementById('inputsSizesModule').style.display = 'block';
            document.getElementById('saveScheme').style.display = 'block';
            flagInputModule = 1;
            numberOfElement = 1;
            cy.remove(cy.elements())
        } else {
            document.getElementById('inputsEdgeModule').style.display = 'none';
            document.getElementById('inputsSizesModule').style.display = 'none';
            document.getElementById('saveScheme').style.display = 'none';
            flagInputModule = 0;
            cy.off('tap')
            cy.off('cxttap')
            cy.remove(cy.elements())
            numberOfElement = 1;
            return true;
        }


        cy.on('tap', function (evt) {
            var tgt = evt.target || evt.cyTarget;

            if (tgt === cy) {
                cy.add({
                    group: 'nodes',
                    data: {
                        id: 'v' + numberOfElement,
                        id1: 'module',
                        label: 'v' + numberOfElement + ' S=' + 2147483647 + "\nКол-во=" + 1,
                        cnt: 1,
                        square: 1231234,
                        classes: 'multiline-manual',
                    },
                    position: {
                        x: evt.position.x,
                        y: evt.position.y
                    }
                });

            }
            numberOfElement += 1;
        });

        cy.on('cxttap', 'node', function (evt) {
            var tgt = evt.target || evt.cyTarget;
            tgt.remove();
        })

        cy.on('cxttap', 'edge', function (evt) {
            var tgt = evt.target || evt.cyTarget;
            tgt.remove();
        })

        document.querySelector('#startModule').addEventListener('click', function () {
            try {
                if ((document.getElementById('sourceModule').value > 0) &&
                    (document.getElementById('targetModule').value > 0)) {
                    cy.add([{
                        group: 'edges',
                        data: {
                            source: 'v' + document.getElementById('sourceModule').value,
                            target: 'v' + document.getElementById('targetModule').value,
                            label: ""
                        }
                    }])
                    var edge = cy.elements()[cy.elements().length - 1]
                    var dataEdge = edge.data();
                    edges = cy.edges()
                    for (let j = 0; j < edges.length - 1; j++) {
                        var data1 = edges[j].data()
                        if ((data1.source == dataEdge.source && data1.target == dataEdge.target) ||
                            (data1.source == dataEdge.target && data1.target == dataEdge.source)) {
                            cy.remove(edge)
                            alert("Между этими элементами уже есть соединение! Удалите его и создайте заново")
                            return;
                        }
                    }
                } else {
                    alert("Вы ввели не число или пустоту!")
                }
            } catch (ex) {
                alert("Таких вершин нет!")
            }
        });

        document.querySelector('#SetSizeModule').addEventListener('click', function () {
            try {
                if ((document.getElementById('numberModule').value >= 0) &&
                    (document.getElementById('squareModule').value >= 0) &&
                    (document.getElementById('cntModule').value > 0)) {
                    var id = document.getElementById('numberModule').value;
                    var square = document.getElementById('squareModule').value == 0 ? 2147483647 : document.getElementById('squareModule').value
                    var cnt = document.getElementById('cntModule').value
                    cy.nodes(`[id="v${id}"]`).data('square', square)
                    cy.nodes(`[id="v${id}"]`).data('cnt', cnt)
                    cy.nodes(`[id="v${id}"]`).data('label', 'v' + id + ' S=' + square + "\nCount=" + cnt)
                } else {
                    alert("Вы ввели не число или пустоту!")
                }
            } catch (ex) {
                alert("Такого модуля нет!")
            }

        });
    }
    catch (e){
        alert("Неизвестная ошибка!")
    }
}

