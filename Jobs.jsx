import React from "react";
import logger from "sabio-debug";
import * as jobsService from "../../services/jobsService";
import { Col, Row, Button } from "reactstrap";
import JobCard from "./JobCard";
import Pagination from "rc-pagination";
import localeInfo from "rc-pagination/lib/locale/en_US";
import "rc-pagination/assets/index.css";
import PropTypes from "prop-types";
import "./Jobs.css";
import swal from "sweetalert";
import Search from "../utility/Search";
import * as jobPostActivity from "../../services/jobPostActivityService";
const _logger = logger.extend("Jobs")

class Jobs extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            jobs: [],
            jobsList: [],
            isSearching: false,
            search: "",
            hasApplied: [],
            pagination: {
                current: 1,
                totalCount: 0,
                pageSize: 6
            }
        }
    }

    componentDidMount() {

        if (this.props.currentUser.id) {
            jobPostActivity
                .getApplyById(this.props.currentUser.id)
                .then(result => this.getApplyByIdSuccess(result))
                .catch(this.getApplyByIdError);
        }

    }

    jobsGetAll = (pageIndex, pageSize) => {
        jobsService
            .paginate(pageIndex, pageSize)
            .then(this.jobsGetAllSuccess)
            .catch(this.jobsGetAllError);
    }

    getApplyByIdSuccess = response => {
        this.jobsGetAll(
            this.state.pagination.current - 1,
            this.state.pagination.pageSize
        );
        let appliedArr = response.item
        let appliedArrId = appliedArr.map(applied => applied.jobPostId)
        this.setState({ hasApplied: appliedArrId });
    }

    getApplyByIdError = () => {
        _logger("((getApplyByIdError))")
    }

    jobsGetAllSuccess = response => {
        const jobs = response.item.pagedItems;
        const jobsList = jobs.map(this.mapJob)
        let pagination = {
            current: response.item.pageIndex + 1,
            totalCount: response.item.totalCount,
            pageSize: 6,
        };

        this.setState(prevState => {
            return {
                ...prevState,
                jobs,
                jobsList,
                pagination
            };
        });
    }

    resetState = () => {
        this.setState(prevState => {
            return {
                ...prevState,
                jobs: [],
                jobsList: [],
                pagination: {
                    current: 1,
                    totalCount: 0,
                    pageSize: 6
                }
            };
        });
    };

    jobsGetAllError = () => {
        _logger("failed to load jobs")
        this.resetState();
    }

    handleDeleteModal = id => {
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this post!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    this.handleDeleteConfirmed(id);
                }
            });
    }

    handleDeleteConfirmed = id => {
        jobsService
            .deleteById(id)
            .then(this.handleDeleteSuccess(id))
            .catch(this.handleDeleteError)
    }

    handleDeleteSuccess = jobId => {
        this.setState({ jobsList: this.state.jobsList.filter(job => job.id !== jobId) })
        swal("Success", "Opening successfully deleted!", "success");
    }

    handleDeleteError = () => {
        swal("Failed to delete", "Please try again!", "error");
    }

    handleCreate = () => {
        this.props.history.push(
            `/job/new`
        );
    }

    handleEdit = job => {
        this.props.history.push(
            `/job/${job.id}/edit/`,
            job
        );
    }

    handleDetails = job => {
        this.props.history.push(
            `/organization/${job.organization.id}/job/${job.id}/details`,
            job
        );
    }

    handleGoToLogin = () => {
        swal(
            "Would you like to log-in?",
            "To apply for this posting you need to be logged-in",
            "info",
            {
                buttons: ["Cancel", "Log-in"]
            }
        ).then(value => {
            if (value) {
                this.props.history.push("/");
            }
        });
    }

    handleApply = jobPost => {
        _logger(jobPost.id, "job post id")
        jobPostActivity
            .add(jobPost.id)
            .then(this.handleApplySuccess)
            .catch(this.handleApplyError)
    }

    handleApplySuccess = () => {
        _logger("((handleApplySuccess))")
    }

    handleApplyError = () => {
        _logger("((handleApplyError))")
    }

    mapJob = job => (
        <Col className="col-xl-4 col-lg-6 col-md-12 col-12" key={job.id}>
            <JobCard
                currentUser={this.props.currentUser}
                jobData={job}
                handleGoToLogin={this.handleGoToLogin}
                handleApply={this.handleApply}
                handleDetails={this.handleDetails}
                handleDelete={this.handleDeleteModal}
                handleEdit={this.handleEdit}
                hasApplied={this.state.hasApplied}
            />
        </Col>
    )

    handleSearch = e => {
        this.setState(prevState => {
            return { ...prevState, search: e };
        });
        const data = e;
        const page = this.state.pagination;
        this.handleSearching(data, page.current, page.pageSize);
    };

    handleSearching = (searchStr, pageIndex, pageSize) => {
        jobsService
            .search(searchStr, pageIndex - 1, pageSize)
            .then(this.searchSuccess)
            .catch(this.searchError);
    };

    searchSuccess = res => {
        _logger("searchSuccess", res);
        this.jobsGetAllSuccess(res);
    };


    searchError = () => {
        _logger("search error is firing");
        this.resetState();
    };

    onNextPage = page => {
        if (this.state.search && this.state.search.length > 0) {
            this.handleSearching(
                this.state.search,
                page,
                this.state.pagination.pageSize
            );
        } else {
            this.setState(
                prevState => {
                    return {
                        ...prevState,
                        pagination: {
                            ...prevState.pagination,
                            current: page - 1
                        }
                    };
                },
                () => this.jobsGetAll(page - 1, this.state.pagination.pageSize)
            );
        }
    };

    resetSearch = () => {
        this.setState({ search: "", isSearching: false }, () =>
            this.jobsGetAll(0, this.state.pagination.pageSize)
        );
    };

    render() {
        return (
            <React.Fragment>
                <span className="d-flex p-4" >
                    {!this.props.currentUser.isLoggedIn || this.props.currentUser.roles[0] === "Seeker" ?
                        null : <Button
                            className="bg-success"
                            onClick={this.handleCreate}>+ New Opening
                     </Button>}
                    <span className="searchBar">
                        <Search
                            getAllPaginated={this.jobsGetAll}
                            searchBtnClick={this.handleSearch}
                            updateSearchQuery={this.resetSearch}
                            searchQuery={this.state.search}
                            isSearching={this.state.isSearching}
                        />
                    </span>
                </span>
                <Row className="p-4">
                    {this.state.jobsList}
                </Row>
                <span className="d-flex">
                    <Pagination
                        className="customPaginate ml-auto mr-auto"
                        onChange={this.onNextPage}
                        current={this.state.pagination.current}
                        pageSize={this.state.pagination.pageSize}
                        total={this.state.pagination.totalCount}
                        localeInfo={localeInfo}
                    />
                </span>
            </React.Fragment >
        )
    }
}
Jobs.propTypes = {
    history: PropTypes.shape({
        push: PropTypes.func.isRequired
    }),
    currentUser: PropTypes.shape({
        id: PropTypes.number,
        roles: PropTypes.array,
        userName: PropTypes.string,
        email: PropTypes.string,
        isLoggedIn: PropTypes.bool
    }),
};
export default Jobs;
