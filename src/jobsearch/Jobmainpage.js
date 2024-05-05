import React, { useState, useEffect } from "react";
import "./Jpb.css";
// import axios from 'axios';
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    minExp: "",
    companyName: "",
    location: "",
    remote: "",
    jobRole: "",
    maxJdSalary: "",
    techStack:''
  });
  const [page, setPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const limit = 10;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const body = JSON.stringify({
          limit,
          offset: (page - 1) * limit,
        });

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body,
        };

        const response = await fetch(
          "https://api.weekday.technology/adhoc/getSampleJdJSON",
          requestOptions
        );
        const data = await response.json();
        if (page === 1) {
          setJobs(data.jdList || []);
          setTotalJobs(data.totalCount || 0);
        } else {
          // Append new jobs to existing list
          setJobs((prevJobs) => [...prevJobs, ...(data.jdList || [])]);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [page]);
//for this is filter function
  const handleFilterChange = (filterName, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };
  const filteredJobs = jobs.filter((job) => {
    return (
      ((job.minExp && job.minExp >= parseFloat(filters.minExp)) ||
        !filters.minExp) &&
      ((job.companyName &&
        job.companyName
          .toLowerCase()
          .includes(filters.companyName.toLowerCase())) ||
        !filters.companyName) &&
      ((job.location &&
        job.location.toLowerCase().includes(filters.location.toLowerCase())) ||
        !filters.location) &&
      ((filters.remote === "remote" &&
        job.location.toLowerCase() === "remote") ||
        (filters.remote === "onsite" &&
          job.location.toLowerCase() !== "remote") ||
        !filters.remote) &&
      ((job.jobRole &&
        job.jobRole.toLowerCase().includes(filters.jobRole.toLowerCase())) ||
        !filters.jobRole) &&
        ((job.jobRole &&
          job.jobRole.toLowerCase().includes(filters.techStack.toLowerCase())) ||
          !filters.techStack) &&
      ((job.maxJdSalary &&
        job.maxJdSalary >= parseFloat(filters.maxJdSalary)) ||
        !filters.maxJdSalary)
    );
  });
  // this is for loading on scroll
  const handleScroll = () => {
    const threshold = 100; // Adjust as needed
    const scrollTop =
      (document.documentElement && document.documentElement.scrollTop) ||
      document.body.scrollTop;
    const scrollHeight =
      (document.documentElement && document.documentElement.scrollHeight) ||
      document.body.scrollHeight;
    const windowHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;

    if (
      scrollHeight - scrollTop - windowHeight < threshold &&
      !loading &&
      jobs.length < totalJobs
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading, jobs, totalJobs]);

  return (
    <div className="main" style={{ alignItems: "center" }}>
      <div className="filter-inputs">
        <div className="input-box">
          <input
            type="text"
            placeholder="Min Experience"
            value={filters.minExp}
            onChange={(e) => handleFilterChange("minExp", e.target.value)}
          />
        </div>
        <div className="input-box-1">
          <input
            type="text"
            placeholder="Company Name"
            value={filters.companyName}
            onChange={(e) => handleFilterChange("companyName", e.target.value)}
          />
        </div>
        <div className="input-box-1">
          <input
            type="text"
            placeholder="Location"
            value={filters.location}
            onChange={(e) => handleFilterChange("location", e.target.value)}
          />
        </div>
        <div className="checkbox-wrapper-15">
          <input
            className="inp-cbx"
            id="cbx-remote"
            style={{ display: "none" }}
            type="checkbox"
            checked={filters.remote === "remote"}
            onChange={() =>
              handleFilterChange(
                "remote",
                filters.remote === "remote" ? "" : "remote"
              )
            }
          />
          <label className="cbx" htmlFor="cbx-remote">
            <span>
              <svg width="12px" height="9px" viewBox="0 0 12 9">
                <polyline points="1 5 4 8 11 1"></polyline>
              </svg>
            </span>
            <span>Remote</span>
          </label>
        </div>
        <div className="checkbox-wrapper-15">
          <input
            className="inp-cbx"
            id="cbx-onsite"
            style={{ display: "none" }}
            type="checkbox"
            checked={filters.remote === "onsite"}
            onChange={() =>
              handleFilterChange(
                "remote",
                filters.remote === "onsite" ? "" : "onsite"
              )
            }
          />
          <label className="cbx" htmlFor="cbx-onsite">
            <span>
              <svg width="12px" height="9px" viewBox="0 0 12 9">
                <polyline points="1 5 4 8 11 1"></polyline>
              </svg>
            </span>
            <span>On site</span>
          </label>
        </div>

        <div className="input-box-1">
          <input
            type="text"
            placeholder="Role"
            value={filters.jobRole}
            onChange={(e) => handleFilterChange("jobRole", e.target.value)}
          />
        </div>
        <div className="input-box-1">
          <input
            type="text"
            placeholder="Tech stack"
            value={filters.techStack}
            onChange={(e) => handleFilterChange("techStack", e.target.value)}
          />
        </div>
        <div className="input-box-1">
          <input
            type="text"
            placeholder="Min Base Pay"
            value={filters.maxJdSalary}
            onChange={(e) => handleFilterChange("maxJdSalary", e.target.value)}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {filteredJobs.map((job) => (
          <div key={job.jdUid} className="card_items">
            <Card
              className="card_items"
              sx={{
                maxWidth: 345,
                marginTop: 10,
                marginBottom: 2,
                boxShadow: "rgba(0, 0, 0, 0.25) 0px 1px 4px 0px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  paddingLeft: "10px",
                  paddingTop: "10px",
                }}
              >
                <div>
                  <img
                    style={{ width: "25px", marginRight: "5px" }}
                    src={job?.logoUrl}
                  />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#8b8b8b",
                    }}
                  >
                    {job?.companyName}
                  </div>
                  <div
                    style={{ fontSize: "14px", textTransform: "capitalize" }}
                  >
                    {job?.jobRole}
                  </div>
                  <div
                    style={{ fontSize: "13px", textTransform: "capitalize" }}
                  >
                    {job?.location}
                  </div>
                </div>
              </div>
              <p style={{ fontSize: "14px", margin: "0px 12px 0px" }}>
                Estimated Salary:{job?.maxJdSalary}
                {job?.salaryCurrencyCode}
              </p>
              <CardContent>
                <div style={{ position: "relative" }}>
                  <p>About company:</p>
                  <div>
                    <p
                      style={{
                        fontSize: "14px",
                        maskImage:
                          "linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255), rgba(255, 255, 255, 0))",
                        overflow: "hidden",
                      }}
                    >
                      {job?.jobDetailsFromCompany}
                    </p>
                    <div
                      className="view-more"
                      style={{
                        position: "absolute",
                        top: "260px",
                        textAlign: "center",
                        width: "100%",
                      }}
                    >
                      <Link to={`/JobDetails/${job.jdUid}`}>
                        <Button
                          size="small"
                          style={{
                            textAlign: "center",
                            alignItems: "center",
                            backgroundColor: "none",
                            color: "#4943da",
                            fontWeight: "500",
                            padding: "8px 18px",
                            marginTop: 10,
                          }}
                        >
                          View More
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#8b8b8b",
                  }}
                >
                  Minimum Experience
                </p>
                <p style={{ fontSize: "14px" }}>
                  {job?.minExp ? job?.minExp : "2"}
                </p>
              </CardContent>
              <CardActions>
                <Button
                  style={{
                    width: "100%",
                    backgroundColor: "rgb(85, 239, 196)",
                    color: "rgb(0, 0, 0)",
                    fontWeight: "500",
                    padding: "8px 18px",
                  }}
                  size="small"
                >
                  Easy Apply
                </Button>
              </CardActions>
            </Card>
          </div>
        ))}
      </div>
      {loading && <div style={{alignItems:'center',textAlign:'center'}}>Loading...</div>}
    </div>
  );
};

export default JobListings;
