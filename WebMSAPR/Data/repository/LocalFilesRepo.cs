using System.Xml;

namespace WebMSAPR.repository;

public class LocalFileRepo
{
    private string FileWay = "Files/File.xml";
    private string ResultWay = "Files/Result.xml";
    public List<List<int>> ReadGraph()
    {
        List<List<int>> matrix = new();
        int length=1;
        XmlDocument xDoc = new XmlDocument();
        xDoc.Load(FileWay);
        var xRoot = xDoc.SelectSingleNode("root/graph");
        if (xRoot != null)
        {
            // обходим все дочерние узлы элемента user
            foreach (XmlNode childnode in xRoot.ChildNodes)
            {
                if (childnode.Name=="n")
                {
                    length = Int32.Parse(childnode.InnerText);
                }

                if (childnode.Name=="matrix")
                {
                    matrix = childnode.InnerText
                        .Split(Array.Empty<string>(), StringSplitOptions.RemoveEmptyEntries)
                        .Select((s, i) => new { N = int.Parse(s), I = i})
                        .GroupBy(at => at.I/length, at => at.N, (k, g) => g.ToList())
                        .ToList();;   
                }
            }
        }
        return matrix;
    }

    public List<List<int>> ReadSizeElements()
    {
        List<List<int>> sizes = new();
        int length=1;
        XmlDocument xDoc = new XmlDocument();
        xDoc.Load(FileWay);
        var xRoot = xDoc.SelectSingleNode("root/graph");
        if (xRoot != null)
        {
            // обходим все дочерние узлы элемента user
            foreach (XmlNode childnode in xRoot.ChildNodes)
            {
                if (childnode.Name=="n")
                {
                    length = Int32.Parse(childnode.InnerText);
                }

                if (childnode.Name=="sizeElements")
                {
                    var x = childnode.InnerText
                        .Split(Array.Empty<string>(), StringSplitOptions.RemoveEmptyEntries)
                        .Select((s, i) => new { N = int.Parse(s), I = i})
                        .GroupBy(at => at.I/length, at => at.N, (k, g) => g.ToList());
                    sizes = childnode.InnerText
                        .Split(Array.Empty<string>(), StringSplitOptions.RemoveEmptyEntries)
                        .Select((s, i) => new { N = int.Parse(s), I = i})
                        .GroupBy(at => at.I/2, at => at.N, (k, g) => g.ToList())
                        .ToList();;   
                }
            }
        }
        return sizes;
    }
    public List<int> ReadSplit()
    {
        List<int> split;
        XmlDocument xDoc = new XmlDocument();
        xDoc.Load(FileWay);
        var xRoot = xDoc.SelectSingleNode("root/split");
        split = xRoot
            .InnerText
            .Split(Array.Empty<string>(), StringSplitOptions.RemoveEmptyEntries)
            .Select(x => int.Parse(x))
            .ToList();
        return split;
    }
    public List<int> ReadSizeModules()
    {
        List<int> sizes;
        XmlDocument xDoc = new XmlDocument();
        xDoc.Load(FileWay);
        var xRoot = xDoc.SelectSingleNode("root/sizeSplit");
        sizes = xRoot
            .InnerText
            .Split(Array.Empty<string>(), StringSplitOptions.RemoveEmptyEntries)
            .Select(x => int.Parse(x))
            .ToList();
        return sizes;
    }
    public void WriteMatix(int n)
    {
        Random ran = new();
        var x = BuildMatrix(n);
        string matrix = "";
        for (int i = 0; i < n; i++)
        {
            for (int j = 0; j < n; j++)
            {
                matrix += x[i, j] + " ";
            }
            matrix += "\n";
        }  
        XmlDocument xDoc = new XmlDocument();
        xDoc.Load("Files/File.xml");
        XmlElement? xRoot = xDoc.DocumentElement;
        if (xRoot != null)
        {
            foreach (XmlElement xnode in xRoot)
            {
                foreach (XmlNode childnode in xnode.ChildNodes)
                {
                    if (childnode.Name=="n")
                    {
                        childnode.InnerText = n.ToString();
                    }
                    if (childnode.Name=="matrix")
                    {
                        childnode.InnerText = matrix;
                    }
                }
            }
        }

        var split = "";
        while (n!=0)
        {
            var random = ran.Next(1, n);
            split += random + " ";
            n -= random;
        }
        var xNode = xDoc.SelectSingleNode("root/split");
        xNode.InnerText = split;
        xDoc.Save("Files/File.xml");
    }
    private int[,] BuildMatrix(int N)
    {
        Random ran = new Random();
        int[,] matrix = new int[N, N];
        for (int i = 0; i < N; i++)
        {
            matrix[i, i] = 0;
            for (int j = i + 1; j < N; j++)
            {
                var check = ran.Next(0, 3);
                var el = 0;
                if (check==2)
                {
                    el=ran.Next(1, 20);
                }


                matrix[i, j] = el;
                matrix[j, i] = matrix[i, j]; 
            }
        }
        return matrix;
    }
    public List<double> ReadGenAlg()
    {
        List<double> split = new();
        XmlDocument xDoc = new XmlDocument();
        xDoc.Load(FileWay);
        var xRoot = xDoc.SelectSingleNode("root/GenAlg");
        if (xRoot != null)
        {
            foreach (XmlNode childnode in xRoot.ChildNodes)
            {
                split.Add(double.Parse(childnode.InnerText));
            }
        }
        return split;
    }

    
}