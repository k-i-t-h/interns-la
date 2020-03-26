using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Requests.Jobs;
using Sabio.Services;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/jobs")]
    [ApiController]
    public class JobApiController : BaseApiController
    {
        private IJobService _service = null;
        private IAuthenticationService<int> _authService = null;
        public JobApiController(IJobService service,
            ILogger<JobApiController> logger,
            IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpPost("new")]
        public ActionResult<ItemResponse<int>> Create(JobAddRequest model)
        {
            int userId = _authService.GetCurrentUserId();

            int code = 200;
            BaseResponse response = null;

            try
            {
                int id = _service.Add(model, userId);
                response = new ItemResponse<int> { Item = id };
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse($"Exeption: {ex.Message}");
            }

            return StatusCode(code, response);
        }
        
        [AllowAnonymous]
        [HttpGet("organizations")]
        public ActionResult<ItemResponse<List<OrganizationSelect>>> GetOrganizations(string search, int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                List<OrganizationSelect> organization = _service.GetOrganizations(search, pageIndex, pageSize);

                if (organization == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found!");
                }
                else
                {
                    response = new ItemResponse<List<OrganizationSelect>> { Item = organization };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse($"Exception Error: {ex.Message}");
            }


            return StatusCode(code, response);
        }

        [AllowAnonymous]
        [HttpGet("paginate")]
        public ActionResult<ItemResponse<Paged<Job>>> Paginate(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<Job> page = _service.Paginate(pageIndex, pageSize);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Job>> { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(code, response);
        }
        [AllowAnonymous]
        [HttpGet("{id:int}")]
        public ActionResult<ItemResponse<Job>> Get(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Job job = _service.Get(id);

                if (job == null)
                {
                    code = 404;
                    response = new ErrorResponse("Resource not found!");
                }
                else
                {
                    response = new ItemResponse<Job> { Item = job };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse($"Generic Error: ${ ex.Message }");
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }
        [AllowAnonymous]
        [HttpGet("search")]
        public ActionResult<ItemResponse<Paged<Job>>> Search(string search, int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<Job> page = _service.Search(search, pageIndex, pageSize);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Job>> { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }

        [HttpGet("current")]
        public ActionResult<ItemResponse<Paged<Job>>> GetPagedCreatedBy(int pageIndex, int pageSize)
        {
            int createdBy = _authService.GetCurrentUserId();

            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<Job> page = _service.GetByCurrent(createdBy, pageIndex, pageSize);

                if (page == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<Job>> { Item = page };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }


            return StatusCode(code, response);
        }

        [HttpPut("{id:int}/edit")]
        public ActionResult<SuccessResponse> Update(JobUpdateRequest model)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                _service.Update(model);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                response = new ErrorResponse($"Exception: ${ex.Message}");
            }

            return StatusCode(code, response);
        }

        [HttpPut("{id:int}/delete")]
        public ActionResult<SuccessResponse> Delete(int id)
        {

            int code = 200;
            BaseResponse response = null;

            try
            {
                _service.Delete(id);

                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }
    }
}
