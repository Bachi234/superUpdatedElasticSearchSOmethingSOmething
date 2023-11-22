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
                Console.WriteLine("Something went wrong.");
                return new List<tblElasticData>();
            }

            /*searchSubject = searchSubject.Trim();*/ // Remove leading and trailing whitespace

            var query = _context.tblElasticData
            .Where(data => !string.IsNullOrWhiteSpace(data.Subject) && data.Subject.Contains(searchSubject));

            var command = _context.Database.GetDbConnection().CreateCommand();
            command.CommandTimeout = 0;

            var result = ProjectElasticDataProperties(query).ToList();

            return result;
        }

        //public List<tblElasticData> GetElasticDataByDate(DateTime? startDate, DateTime? endDate)
        //{
        //    startDate ??= DateTime.MinValue; // If startDate is null, set it to DateTime.MinValue
        //    endDate ??= DateTime.MaxValue;   // If endDate is null, set it to DateTime.MaxValue

        //    var command = _context.Database.GetDbConnection().CreateCommand();
        //    command.CommandTimeout = 0; // 5 min timeout  

        //    var result = _context.tblElasticData
        //        .Where(data => data.EventDate >= startDate && data.EventDate <= endDate)
        //        .GroupBy(data => new
        //        {
        //            data.To,
        //            data.From,
        //            data.Subject,
        //            data.EventType,
        //            data.EventDate,
        //            data.Channel,
        //            data.MessageCategory
        //        })
        //        .Select(group => new tblElasticData
        //        {
        //            To = group.Key.To,
        //            From = group.Key.From,
        //            Subject = group.Key.Subject,
        //            EventType = group.Key.EventType,
        //            EventDate = group.Key.EventDate,
        //            Channel = group.Key.Channel,
        //            MessageCategory = group.Key.MessageCategory,
        //            Quantity = group.Count() // Count represents the quantity
        //        })
        //        .ToList();

        //    return result;
        //}
        public List<tblElasticData> GetElasticDataByDate(DateTime? startDate, DateTime? endDate)
        {
            startDate ??= DateTime.MinValue; // If startDate is null, set it to DateTime.MinValue
            endDate ??= DateTime.MaxValue;   // If endDate is null, set it to DateTime.MaxValue

            var command = _context.Database.GetDbConnection().CreateCommand();
            command.CommandTimeout = 0; // 5 min timeout  

            var result = _context.tblElasticData
                .Where(data => data.EventDate.Date >= startDate.Value.Date && data.EventDate.Date <= endDate.Value.Date)
                .GroupBy(data => new
                {
                    data.To,
                    data.From,
                    data.Subject,
                    data.EventType,
                    data.EventDate,
                    data.Channel,
                    data.MessageCategory
                })
                .Select(group => new tblElasticData
                {
                    To = group.Key.To,
                    From = group.Key.From,
                    Subject = group.Key.Subject,
                    EventType = group.Key.EventType,
                    EventDate = group.Key.EventDate,
                    Channel = group.Key.Channel,
                    MessageCategory = group.Key.MessageCategory,
                    Quantity = group.Count() // Count represents the quantity
                })
                .ToList();

            return result;
        }

    }
}

//CODE DUMP
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

//public List<tblElasticData> GetElasticDataByDate(DateTime? startDate, DateTime? endDate)
//{
//    return ProjectElasticDataProperties(_context.tblElasticData
//        .Where(data => data.EventDate.Date >= startDate && data.EventDate.Date <= endDate))
//        .ToList();
//}