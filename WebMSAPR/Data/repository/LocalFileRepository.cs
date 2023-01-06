using System.Xml;

namespace WebMSAPR.repository;

public class LocalFileRepository
{
    private string FileWay = "Files/File.xml";
    private string ResultWay = "Files/Result.xml";
    public List<List<int>> ReadGraph()
    {
        try
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

            foreach (var var in matrix)
            {
                if (var.Where(x=>x==0).Count()==var.Count)
                {
                    throw new Exception("Присутвует элемент у которого нет связей с другими");
                }
            }
            return matrix;
        }
        catch (Exception e)
        {
            throw new Exception("Файл поврежден: "+e.Message);
        }
    }

    public List<List<decimal>> ReadSizeElements()
    {
        try
        {
            List<List<decimal>> sizes = new();
            int length=1;
            XmlDocument xDoc = new XmlDocument();
            xDoc.Load(FileWay);
            var xRoot = xDoc.SelectSingleNode("root/graph");
            if (xRoot != null)
            {
                // обходим все дочерние узлы элемента user
                foreach (XmlNode childnode in xRoot.ChildNodes)
                {

                    if (childnode.Name=="sizeElements")
                    {
                        sizes = childnode.InnerText
                            .Split(Array.Empty<string>(), StringSplitOptions.RemoveEmptyEntries)
                            .Select((s, i) => new { N = decimal.Parse(s.Replace(".",",")), I = i})
                            .GroupBy(at => at.I/2, at => at.N, (k, g) => g.ToList())
                            .ToList();;   
                    }
                }
            }
            return sizes;
        }
        catch (Exception e)
        {
            throw new Exception("Файл поврежден!");
        }
    }
    public List<int> ReadSplit()
    {
        try
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
        catch (Exception e)
        {
            throw new Exception("Файл поврежден!");
        }
    }
    public List<int> ReadSizeModules()
    {
        try
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
        catch (Exception e)
        {
            throw new Exception("Файл поврежден!");
        }
    }

    public List<List<int>> ReadMatrixModule()
    {
        try
        {
            List<List<int>> matrix = new();
            int length=1;
            XmlDocument xDoc = new XmlDocument();
            xDoc.Load(FileWay);
            var xRoot = xDoc.SelectSingleNode("root/matrixModules");
            var count = xRoot.InnerText.Trim().Where(x => (x == '\n')).Count()+1;
            matrix = xRoot.InnerText
                .Split(Array.Empty<string>(), StringSplitOptions.RemoveEmptyEntries)
                .Select((s, i) => new { N = int.Parse(s), I = i})
                .GroupBy(at => at.I/count, at => at.N, (k, g) => g.ToList())
                .ToList();
            if (matrix.Count!=count)
            {
                throw new Exception("Проверьте матрицу соединений модулей!");
            }
            return matrix;
        }
        catch (Exception e)
        {
            throw new Exception("Файл поврежден: "+e.Message);
        }
    }
    public void WriteMatixSizesElement(List<List<string>> matrix, List<List<string>> listSizeElements)
    {

        try
        {
            string strMatrix = "";
            for (int i = 0; i < matrix.Count; i++)
            {
                for (int j = 0; j < matrix.Count; j++)
                {
                    strMatrix += matrix[i][j] + " ";
                }
                strMatrix += "\n";
            }

            string sizeElements = "";
            foreach (var list in listSizeElements)
            {
                sizeElements += list[0].Replace(".",",") + " " + list[1].Replace(".",".")  + "\n";
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
                            childnode.InnerText = matrix.Count.ToString();
                        }
                        if (childnode.Name=="matrix")
                        {
                            childnode.InnerText = strMatrix;
                        }

                        if (childnode.Name=="sizeElements")
                        {
                            childnode.InnerText = sizeElements;
                        }
                    }
                }
            }
            xDoc.Save("Files/File.xml");
        }
        catch (Exception e)
        {
            throw new Exception("Файл поврежден!");
        }
    }
    
    public void WriteMatixSizesModule(List<List<string>> matrix, List<int> listCountElement, List<string> listSizeModule)
    {

        try
        {
            string strMatrix = "";
            for (int i = 0; i < matrix.Count; i++)
            {
                for (int j = 0; j < matrix.Count; j++)
                {
                    strMatrix += matrix[i][j] + " ";
                }
                strMatrix += "\n";
            }

            string sizeElements = "";

            XmlDocument xDoc = new XmlDocument();
            xDoc.Load("Files/File.xml");
            var split = string.Join(" ",listCountElement);
            var xNode = xDoc.SelectSingleNode("root/split");
            xNode.InnerText = split;
            xDoc.Save("Files/File.xml");
            var sisezModule = string.Join(" ", listSizeModule);
            xNode = xDoc.SelectSingleNode("root/sizeSplit");
            xNode.InnerText = sisezModule;
            xDoc.Save("Files/File.xml");
            xNode=xDoc.SelectSingleNode("root/matrixModules");
            xNode.InnerText = strMatrix;
            xDoc.Save("Files/File.xml");
        }
        catch (Exception e)
        {
            throw new Exception("Файл поврежден!");
        }
    }

}