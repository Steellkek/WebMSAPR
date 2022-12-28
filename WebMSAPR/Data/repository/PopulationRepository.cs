﻿using WebApplication1.Controllers;

namespace WebMSAPR.repository;

public class PopulationRepository
{
    public Population CreateFirstPopulation(int k, PCB pcb)
    {
        var genomeRepo = new GenomeRepository();
        Population population = new Population();
        for (int i = 0; i < k; i++)
        {
            population.Genomes.Add(genomeRepo.CreateFirstGenome(pcb));
        }
        population.SumFitness = population.Genomes.Sum(x => x.Fitness);
        return population;
    }
    

    private List<Genome> GetNewParents(Population population)
    {
        population.Genomes= population.Genomes.OrderBy(x => x.Fitness).ToList();
        Random ran = new Random();
        var Chances = new List<decimal>();
        var x = population.Genomes.Count * (population.Genomes.Count + 1) / 2;
        Chances.Add( (decimal)1 / x);
        for (int i = 1; i <population.Genomes.Count; i++)
        {
            Chances.Add( Chances[i-1]+ ((decimal)(i+1)/x));
        }

        var Parents = new List<Genome>();
        for (int i = 0; i < population.Genomes.Count; i++)
        {
            var chanse = (decimal)ran.NextDouble();
            if (chanse<Chances[0])
            {
                Parents.Add(population.Genomes[i]);
                continue;
            }

            for (int j = 1; j < Chances.Count; j++)
            {
                if ((chanse<Chances[j])&(chanse>Chances[j-1]))
                {
                    Parents.Add(population.Genomes[j]);
                    break;
                }
            }
        }
        return Parents;
    }

    public Population GeneticOpertors(Population population, PCBController.ParametrsGenAlg parametrsGenAlg)
    {
        var genomeRepo = new GenomeRepository();
        var bestGen = population.Genomes.OrderBy(x => x.Fitness).ToList()[0];
        population.BestGenome = new BestGenome() {Modules = bestGen.Modules,Fitness = bestGen.Fitness};
        population.BestGenome.ListBestGen.Add(population.BestGenome.Fitness);
        population.BestGenome.ListSumFitnes.Add(population.SumFitness);
        for (int i = 0; i < parametrsGenAlg.CountOfPopulation; i++)
        {
            population.NextGener= GetNewParents(population);
            population=Crossingover(population,parametrsGenAlg.ChanсeCrosover);
            foreach (var genome in population.NextGener)
            {
                genome.Fitness = genomeRepo.DetermineFitnes(genome.Modules);
            }
            population = Mutation(population,parametrsGenAlg.ChanсeMutation);
            foreach (var genome in population.Genomes)
            {
                genome.Fitness = genomeRepo.DetermineFitnes(genome.Modules);
            }

            population.Genomes = Otbor(population.Genomes, population.NextGener);
            population.SumFitness = population.Genomes.Sum(x => x.Fitness);
            population.BestGenome.ListBestGen.Add(population.BestGenome.Fitness);
            population.BestGenome.ListSumFitnes.Add(population.SumFitness);
            if (population.BestGenome.Fitness<population.Genomes[0].Fitness)
            {
                population.BestGenome.Fitness = population.Genomes[0].Fitness;
                population.BestGenome.Modules = population.Genomes[0].Modules;
            }
        }
        return population;
    }

    private List<Genome> Otbor(List<Genome> genomes1, List<Genome> NextGener)
    {
        var newList = genomes1.Concat(NextGener).OrderBy(x=>x.Fitness).Reverse().ToList();
        return newList.GetRange(0,genomes1.Count);
    }

    private Population Mutation(Population population,double chance)
    {
        var rand = new Random();
        var genomeRepo = new GenomeRepository();
        for (int i = 0; i < population.NextGener.Count; i ++)
        {
            var newChance = rand.NextDouble();
            if (chance > newChance)
            {
                population.NextGener[i].Modules = genomeRepo.Mutation(population.NextGener[i]);
            }
        }
        return population;
    }

    private Population Crossingover(Population population,double chance)
    {
        var rand = new Random();
        var genomeRepo = new GenomeRepository();
        population.NextGener.Clear();
        for (int i = 0; i < population.Genomes.Count-1; i=i+2)
        {
            var newChance = rand.NextDouble();
            var point = rand.Next(0,population.Genomes[i].Modules.Sum(x=>x.Cnt));
            if (chance>newChance&&!genomeRepo.CheckEquality(population.Genomes[i],population.Genomes[i+1]))
            {
                var child1 = genomeRepo.GetChild(population.Genomes[i], population.Genomes[i + 1], point);
                var child2 = genomeRepo.GetChild(population.Genomes[i+1], population.Genomes[i], point);
                population.NextGener.Add(new Genome());
                population.NextGener[i].Modules = child1;
                population.NextGener.Add(new Genome());
                population.NextGener[i + 1].Modules = child2;
            }
            else
            {
                population.NextGener.Add(new Genome());
                population.NextGener[i].Modules = population.Genomes[i].Modules;
                population.NextGener.Add(new Genome());
                population.NextGener[i + 1].Modules = population.Genomes[i+1].Modules;
            }
        }

        if (population.Genomes.Count%2==1)
        {
            population.NextGener.Add(new Genome());
            population.NextGener[population.NextGener.Count-1].Modules = population.Genomes[population.NextGener.Count-1].Modules;
        }
        return population;
    }
}