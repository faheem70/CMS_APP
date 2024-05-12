// UpdateUser.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./UpdateUser.css";

const UpdateUser = ({ id, onCancel, onUpdate }) => {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        mobileNumber: '',
        dateOfBirth: ''
    });

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/person/${id}`);
            if (response && response.data) {
                setUserData(response.data);
            } else {
                console.log('Failed to fetch user data');
            }
        } catch (error) {
            console.error('Error fetching user data:', error.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:5000/api/person/${id}`, userData);
            if (response && response.data) {
                alert(response.data.message);
                onUpdate(); // Update user list
                onCancel(); // Close modal
            } else {
                alert('Unknown error occurred');
            }
        } catch (error) {
            alert(error.response?.data?.error || 'Internal Server Error');
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onCancel}>&times;</span>
                <h2>Edit User</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            value={userData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="input-group">
                        <label>Mobile Number</label>
                        <input
                            type="text"
                            name="mobileNumber"
                            value={userData.mobileNumber}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="input-group">
                        <label>Date of Birth</label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={userData.dateOfBirth}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="update-button">Update</button>
                </form>
            </div>
        </div>
    );
};

export default UpdateUser;
