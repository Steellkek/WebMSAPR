namespace WebMSAPR;

public class Module
{
    public List<Element> Elements { get; set; } = new();
    public int Square{ get; set; }
    public int Cnt{ get; set; }
    public List<ConnectionElement> ConnectionsInModules { get; set; } = new();
    public int Number { get; set; }
    public Module(int count, int square, int number)
    {
        Square = square == 0 ? Int32.MaxValue : square;
        Cnt = count;
        Number = number;
    }
}