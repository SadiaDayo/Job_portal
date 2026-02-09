import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import JobList from './components/JobList';
import ApplyForm from './components/ApplyForm';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import './styles/App.css';

function App() {
  return (
    <Router>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-0 shadow-lg py-3">
  <Container>
    <LinkContainer to="/">
      <Navbar.Brand className="d-flex align-items-center fw-bold fs-4">
        <i className="bi bi-briefcase-fill me-2" style={{ fontSize: '1.6rem' }}></i>
        Job Portal
      </Navbar.Brand>
    </LinkContainer>

    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="ms-auto">
        <LinkContainer to="/">
          <Nav.Link className="px-3">Home</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/admin/login">
          <Nav.Link className="px-3">
            <i className="bi bi-shield-lock-fill me-1"></i> Admin
          </Nav.Link>
        </LinkContainer>
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>

      {/* Main Content */}
      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<JobList />} />
          <Route path="/apply/:jobId" element={<ApplyForm />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="*" element={<h2>404 - Page Not Found</h2>} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
