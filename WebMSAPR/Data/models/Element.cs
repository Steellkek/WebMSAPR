namespace WebMSAPR;

public class Element
{
    public int Number{ get; set; }
    public double Squre { get; set; }
    public double Width { get; set; }
    public double Length { get; set; }
    internal List<Tuple<Element, int>> AdjElement { get; set; } = new();

    public Element(int N, int width, int length)
    {
        Number = N;
        Width = width==0?10:width;
        Length = length==0?10:length;
        Squre = Width * Length;
    }
}