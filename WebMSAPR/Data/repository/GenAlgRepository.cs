using WebApplication1.Controllers;

namespace WebMSAPR.repository;

public class GenAlgRepository
{
    public BestGenome Go(PCBController.ParametrsGenAlg parametrsGenAlg)
    {
        PCB Pcb = new PCBRepository().CreatePCB();
        var populationRepo = new PopulationRepository();
        var genomeRepo = new GenomeRepository();
        var population =populationRepo.CreateFirstPopulation(parametrsGenAlg.CountOfGenome,Pcb);
        population = populationRepo.GeneticOpertors(population, parametrsGenAlg);
        genomeRepo.GetConnectionsInModules(population.BestGenome);
        genomeRepo.GetConnectionsBetweenModules(population.BestGenome);
        return population.BestGenome;
    }

}