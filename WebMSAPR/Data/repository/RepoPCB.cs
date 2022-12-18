namespace WebMSAPR.repository;

public class RepoPCB
{
    public PCB CreatePCB()
    {
        var lfRepo = new LocalFileRepo();
        var matrix = lfRepo.ReadGraph();
        var sizeElements = lfRepo.ReadSizeElements();
        var pcb = new PCB();
        pcb.Elements = CreateElements(sizeElements);
        pcb.Connections = CreateConnections(pcb.Elements, matrix);
        CrateAdjElements(pcb);
        return pcb;
    }

    private void CrateAdjElements(PCB pcb)
    {
        foreach (var connection in pcb.Connections)
        {
            connection._element1.AdjElement.Add(new Tuple<Element, int>(connection._element2,connection._value));
            connection._element2.AdjElement.Add(new Tuple<Element, int>(connection._element1,connection._value));
        }
    }

    private List<Element> CreateElements(List<List<int>> sizes)
    {
        var elements = new List<Element>();
        for (int i = 0; i < sizes.Count; i++)
        {
            elements.Add(new Element(i,sizes[i][0],sizes[i][1]));
        }

        return elements;
    }

    private List<Connection<Element>> CreateConnections(List<Element> elements, List<List<int>> matrix)
    {
        List<Connection<Element>> connections = new List<Connection<Element>>();
        for (int i = 0; i < matrix.Count; i++)
        {
            for (int j = i+1; j < matrix.Count; j++)
            {
                if (matrix[i][j]!=0)
                {
                    connections.Add(new Connection<Element>(elements[i],elements[j], matrix[i][j]));
                }
            }
            
        }
        return connections;
    }

}