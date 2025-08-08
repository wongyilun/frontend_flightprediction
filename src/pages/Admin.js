import React, { useState } from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import './Admin.css';

function AdminPage() {
  const [selectedRole, setSelectedRole] = useState('unregistered');
  const [permissions, setPermissions] = useState({
    ticketSearch: false,
    flightTracker: false,
    prediction: false,
    weather: false,
  });

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  const handlePermissionChange = (event) => {
    const { name, checked } = event.target;
    setPermissions((prevPermissions) => ({
      ...prevPermissions,
      [name]: checked,
    }));
  };

  const renderContent = () => {
    switch (selectedRole) {
      case 'unregistered':
        return <p>Unregistered users can see this content.</p>;
      case 'registered':
        return <p>Registered users can see this content.</p>;
      case 'member':
        return <p>Members can see this content.</p>;
      default:
        return null;
    }
  };

  return (
    <div className="admin-page">
      <h2>Admin Page</h2>
      <Form.Group controlId="roleSelect">
        <Form.Label>Select User Role</Form.Label>
        <Form.Control as="select" value={selectedRole} onChange={handleRoleChange}>
          <option value="unregistered">Unregistered User</option>
          <option value="registered">Registered User</option>
          <option value="member">Member</option>
        </Form.Control>
      </Form.Group>

      <div className="permissions-section">
        <h3>Permissions</h3>
        <Form>
          <Row>
            <Col>
              <Form.Check
                type="checkbox"
                label="Ticket Search"
                name="ticketSearch"
                checked={permissions.ticketSearch}
                onChange={handlePermissionChange}
              />
            </Col>
            <Col>
              <Form.Check
                type="checkbox"
                label="Flight Tracker"
                name="flightTracker"
                checked={permissions.flightTracker}
                onChange={handlePermissionChange}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Check
                type="checkbox"
                label="Prediction"
                name="prediction"
                checked={permissions.prediction}
                onChange={handlePermissionChange}
              />
            </Col>
            <Col>
              <Form.Check
                type="checkbox"
                label="Weather"
                name="weather"
                checked={permissions.weather}
                onChange={handlePermissionChange}
              />
            </Col>
          </Row>
        </Form>
      </div>

      <div className="content-section">
        {renderContent()}
      </div>
    </div>
  );
}

export default AdminPage;