import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ApplyForm() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    full_name: '', father_name: '', cnic: '', gender: '', qualification: '', photo: null
  });
  const [jobTitle, setJobTitle] = useState('');

  useEffect(() => {
    axios.get(`/api/jobs/${jobId}`).catch(() => {}); // just to confirm job exists (optional)
    // You can fetch job title if you want
  }, [jobId]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = e => {
    setForm({ ...form, photo: e.target.files[0] });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const data = new FormData();
    data.append('job_id', jobId);
    Object.keys(form).forEach(key => {
      if (key !== 'photo') data.append(key, form[key]);
    });
    if (form.photo) data.append('photo', form.photo);

    try {
      await axios.post('/api/applications', data);
      alert('Application submitted successfully!');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting application');
    }
  };

  return (
    <div className="card">
      <div className="card-header">Apply for Job #{jobId}</div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Full Name</label>
            <input type="text" name="full_name" className="form-control" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label>Father's Name</label>
            <input type="text" name="father_name" className="form-control" onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label>CNIC (12345-1234567-1)</label>
            <input type="text" name="cnic" pattern="\d{5}-\d{7}-\d{1}" className="form-control" onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label>Gender</label>
            <select name="gender" className="form-select" onChange={handleChange} required>
              <option value="">Select...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="mb-3">
            <label>Qualification</label>
            <select name="qualification" className="form-select" onChange={handleChange} required>
              <option value="">Select...</option>
              <option value="Matric">Matric</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Bachelor">Bachelor</option>
              <option value="Master">Master</option>
              <option value="PhD">PhD</option>
            </select>
          </div>
          <div className="mb-3">
            <label>Photo (jpg/png, max 2MB)</label>
            <input type="file" accept="image/jpeg,image/png" className="form-control" onChange={handleFile} required />
          </div>
          <button type="submit" className="btn btn-success">Submit Application</button>
        </form>
      </div>
    </div>
  );
}

export default ApplyForm;