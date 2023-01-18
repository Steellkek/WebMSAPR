namespace WebMSAPR;

public class ConnectionsModule
{
    public Module Module1 { get; set; }
    public Module Module2 { get; set; }
    public int value {get; set; }

    internal List<ConnectionElement> Connections { get; set; } = new List<ConnectionElement>();
}