using Microsoft.AspNetCore.Mvc;
using WebMSAPR;
using WebMSAPR.repository;

namespace WebApplication1.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GraphController : Controller
{
    [HttpGet("graph")]
    public Task<ActionResult<BestGenome>> Graph()
    {
        var x = new GenAlgRepo();
        var g = x.Go();
        return Task.FromResult<ActionResult<BestGenome>>(g);
    }
}