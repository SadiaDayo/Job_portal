import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, Button, Badge, Row, Col, Container, Modal } from 'react-bootstrap';

const API_URL = process.env.REACT_APP_API_URL;

/* ---------- Date Helpers ---------- */
function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function daysLeft(dateStr) {
  if (!dateStr) return null;
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/* ---------- Main Component ---------- */
function JobList() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/jobs`) // use full API URL
      .then((res) => {
        // ensure jobs is always an array
        if (Array.isArray(res.data)) {
          setJobs(res.data);
        } else if (Array.isArray(res.data.jobs)) {
          setJobs(res.data.jobs);
        } else {
          setJobs([]);
        }
      })
      .catch((err) => {
        console.error('Error fetching jobs:', err);
        setJobs([]);
      });
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div
        className="bg-image text-white text-center d-flex align-items-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=2000')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '50vh',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            zIndex: 1,
          }}
        ></div>

        <Container className="position-relative" style={{ zIndex: 2 }}>
          <h1 className="display-4 fw-bold mb-3">
            Find Your Next Career Opportunity
          </h1>
          <p className="lead mb-4 opacity-90">
            Discover exciting roles and take the next step in your career today
          </p>

          <Badge bg="light" text="dark" className="fs-5 px-4 py-2">
            {jobs.length} Active Positions
          </Badge>
        </Container>
      </div>

      {/* Job Listings */}
      <Container className="py-5">
        {jobs.length === 0 ? (
          <div className="text-center py-5">
            <h4 className="text-muted mb-3">No active job openings right now</h4>
            <p className="text-muted">Please check back soon or contact the admin.</p>
          </div>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {jobs.map((job) => {
              const days = daysLeft(job.closing_date);
              const isClosed = days <= 0;

              return (
                <Col key={job.id}>
                  <Card
                    className="h-100 border-0 shadow-sm job-card"
                    onClick={() => setSelectedJob(job)}
                    style={{
                      cursor: 'pointer',
                      transition: 'all 0.25s ease',
                      backgroundColor: '#212529',
                      color: '#f1f5f9',
                    }}
                  >
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="fw-bold mb-3" style={{ color: '#e2e8f0' }}>
                        {job.title}
                      </Card.Title>

                      <Card.Text className="flex-grow-1 mb-4" style={{ color: '#cbd5e1' }}>
                        {job.description?.substring(0, 110) || 'No description available'}...
                      </Card.Text>

                      <div className="mt-auto">
                        <div className="mb-3 d-flex flex-wrap gap-2">
                          <Badge bg="info" text="dark" className="px-3 py-2 fw-medium">
                            {job.category}
                          </Badge>

                          <Badge
                            bg={isClosed ? 'danger' : days <= 5 ? 'warning' : 'secondary'}
                            text="light"
                            className="px-3 py-2 fw-medium"
                          >
                            {isClosed ? 'Closed' : `${days} day${days !== 1 ? 's' : ''} left`}
                          </Badge>
                        </div>

                        <Button
                          variant="outline-light"
                          size="sm"
                          className="w-100 fw-medium"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedJob(job);
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}

        {/* Admin Link */}
        <div className="text-center mt-5 pt-4">
          <small className="text-muted">
            <Link to="/admin/login" className="text-muted text-decoration-none hover-link">
              Admin Login
            </Link>
          </small>
        </div>
      </Container>

      {/* Job Details Modal */}
      <Modal show={!!selectedJob} onHide={() => setSelectedJob(null)} centered size="lg">
        {selectedJob && (
          <>
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">{selectedJob.title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <div className="mb-4">
                <Badge bg="info" className="me-2 px-3 py-2">
                  {selectedJob.category}
                </Badge>
                <Badge bg="secondary" className="px-3 py-2">
                  Closes: {formatDate(selectedJob.closing_date)}
                </Badge>
              </div>

              <p className="text-muted small mb-4">
                {daysLeft(selectedJob.closing_date) > 0
                  ? `${daysLeft(selectedJob.closing_date)} days remaining to apply`
                  : 'Applications for this position are now closed'}
              </p>

              <h6 className="fw-semibold mb-2">Job Description</h6>
              <p className="text-muted mb-4">
                {selectedJob.description || 'No detailed description provided.'}
              </p>

              <h6 className="fw-semibold mb-2">Requirements</h6>
              <p className="text-muted">
                {selectedJob.requirements || 'No specific requirements listed.'}
              </p>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="outline-secondary" onClick={() => setSelectedJob(null)}>
                Close
              </Button>

              <Link to={`/apply/${selectedJob.id}`}>
                <Button
                  variant="primary"
                  disabled={daysLeft(selectedJob.closing_date) <= 0}
                >
                  Apply Now
                </Button>
              </Link>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </div>
  );
}

export default JobList;
