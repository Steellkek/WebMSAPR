namespace WebMSAPR;

public class Element
{
    public int Number{ get; set; }
    public int Squre { get; set; }
    internal List<Tuple<Element, int>> AdjElement { get; set; } = new();

    public Element(int N, int width, int length)
    {
        Number = N;
        Squre = width * length;
    }
}