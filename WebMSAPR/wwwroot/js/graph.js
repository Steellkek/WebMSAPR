var flagInput=0
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

async function  graph(){
    document.getElementById('inputsEdge').style.display = 'none';
    document.getElementById('inputsSizes').style.display = 'none';
    flagInput=0;
    cy.off('tap')
    cy.off('cxttap')
    cy.remove(cy.elements())
    const response = await fetch("/api/Graph/PCB", {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    if (response.ok) {
        const graph = await response.json();
        console.log(graph)
        for (let i = 0; i <graph.elements.length;i++){
            var rand = Math.floor(Math.random() * el.length);
            var length=graph.elements[i].length==0?10:graph.elements[i].length;
            var width = graph.elements[i].width==0?10:graph.elements[i].width;
            cy.add([{group: 'nodes',
                data: {id: 'g' + (i+1),
                    id1:el[rand],
                    label:'g' + (i+1)+' '+length+'×'+width,
                    width:5*length,
                    height: 5*width}}])
        }
        for (let i = 0; i <graph.connections.length;i++){
            cy.add([{group: 'edges',
                data: {
                    id: 'e' + (i+1),
                    source: 'g' + (graph.connections[i]._element1.number+1),
                    target: 'g' + (graph.connections[i]._element2.number+1),
                    label: graph.connections[i]._value
                }
            }])
        }
        cy.layout({name: 'circle'}).run();
        cy.layout({name: 'circle'}).stop();
    }
}

async function  gengraph(){
    document.getElementById('inputsEdge').style.display = 'none';
    document.getElementById('inputsSizes').style.display = 'none';
    flagInput=0;
    cy.off('tap')
    cy.off('cxttap')
    cy.remove(cy.elements())
    const response = await fetch("/api/Graph/genPCB", {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    if (response.ok) {
        const graph = await response.json();
        console.log(graph);

        let x = 0;
        for (let i = 0; i <graph.modules.length;i++)
        {
            cy.add([{group: 'nodes', data: {id: 'v' + (i + 1),
                    id1:'module',
                    label:'v' + (i + 1) +' V='+graph.modules[i].square}}])
            for (let j =0;j<graph.modules[i].elements.length;j++)
            {
                var rand = Math.floor(Math.random() * el.length);
                cy.add([{group: 'nodes',
                    data: {id: 'g' + graph.modules[i].elements[j].number,
                        parent: 'v' + (i + 1),
                        id1:el[rand],
                        label:'g' + graph.modules[i].elements[j].number+' '+graph.modules[i].elements[j].length+'×'+graph.modules[i].elements[j].width,
                        width:5*graph.modules[i].elements[j].width,
                        height: 5*graph.modules[i].elements[j].length}}])
            }

            for (let j =0;j<graph.modules[i].connectionsInModules.length;j++)
            {
                cy.add([{group: 'edges',
                    data: {
                        id: 'e' + (x+1),
                        source: 'g' + graph.modules[i].connectionsInModules[j]._element1.number,
                        target: 'g' + graph.modules[i].connectionsInModules[j]._element2.number,
                        label: graph.modules[i].connectionsInModules[j]._value
                    }
                }])
                x+=1;
            }
        }
        for (let i =0; i<graph.connectionsBeetwenModules.length;i++){
            cy.add([{group: 'edges',
                data: {
                    id: 'e' + (x+1),
                    source: 'v' + (graph.connectionsBeetwenModules[i].module1.number+1),
                    target: 'v' + (graph.connectionsBeetwenModules[i].module2.number+1),
                    label: graph.connectionsBeetwenModules[i].value
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
        console.log(cy.elements())

    }
}
function newgraph(){
    if (flagInput==0){
        document.getElementById('inputsEdge').style.display = 'block';
        document.getElementById('inputsSizes').style.display = 'block';
        flagInput=1;
        cy.remove(cy.elements())
    }
    else{
        document.getElementById('inputsEdge').style.display = 'none';
        document.getElementById('inputsSizes').style.display = 'none';
        flagInput=0;
        cy.off('tap')
        cy.off('cxttap')
        cy.remove(cy.elements())
        return;
    }

    cy.zoom({                       // Zoom to the specified position
        level: 1
    });

    var j=1;
    
    cy.on('tap', function( evt ){
        var tgt = evt.target || evt.cyTarget; // 3.x || 2.x

        if( tgt === cy ){
            var rand = Math.floor(Math.random() * (el.length));
            cy.add({
                group: 'nodes',
                data: { id: 'g' + j,
                    id1:el[rand],
                    label:'g'+j+' 10×10',
                    width:50,
                    height: 50,
                },
                position: {
                    x: evt.position.x,
                    y: evt.position.y
                }
            });
           
        }
        j+=1;
    });


    cy.on('cxttap', 'node', function( evt ){
        var tgt = evt.target || evt.cyTarget; // 3.x || 2.x
        j-=1;
        tgt.remove();
    })

    cy.on('cxttap', 'edge', function( evt ){
        var tgt = evt.target || evt.cyTarget; // 3.x || 2.x

        tgt.remove();
    })

    x=0;
    document.querySelector('#start').addEventListener('click', function() {
        try {
            if ((document.getElementById('source').value!=0) &&
                (document.getElementById('target').value!=0) && 
                (document.getElementById('number').value!=0)) {
                cy.add([{
                    group: 'edges',
                    data: {
                        id: 'e' + (x + 1),
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
                        alert("Между этими элементами уже есть соединение! Удалите его и создайуте заново")
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
            if ((document.getElementById('element').value !=='') &&
                (document.getElementById('length').value !=='') &&
                (document.getElementById('width').value !=='')) {
                var id=document.getElementById('element').value;
                var length = document.getElementById('length').value==0?10:document.getElementById('length').value
                var width = document.getElementById('width').value==0?10:document.getElementById('width').value
                cy.nodes(`[id="g${id}"]`).data('width',5*width)
                cy.nodes(`[id="g${id}"]`).data('height',5*length)
                cy.nodes(`[id="g${id}"]`).data('label','g' + id+' '+length+'×'+width)
                console.log(cy.nodes(`[id="g${id}"]`))
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


