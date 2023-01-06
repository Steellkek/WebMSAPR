using Microsoft.AspNetCore.Mvc;
using WebMSAPR;
using WebMSAPR.repository;

namespace WebApplication1.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PCBController : Controller
{
    [HttpPost("genPCB")]
    public Task<ActionResult<Response<Genome>>> genPCB(ParametrsGenAlg parametrsGenAlg)
    {
        try
        { 
            var genAlgRepo = new GenAlgRepository();
            var bestGenome = genAlgRepo.Go(parametrsGenAlg);
            var response = new Response<Genome>() {entity = bestGenome, resultCode = 0};
            return Task.FromResult<ActionResult<Response<Genome>>>(response);
        }
        catch (Exception e)
        {
            var response = new Response<Genome>() { Message = e.Message, resultCode = -1};
            return Task.FromResult<ActionResult<Response<Genome>>>(response);
        }
    }

    [HttpGet("Module")]
    public Task<ActionResult<Response<Tuple<List<Module>, List<ConnectionsModule>>>>> Module()
    {
        var moduleRepo = new ModuleRepository();
        var modules = moduleRepo.CreateModules(null);
        var localFileRepository = new LocalFileRepository();
        var matrix = localFileRepository.ReadMatrixModule();
        List<ConnectionsModule> connections = new List<ConnectionsModule>();
        for (int i = 0; i < matrix.Count; i++)
        {
            for (int j = i+1; j < matrix.Count; j++)
            {
                if (matrix[i][j]!=0)
                {
                    connections.Add(new ConnectionsModule()
                    {
                        Module1 = modules.Where(x=>x.Number==i).FirstOrDefault(),
                        Module2 = modules.Where(x=>x.Number==j).FirstOrDefault(),
                    });
                }
            }
            
        }

        var tuple = new Tuple<List<Module>, List<ConnectionsModule>>(item1: modules, item2: connections);
        var response = new Response<Tuple<List<Module>, List<ConnectionsModule>>>(){entity = tuple};
        return Task.FromResult<ActionResult<Response<Tuple<List<Module>, List<ConnectionsModule>>>>>(response);
    }

    [HttpGet("PCB")]
    public  Task<ActionResult<Response<PCB>>> PCB()
    {
        try
        {
            PCB Pcb = new PCBRepository().CreatePCB();
            var response = new Response<PCB>() {entity = Pcb, resultCode = 0};
            return Task.FromResult<ActionResult<Response<PCB>>>(response);
        }
        catch (Exception e)
        {
            return Task.FromResult<ActionResult<Response<PCB>>>(new Response<PCB>(){Message = e.Message,resultCode = -1});
        }   
    }
    
    [HttpPost("LoadMatrixElement")]
    public  Task<ActionResult<BaseResponse>> LoadMatrixElement(MatrixAndSizesElement matrixAndSizes)
    {
        try
        {
            LocalFileRepository localFileRepository = new LocalFileRepository();
            localFileRepository.WriteMatixSizesElement(matrixAndSizes.Matrix, matrixAndSizes.SizesElements);
            return Task.FromResult<ActionResult<BaseResponse>>(new BaseResponse());
        }
        catch (Exception e)
        {
            return Task.FromResult<ActionResult<BaseResponse>>(new BaseResponse(){Message = e.Message,resultCode = -1});
        }
    }
    
    [HttpPost("LoadMatrixModule")]
    public  Task<ActionResult<BaseResponse>> LoadMatrixModule(MatrixAndSizesModule matrixAndSizes)
    {
        try
        {
            LocalFileRepository localFileRepository = new LocalFileRepository();
            localFileRepository.WriteMatixSizesModule(matrixAndSizes.Matrix, matrixAndSizes.CountElements,
                matrixAndSizes.SizeModule);
            return Task.FromResult<ActionResult<BaseResponse>>(new BaseResponse());
        }
        catch (Exception e)
        {
            return Task.FromResult<ActionResult<BaseResponse>>(new BaseResponse(){Message = e.Message,resultCode = -1});
        }
    }
    
    public class MatrixAndSizesElement
    {
        public List<List<string>> Matrix;
        public List<List<string>> SizesElements;
    }
    
    public class MatrixAndSizesModule
    {
        public List<List<string>> Matrix;
        public List<int> CountElements;
        public List<string> SizeModule;
    }

    public class ParametrsGenAlg
    {
        public int CountOfGenome;
        public int CountOfPopulation;
        public double ChanсeCrosover;
        public double ChanсeMutation;
    }
}