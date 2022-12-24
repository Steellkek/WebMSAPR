// photos from flickr with creative commons license

/*var cy = cytoscape({
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

    }
});*/ // cy init

var cy = window.cy = cytoscape({});
async function  graph() {
    
    
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
        var cy = window.cy = cytoscape({
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
         cy.layout= cy.layout({
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
        //layout.stop();
        
        
    }
    cy.layout.run();
    cy.layout.stop();

    console.log(cy._private.elements)
}

function newgraph(){
    

        cy = cytoscape({
            container: document.getElementById('cy'),

            layout: {
                name: 'preset'
            },

            style: [
                {
                    selector: 'node[name]',
                    style: {
                        'content': 'data(name)'
                    }
                },

                {
                    selector: 'edge',
                    style: {
                        'curve-style': 'bezier',
                        'target-arrow-shape': 'triangle'
                    }
                },

                // some style for the extension

                {
                    selector: '.eh-handle',
                    style: {
                        'background-color': 'red',
                        'width': 12,
                        'height': 12,
                        'shape': 'ellipse',
                        'overlay-opacity': 0,
                        'border-width': 12, // makes the handle easier to hit
                        'border-opacity': 0
                    }
                },

                {
                    selector: '.eh-hover',
                    style: {
                        'background-color': 'red'
                    }
                },

                {
                    selector: '.eh-source',
                    style: {
                        'border-width': 2,
                        'border-color': 'red'
                    }
                },

                {
                    selector: '.eh-target',
                    style: {
                        'border-width': 2,
                        'border-color': 'red'
                    }
                },

                {
                    selector: '.eh-preview, .eh-ghost-edge',
                    style: {
                        'background-color': 'red',
                        'line-color': 'red',
                        'target-arrow-color': 'red',
                        'source-arrow-color': 'red'
                    }
                },

                {
                    selector: '.eh-ghost-edge.eh-preview-active',
                    style: {
                        'opacity': 0
                    }
                }
            ],

            
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

    var eh = cy.edgehandles({
        snap: false
    });

    eh.enableDrawMode();


    console.log(cy)
        
}
document.getElementById("x").addEventListener("click", function() {
    console.log(cy)
})

document.addEventListener('DOMContentLoaded', function(){

    var cy = window.cy = cytoscape({
        container: document.getElementById('cy'),

        layout: {
            name: 'concentric',
            concentric: function(n){ return n.id() === 'j' ? 200 : 0; },
            levelWidth: function(nodes){ return 100; },
            minNodeSpacing: 100
        },

        style: [
            {
                selector: 'node[name]',
                style: {
                    'content': 'data(name)'
                }
            },

            {
                selector: 'edge',
                style: {
                    'curve-style': 'bezier',
                    'target-arrow-shape': 'triangle'
                }
            },

            // some style for the extension

            {
                selector: '.eh-handle',
                style: {
                    'background-color': 'red',
                    'width': 12,
                    'height': 12,
                    'shape': 'ellipse',
                    'overlay-opacity': 0,
                    'border-width': 12, // makes the handle easier to hit
                    'border-opacity': 0
                }
            },

            {
                selector: '.eh-hover',
                style: {
                    'background-color': 'red'
                }
            },

            {
                selector: '.eh-source',
                style: {
                    'border-width': 2,
                    'border-color': 'red'
                }
            },

            {
                selector: '.eh-target',
                style: {
                    'border-width': 2,
                    'border-color': 'red'
                }
            },

            {
                selector: '.eh-preview, .eh-ghost-edge',
                style: {
                    'background-color': 'red',
                    'line-color': 'red',
                    'target-arrow-color': 'red',
                    'source-arrow-color': 'red'
                }
            },

            {
                selector: '.eh-ghost-edge.eh-preview-active',
                style: {
                    'opacity': 0
                }
            }
        ],

        elements: {
            nodes: [
                { data: { id: 'j', name: 'Jerry' } },
                { data: { id: 'e', name: 'Elaine' } },
                { data: { id: 'k', name: 'Kramer' } },
                { data: { id: 'g', name: 'George' } }
            ],
            edges: [
                { data: { source: 'j', target: 'e' } },
                { data: { source: 'j', target: 'k' } },
                { data: { source: 'j', target: 'g' } },
                { data: { source: 'e', target: 'j' } },
                { data: { source: 'e', target: 'k' } },
                { data: { source: 'k', target: 'j' } },
                { data: { source: 'k', target: 'e' } },
                { data: { source: 'k', target: 'g' } },
                { data: { source: 'g', target: 'j' } }
            ]
        }
    });

    var eh = cy.edgehandles({
        snap: false
    });
    

    document.querySelector('#start').addEventListener('click', function() {
        eh.start( cy.$('node:selected') );
    });

});