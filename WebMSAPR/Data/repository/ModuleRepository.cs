namespace WebMSAPR.repository;

public class ModuleRepository
{
    public List<Module> CreateModules(PCB pcb)
    {
        var localFileRepo = new LocalFileRepository();
        var split = localFileRepo.ReadSplit();
        var sizeSplit = localFileRepo.ReadSizeModules();
        var modules = new List<Module>();
        for (int i = 0; i < split.Count; i++)
        {
            modules.Add(new Module(split[i],sizeSplit[i],i));
        }

        if (pcb is null)
        {
            return modules;
        }
        return Shuffle(pcb,modules);
    }
    
    private List<Module> Shuffle(PCB pcb, List<Module> modules)
    {
        var m = modules.Sum(x => x.Cnt);
        if (pcb.Elements.Count!=modules.Sum(x=>x.Cnt))
        {
            throw new Exception("Суммарное количество элементов в модулях не совпадает с количествеом элементов в схеме!");
        }
        Random rand = new Random();
        var check = 0;
        var cnt = 0;
        while (check!=1 && cnt<2000)
        {
            cnt += 1;
            List<Element> list = pcb.Elements.GetRange(0, pcb.Elements.Count);
            for (int i = list.Count - 1; i >= 1; i--)
            {
                int j = rand.Next(i + 1);
                (list[j], list[i]) = (list[i], list[j]);
            }

            foreach (var module in modules)
            {
                module.Elements.Clear();
                for (int i = list.Count-1; i >=0 && module.Cnt>module.Elements.Count; i--)
                {
                    if (list[i].Squre+module.Elements.Sum(x=>x.Squre)<=module.Square)
                    {
                        module.Elements.Add(list[i]);
                        list.Remove(list[i]);
                    }
                }

                if (module.Cnt>module.Elements.Count)
                {
                    check = 0;
                    break;
                }
                else
                {
                    check = 1;
                }

            }

        }

        if (cnt==2000)
        {
            throw new Exception("Данная компоновка невозможна, попробуйте изменить размеры модулей или элементов.");
        }
        
        return modules;
    }
}