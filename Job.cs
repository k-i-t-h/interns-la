using Sabio.Models.Domain.LookUp;
using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Domain
{
   public class Job
    {
        public int Id { get; set; }
        public OrganizationSelect Organization { get; set; }
        public TwoColumn JobType { get; set; }
        public LocationInfo Location { get; set; }
        public UserProfile CreatedBy { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Requirements { get; set; }
        public bool IsActive { get; set; }
        public string ContactName { get; set; }
        public string ContactPhone { get; set; }
        public string ContactEmail { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
    }
}
