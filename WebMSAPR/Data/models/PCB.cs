namespace WebMSAPR;

public class PCB
{
    public List<Element> Elements { get; set; }
    public List<Connection<Element>> Connections { get; set; }
}