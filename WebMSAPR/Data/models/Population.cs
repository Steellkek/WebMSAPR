namespace WebMSAPR;

public class Population
{
    public List<Genome> Genomes = new();
    public List<Genome> NextGener = new();
    public Genome BestGenome { get; set; }
}