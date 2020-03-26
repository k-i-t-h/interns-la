using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.LookUp;
using Sabio.Models.Requests.Jobs;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace Sabio.Services
{
    public class JobService : IJobService
    {
        IDataProvider _data = null;
        public JobService(IDataProvider data)
        {
            _data = data;
        }

        public int Add(JobAddRequest model, int createdBy)
        {
            string procName = "[dbo].[Openings_Insert]";
            int Id = 0;

            _data.ExecuteNonQuery(procName,
               inputParamMapper: delegate (SqlParameterCollection col)
               {
                   CommonParams(model, col);
                   col.AddWithValue("@CreatedBy", createdBy);
                   SqlParameter idOutput = new SqlParameter("@Id", SqlDbType.Int);
                   idOutput.Direction = ParameterDirection.Output;
                   col.Add(idOutput);
               },
                returnParameters: delegate (SqlParameterCollection returnCol)
                {
                    object oId = returnCol["@Id"].Value;
                    int.TryParse(oId.ToString(), out Id);
                });
            return Id;
        }

        public Job Get(int Id)
        {
            string procName = "[dbo].[Openings_Details_ById]";
            Job job = null;
            OrganizationSelect organization = null;
            TwoColumn jobType = null;
            LocationInfo location = null;
            UserProfile userProfile = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection jobCol)
            {
                jobCol.AddWithValue("@Id", Id);

            }, delegate (IDataReader reader, short set)
            {
                job = new Job();
                organization = new OrganizationSelect();
                jobType = new TwoColumn();
                location = new LocationInfo();
                userProfile = new UserProfile();
                MapJob(reader, job, organization, jobType, location, userProfile);
            });

            return job;
        }

        public Paged<Job> Paginate(int pageIndex, int pageSize)
        {
            Paged<Job> pagedResult = null;
            List<Job> result = null;
            Job job = null;
            OrganizationSelect organization = null;
            TwoColumn jobType = null;
            LocationInfo location = null;
            UserProfile userProfile = null;
            int totalCount = 0;
            string procName = "[dbo].[Openings_Select_All_V3]";

            _data.ExecuteCmd(procName,
                inputParamMapper: delegate (SqlParameterCollection parameterCollection)
                {
                    parameterCollection.AddWithValue("@PageIndex", pageIndex);
                    parameterCollection.AddWithValue("@PageSize", pageSize);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    job = new Job();
                    organization = new OrganizationSelect();
                    jobType = new TwoColumn();
                    location = new LocationInfo();
                    userProfile = new UserProfile();
                    MapJob(reader, job, organization, jobType, location, userProfile);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(26);
                    }

                    if (result == null)
                    {
                        result = new List<Job>();
                    }

                    result.Add(job);
                });

            if (result != null)
            {
                pagedResult = new Paged<Job>(result, pageIndex, pageSize, totalCount);
            }

            return pagedResult;
        }

        public Paged<Job> GetByCurrent(int createdBy, int pageIndex, int pageSize)
        {
            string procName = "[dbo].[Openings_Select_ByCreatedBy_V2]";
            Paged<Job> pagedResult = null;
            List<Job> result = null;
            Job job = null;
            OrganizationSelect organization = null;
            TwoColumn jobType = null;
            LocationInfo location = null;
            UserProfile userProfile = null;
            int totalCount = 0;

            _data.ExecuteCmd(procName,
                inputParamMapper: delegate (SqlParameterCollection parameterCollection)
                {
                    parameterCollection.AddWithValue("@CreatedBy", createdBy);
                    parameterCollection.AddWithValue("@PageIndex", pageIndex);
                    parameterCollection.AddWithValue("@PageSize", pageSize);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    job = new Job();
                    organization = new OrganizationSelect();
                    jobType = new TwoColumn();
                    location = new LocationInfo();
                    userProfile = new UserProfile();
                    MapJob(reader, job, organization, jobType, location, userProfile);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(26);
                    }

                    if (result == null)
                    {
                        result = new List<Job>();
                    }

                    if (job.CreatedBy.Id == createdBy)
                    {
                        result.Add(job);
                    }

                });

            if (result != null)
            {
                pagedResult = new Paged<Job>(result, pageIndex, pageSize, totalCount);
            }

            return pagedResult;
        }

        public Paged<Job> Search(string search, int pageIndex, int pageSize)
        {
            string procName = "[dbo].[Openings_Search_V2]";
            Paged<Job> pagedResult = null;
            List<Job> list = null;
            Job job = null;
            OrganizationSelect organization = null;
            TwoColumn jobType = null;
            LocationInfo location = null;
            UserProfile userProfile = null;
            int totalCount = 0;

            _data.ExecuteCmd(procName,
                inputParamMapper: delegate (SqlParameterCollection parameterCollection)
                {
                    parameterCollection.AddWithValue("@Search", search);
                    parameterCollection.AddWithValue("@PageIndex", pageIndex);
                    parameterCollection.AddWithValue("@PageSize", pageSize);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    job = new Job();
                    organization = new OrganizationSelect();
                    jobType = new TwoColumn();
                    location = new LocationInfo();
                    userProfile = new UserProfile();
                    MapJob(reader, job, organization, jobType, location, userProfile);

                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(26);
                    }

                    if (list == null)
                    {
                        list = new List<Job>();
                    }

                    list.Add(job);

                });

            if (list != null)
            {
                pagedResult = new Paged<Job>(list, pageIndex, pageSize, totalCount);
            }

            return pagedResult;
        }

        public List<OrganizationSelect> GetOrganizations(string search, int pageIndex, int pageSize)
        {
            OrganizationSelect model = null;
            List<OrganizationSelect> list = null;
            string procName = "[dbo].[OpeningsOrganization_SelectAll_Search]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection parameterCollection)
            {
                parameterCollection.AddWithValue("@Search", search);
                parameterCollection.AddWithValue("@pageIndex", pageIndex);
                parameterCollection.AddWithValue("@pageSize", pageSize);

            }, singleRecordMapper: delegate (IDataReader reader, short set)
         {
             model = new OrganizationSelect();
             int indexer = 0;
             model.Id = reader.GetSafeInt32(indexer++);
             model.OrgName = reader.GetSafeString(indexer++);
             model.SiteUrl = reader.GetSafeString(indexer++);
             model.Logo = reader.GetSafeString(indexer++);

             if (list == null)
             {
                 list = new List<OrganizationSelect>();
             }

             list.Add(model);
         });

            return list;
        }

        public void Update(JobUpdateRequest model)
        {
            string procName = "[dbo].[Openings_Update]";
            _data.ExecuteNonQuery(procName,
            inputParamMapper: delegate (SqlParameterCollection col)
            {
                CommonParams(model, col);
                col.AddWithValue("@Id", model.Id);
            }, returnParameters: null);
        }

        public void Delete(int Id)
        {
            string procName = "[dbo].[Openings_Delete_ByID_V2]";
            _data.ExecuteNonQuery(procName, delegate (SqlParameterCollection paramCollection)
            {
                paramCollection.AddWithValue("@Id", Id);
            }, returnParameters: null);
        }

        #region Private Methods
        private static Job MapJob(IDataReader reader, Job job, OrganizationSelect organization, TwoColumn jobType, LocationInfo location, UserProfile userProfile)
        { 
            int indexer = 0;
            job.Id = reader.GetSafeInt32(indexer++);
            organization.Id = reader.GetSafeInt32(indexer++);
            organization.OrgName = reader.GetSafeString(indexer++);
            organization.SiteUrl = reader.GetSafeString(indexer++);
            organization.Logo = reader.GetSafeString(indexer++);
            job.Organization = organization;
            jobType.Id = reader.GetSafeInt32(indexer++);
            jobType.Name = reader.GetSafeString(indexer++);
            job.JobType = jobType; 
            location.Id = reader.GetSafeInt32(indexer++);
            location.LineOne = reader.GetSafeString(indexer++);
            location.City = reader.GetSafeString(indexer++); 
            location.Zip = reader.GetSafeString(indexer++);
            location.StateName = reader.GetSafeString(indexer++);
            location.StateProvinceCode = reader.GetSafeString(indexer++); 
            job.Location = location;
            userProfile.Id = reader.GetSafeInt32(indexer++);
            userProfile.FirstName = reader.GetSafeString(indexer++);
            userProfile.LastName = reader.GetSafeString(indexer++);
            userProfile.AvatarUrl = reader.GetSafeString(indexer++);
            job.CreatedBy = userProfile;
            job.Title = reader.GetSafeString(indexer++);
            job.Description = reader.GetSafeString(indexer++);
            job.Requirements = reader.GetSafeString(indexer++);
            job.IsActive = reader.GetSafeBool(indexer++);
            job.ContactName = reader.GetSafeString(indexer++);
            job.ContactPhone = reader.GetSafeString(indexer++);
            job.ContactEmail = reader.GetSafeString(indexer++);
            job.DateCreated = reader.GetSafeDateTime(indexer++);
            job.DateModified = reader.GetSafeDateTime(indexer++);
            return job;
        }
        private static void CommonParams(JobAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@OrganizationId", model.OrganizationId);
            col.AddWithValue("@JobTypeId", model.JobTypeId);
            col.AddWithValue("@LocationId", model.LocationId);
            col.AddWithValue("@Title", model.Title);
            col.AddWithValue("@Description", model.Description);
            col.AddWithValue("@Requirements", model.Requirements);
            col.AddWithValue("@IsActive", model.IsActive);
            col.AddWithValue("@ContactName", model.ContactName);
            col.AddWithValue("@ContactPhone", model.ContactPhone);
            col.AddWithValue("@ContactEmail", model.ContactEmail);
        }
        #endregion
    }
}

