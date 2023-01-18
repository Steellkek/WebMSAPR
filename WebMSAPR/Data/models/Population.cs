namespace WebMSAPR;

public class Population
{
    public List<Genome> Genomes { get; set; } = new();
    public List<Genome> NextGener{ get; set; } = new();
    public Genome BestGenome { get; set; }
    public List<decimal> listFitness { get; set; }= new();
}