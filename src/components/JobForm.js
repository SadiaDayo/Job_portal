import { useState } from 'react';
import axios from 'axios';


function JobForm({ onJobAdded }) {
  const [form, setForm] = useState({ title: '', description: '', category: 'IT', closing_date: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    axios.post('/api/jobs', form, { withCredentials: true })
      .then(res => {
        onJobAdded({ ...form, id: res.data.id });
        setForm({ title: '', description: '', category: 'IT', closing_date: '' });
        alert('Job posted!');
      })
      .catch(err => alert('Error creating job'));
  };

  return (
    <div className="card mb-4">
      <div className="card-header">Post New Job</div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Title</label>
            <input
              name="title"
              className="form-control"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="e.g. Senior React Developer"
            />
          </div>
          <div className="mb-3">
            <label>Description</label>
            <textarea
              name="description"
              className="form-control"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Describe the role, responsibilities, and qualifications..."
            />
          </div>
          <div className="mb-3">
            <label>Category</label>
            <select name="category" className="form-select" value={form.category} onChange={handleChange}>
              <option>IT</option><option>Finance</option><option>Marketing</option><option>HR</option><option>Other</option>
            </select>
          </div>
          <div className="mb-3">
            <label>Closing Date</label>
           <input
              type="date"
              name="closing_date"
              className="form-control"
              value={form.closing_date}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]} 
            />
          </div>
          <button type="submit" className="btn btn-success">Post Job</button>
        </form>
      </div>
    </div>
  );
}



export default JobForm;