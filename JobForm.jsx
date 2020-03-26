import React from "react";
import { FormGroup, Label, Button, Form, Container } from "reactstrap";
import { Formik, Field } from "formik";
import _logger from "sabio-debug";
import swal from "sweetalert";
import PropTypes from "prop-types";
import * as jobService from "../../services/jobsService";
import { jobValidationSchema } from './JobValidationSchema';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import { lookUp } from "../../services/lookUpService";
import "./Jobs.css";
import locationService from "../../services/locationService";

class JobForm extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            formData: {
                organizationId: null,
                jobTypeId: null,
                locationId: null,
                title: "",
                description: "",
                requirements: "",
                isActive: false,
                contactName: "",
                contactPhone: "",
                contactEmail: "",
                selectedLocation: {},
                selectedJob: {},
                selectedOrganization: {}
            },
            isEditing: false,
            initialValid: false
        };
    }

    componentDidMount() {
        this.getJobTypeOptions()
        const { id } = this.props.match.params;
        if (id) {
            const { state } = this.props.location;
            if (state) {
                this.setFormData(state)
            } else {
                jobService.getById(id)
                    .then(response => this.setFormData(response.item))
                    .catch(this.getByIdFail)
            }
        }
    }

    setFormData = job => {
        let organization = this.mapOrganizations(job.organization);
        let jobType = this.mapJobTypes(job.jobType);
        let address = this.mapLocation(job.location);
        this.setState((prevState) => {
            return {
                ...prevState,
                formData: {
                    ...job,
                    organizationId: job.organization.id,
                    jobTypeId: job.jobType.id,
                    locationId: job.location.id,
                    selectedOrganization: organization || {
                        label: "Please search for a organization...",
                        value: 0
                    },
                    selectedJob: jobType || {
                        label: "Please search for a job type...",
                        value: 0
                    },
                    selectedLocation: address || {
                        label: "Please search for a location...",
                        value: 0
                    }
                },
                isEditing: true,
                initialValid: true
            }
        });
    };

    getByIdFail = () => {
        _logger("Failed to get by id ....")
    }

    onSubmitForm = (formValues, { resetForm }) => {
        if (this.props.match.params.id) {
            jobService
                .update(this.props.match.params.id, formValues)
                .then(this.genericSubmitSuccess)
                .catch(this.genericSubmitError)
        } else {
            jobService
                .create(formValues)
                .then(this.genericSubmitSuccess)
                .catch(this.genericSubmitError)
        }

        resetForm(this.state.formData);
    };

    genericSubmitSuccess = () => {
        swal("Congratulations", "Submitted Successfully!", "success")
        setTimeout(() => {
            this.props.history.goBack();
        }, 500)
    }

    genericSubmitError = () => {
        swal("Error!", "Failed to submit!", "error")
    }

    handleOrganizationChange = (selectedOption, setFieldValue) => {
        setFieldValue("organizationId", selectedOption.value);
        setFieldValue("selectedOrganization", selectedOption);
    };

    loadOrganizationsOptions = (inputValue, callBack) => {
        new Promise(resolve => {
            resolve(this.callOrganization(inputValue, callBack));
        });
    }

    callOrganization = (inputValue, callBack) => {
        jobService
            .getOrganizations(inputValue)
            .then(response => this.getOrganizationsSuccess(response, callBack))
            .catch(this.getOrganizationsError);
    }

    getOrganizationsSuccess = (response, setOptions) => {
        let orgArray = response.item;
        setOptions(orgArray.map(this.mapOrganizations))
    }

    getOrganizationsError = (response, callBack) => {
        _logger(response, callBack)
    }

    mapOrganizations = orgObj => {
        let organization = null;
        if (orgObj.siteUrl) {
            organization = {
                label: orgObj.orgName,
                value: orgObj.id
            }
        } else {
            organization = {
                label: orgObj.name,
                value: orgObj.id
            }
        }
        return organization
    };

    getJobTypeOptions = () => {
        lookUp("JobTypes")
            .then(response => this.getJobTypesSuccess(response))
            .catch(this.getJobTypesError);
    }

    getJobTypesSuccess = (response) => {
        let jobTypeArray = response.items;
        let mappedJobTypes = jobTypeArray.map(this.mapJobTypes);
        this.setState({ jobTypeOptions: mappedJobTypes })
    }

    mapJobTypes = jobTypeObj => {
        let jobTypes = {
            label: jobTypeObj.name,
            values: jobTypeObj.id
        }
        return jobTypes;
    }

    getJobTypesError = response => {
        _logger(response);
    }

    handleJobTypeChange = (selectedOption, setFieldValue) => {
        setFieldValue("jobTypeId", selectedOption.values);
        setFieldValue("selectedJob", selectedOption);
    };

    loadLocationsOptions = (inputValue, callBack) => {
        new Promise(resolve => {
            resolve(this.callLocations(inputValue, callBack));
        });
    }

    callLocations = (inputValue, callBack) => {
        let pageIndex = 0;
        let pageSize = 20;
        locationService
            .search(inputValue, pageIndex, pageSize)
            .then(response => this.getLocationSuccess(response, callBack))
            .catch(this.getLocationError);
    }

    getLocationSuccess = (response, setOptions) => {
        let locationArr = response.item.pagedItems;
        setOptions(locationArr.map(this.mapLocation))
    }

    mapLocation = locationObj => {
        let location
        if (locationObj.state) {
            location = {
                label: `${locationObj.lineOne}, ${locationObj.city}, ${locationObj.state.stateProvinceCode} ${locationObj.zip}`,
                value: locationObj.id
            }
        } else {
            location = {
                label: `${locationObj.lineOne}, ${locationObj.city}, ${locationObj.stateName} ${locationObj.zip}`,
                value: locationObj.id
            }
        }
        return location;
    }

    getLocationError = response => {
        _logger(response)
    }

    handleLocationChange = (selectedOption, setFieldValue) => {
        setFieldValue("locationId", selectedOption.value)
        setFieldValue("selectedLocation", selectedOption);
    }

    contactCheck = contactInfo => contactInfo === "" ? "Not Provided" : contactInfo;

    maxParagraphLength = paragraph => paragraph.length > 100 ? paragraph.slice(0, 100) + "..." : paragraph;

    render() {
        return (
            <div className="m-4">
                {this.state.isEditing
                    ? <h1 className="text-center p-3">Modify</h1>
                    : <h1 className="text-center p-3">Create</h1>
                }
                <Formik
                    enableReinitialize={true}
                    validationSchema={jobValidationSchema}
                    initialValues={this.state.formData}
                    onSubmit={this.onSubmitForm}
                    isInitialValid={this.state.initialValid}
                >
                    {props => {
                        const {
                            values,
                            handleSubmit,
                            setFieldValue,
                            touched,
                            errors,
                            isValid,
                            isSubmitting
                        } = props;
                        return (
                            <Form onSubmit={handleSubmit} className="card col-lg-12 col-12 p-4 ml-auto mr-auto shadowStyle" >
                                <div className="row">
                                    <div className="card d-lg-flex col-6 formPreviewCard" >
                                        <div className="card shadowStyle col-4 cardFixed">
                                            <div className="text-center pt-4 lead text-bold"><u>
                                                {values.title}</u>
                                            </div>
                                            <div className="m-1"><strong>Organization:</strong> {values.selectedOrganization.label}</div>
                                            <div className="m-1"><strong>Job Type:</strong> {values.selectedJob.label}</div>
                                            <div className="m-1"><strong>Location:</strong> {values.selectedLocation.label}</div>
                                            <div className="m-2 card-text" ><strong>Description:</strong>  {this.maxParagraphLength(values.description)}</div>
                                            <div className="m-2 card-text" ><strong>Requirements:</strong>  {this.maxParagraphLength(values.requirements)}</div>
                                            <div className="m-1"><strong>Contact Person:</strong> {values.contactName}</div>
                                            <div className="m-1"><strong>Phone:</strong> {this.contactCheck(values.contactPhone)}</div>
                                            <div className="m-1 pb-2"><strong>E-mail:</strong> {this.contactCheck(values.contactEmail)}</div>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="text-center text-muted pb-2">Tip: Required fields are marked with <span className="text-danger">*</span></div>
                                        <FormGroup>
                                            <Label className="labelStyle">Organization <span className="text-danger">*</span></Label>
                                            <AsyncSelect
                                                value={values.selectedOrganization}
                                                loadOptions={this.loadOrganizationsOptions}
                                                cacheOptions
                                                onChange={selectedOption =>
                                                    this.handleOrganizationChange(selectedOption, setFieldValue)
                                                }
                                                className={
                                                    errors.organizationId && touched.organizationId
                                                        ? "error"
                                                        : ""
                                                }
                                            />
                                            {errors.organizationId && touched.organizationId && (
                                                <span className="input-feedback text-danger">{errors.organizationId}</span>
                                            )}
                                        </FormGroup>
                                        <FormGroup>
                                            <Label className="labelStyle">Job type <span className="text-danger">*</span></Label>
                                            <Select
                                                value={values.selectedJob}
                                                isSearchable={false}
                                                options={this.state.jobTypeOptions}
                                                onChange={selectedOption =>
                                                    this.handleJobTypeChange(selectedOption, setFieldValue)
                                                }
                                                className={
                                                    errors.jobTypeId && touched.jobTypeId
                                                        ? "error"
                                                        : ""
                                                }
                                            />
                                            {errors.jobTypeId && touched.jobTypeId && (
                                                <span className="input-feedback text-danger">{errors.jobTypeId}</span>
                                            )}
                                        </FormGroup>
                                        <FormGroup>
                                            <Label className="labelStyle">Location <span className="text-danger">*</span></Label>
                                            <AsyncSelect
                                                value={values.selectedLocation}
                                                loadOptions={this.loadLocationsOptions}
                                                cacheOptions
                                                onChange={option => this.handleLocationChange(option, setFieldValue)}
                                                className={
                                                    errors.locationId && touched.locationId
                                                        ? "error"
                                                        : ""
                                                }
                                            />
                                            {errors.locationId && touched.locationId && (
                                                <span className="input-feedback text-danger">{errors.locationId}</span>
                                            )}
                                        </FormGroup>
                                        <FormGroup>
                                            <Label className="labelStyle">Title <span className="text-danger">*</span></Label>
                                            <Field
                                                name="title"
                                                type="text"
                                                placeholder="Software Engineer"
                                                autoComplete="title"
                                                className={
                                                    errors.title && touched.title
                                                        ? "form-control error"
                                                        : "form-control"
                                                }
                                            />
                                            {errors.title && touched.title && (
                                                <span className="input-feedback text-danger">{errors.title}</span>
                                            )}
                                        </FormGroup>
                                        <FormGroup>
                                            <Label className="labelStyle">Description <span className="text-danger">*</span></Label>
                                            <Field
                                                name="description"
                                                component="textarea"
                                                placeholder="Description of this position."
                                                autoComplete="off"
                                                className={
                                                    errors.description && touched.description
                                                        ? "form-control error textArea"
                                                        : "form-control textArea"
                                                }
                                            />
                                            {errors.description && touched.description && (
                                                <span className="input-feedback text-danger">{errors.description}</span>
                                            )}
                                        </FormGroup>
                                        <FormGroup>
                                            <Label className="labelStyle">Requirements <span className="text-danger">*</span></Label>
                                            <Field
                                                name="requirements"
                                                component="textarea"
                                                placeholder="Requirements to be considered for this position."
                                                autoComplete="off"
                                                className={
                                                    errors.requirements && touched.requirements
                                                        ? "form-control error textArea"
                                                        : "form-control textArea"
                                                }
                                            />
                                            {errors.requirements && touched.requirements && (
                                                <span className="input-feedback text-danger">{errors.requirements}</span>
                                            )}
                                        </FormGroup>
                                        <FormGroup>
                                            <Label className="labelStyle">Contact Person <span className="text-danger">*</span></Label>
                                            <Field
                                                name="contactName"
                                                type="text"
                                                placeholder="John Smith"
                                                autoComplete="off"
                                                className={
                                                    errors.contactName && touched.contactName
                                                        ? "form-control error"
                                                        : "form-control"
                                                }
                                            />
                                            {errors.contactName && touched.contactName && (
                                                <span className="input-feedback text-danger">{errors.contactName}</span>
                                            )}
                                        </FormGroup>
                                        <FormGroup>
                                            <Label className="labelStyle">Contact Number</Label>
                                            <Field
                                                name="contactPhone"
                                                type="text"
                                                placeholder="321-456-7890"
                                                autoComplete="off"
                                                className={
                                                    errors.contactPhone && touched.contactPhone
                                                        ? "form-control error"
                                                        : "form-control"
                                                }
                                            />
                                            {errors.contactPhone && touched.contactPhone && (
                                                <span className="input-feedback text-danger">{errors.contactPhone}</span>
                                            )}
                                        </FormGroup>
                                        <FormGroup>
                                            <Label className="labelStyle">Contact E-mail</Label>
                                            <Field
                                                name="contactEmail"
                                                type="email"
                                                placeholder="john.smith@email.com"
                                                autoComplete="off"
                                                className={
                                                    errors.contactEmail && touched.contactEmail
                                                        ? "form-control error"
                                                        : "form-control"
                                                }
                                            />
                                            {errors.contactEmail && touched.contactEmail && (
                                                <span className="input-feedback text-danger">{errors.contactEmail}</span>
                                            )}
                                        </FormGroup>
                                        <FormGroup className="text-center">
                                            <Label className="labelStyle">Is Active?</Label>
                                            <div>
                                                <Field
                                                    name="isActive"
                                                    type="checkbox"
                                                    component="input"
                                                    checked={values.isActive}
                                                />
                                            </div>
                                        </FormGroup>
                                        <Container className="d-flex ml-auto">
                                            <Button
                                                type="reset"
                                                onClick={this.props.history.goBack}
                                                className="mr-auto bg-danger">
                                                Cancel </Button>
                                            <Button
                                                type="submit"
                                                className="bg-success"
                                                disabled={!isValid || isSubmitting}>
                                                Submit </Button>
                                        </Container>
                                    </div>
                                </div>
                            </Form>)
                    }}
                </Formik >
            </div>
        );
    }
}

JobForm.propTypes = {
    formData: PropTypes.shape({
        id: PropTypes.number,
        organizationId: PropTypes.number.isRequired,
        jobTypeId: PropTypes.number.isRequired,
        locationId: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        requirements: PropTypes.string.isRequired,
        isActive: PropTypes.bool,
        contactName: PropTypes.string.isRequired,
        contactPhone: PropTypes.string.isRequired,
        contactEmail: PropTypes.string.isRequired
    }),
    history: PropTypes.shape({
        push: PropTypes.func,
        goBack: PropTypes.func
    }),
    location: PropTypes.shape({
        state: PropTypes.shape({
            id: PropTypes.number,
            organization: PropTypes.shape({
                id: PropTypes.number,
                orgName: PropTypes.string,
                siteUrl: PropTypes.string,
                logo: PropTypes.string
            }),
            jobType: PropTypes.shape({
                id: PropTypes.number,
                orgName: PropTypes.string,
                siteUrl: PropTypes.string,
                logo: PropTypes.string
            }),
            location: PropTypes.shape({

            }),
            locationId: PropTypes.number,
            title: PropTypes.string,
            description: PropTypes.string,
            requirements: PropTypes.string,
            isActive: PropTypes.bool,
            contactName: PropTypes.string,
            contactPhone: PropTypes.string,
            contactEmail: PropTypes.string
        })
    }),
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.string
        })
    })
}

export default JobForm;