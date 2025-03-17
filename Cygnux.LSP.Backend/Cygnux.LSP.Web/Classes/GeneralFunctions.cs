using System.Xml.Linq;

namespace CygnuxLSP.Web.Classes
{
    public class GeneralFunctions
    {
        #region Serialize Deserialize

        public void SerializeParams<T>(List<T> paramList, string folderPath)
        {
            XDocument doc = new XDocument();
            System.Xml.Serialization.XmlSerializer serializer = new System.Xml.Serialization.XmlSerializer(paramList.GetType());
            System.Xml.XmlWriter writer = doc.CreateWriter();
            serializer.Serialize(writer, paramList);
            writer.Close();
            doc.Save(folderPath);
        }

        public List<T> DeserializeParams<T>(string folderPath)
        {
            XDocument doc = XDocument.Load(folderPath);
            System.Xml.Serialization.XmlSerializer serializer = new System.Xml.Serialization.XmlSerializer(typeof(List<T>));
            System.Xml.XmlReader reader = doc.CreateReader();
            List<T> result = (List<T>)serializer.Deserialize(reader);
            reader.Close();
            return result;
        }
        #endregion
    }
}
