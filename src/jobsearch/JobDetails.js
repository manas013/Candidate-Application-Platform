import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";

const JobDetails = () => {
  const params = useParams();
  const [jobDetails, setJobDetails] = useState([]);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const body = JSON.stringify({
          id: params.id, // Use the provided job ID
          limit: 200,
          offset: 0,
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
        // console.log(data.jdList)
        const k = data.jdList.filter((e) => e.jdUid === params.id); //this for filter the particular data
        setJobDetails(k);
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };

    // Fetch job details only if jobId is available
    if (params.id) {
      fetchJobDetails();
    }
  }, [params.id]);

  if (!jobDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {jobDetails.map((job) => (
        <div key={job.jdUid}>
          <Card
            sx={{
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
                  style={{ width: "55px", marginRight: "5px" }}
                  src={job?.logoUrl}
                />
              </div>
            </div>
            <CardContent>
              <p style={{ textTransform: "capitalize" }}>
                <strong>Role: </strong>
                {job?.jobRole}
              </p>
              <ul>
                <li>
                  Salary: {job?.maxJdSalary}
                  {job?.salaryCurrencyCode}
                </li>
                <li>Experience: {job?.minExp}</li>
                <li style={{ textTransform: "capitalize" }}>
                  Location: {job?.location}
                </li>
                <li>Type: Full-Time</li>
              </ul>
              <h2 style={{ fontSize: "1.25rem" }}>About company:</h2>
              <div>
                <p style={{ fontSize: "14px" }}>{job?.jobDetailsFromCompany}</p>
              </div>
              <p style={{ fontSize: "14px", fontWeight: "bold" }}>
                JobDetails link: <a href={job?.jdLink}>{job?.jdLink}</a>
              </p>
            </CardContent>
            <CardActions>
              <Button
                style={{
                  width: "100%",
                  backgroundColor: "rgb(24, 118, 210)",
                  color: "#fff",
                  fontWeight: "500",
                  padding: "8px 18px",
                  borderRadius: "10px",
                }}
                size="small"
              >
                Apply For This Job
              </Button>
            </CardActions>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default JobDetails;
