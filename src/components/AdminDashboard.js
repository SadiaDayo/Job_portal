import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import JobForm from './JobForm';
import ApplicantsList from './ApplicantsList';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AdminDashboard() {
  const [jobs, setJobs] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [view, setView] = useState('jobs');
  const [loading, setLoading] = useState(true);
  
function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [jobsRes, analyticsRes] = await Promise.all([
          axios.get('/api/jobs/admin', { withCredentials: true }),
          axios.get('/api/applications/analytics', { withCredentials: true }),
        ]);

        setJobs(jobsRes.data);
        setAnalytics(analyticsRes.data);
      } catch (err) {
        console.error(err);
        alert('Session expired or server error. Please login again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    axios
      .get('/api/auth/logout', { withCredentials: true })
      .then(() => {
        window.location.href = '/admin/login';
      })
      .catch(() => alert('Logout failed'));
  };

  const chartData = {
    labels: analytics.map((a) => (a.title.length > 25 ? a.title.substring(0, 22) + '...' : a.title)),
    datasets: [
      {
        label: 'Total Applicants',
        data: analytics.map((a) => a.total_applicants),
        backgroundColor: 'rgba(54, 162, 235, 0.65)',
      },
      {
        label: 'Male',
        data: analytics.map((a) => a.male),
        backgroundColor: 'rgba(75, 192, 192, 0.65)',
      },
      {
        label: 'Female',
        data: analytics.map((a) => a.female),
        backgroundColor: 'rgba(255, 99, 132, 0.65)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Applications by Job', font: { size: 18 } },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
        <div>
          <h2 className="mb-1">
            <i className="bi bi-speedometer2 me-2 text-primary"></i>
            Admin Dashboard
          </h2>
          <small className="text-muted">Manage jobs, view analytics & applications</small>
        </div>

        <button className="btn btn-outline-danger" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right me-2"></i>
          Logout
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-4">
        <div className="btn-group w-100 w-md-auto" role="group">
          <button
            type="button"
            className={`btn ${view === 'jobs' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setView('jobs')}
          >
            <i className="bi bi-briefcase me-1"></i> Jobs
          </button>
          <button
            type="button"
            className={`btn ${view === 'analytics' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setView('analytics')}
          >
            <i className="bi bi-graph-up me-1"></i> Analytics
          </button>
          <button
            type="button"
            className={`btn ${view === 'applicants' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setView('applicants')}
          >
            <i className="bi bi-people me-1"></i> Applicants
          </button>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading dashboard data...</p>
        </div>
      ) : (
        <>
          {view === 'jobs' && (
            <div className="card shadow-sm border-0">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">Manage Job Postings</h5>
              </div>
              <div className="card-body">
                <JobForm onJobAdded={(newJob) => setJobs([...jobs, newJob])} />

                <h5 className="mt-5 mb-3">Existing Jobs</h5>

                {jobs.length === 0 ? (
                  <div className="alert alert-info">
                    No jobs posted yet. Create your first job above.
                  </div>
                ) : (
                  <div className="list-group">
                    {jobs.map((j) => (
                      <div
                        key={j.id}
                        className="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3"
                      >
                        <div>
                          <h6 className="mb-1">{j.title}</h6>
                          <small className="text-muted">
                            {j.category} • Closes: {formatDate(j.closing_date)}
                          </small>
                        </div>
                        <div>
                          <button className="btn btn-sm btn-outline-warning me-2">
                            <i className="bi bi-pencil"></i> Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => {
                              if (window.confirm('Delete this job?')) {
                                axios
                                  .delete(`/api/jobs/${j.id}`, { withCredentials: true })
                                  .then(() => setJobs(jobs.filter((x) => x.id !== j.id)))
                                  .catch(() => alert('Failed to delete job'));
                              }
                            }}
                          >
                            <i className="bi bi-trash"></i> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {view === 'analytics' && (
            <div className="card shadow-sm border-0">
              <div className="card-header bg-info text-white">
                <h5 className="mb-0">Application Analytics</h5>
              </div>
              <div className="card-body" style={{ height: '450px' }}>
                {analytics.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    No application data yet
                  </div>
                ) : (
                  <Bar data={chartData} options={chartOptions} />
                )}
              </div>
            </div>
          )}

          {view === 'applicants' && (
            <div className="card shadow-sm border-0">
              <div className="card-header bg-secondary text-white">
                <h5 className="mb-0">All Applications</h5>
              </div>
              <div className="card-body p-0">
                <ApplicantsList />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminDashboard;