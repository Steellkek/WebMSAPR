namespace WebMSAPR;

public class BestGenome:Genome
{
    public List<Decimal> ListSumFitnes { get; set; } = new();
    public List<Decimal> ListBestGen { get; set; } = new();
    public List<ConnectionsModule> ConnectionsBeetwenModules { get; set; } = new();
}