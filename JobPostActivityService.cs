using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models.Domain;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace Sabio.Services
{
    public class JobPostActivityService : IJobPostActivityService
    {
        IDataProvider _data = null;

        public JobPostActivityService(IDataProvider data)
        {
            _data = data;
        }

        public List<JobPostActivity> GetJobPostActivities(int UserId)
        {
            JobPostActivity model = null;
            List<JobPostActivity> list = null;
            string procName = "[dbo].[JobPostActivity_SelectAll_by_UserId]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection col)
             {
                 col.AddWithValue("@UserId", UserId);
             }, singleRecordMapper: delegate (IDataReader reader, short set)
             {
                 model = new JobPostActivity();
                 int indexer = 0;
                 model.UserId = reader.GetSafeInt32(indexer++);
                 model.JobPostId = reader.GetSafeInt32(indexer++);
                 model.ApplyDate = reader.GetSafeDateTime(indexer++);

                 if (list == null)
                 {
                     list = new List<JobPostActivity>();
                 }

                 list.Add(model);
             });
            return list;
        }

        public void Insert(int UserId, int JobPostId)
        {
            string procName = "[dbo].[JobPostActivity_Insert]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@UserId", UserId);
                col.AddWithValue("@JobPostId", JobPostId);
            },
            returnParameters: null);
        }
    }
}
