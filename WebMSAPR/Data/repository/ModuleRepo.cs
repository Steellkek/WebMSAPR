namespace WebMSAPR.repository;

public class ModuleRepo
{
    public List<Module> CreateModules(PCB pcb)
    {
        var x = new LocalFileRepo();
        var split = x.ReadSplit();
        var sizeSplit = x.ReadSizeModules();
        var modules = new List<Module>();
        for (int i = 0; i < split.Count; i++)
        {
            modules.Add(new Module(split[i],sizeSplit[i],i));
        }

        return Shuffle(pcb,modules);
    }
    
    private List<Module> Shuffle(PCB pcb, List<Module> modules)
    {
        Random rand = new Random();
        var x = 0;
        var g = 0;
        while (x!=1 && g<2000)
        {
            g += 1;
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
                    if (list[i].Squre+module.Elements.Sum(x=>x.Squre)<module.Square)
                    {
                        module.Elements.Add(list[i]);
                        list.Remove(list[i]);
                    }
                }

                if (module.Cnt>module.Elements.Count)
                {
                    x = 0;
                    break;
                }
                else
                {
                    x = 1;
                }

            }

        }

        if (g==2000)
        {
            throw new Exception("Данная компоновка невозможна, попробуйте изменить размеры модулей или элементов.");
        }
        
        return modules;
    }
}