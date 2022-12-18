// photos from flickr with creative commons license

var cy = cytoscape({
    container: document.getElementById('cy'),

    boxSelectionEnabled: false,
    autounselectify: true,

    style: cytoscape.stylesheet()
        .selector('node')
        .css({
            'height': 80,
            'width': 80,
            'background-fit': 'cover',
            'border-color': '#000',
            'border-width': 3,
            'border-opacity': 0.5
        })
        .selector('.eating')
        .css({
            'border-color': 'red'
        })
        .selector('.eater')
        .css({
            'border-width': 9
        })
        .selector('edge')
        .css({
            'curve-style': 'bezier',
            'width': 6,
            'target-arrow-shape': 'triangle',
            'line-color': '#ffaaaa',
            'target-arrow-color': '#ffaaaa'
        })
        .selector('#bird')
        .css({
            'background-image': 'https://live.staticflickr.com/7272/7633179468_3e19e45a0c_b.jpg'
        })
        .selector('#cat')
        .css({
            'background-image': 'https://live.staticflickr.com/1261/1413379559_412a540d29_b.jpg'
        })
        .selector('#ladybug')
        .css({
            'background-image': 'https://live.staticflickr.com/3063/2751740612_af11fb090b_b.jpg'
        })
        .selector('#aphid')
        .css({
            'background-image': 'https://live.staticflickr.com/8316/8003798443_32d01257c8_b.jpg'
        })
        .selector('#rose')
        .css({
            'background-image': 'https://live.staticflickr.com/5109/5817854163_eaccd688f5_b.jpg'
        })
        .selector('#grasshopper')
        .css({
            'background-image': '/img/t.png'
        })
        .selector('#plant')
        .css({
            'background-image': '/img/y.png'
        })
        .selector('#wheat')
        .css({
            'background-image': '/img/x.png'
        })
        .selector('#g')
        .css({
            'background-color': 'green',
            'width':100,
            'height':10000
        }),
    

    elements: {
        nodes: [
            {data:{id:'g'}},
            {data:{id:'g1'}},
            { data: { id: 'cat' , parent:'g1' }},
            { data: { id: 'bird'} },
            { data: { id: 'ladybug' , parent:'g1'} },
            { data: { id: 'aphid', parent:'g1' } },
            { data: { id: 'rose', parent:'g1' } },
            { data: { id: 'grasshopper' , parent:'g'} },
            { data: { id: 'plant' , parent:'g'} },
            { data: { id: 'wheat' , parent:'g'} },

        ],
        edges: [
            { data: { source: 'cat', target: 'bird' } },
            { data: { source: 'bird', target: 'ladybug' } },
            { data: { source: 'bird', target: 'g' } },
            { data: { source: 'grasshopper', target: 'plant' } },
            { data: { source: 'grasshopper', target: 'wheat' } },
            { data: { source: 'ladybug', target: 'aphid' } },
            { data: { source: 'aphid', target: 'rose' } },
            //{ data: { source: 'aphid', target: 'g' } },
        ]
    },

    /*layout: {
        name: 'cise',

        allowNodesInsideCircle: true,

    }*/
}); // cy init
async function  graph() {
    let cy = cytoscape({

        container: document.getElementById('cy'),
    })
    
    var layout = cy.layout({
        name: 'cise',
        allowNodesInsideCircle: true,
    });
    layout.run();
    layout.stop();
}
cy.on('tap', 'node', function(){
    var nodes = this;
    var tapped = nodes;
    var food = [];

    nodes.addClass('eater');

    for(;;){
        var connectedEdges = nodes.connectedEdges(function(el){
            return !el.target().anySame( nodes );
        });

        var connectedNodes = connectedEdges.targets();

        Array.prototype.push.apply( food, connectedNodes );

        nodes = connectedNodes;

        if( nodes.empty() ){ break; }
    }

    var delay = 0;
    var duration = 500;
    for( var i = food.length - 1; i >= 0; i-- ){ (function(){
        var thisFood = food[i];
        var eater = thisFood.connectedEdges(function(el){
            return el.target().same(thisFood);
        }).source();

        thisFood.delay( delay, function(){
            eater.addClass('eating');
        } ).animate({
            position: eater.position(),
            css: {
                'width': 10,
                'height': 10,
                'border-width': 0,
                'opacity': 0
            }
        }, {
            duration: duration,
            complete: function(){
                thisFood.remove();
            }
        });

        delay += duration;
    })(); } // for

}); // on tap

async function  gengraph(){
    const response = await fetch("/api/Graph/graph", {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    if (response.ok) {
        const graph = await response.json();
        console.log(graph);
        let cy = cytoscape({

            container: document.getElementById('cy'),

            elements: [],
            style: cytoscape.stylesheet()
                .selector('node')
                .css({
                    'content': 'data(id)',
                    'text-valign': 'center',
                    'text-halign': 'center',
                    'color': 'white',
                    'text-outline-width': 2,
                    'text-outline-color': '#888',
                })
                .selector('edge')
                .css({
                    'width': 1,
                    'line-color': 'Black',
                    'target-arrow-color': 'black',
                    'target-arrow-shape': 'triangle',
                    'label': 'data(label)',
                    'font-size': '30px',
                    'color': '#ff0033'
                })
        })
        let x = 0;
        let arrayOfClusterArrays = [];
        for (let i = 0; i <graph.modules.length;i++)
        {
            arrayOfClusterArrays.push([])
            cy.add([{group: 'nodes', data: {id: 'v' + (i + 1)}}])
            for (let j =0;j<graph.modules[i].elements.length;j++)
            {
                cy.add([{group: 'nodes', 
                    data: {id: 'g' + graph.modules[i].elements[j].number, 
                        parent: 'v' + (i + 1),
                        clusterID: 'v' + (i + 1)}}])
                arrayOfClusterArrays[i].push('g' + graph.modules[i].elements[j].number)
            }
            
            for (let j =0;j<graph.modules[i].connectionsInModules.length;j++)
            {
                cy.add([{group: 'edges',
                    data: {
                        id: 'e' + (x+1),
                        source: 'g' + graph.modules[i].connectionsInModules[j]._element1.number,
                        target: 'g' + graph.modules[i].connectionsInModules[j]._element2.number,
                        label: graph.connectionsBeetwenModules[i].value
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
        debugger;
        var layout = cy.layout({
            name: 'fcose',
            quality: "default",
            randomize: true,
            animate: true,
            animationDuration: 1000,
            animationEasing: undefined,
            fit: true,
            padding: 30,
            nestingFactor: 0.1,
            gravityRangeCompound: 1.5,
            gravityCompound: 1.0
        });
        layout.run();
        //layout.stop();
        
    }
}

function newgraph(){
    

        var cy = window.cy = cytoscape({
            container: document.getElementById('cy'),

            layout: {
                name: 'preset'
            },

            style: [
                {
                    selector: 'node',
                    style: {
                        'label': 'data(id)'
                    }
                },

                {
                    selector: '.mid',
                    style: {
                        'width': 8,
                        'height': 8,
                        'label': ''
                    }
                }
            ],

            elements: [
                { data: { id: 'a' } },
                { data: { id: 'b' } },
                { data: { id: 'c' } },
                { data: { id: 'mid' }, classes: 'mid' },
                { data: { source: 'a', target: 'mid' } },
                { data: { source: 'b', target: 'mid' } },
                { data: { source: 'mid', target: 'c' } },

                { data: { id: 'd' } },

                { data: { id: 'e' } },
                { data: { id: 'f' } },
                { data: { source: 'e', target: 'f' } },

                { data: { id: 'g' } },

                { data: { id: 'h' } },
                { data: { id: 'i' } },
                { data: { source: 'h', target: 'i' } },

                { data: { id: 'j' } },

                { data: { id: 'k' } },
                { data: { id: 'm' } },
                { data: { id: 'n' } },
                { data: { source: 'k', target: 'm' } },
                { data: { source: 'k', target: 'n' } },
                { data: { source: 'm', target: 'n' } },
            ]
        });

        // cy.on('automove', function( evt ){
        // 	var target = evt.target || evt.cyTarget; // 3.x || 2.x
        //
        // 	console.log('automove event on %s', target.id());
        // });

        // a, b, c; with mid in the middle

        cy.$('#a, #b, #c').makeLayout({
            name: 'circle',
            boundingBox: {
                x1: 0,
                y1: 0,
                x2: 300,
                y2: 300
            }
        }).run();

        cy.automove({
            nodesMatching: cy.$('#mid'),
            reposition: 'mean',
            meanOnSelfPosition: function( node ){ return false; }
        });

        // dragging mid drags its neighbourhood with it
        cy.automove({
            nodesMatching: cy.$('#mid').neighbourhood().nodes(),
            reposition: 'drag',
            dragWith: cy.$('#mid')
        });


        // d can't go out of a box

        cy.automove({
            nodesMatching: cy.$('#d'),
            reposition: { x1: 350, x2: 450, y1: 100, y2: 200 }
        });

        cy.$('#d').position({ x: 400, y: 150 });


        // e & f have the same y

        var eAndF = cy.$('#e, #f');

        eAndF.makeLayout({
            name: 'grid',
            boundingBox: { x1: 0, x2: 300, y1: 300, y2: 400 },
            cols: 2,
            fit: false
        }).run();

        cy.automove({
            nodesMatching: cy.$('#e, #f'),
            reposition: function( node ){
                var pos = node.position();

                if( node.grabbed() ){ return pos; }

                var otherNode = eAndF.not( node );

                return {
                    x: pos.x,
                    y: otherNode.position('y')
                };
            },
            when: 'matching'
        });

        // g kept in viewport

        cy.$('#g').position({ x: 400, y: 350 });

        cy.fit( 100 ); // make sure g is in the viewport for the demo

        cy.automove({
            nodesMatching: cy.$('#g'),
            reposition: 'viewport'
        });


        // i gets pulled along with h on drag

        cy.$('#h').position({ x: 585, y: 195 });
        cy.$('#i').position({ x: 510, y: 260 });

        cy.automove({
            nodesMatching: cy.$('#i'),
            reposition: 'drag',
            dragWith: cy.$('#h')
        });


        // j can't go in the box of d

        cy.$('#j').position({ x: 585, y: 350 });

        cy.automove({
            nodesMatching: cy.$('#j'),
            reposition: { type: 'outside', x1: 350, x2: 450, y1: 100, y2: 200 }
        });


        // k, m, n all move together on drag as a unit (e.g. cluster)

        cy.$('#k').position({ x: 430, y: -20 });
        cy.$('#m').position({ x: 490, y: -110 });
        cy.$('#n').position({ x: 550, y: -20 });

        cy.automove({
            nodesMatching: cy.$('#k, #m, #n'),
            reposition: 'drag',
            dragWith: cy.$('#k, #m, #n')
        });



        cy.fit( 100 ); // fit to all the layouts


        // .automove-viewport nodes kept in viewport (even if added after this call)
        // convenient but less performant than `nodesMatching: collection`

        cy.automove({
            nodesMatching: '.automove-viewport',
            reposition: 'viewport'
        });

        cy.on('tap', function( evt ){
            var tgt = evt.target || evt.cyTarget; // 3.x || 2.x

            if( tgt === cy ){
                cy.add({
                    classes: 'automove-viewport',
                    data: { id: 'new' + Math.round( Math.random() * 100 ) },
                    position: {
                        x: evt.position.x,
                        y: evt.position.y
                    }
                });
            }
        });

        cy.on('cxttap', 'node', function( evt ){
            var tgt = evt.target || evt.cyTarget; // 3.x || 2.x

            tgt.remove();
        })
    console.log(cy)
        
}
document.getElementById("x").addEventListener("click", function() {
    console.log(cy)
})