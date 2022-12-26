namespace WebMSAPR;

public class Element
{
    public int Number{ get; set; }
    public decimal Squre { get; set; }
    public decimal Width { get; set; }
    public decimal Length { get; set; }
    internal List<Tuple<Element, int>> AdjElement { get; set; } = new();

    public Element(int N, decimal width, decimal length)
    {
        Number = N;
        Width = width==0?10:width;
        Length = length==0?10:length;
        Squre = Width * Length;
    }
}