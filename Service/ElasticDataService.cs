using automationTest.Context;
using automationTest.Models;
using Microsoft.EntityFrameworkCore;

namespace automationTest.Service
{
    public class ElasticDataService
    {
        private readonly ApplicationDbContext _context;

        public ElasticDataService(ApplicationDbContext context)
        {
            _context = context;
        }

        private IQueryable<tblElasticData> ProjectElasticDataProperties(IQueryable<tblElasticData> dataQuery)
        {
            return dataQuery.Select(data => new tblElasticData
            {
                Subject = data.Subject,
                To = data.To,
                From = data.From,
                EventType = data.EventType,
                EventDate = data.EventDate,
                Channel = data.Channel,
                MessageCategory = data.MessageCategory
            });
        }

        public List<tblElasticData> GetElasticDataBySubject(string searchSubject)
        {
            if (string.IsNullOrWhiteSpace(searchSubject))
            {
                // Handle the case where searchSubject is null, empty, or contains only whitespace (optional)
                return new List<tblElasticData>();
            }

            searchSubject = searchSubject.Trim(); // Remove leading and trailing whitespace

            var query = _context.tblElasticData
                .Where(data => !string.IsNullOrWhiteSpace(data.Subject) && EF.Functions.Like(data.Subject, "%" + searchSubject + "%"));

        
            var result = ProjectElasticDataProperties(query).ToList();

            return result;
        }

        public List<tblElasticData> GetElasticDataByDate(DateTime? startDate, DateTime? endDate)
        {
            return ProjectElasticDataProperties(_context.tblElasticData
                .Where(data => data.EventDate.Date >= startDate && data.EventDate.Date <= endDate))
                .ToList();
        }
    }
}

//STUFF
//private IQueryable<tblElasticData> ProjectElasticDataProperties(IQueryable<tblElasticData> dataQuery)
//{
//    return dataQuery.Select(data => new tblElasticData
//    {
//        Subject = data.Subject,
//        To = data.To,
//        From = data.From,
//        EventType = data.EventType,
//        EventDate = data.EventDate,
//        Channel = data.Channel,
//        MessageCategory = data.MessageCategory
//    });
//}



//public List<tblElasticData> GetElasticDataByDate(DateTime? startDate, DateTime? endDate)
//{
//    return ProjectElasticDataProperties(_context.tblElasticData
//        .Where(data => data.EventDate.Date >= startDate && data.EventDate.Date <= endDate))
//        .ToList();
//}


//public List<tblElasticData> GetElasticDataBySubject(string searchSubject)
//{
//    if (searchSubject != null)
//    {
//        searchSubject = searchSubject.Replace(" ", ""); // Remove whitespace from the search subject

//        return ProjectElasticDataProperties(_context.tblElasticData
//            .Where(data => data.Subject != null && data.Subject.Replace(" ", "").Contains(searchSubject)))
//            .ToList();
//    }
//    else
//    {
//        // Handle the case where searchSubject is null (optional)
//        return new List<tblElasticData>();
//    }
//}