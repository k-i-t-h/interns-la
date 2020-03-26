import React from "react";
import PropTypes from "prop-types";
import {
    Card,
    CardTitle,
    CardBody,
    CardText,
    Container,
    Button
} from "reactstrap";
import "./Jobs.css";
import swal from 'sweetalert';
import Moment from 'react-moment';
import logger from "sabio-debug";
const _logger = logger.extend("JobDetails");

const JobDetails = props => {
    var job = props.location.state;

    const isNotProvided = contactInfo => contactInfo === "" ? "Not Provided" : contactInfo;

    const handleDelete = id => _logger("deleting..." + id)

    const handleGoToLogin = () => {
        swal(
            "Would you like to log-in?",
            "To apply for this posting you need to be logged-in",
            "info",
            {
                buttons: ["Cancel", "Log-in"]
            }
        ).then(value => {
            if (value) {
                props.history.push("/");
            }
        });
    }

    const handleEdit = () => {
        props.history.push(
            `/job/${job.id}/edit/`,
            job
        );
    }

    return (
        <Container className="col-lg-9 col-sm-12 p-1 ml-auto mr-auto">
            <Card className="m-3 shadowStyle">
                <span className="d-flex mt-5 ml-5 mr-5">
                    <CardTitle className="lead text-bold"><u>{job.title}</u></CardTitle>
                    <img className="showMoreCardImg ml-auto" src={job.organization.logo} alt={job.id} />
                </span>
                <CardBody>
                    <CardText className="m-3"><strong>Company:</strong> {job.organization.orgName}</CardText>
                    <CardText className="m-3"><strong>Job type:</strong> {job.jobType.name}</CardText>
                    <CardText className="m-3"><strong>Location:</strong> {`${job.location.lineOne}, ${job.location.city} ${job.location.stateName} ${job.location.zip}`}</CardText>
                    <CardText className="m-3"><strong>Description:</strong> {job.description}</CardText>
                    <CardText className="m-3"><strong>Requirements:</strong> {job.requirements}</CardText>
                    <CardText className="m-3"><strong>Is Active:</strong> {job.isActive.toString()}</CardText>
                    <CardText className="m-3"><strong>Contact Person:</strong> {job.contactName}</CardText>
                    <CardText className="m-3"><strong>Phone:</strong> {isNotProvided(job.contactPhone)}</CardText>
                    <CardText className="m-3"><strong>E-mail:</strong> {isNotProvided(job.contactEmail)}</CardText>
                    <div className="d-flex small text-muted m-3">
                        <div className="mr-auto">Date Posted: <Moment format="MMMM DD, YYYY">{job.dateCreated}</Moment></div>
                        <div>Date Modified: <Moment format="MMMM DD, YYYY">{job.dateModified}</Moment></div>
                    </div>
                </CardBody>
                <div className="d-flex m-3">
                    <Button className="mr-auto bg-gray" onClick={props.history.goBack} data-toggle="tooltip" data-placement="bottom" title="Back"><i className="fas fa-arrow-left"></i></Button>
                    {!props.currentUser.isLoggedIn
                        ? null
                        : props.currentUser.roles[0] === "Seeker"
                            ? null
                            : <Button className="mr-auto bg-warning" onClick={handleEdit}>Edit</Button>}
                    {!props.currentUser.isLoggedIn
                        ? <Button className="bg-success" onClick={handleGoToLogin} >Apply Now!</Button>
                        : props.currentUser.roles[0] === "Seeker"
                            ? null
                            : <Button className="bg-danger" onClick={handleDelete} >Delete</Button>}
                </div>
            </Card>
        </Container>
    )
}

JobDetails.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func,
        goBack: PropTypes.func
    }),
    currentUser: PropTypes.shape({
        roles: PropTypes.array,
        userName: PropTypes.string,
        email: PropTypes.string,
        isLoggedIn: PropTypes.bool
    }),
    location: PropTypes.shape({
        state: PropTypes.shape({
            id: PropTypes.number,
            organization: PropTypes.shape({
                orgName: PropTypes.string,
                siteUrl: PropTypes.string,
                logo: PropTypes.string
            }),
            jobType: PropTypes.shape({
                name: PropTypes.string
            }),
            location: PropTypes.shape({
                lineOne: PropTypes.string,
                lineTwo: PropTypes.string,
                zip: PropTypes.string,
                stateName: PropTypes.string,
                city: PropTypes.string
            }),
            title: PropTypes.string,
            description: PropTypes.string,
            requirements: PropTypes.string,
            isActive: PropTypes.bool,
            contactName: PropTypes.string,
            contactPhone: PropTypes.string,
            contactEmail: PropTypes.string,
            dateCreated: PropTypes.string,
            dateModified: PropTypes.string
        })
    })
};
export default JobDetails;
