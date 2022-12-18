namespace WebMSAPR;

public class Population
{
    public List<Genome> Genomes = new();
    public List<Genome> NextGener = new();
    public BestGenome BestGenome { get; set; }
    //public decimal SumNewFitness;
    public decimal SumFitness;
}