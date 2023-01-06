namespace WebMSAPR;

public class Genome
{
    public List<Module> Modules { get; set; }
    public decimal Fitness { get; set; }
    public List<ConnectionsModule> DirectConnectionsBeetwenModules { get; set; } = new();
    public List<ConnectionsModule> FinalConnectionsBeetwenModules { get; set; } = new();
}