using Microsoft.AspNetCore.Mvc;
using WebMSAPR;
using WebMSAPR.repository;

namespace WebApplication1.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PCBController : Controller
{
    [HttpPost("genPCB")]
    public Task<ActionResult<Response<BestGenome>>> genPCB(ParametrsGenAlg parametrsGenAlg)
    {
        try
        { 
            var genAlgRepo = new GenAlgRepository();
            var bestGenome = genAlgRepo.Go();
            var response = new Response<BestGenome>() {entity = bestGenome, resultCode = 0};
            return Task.FromResult<ActionResult<Response<BestGenome>>>(response);
        }
        catch (Exception e)
        {
            var response = new Response<BestGenome>() { Message = e.Message, resultCode = -1};
            return Task.FromResult<ActionResult<Response<BestGenome>>>(response);
        }
    }

    [HttpGet("PCB")]
    public  Task<ActionResult<PCB>> PCB()
    {
        PCB Pcb = new RepoPCB().CreatePCB();
        return Task.FromResult<ActionResult<PCB>>(Pcb);
    }
    
    [HttpPost("LoadMatrix")]
    public  Task<ActionResult<int>> LoadMatrix(MatrixAndSizes matrixAndSizes)
    {
        LocalFileRepo x = new LocalFileRepo();
        x.WriteMatix(matrixAndSizes.Matrix, matrixAndSizes.SizesElements,matrixAndSizes.CountElements,matrixAndSizes.SizeModule);
        return Task.FromResult<ActionResult<int>>(1);
    }
    
    public class MatrixAndSizes
    {
        public List<List<string>> Matrix;
        public List<List<string>> SizesElements;
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