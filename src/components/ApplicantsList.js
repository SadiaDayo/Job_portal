import { useEffect, useState } from 'react';
import axios from 'axios';

function ApplicantsList() {
  const [applicants, setApplicants] = useState([]);
  const [filterQual, setFilterQual] = useState('');
  const [filterGender, setFilterGender] = useState('');

  useEffect(() => {
    axios
      .get('/api/applications', { withCredentials: true })
      .then(res => setApplicants(res.data))
      .catch(() => alert('Please login again'));
  }, []);

  const filtered = applicants.filter(app => {
    return (
      (!filterQual || app.qualification === filterQual) &&
      (!filterGender || app.gender === filterGender)
    );
  });

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold">Applicants Management</h4>
        <span className="badge bg-primary fs-6">
          Total: {filtered.length}
        </span>
      </div>

      {/* Filters */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h6 className="mb-3 text-muted">Filters</h6>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Qualification</label>
              <select
                className="form-select"
                value={filterQual}
                onChange={e => setFilterQual(e.target.value)}
              >
                <option value="">All</option>
                <option>Matric</option>
                <option>Intermediate</option>
                <option>Bachelor</option>
                <option>Master</option>
                <option>PhD</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label">Gender</label>
              <select
                className="form-select"
                value={filterGender}
                onChange={e => setFilterGender(e.target.value)}
              >
                <option value="">All</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div className="col-md-4 d-flex align-items-end">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setFilterQual('');
                  setFilterGender('');
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-bordered align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Job</th>
                  <th>CNIC</th>
                  <th>Gender</th>
                  <th>Qualification</th>
                  <th className="text-center">Photo</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
                      No applicants found with selected filters
                    </td>
                  </tr>
                ) : (
                  filtered.map(a => (
                    <tr key={a.id}>
                      <td className="fw-semibold">{a.full_name}</td>
                      <td>{a.title}</td>
                      <td>{a.cnic}</td>
                      <td>
                        <span className="badge bg-secondary">
                          {a.gender}
                        </span>
                      </td>
                      <td>{a.qualification}</td>
                      <td className="text-center">
                        {a.photo_path ? (
                          <img
                            src={`http://localhost:5000${a.photo_path}`}
                            alt="Applicant"
                            width="55"
                            height="55"
                            style={{ objectFit: 'cover' }}
                            className="rounded-circle border"
                          />
                        ) : (
                          <span className="text-muted">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplicantsList;
