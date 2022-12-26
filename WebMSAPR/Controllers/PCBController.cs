using Microsoft.AspNetCore.Mvc;
using WebMSAPR;
using WebMSAPR.repository;

namespace WebApplication1.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GraphController : Controller
{
    [HttpGet("genPCB")]
    public Task<ActionResult<BestGenome>> genPCB()
    {
        var x = new GenAlgRepo();
        var g = x.Go();
        return Task.FromResult<ActionResult<BestGenome>>(g);
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
        x.WriteMatix(matrixAndSizes.Matrix, matrixAndSizes.SizesElements);
        return Task.FromResult<ActionResult<int>>(1);
    }
    
    public class MatrixAndSizes
    {
        public List<List<string>> Matrix;
        public List<List<string>> SizesElements;

    }
}