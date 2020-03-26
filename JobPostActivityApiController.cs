using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models.Domain;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/quickapply")]
    [ApiController]
    public class JobPostActivityApiController : BaseApiController
    {
        private IJobPostActivityService _service = null;
        private IAuthenticationService<int> _authService = null;

        public JobPostActivityApiController(IJobPostActivityService service,
            ILogger<JobPostActivityApiController> logger,
            IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpGet("{userId:int}")]
        public ActionResult<ItemResponse<List<JobPostActivity>>> GetQuickApply(int UserId)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                List<JobPostActivity> quickApply = _service.GetJobPostActivities(UserId);

                if (quickApply == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found!");
                }
                else
                {
                    response = new ItemResponse<List<JobPostActivity>> { Item = quickApply };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);
        }

        [HttpPost]
        public ActionResult<SuccessResponse> Insert(int jobPostId)
        {
            int Code = 200;
            BaseResponse response = null;
            try
            {
                int UserId = _authService.GetCurrentUserId();
                _service.Insert(UserId, jobPostId);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                Code = 500;
                response = new ErrorResponse(ex.Message);
            }
            return StatusCode(Code, response);
        }

    }
}