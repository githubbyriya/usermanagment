import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const UserForm = ({ open, onClose, onSubmit, user }) => {
    const initialFormData = {
        id: null,
        name: '',
        email: '',
        phone: '',
        username: '',
        address: {
            street: '',
            suite: '',
            city: '',
            zipcode: '',
            geo: {
                lat: '',
                lng: ''
            }
        },
        company: {
            name: '',
            catchPhrase: '',
            bs: ''
        },
        website: ''
    };

    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (user) {
            setFormData({
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                username: user.username, // Use the original username without the "USER-" prefix
                address: {
                    street: user.address.street,
                    suite: user.address.suite,
                    city: user.address.city,
                    zipcode: user.address.zipcode,
                    geo: {
                        lat: user.address.geo.lat,
                        lng: user.address.geo.lng
                    }
                },
                company: {
                    name: user.company.name,
                    catchPhrase: user.company.catchPhrase,
                    bs: user.company.bs
                },
                website: user.website
            });
        } else {
            setFormData(initialFormData);
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Update username based on name input
        if (name === 'name') {
            setFormData((prev) => ({
                ...prev,
                name: value,
                username: value.length >= 3 ? `${value}` : '' // Set username if name has 3 or more characters
            }));
        } else if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setFormData((prev) => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value
                }
            }));
        } else if (name.startsWith('geo.')) {
            const geoField = name.split('.')[1];
            setFormData((prev) => ({
                ...prev,
                address: {
                    ...prev.address,
                    geo: {
                        ...prev.address.geo,
                        [geoField]: value
                    }
                }
            }));
        } else if (name.startsWith('company.')) {
            const companyField = name.split('.')[1];
            setFormData((prev) => ({
                ...prev,
                company: {
                    ...prev.company,
                    [companyField]: value
                }
            }));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const validate = () => {
        const newErrors = {};
        
        if (!formData.name || formData.name.length < 3) {
            newErrors.name = 'Name is required and must be at least 3 characters long.';
        }
        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'A valid email is required.';
        }
        if (!formData.phone || !/^\+?[0-9\s\-x()]{10,}$/.test(formData.phone)) {
            newErrors.phone = 'A valid phone number is required.';
        }
        if (!formData.username || formData.username.length < 3) {
            newErrors.username = 'Username is required and must be at least 3 characters long.';
        }
        if (!formData.address.street) {
            newErrors.street = 'Street is required.';
        }
        if (!formData.address.city) {
            newErrors.city = 'City is required.';
        }
        if (!formData.address.zipcode) {
            newErrors.zipcode = 'Zipcode is required.';
        }
        if (formData.company.name && formData.company.name.length < 3) {
            newErrors.companyName = 'Company Name must be at least 3 characters long.';
        }
        if (formData.website && !/^(https?:\/\/)?([\w\-]+)+([\w\-\.]+)+(\.[a-z]{2,6})([\/\w \.-]*)*\/?$/.test(formData.website)) {
            newErrors.website = 'A valid URL is required.';
        }
        
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return; // Prevent submission if there are errors
        }
        onSubmit(formData);
        setFormData(initialFormData); // Reset form after submission
        setErrors({}); // Clear errors
    };

    return (
        <Modal show={open} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{user ? 'Edit User' : 'Create User'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formUsername">
                        <Form.Label>Username</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="username" 
                            value={`USER-${formData.username}`} 
                            readOnly 
                        />
                        {errors.username && <p className="text-danger">{errors.username}</p>}
                    </Form.Group>
                    <Form.Group controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
                        {errors.name && <p className="text-danger">{errors.name}</p>}
                    </Form.Group>
                    <Form.Group controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
                        {errors.email && <p className="text-danger">{errors.email}</p>}
                    </Form.Group>
                    <Form.Group controlId="formPhone">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control type="text" name="phone" value={formData.phone} onChange={handleChange} required />
                        {errors.phone && <p className="text-danger">{errors.phone}</p>}
                    </Form.Group>
                    <Form.Group controlId="formStreet">
                        <Form.Label>Street</Form.Label>
                        <Form.Control type="text" name="address.street" value={formData.address.street} onChange={handleChange} required />
                        {errors.street && <p className="text-danger">{errors.street}</p>}
                    </Form.Group>
                    <Form.Group controlId="formSuite">
                        <Form.Label>Suite</Form.Label>
                        <Form.Control type="text" name="address.suite" value={formData.address.suite} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId="formCity">
                        <Form.Label>City</Form.Label>
                        <Form.Control type="text" name="address.city" value={formData.address.city} onChange={handleChange} required />
                        {errors.city && <p className="text-danger">{errors.city}</p>}
                    </Form.Group>
                    <Form.Group controlId="formZipcode">
                        <Form.Label>Zipcode</Form.Label>
                        <Form.Control type="text" name="address.zipcode" value={formData.address.zipcode} onChange={handleChange} required />
                        {errors.zipcode && <p className="text-danger">{errors.zipcode}</p>}
                    </Form.Group>
                    <Form.Group controlId="formGeoLat">
                        <Form.Label>Geo Latitude</Form.Label>
                        <Form.Control type="text" name="geo.lat" value={formData.address.geo.lat} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId="formGeoLng">
                        <Form.Label>Geo Longitude</Form.Label>
                        <Form.Control type="text" name="geo.lng" value={formData.address.geo.lng} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId="formCompanyName">
                        <Form.Label>Company Name (optional)</Form.Label>
                        <Form.Control type="text" name="company.name" value={formData.company.name} onChange={handleChange} />
                        {errors.companyName && <p className="text-danger">{errors.companyName}</p>}
                    </Form.Group>
                    <Form.Group controlId="formCompanyCatchPhrase">
                        <Form.Label>Company Catch Phrase (optional)</Form.Label>
                        <Form.Control type="text" name="company.catchPhrase" value={formData.company.catchPhrase} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId="formCompanyBS">
                        <Form.Label>Company BS (optional)</Form.Label>
                        <Form.Control type="text" name="company.bs" value={formData.company.bs} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId="formWebsite">
                        <Form.Label>Website (optional)</Form.Label>
                        <Form.Control type="text" name="website" value={formData.website} onChange={handleChange} />
                        {errors.website && <p className="text-danger">{errors.website}</p>}
                    </Form.Group>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={onClose}>Cancel</Button>
                        <Button variant="primary" type="submit">Submit</Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default UserForm;
