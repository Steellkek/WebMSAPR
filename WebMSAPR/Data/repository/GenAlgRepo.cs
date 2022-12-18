using System.Text.Json;

namespace WebMSAPR.repository;

public class GenAlgRepo
{
    public BestGenome Go()
    {
        PCB Pcb = new RepoPCB().CreatePCB();
        var x = new populationRepo();
        var y = new GenomeRepo();
        var population =x.CreateFirstPopulation(100,Pcb);
        population = x.GeneticOpertors(population, 100);
        y.GetConnectionsInModules(population.BestGenome);
        y.GetConnectionsBetweenModules(population.BestGenome);
        string json = JsonSerializer.Serialize(population.BestGenome);
        var g = 5;
        return population.BestGenome;
    }

}