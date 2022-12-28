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
            var bestGenome = genAlgRepo.Go(parametrsGenAlg);
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
    
    [HttpPost("LoadMatrix")]
    public  Task<ActionResult<BaseResponse>> LoadMatrix(MatrixAndSizes matrixAndSizes)
    {
        try
        {
            LocalFileRepository localFileRepository = new LocalFileRepository();
            localFileRepository.WriteMatixSizes(matrixAndSizes.Matrix, matrixAndSizes.SizesElements,matrixAndSizes.CountElements,matrixAndSizes.SizeModule);
            return Task.FromResult<ActionResult<BaseResponse>>(new BaseResponse());
        }
        catch (Exception e)
        {
            return Task.FromResult<ActionResult<BaseResponse>>(new BaseResponse(){Message = e.Message,resultCode = -1});
        }
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