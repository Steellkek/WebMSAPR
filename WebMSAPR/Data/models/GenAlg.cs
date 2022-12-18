namespace WebMSAPR;

public class GenAlg
{
    public int CountGenome{ get; set; }
    public int Iteration{ get; set; }
    public decimal ChanseCrosover{ get; set; }
    public decimal ChanseMutation{ get; set; }
    public decimal ChanseInversion { get; set; }
    public long time { get; set; }
    public Genome BestGen{ get; set; } = new();
}