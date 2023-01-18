namespace WebMSAPR;

public class Response<T>:BaseResponse
{
    public T entity { get; set; }
}