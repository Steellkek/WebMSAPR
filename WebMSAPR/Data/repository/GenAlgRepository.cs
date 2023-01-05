using WebApplication1.Controllers;

namespace WebMSAPR.repository;

public class GenAlgRepository
{
    public Genome Go(PCBController.ParametrsGenAlg parametrsGenAlg)
    {
        PCB Pcb = new PCBRepository().CreatePCB();
        var populationRepo = new PopulationRepository();
        var population =populationRepo.CreateFirstPopulation(parametrsGenAlg.CountOfGenome,Pcb);
        population = populationRepo.GeneticOpertors(population, parametrsGenAlg);
        return population.BestGenome;
    }

}