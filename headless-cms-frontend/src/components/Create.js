import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import UpdateUser from './UpdateUser';
import "./Create.css";

const Create = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobileNumber: '',
        dateOfBirth: ''
    });
    const [id, setId] = useState('');
    const [message, setMessage] = useState('');
    const [users, setUsers] = useState([]);
    const updateUserRef = useRef(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/person');
            if (response && response.data && Array.isArray(response.data)) {
                setUsers(response.data);
            } else {
                console.log('Invalid data received from the server');
            }
        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/person', formData);
            if (response && response.data) {
                alert(response.data.message);
                const createdUserId = response.data.id;
                // Fetch the created user immediately after creation
                const newUserResponse = await axios.get(`http://localhost:5000/api/person/${createdUserId}`);
                if (newUserResponse && newUserResponse.data) {
                    setUsers([...users, newUserResponse.data]);
                } else {
                    setMessage('Failed to fetch the created user');
                }
                setFormData({
                    name: '',
                    email: '',
                    mobileNumber: '',
                    dateOfBirth: ''
                });
            } else {
                setMessage('Unknown error occurred');
            }
        } catch (error) {
            alert(error.response?.data?.error || 'Internal Server Error');
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/person/${id}`);
            if (response && response.data) {
                alert(response.data.message);
                setUsers(users.filter(user => user.id !== id));
            } else {
                alert('Unknown error occurred');
            }
        } catch (error) {
            alert(error.response?.data?.error || 'Internal Server Error');
        }
    };

    const handleEdit = (id) => {
        setId(id);
        // Scroll to the UpdateUser component
        if (updateUserRef.current) {
            window.scrollTo({
                top: updateUserRef.current.offsetTop,
                behavior: "smooth"
            });
        }
    };

    const handleCancelEdit = () => {
        setId('');
    };

    return (
        <div className="container">
            <h1>CRUD Operations</h1>
            <form onSubmit={handleSubmit} className="form-card">
                <input
                    type="text"
                    placeholder="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                />
                <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    placeholder="Mobile Number"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                />
                <input
                    type="date"
                    placeholder="Date of Birth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                />
                <button type="submit">Create Person</button>
            </form>
            <div className="card-container">
                {users.map(user => (
                    <div key={user?.id} className="card">
                        <div className="card-content">
                            <p>Name: {user?.name}</p>
                            <p>Email: {user?.email}</p>
                            <p>Mobile Number: {user?.mobileNumber}</p>
                            <p>Date of Birth: {user?.dateOfBirth}</p>
                        </div>
                        <button onClick={() => handleEdit(user?.id)}>Edit</button>
                        <button onClick={() => handleDelete(user?.id)}>Delete</button>

                    </div>
                ))}
            </div>
            {/* Display UpdateUser component conditionally */}
            <div ref={updateUserRef}>
                {id && <UpdateUser id={id} onCancel={handleCancelEdit} onUpdate={fetchData} />}
            </div>
            <p>{message}</p>
        </div>
    );
};

export default Create;
