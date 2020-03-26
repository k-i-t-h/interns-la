using System;
using System.Collections.Generic;
using System.Text;

namespace Sabio.Models.Domain
{
    public class JobPostActivity
    {
        public int UserId { get; set; }
        public int JobPostId { get; set; }
        public DateTime ApplyDate { get; set; }
    }
}
