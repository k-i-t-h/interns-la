import React from "react";
import { Card, CardTitle, CardBody, CardText, Container } from "reactstrap";
import PropTypes from 'prop-types';
import "./Jobs.css";
import { FaEdit, FaTrashAlt, FaInfoCircle } from "react-icons/fa"
import Moment from 'react-moment';

const JobCard = (props) => {
    const showDetails = () => props.handleDetails(props.jobData);
    const deleteCard = () => props.handleDelete(props.jobData.id);
    const editCard = () => props.handleEdit(props.jobData);
    const goToLogin = () => props.handleGoToLogin(props.jobData);
    const handleApply = () => props.handleApply(props.jobData);
    const hasApplied = id => {
        const jobs = [...props.hasApplied];
        return jobs.includes(id);
    }
    return (
        <Container className="p-1">
            <Card className="cardStyle shadowStyle">
                <CardTitle className="text-center pt-4  lead text-bold"><u>{props.jobData.title}</u></CardTitle>
                <img alt="logo" className="cardImg mt-1 mb-1" src={props.jobData.organization.logo} />
                <CardBody>
                    <CardText className="m-1 p-0"><strong>Organization:</strong> {props.jobData.organization.orgName}</CardText>
                    <CardText className="m-1 p-0"><strong>Location:</strong> {`${props.jobData.location.city}, ${props.jobData.location.stateName} ${props.jobData.location.zip}`}</CardText>
                    <CardText className="m-1 p-0"><strong>Date Posted:</strong> <Moment format="MMMM DD, YYYY">{props.jobData.dateCreated}</Moment></CardText>
                </CardBody>
                <div className="d-flex">
                    <button
                        type="button"
                        className="mr-auto btn btn-job btn-create"
                        data-toggle="tooltip" data-placement="bottom" title="More Details"
                        onClick={showDetails} >
                        <FaInfoCircle />
                    </button>

                    {props.currentUser.isLoggedIn && props.currentUser.roles[0] !== "Seeker"
                        ? <button
                            type="button"
                            className="btn btn-job btn-create"
                            onClick={editCard}
                            data-toggle="tooltip" data-placement="bottom" title="Edit">
                            <FaEdit />
                        </button>
                        : null
                    }
                    {
                        !props.currentUser.isLoggedIn
                            ? <button
                                type="button"
                                className="btn btn-success m-1 font-weight-bold"
                                onClick={goToLogin}> {"Apply Now!"}
                            </button>
                            : props.currentUser.roles[0] === "Seeker"
                                ? hasApplied(props.jobData.id)
                                    ? null
                                    : <button
                                        type="button"
                                        className={`btn m-3 bg-success`}
                                        onClick={handleApply}>{"Quick Apply"}
                                    </button>
                                : <button
                                    type="button"
                                    className="btn btn-job btn-delete"
                                    onClick={deleteCard}>
                                    <FaTrashAlt />
                                </button>
                    }
                </div>
            </Card>
        </Container>
    )
}

JobCard.propTypes = {
    hasApplied: PropTypes.arrayOf(PropTypes.number),
    jobData: PropTypes.shape({
        id: PropTypes.number.isRequired,
        organization: PropTypes.shape({
            orgName: PropTypes.string.isRequired,
            siteUrl: PropTypes.string.isRequired,
            logo: PropTypes.string.isRequired
        }),
        location: PropTypes.shape({
            zip: PropTypes.string.isRequired,
            city: PropTypes.string.isRequired,
            stateName: PropTypes.string.isRequired
        }),
        title: PropTypes.string.isRequired,
        dateCreated: PropTypes.string.isRequired,
        dateModified: PropTypes.string.isRequired
    }),
    currentUser: PropTypes.shape({
        roles: PropTypes.array,
        userName: PropTypes.string,
        email: PropTypes.string,
        isLoggedIn: PropTypes.bool
    }),
    handleDetails: PropTypes.func,
    handleDelete: PropTypes.func,
    handleEdit: PropTypes.func,
    handleQuickApply: PropTypes.func,
    handleGoToLogin: PropTypes.func,
    handleApply: PropTypes.func,
    isApplying: PropTypes.shape({
        jobPostId: PropTypes.number
    })
}

export default JobCard
