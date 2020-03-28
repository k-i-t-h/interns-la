import axios from "axios";
import * as serviceHelper from "./serviceHelpers";
const locationEndPoint = serviceHelper.API_HOST_PREFIX + "/api/locations";
const rootEndPoint = serviceHelper.API_HOST_PREFIX + "/api/jobs";

const paginate = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: rootEndPoint + `/paginate?pageindex=${pageIndex}&pagesize=${pageSize}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" }
  };

  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

const getById = jobId => {
  const config = {
    method: "GET",
    url: rootEndPoint + "/" + jobId,
    crossdomain: true,
    headers: { "Content-Type": "application/json" }
  };

  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

const getCurrent = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: rootEndPoint + `/current?&pageindex=${pageIndex}&pagesize=${pageSize}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" }
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

const getByOrgId = (orgId, pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url:
      rootEndPoint +
      `/organization/${orgId}?pageindex=${pageIndex}&pagesize=${pageSize}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" }
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

const create = formData => {
  const config = {
    method: "POST",
    url: rootEndPoint + "/new",
    data: formData,
    crossdomain: true,
    headers: { "Content-Type": "application/json" }
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

const update = (jobId, formData) => {
  const config = {
    method: "PUT",
    url: rootEndPoint + "/" + jobId + "/edit",
    data: formData,
    crossdomain: true,
    headers: { "Content-Type": "application/json" }
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

const deleteById = jobId => {
  const config = {
    method: "PUT",
    url: rootEndPoint + "/" + jobId + "/delete",
    crossdomain: true,
    headers: { "Content-Type": "application/json" }
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .then(() => jobId)
    .catch(serviceHelper.onGlobalError);
};

const search = (userInput, pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url:
      rootEndPoint +
      `/search?pageindex=${pageIndex}&pagesize=${pageSize}&search=${userInput}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" }
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

const getByOrgIdSearch = (orgId, pageIndex, pageSize, userInput) => {
  const config = {
    method: "GET",
    url:
      rootEndPoint +
      `/organization/${orgId}/search?pageindex=${pageIndex}&pagesize=${pageSize}&search=${userInput}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" }
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

const getOrganizations = inputValue => {
  const config = {
    method: "GET",
    url:
      rootEndPoint +
      `/organizations?pageindex=0&pagesize=10&search=${inputValue}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" }
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

const getLocationById = id => {
  const config = {
    method: "GET",
    url: locationEndPoint + "/" + id,
    crossdomain: true,
    headers: { "Content-Type": "application/json" }
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

export {
  paginate,
  getById,
  getCurrent,
  create,
  update,
  deleteById,
  search,
  getOrganizations,
  getLocationById,
  getByOrgId,
  getByOrgIdSearch
};
