import React, { useState, useEffect } from 'react';
import { fetchUsers, deleteUser } from '../api';
import UserForm from './UserForm';
import UserDetail from './UserDetail'; // Import the updated UserDetail component
import { Button, Table, Spinner, Toast, Container, Row, Col, Form } from 'react-bootstrap';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewUser, setViewUser] = useState(null); // State for viewing user details

    useEffect(() => {
        const getUsers = async () => {
            setLoading(true);
            try {
                const response = await fetchUsers();
                setUsers(response.data);
            } catch (err) {
                setError(err.message);
                setShowToast(true);
            } finally {
                setLoading(false);
            }
        };
        getUsers();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteUser(id);
            setUsers(users.filter(user => user.id !== id));
        } catch (err) {
            setError(err.message);
            setShowToast(true);
        }
    };

    const handleCreateOrUpdate = (user) => {
        if (currentUser) {
            setUsers(users.map(u => (u.id === user.id ? user : u)));
        } else {
            setUsers([...users, user]);
        }
        setModalOpen(false);
        setCurrentUser(null);
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container>
            <Row>
                <Col>
                    <h1 className="mt-4">User Management</h1>
                    <Form className="mb-3">
                        <Form.Group controlId="search">
                            <Form.Control
                                type="text"
                                placeholder="Search by name"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                    <Button variant="primary" onClick={() => { setModalOpen(true); setCurrentUser(null); }}>Create User</Button>
                    <UserForm open={isModalOpen} onClose={() => setModalOpen(false)} onSubmit={handleCreateOrUpdate} user={currentUser} />
                    <UserDetail user={viewUser} onClose={() => setViewUser(null)} /> {/* UserDetail component */}
                    <div className="table-responsive">
                        {loading ? (
                            <Spinner animation="border" />
                        ) : (
                            <Table striped bordered hover className="mt-3">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map(user => (
                                            <tr key={user.id}>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>
                                                    <Button variant="info" onClick={() => { setViewUser(user); }}>View</Button>
                                                    <Button variant="warning" onClick={() => { setCurrentUser(user); setModalOpen(true); }}>Edit</Button>
                                                    <Button variant="danger" onClick={() => handleDelete(user.id)}>Delete</Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="text-center">No users found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        )}
                    </div>
                </Col>
            </Row>
            <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
                <Toast.Header>
                    <strong className="me-auto">Error</strong>
                </Toast.Header>
                <Toast.Body>{error}</Toast.Body>
            </Toast>
        </Container>
    );
};

export default UserList;
