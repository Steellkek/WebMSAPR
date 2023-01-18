using System.Diagnostics.CodeAnalysis;

namespace WebMSAPR.repository;

public class GenomeRepository
{
    private List<List<int>> MinPathToModule = new();
    private List<List<int>> Matrix = new();
    public GenomeRepository()
    {
        var localFileRepository = new LocalFileRepository();
        var matrix = localFileRepository.ReadMatrixModule();
        Matrix = matrix;
        for (int i = 0; i < matrix.Count; i++)
        {
            var rast = DijkstraAlgo(matrix, i, matrix.Count);
            for (int j = i; j < rast.Count; j++)
            {
                if (i != j)
                {
                    var MinPath = MinPath1(j, i, rast).AsEnumerable().Reverse().ToList();
                    MinPathToModule.Add(MinPath);
                }
            }
        }
    }
    public Genome CreateFirstGenome(PCB pcb)
    {
        var moduleRepo = new ModuleRepository();
        var genome = new Genome();
        genome.Modules = moduleRepo.CreateModules(pcb);
        GetConnectionsInModules(genome);
        GetConnectionsBetweenModules(genome);
        CreateConnectionsBetweenModules(genome);
        genome.Fitness = DetermineFitnes(genome.FinalConnectionsBeetwenModules);
        return genome;
    }

    public void GetConnectionsInModules(Genome genome)
    {
        foreach (var module in genome.Modules)
        {
            module.ConnectionsInModules.Clear();
            foreach (var element in module.Elements)
            {
                foreach (var tuple in element.AdjElement)
                {
                    if (module.Elements.Contains(tuple.Item1) && !CheckInConnections(module.ConnectionsInModules,element,tuple.Item1,tuple.Item2))
                    {
                        module.ConnectionsInModules.Add(new ConnectionElement(element,tuple.Item1,tuple.Item2));
                    }
                }
            }
        }
    }

    private List<int> MinPath1(int end, int start, List<int> paths)
    {
        List<int> listOfpoints = new List<int>();
        var tempp = end;
        while (tempp != start)
        {
            listOfpoints.Add(tempp);
            tempp = paths[tempp];
        }
        listOfpoints.Add(tempp);
        return listOfpoints;
    }

    public void CreateConnectionsBetweenModules(Genome genome)
    {
        genome.FinalConnectionsBeetwenModules.Clear();
        List<ConnectionsModule> connections = new List<ConnectionsModule>();
        for (int i = 0; i < Matrix.Count; i++)
        {
            for (int j = i+1; j < Matrix.Count; j++)
            {
                if (Matrix[i][j]!=0)
                {
                    connections.Add(new ConnectionsModule()
                    {
                        Module1 = genome.Modules.Where(x=>x.Number==i).FirstOrDefault(),
                        Module2 = genome.Modules.Where(x=>x.Number==j).FirstOrDefault(),
                    });
                }
            }
            
        }
        genome.FinalConnectionsBeetwenModules = connections;
        for (int i = 0; i < MinPathToModule.Count; i++)
        {
            var con2 =genome.DirectConnectionsBeetwenModules.Where(x => (x.Module1.Number == MinPathToModule[i].FirstOrDefault() &&
                                                                         x.Module2.Number == MinPathToModule[i].LastOrDefault())||
                                                                        (x.Module2.Number == MinPathToModule[i].FirstOrDefault() &&
                                                                         x.Module1.Number == MinPathToModule[i].LastOrDefault())).FirstOrDefault();
            for (int j = 0; j < MinPathToModule[i].Count-1; j++)
            {
                var con =genome.FinalConnectionsBeetwenModules.Where(x => (x.Module1.Number == MinPathToModule[i][j] &&
                                                                           x.Module2.Number == MinPathToModule[i][j+1])||
                                                                          (x.Module2.Number == MinPathToModule[i][j] &&
                                                                           x.Module1.Number == MinPathToModule[i][j+1])).FirstOrDefault();
                
                if (con2 != null)
                {
                    con.value += con2.value;
                }
            }
            
        }
        
    }
    
    private static int MinimumDistance(int[] distance, bool[] shortestPathTreeSet, int verticesCount)
    {
        int min = int.MaxValue;
        int minIndex = 0;
 
        for (int v = 0; v < verticesCount; ++v)
        {
            if (shortestPathTreeSet[v] == false && distance[v] <= min)
            {
                min = distance[v];
                minIndex = v;
            }
        }
 
        return minIndex;
    }
    
 
    public static List<int> DijkstraAlgo(List<List<int>> graph, int source, int verticesCount)
    {
        int[] distance = new int[verticesCount];
        bool[] shortestPathTreeSet = new bool[verticesCount];
        List<int> vert = new();
        for (int i = 0; i < verticesCount; i++)
        {
            vert.Add(source);
        }

        for (int i = 0; i < verticesCount; ++i)
        {
            distance[i] = int.MaxValue;
            shortestPathTreeSet[i] = false;
        }
 
        distance[source] = 0;
 
        for (int count = 0; count < verticesCount - 1; ++count)
        {
            int u = MinimumDistance(distance, shortestPathTreeSet, verticesCount);
            shortestPathTreeSet[u] = true;
            
            for (int v = 0; v < verticesCount; ++v)
            {
                if (!shortestPathTreeSet[v] && Convert.ToBoolean(graph[u][v]) && distance[u] != int.MaxValue &&
                    distance[u] + graph[u][v] < distance[v])
                {
                    distance[v] = distance[u] + graph[u][v];
                    vert[v] = u;
                }
            }
        }

        return vert;
    }

    public void GetConnectionsBetweenModules(Genome genome)
    {
        genome.DirectConnectionsBeetwenModules.Clear();
        for (int i = 0; i < genome.Modules.Count; i++)
        {
            foreach (var element in genome.Modules[i].Elements)
            {
                foreach (var tuple in element.AdjElement)
                {
                    if (!genome.Modules[i].Elements.Contains(tuple.Item1))
                    {
                        var module2 = genome.Modules.Where(x => x.Elements.Contains(tuple.Item1)).FirstOrDefault();
                        if (!(genome.DirectConnectionsBeetwenModules.Where(x =>
                                (x.Module1 == genome.Modules[i] || x.Module1 == module2) &&
                                (x.Module2 == genome.Modules[i] || x.Module2 == module2)).ToList().Count > 0))
                        {
                            genome.DirectConnectionsBeetwenModules.Add(new ConnectionsModule(){Module1 = genome.Modules[i],
                                Module2 = genome.Modules.Where(x => x.Elements.Contains(tuple.Item1)).FirstOrDefault(),
                                value = tuple.Item2});
                            genome.DirectConnectionsBeetwenModules.LastOrDefault().Connections.Add(new ConnectionElement(element,tuple.Item1,tuple.Item2));
                        }
                        else if (!CheckInConnections(genome.DirectConnectionsBeetwenModules.Where(x=>
                                     (x.Module1 == genome.Modules[i] || x.Module1 == module2)&&
                                     (x.Module2 == genome.Modules[i] || x.Module2 == module2)).FirstOrDefault().Connections,element,tuple.Item1,tuple.Item2))
                        {
                            genome.DirectConnectionsBeetwenModules.Where(x =>
                                    (x.Module1 == genome.Modules[i] || x.Module1 == module2) &&
                                    (x.Module2 == genome.Modules[i] || x.Module2 == module2))
                                .FirstOrDefault()
                                .value += tuple.Item2;
                            genome.DirectConnectionsBeetwenModules.Where(x =>
                                    (x.Module1 == genome.Modules[i] || x.Module1 == module2) &&
                                    (x.Module2 == genome.Modules[i] || x.Module2 == module2))
                                .FirstOrDefault().Connections.Add(new ConnectionElement(element,tuple.Item1,tuple.Item2));
                        }
                    }
                }
            }
        }
    }

    private bool CheckInConnections(List<ConnectionElement> connections, Element element1, Element element2, int value)
    {
        foreach (var connection in connections)
        {
            if ((connection._element1==element1||connection._element1==element2) && (connection._element2==element2||connection._element2==element1)&& connection._value==value)
            {
                return true;
            }
        }

        return false;
    }
    private List<Module> CopyListModule(List<Module> modules)
    {
        var copyModules = new List<Module>();
        foreach (var module in modules)
        {
            var newModule = new Module(module.Cnt, module.Square,module.Number);
            module.Elements.ForEach(e=>newModule.Elements.Add(e));
            copyModules.Add(newModule);
        }

        return copyModules;
    }

    public List<Module> GetChild(Genome genome1,Genome genome2,int x)
    {
        
        var list1 = GetElementsFromModule(genome1.Modules);
        var list2 = GetElementsFromModule(genome2.Modules);
        var child = CopyListModule(genome1.Modules);

        for (int l = 0; l < genome1.Modules.Sum(x=>x.Elements.Count); l++)
        {
            var j = 0;
            foreach (var module in child)
            {
                module.Elements.Clear();
            }

            foreach (var module in child)
            {
                for (int i = j; i < list2.Count && module.Cnt > module.Elements.Count; i++)
                {
                    if (j <= x)
                    {
                        module.Elements.Add(list1[j]);
                        j += 1;
                    }
                    else if ((list2[i].Squre + module.Elements.Sum(x => x.Squre) <= module.Square) &&
                             (!ExistInModule(child, list2[i])))
                    {
                        module.Elements.Add(list2[i]);
                        list2.Remove(list2[i]);
                        i--;
                    }

                    if (module.Cnt == module.Elements.Count)
                    {
                        break;
                    }
                }
            }

            foreach (var module in child)
            {
                if (module.Cnt > module.Elements.Count)
                {
                    for (int i = 0; i < list2.Count && module.Cnt > module.Elements.Count; i++)
                    {
                        if ((list2[i].Squre + module.Elements.Sum(x => x.Squre) <= module.Square) &&
                            (!ExistInModule(child, list2[i])))
                        {
                            module.Elements.Add(list2[i]);
                            list2.Remove(list2[i]);
                            i--;
                        }
                    }
                }
            }

            if (child.Sum(x=>x.Elements.Count)!=genome1.Modules.Sum(x=>x.Cnt))
            {
                list1 = GetElementsFromModule(genome1.Modules);
                list2 = LeftShufle(GetElementsFromModule(genome2.Modules));
            }
            else
            {
                break;
            }
        }   
        
        if (child.Sum(x=>x.Elements.Count)!=genome1.Modules.Sum(x=>x.Cnt))
        {
            return genome1.Modules;
        }
        else
        {
            return child;
        }
        
    }

    public List<Module> Mutation(Genome genome)
    {

        Random ran = new();
        int position1;
        int position2;

        var list = GetElementsFromModule(genome.Modules);
        var listTuple = new List<Tuple<int, int>>();
        var mutatationModule = CopyListModule(genome.Modules);

        var cnt = genome.Modules.Sum(x => x.Cnt) * (genome.Modules.Sum(x => x.Cnt) - 1) / 2;
        for (int j = 0; j < cnt; j++)
        {
            foreach (var module in mutatationModule)
            {
                module.Elements.Clear();
            }
            do
            {
                position1 = ran.Next(0, list.Count);
                position2 = ran.Next(0, list.Count);
                while (position1 == position2)
                {
                    position2 = ran.Next(0, list.Count);
                }
            } while (listTuple.Contains(new Tuple<int, int>(position1, position2)));

            listTuple.Add(new Tuple<int, int>(position1,position2));
            listTuple.Add(new Tuple<int, int>(position2,position1));
            (list[position1], list[position2])= (list[position2], list[position1]);

            foreach (var module in mutatationModule)
            {
                for (int i = 0; i < list.Count && module.Cnt > module.Elements.Count; i++)
                {
                    if ((list[i].Squre + module.Elements.Sum(x => x.Squre) <= module.Square))
                    {
                        module.Elements.Add(list[i]);
                        list.Remove(list[i]);
                        i--;
                    }
                }
            }
            if (mutatationModule.Sum(x=>x.Elements.Count)!=genome.Modules.Sum(x=>x.Cnt))
            {
                list = GetElementsFromModule(genome.Modules);
            }
            else
            {
                break;
            }
        }

        if (mutatationModule.Sum(x=>x.Elements.Count)!=genome.Modules.Sum(x=>x.Cnt))
        {
            return genome.Modules;
        }
        else
        {
            return mutatationModule;
        }

    }

    public bool CheckEquality(Genome genome1, Genome genome2)
    {
        var list1 = GetElementsFromModule(genome1.Modules);
        var list2 = GetElementsFromModule(genome2.Modules);
        for (int i = 0; i < list1.Count; i++)
        {
            if (list1[i].Number!=list2[i].Number)
            {
                return false;
            }
        }

        return true;
    }
    public List<Element> LeftShufle(List<Element> elements)
    {
        var newElements = elements.GetRange(1, elements.Count-1);
        newElements.Add(elements[0]);
        return newElements;
    }

    private bool ExistInModule(List<Module> modules,Element element)
    {
        foreach (var module in modules)
        {
            if (module.Elements.Select(x=>x.Number).ToList().Contains(element.Number))
            {
                return true;
            }
        }

        return false;
    }
    private List<Element> GetElementsFromModule(List<Module> modules)
    {
        List<Element> list = new();
        foreach (var module in modules)
        {
            foreach (var element in module.Elements)
            {
                list.Add(element);
            }
        }

        return list;
    }
    public decimal DetermineFitnes(List<ConnectionsModule> connectionsModules)
    {
        return connectionsModules.Sum(x => x.value);
    }
}