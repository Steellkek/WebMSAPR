using System.Text.Json;

namespace WebMSAPR.repository;

public class GenAlgRepository
{
    public BestGenome Go()
    {
        PCB Pcb = new RepoPCB().CreatePCB();
        var x = new PopulationRepository();
        var y = new GenomeRepo();
        var population =x.CreateFirstPopulation(3,Pcb);
        population = x.GeneticOpertors(population, 100);
        y.GetConnectionsInModules(population.BestGenome);
        y.GetConnectionsBetweenModules(population.BestGenome);
        return population.BestGenome;
    }

}