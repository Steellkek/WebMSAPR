namespace WebMSAPR;

public class Genome
{
    public List<Module> Modules { get; set; }
    public decimal Fitness { get; set; }
    public List<ConnectionsModule> ConnectionsBeetwenModules { get; set; } = new();
    public List<ConnectionsModule> ConnectionsBeetwenModules2 { get; set; } = new();
}