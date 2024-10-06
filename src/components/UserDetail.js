import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const UserDetail = ({ user, onClose }) => {
    if (!user) return null; // If no user, return null

    return (
        <Modal show={!!user} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>User Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h5>Name:</h5>
                <p>{user.name}</p>
                <h5>Email:</h5>
                <p>{user.email}</p>
                <h5>Username:</h5>
                <p>{user.username}</p>
                <h5>Phone:</h5>
                <p>{user.phone}</p>
                <h5>Website:</h5>
                <p>{user.website}</p>
                <h5>Address:</h5>
                <p>{`${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}`}</p>
                <h5>Geo:</h5>
                <p>{`Latitude: ${user.address.geo.lat}, Longitude: ${user.address.geo.lng}`}</p>
                <h5>Company:</h5>
                <p>{user.company.name}</p>
                <h5>Catch Phrase:</h5>
                <p>{user.company.catchPhrase}</p>
                <h5>BS:</h5>
                <p>{user.company.bs}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UserDetail;
