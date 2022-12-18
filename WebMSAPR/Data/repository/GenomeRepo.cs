using System.Diagnostics.CodeAnalysis;

namespace WebMSAPR.repository;

public class GenomeRepo
{
    public Genome CreateFirstGenome(PCB pcb)
    {
        var moduleRepo = new ModuleRepo();
        var genome = new Genome();
        genome.Modules = moduleRepo.CreateModules(pcb);
        genome.Fitness = DetermineFitnes(genome.Modules);
        return genome;
    }

    public void GetConnectionsInModules(BestGenome genome)
    {
        foreach (var module in genome.Modules)
        {
            foreach (var element in module.Elements)
            {
                foreach (var tuple in element.AdjElement)
                {
                    if (module.Elements.Contains(tuple.Item1) && !CheckInConnections(module.ConnectionsInModules,element,tuple.Item1,tuple.Item2))
                    {
                        module.ConnectionsInModules.Add(new Connection<Element>(element,tuple.Item1,tuple.Item2));
                    }
                }
            }
        }
    }

    public void GetConnectionsBetweenModules(BestGenome genome)
    {
        for (int i = 0; i < genome.Modules.Count; i++)
        {
            for (int j = i+1; j < genome.Modules.Count; j++)
            {
                foreach (var element1 in genome.Modules[i].Elements)
                {
                    foreach (var tuple in element1.AdjElement)
                    {
                        {
                            if (!((genome.ConnectionsBeetwenModules.Select(x => x.Module1).Contains(genome.Modules[i]) ||
                                  genome.ConnectionsBeetwenModules.Select(x => x.Module1)
                                      .Contains(genome.Modules[j])) &&
                                 (genome.ConnectionsBeetwenModules.Select(x => x.Module2).Contains(genome.Modules[i]) ||
                                  genome.ConnectionsBeetwenModules.Select(x => x.Module2)
                                      .Contains(genome.Modules[j]))) &&
                                 genome.Modules[j].Elements.Contains(tuple.Item1))
                            {
                                genome.ConnectionsBeetwenModules.Add(new ConnectionsModule(){Module1 = genome.Modules[i],Module2 = genome.Modules[j],value = tuple.Item2});
                                genome.ConnectionsBeetwenModules.Where(x =>
                                        (x.Module1 == genome.Modules[i] || x.Module1 == genome.Modules[j]) &&
                                        (x.Module2 == genome.Modules[i] || x.Module2 == genome.Modules[j]))
                                    .FirstOrDefault().Connections.Add(new Connection<Element>(element1,tuple.Item1,tuple.Item2));
                            }
                            else if (genome.ConnectionsBeetwenModules.Where(x=>
                                         (x.Module1 == genome.Modules[i] || x.Module1 == genome.Modules[j])&&
                                         (x.Module2 == genome.Modules[i] || x.Module2 == genome.Modules[j])).ToList().Count>0 &&
                                     CheckInConnections(genome.ConnectionsBeetwenModules.Where(x=>
                                         (x.Module1 == genome.Modules[i] || x.Module1 == genome.Modules[j])&&
                                         (x.Module2 == genome.Modules[i] || x.Module2 == genome.Modules[j])).FirstOrDefault().Connections,element1,tuple.Item1,tuple.Item2))
                            {
                                genome.ConnectionsBeetwenModules.Where(x =>
                                        (x.Module1 == genome.Modules[i] || x.Module1 == genome.Modules[j]) &&
                                        (x.Module2 == genome.Modules[i] || x.Module2 == genome.Modules[j]))
                                    .FirstOrDefault()
                                    .value += tuple.Item2;
                                genome.ConnectionsBeetwenModules.Where(x =>
                                        (x.Module1 == genome.Modules[i] || x.Module1 == genome.Modules[j]) &&
                                        (x.Module2 == genome.Modules[i] || x.Module2 == genome.Modules[j]))
                                    .FirstOrDefault().Connections.Add(new Connection<Element>(element1,tuple.Item1,tuple.Item2));
                            }
                        }
                    }

                }
            }
        }
    }

    public bool CheckInConnections(List<Connection<Element>> connections, Element element1, Element element2, int value)
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
    public List<Module> CopyListModule(List<Module> modules)
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
                    else if ((list2[i].Squre + module.Elements.Sum(x => x.Squre) < module.Square) &&
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
                        if ((list2[i].Squre + module.Elements.Sum(x => x.Squre) < module.Square) &&
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
                list2 = leftShufle(GetElementsFromModule(genome2.Modules));
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
        int position1=0;
        int position2=0;

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
                    module.Elements.Add(list[i]);
                    list.Remove(list[i]);
                    i--;
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
    public List<Element> leftShufle(List<Element> elements)
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
    public decimal DetermineFitnes(List<Module> modules)
    {
        decimal F = 0;
        decimal K = 0;
        foreach (var module in modules)
        {
            foreach (var element in module.Elements)
            {
                foreach (var adjElement in element.AdjElement)
                {
                    if (!module.Elements.Contains(adjElement.Item1))
                    {
                        F += adjElement.Item2;
                    }
                    if (module.Elements.Contains(adjElement.Item1))
                    {
                        K += adjElement.Item2;
                    }
                }
            }
        }
        return  K/F;
    }


    
}