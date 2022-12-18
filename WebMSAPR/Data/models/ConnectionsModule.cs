namespace WebMSAPR;

public class ConnectionsModule
{
    public Module Module1 { get; set; }
    public Module Module2 { get; set; }
    public int value = 0;
    internal List<Connection<Element>> Connections { get; set; } = new List<Connection<Element>>();
}