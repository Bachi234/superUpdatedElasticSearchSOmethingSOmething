using automationTest.Models;

namespace automationTest.ViewModel
{
    public class CombinedViewModel
    {
        public List<tblElasticData>? ElasticData { get; set; }
        public List<tblEvent>? EventData { get; set; }
        public List<CombinedModel> ?CombinedModel { get; set; }
    }

}
