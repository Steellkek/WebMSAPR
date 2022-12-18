namespace WebMSAPR;

public class Connection<T>
{
    public T _element1{ get; set; }
    public T _element2{ get; set; }
    public int _value{ get; set; }

    public Connection(T element1, T element2, int value)
    {
        _element1 = element1;
        _element2 = element2;
        _value = value;
    }
}