// src/components/ThreeColumns.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Lists.css'; // Import your CSS file
import { useNavigate } from 'react-router-dom';

const Lists = () => {
    const navigate = useNavigate();

    const [usersLists, setUsersLists] = useState([]);
    const [customersLists, setCustomersLists] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenCustomer, setIsModalOpenCustomer] = useState(false);
    const [isModalOpenUser, setIsModalOpenUser] = useState(null);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [creatingCustomer, setCreatingCustomer] = useState(null);
    const [creatingUser, setCreatingUser] = useState(null);
    const [userLoggerIsAdmin, setUserLoggerIsAdmin] = useState(false);
    const [userLoggerEmail, setUserLoggerEmail] = useState('');
    const [userUserLoggerTenant, setUserLoggerTenant] = useState('');
    const [updateCustomerError, setUpdateCustomerError] = useState('');
    const secretKey = 'my-32-character-ultra-secure-and-ultra-long-secret-1231241234-54234234-23423-24234342342-2342423434-2342434322';

    var axiosConfig = '';
    // var urlLocal = "http://localhost:5108/api";
    // var urlDocker = "http://localhost:8088/api";
    var urlDocker = "http://localhost:8088/api";


    const getAuthToken = () => {
        return localStorage.getItem('authToken');
    };

    useEffect(() => {
        getUsersAndCustomers()
    }, [])

    function handleLogout() {
        localStorage.clear();
        navigate('/')
    }
    async function handleDeletedeCustomer(customer) {
        const authToken = getAuthToken();
        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
        };

        await axios.delete(`${urlDocker}/customer?id=${customer.id}`, axiosConfig)
            .then(res => getUsersAndCustomers())
            .catch(er => console.log(er));

    }
    async function handleDeletedUser(user) {
        const authToken = getAuthToken();
        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
        };

        if (user.email != userLoggerEmail)
            await axios.delete(`${urlDocker}/admin/user?id=${user.id}`, axiosConfig)
                .then(res => getUsersAndCustomers())
                .catch(er => console.log(er));
        else {
            window.alert("Can't delete tenant")
        }
    }


    const getUsersAndCustomers = async () => {
        const authToken = getAuthToken();
        axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
        };

        await axios.get(`${urlDocker}/admin/users`, axiosConfig).then(res => {
            var token = getAuthToken();
            const base64UrlPayload = token.split('.')[1];
            const base64Payload = base64UrlPayload.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(atob(base64Payload));
            setUserLoggerTenant(payload.tenantId);
            const userEmail = (payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']);
            setUserLoggerEmail(userEmail);
            var user = res.data.filter((user) => user.email == userEmail)
            if (user && user[0].role === 1) {
                localStorage.setItem('userLoggedIsAdm', true);
                setUserLoggerIsAdmin(true)

            } else {
                localStorage.setItem('userLoggedIsAdm', false);
                setUserLoggerIsAdmin(false)
            }
            if (userLoggerIsAdmin || localStorage.getItem('userLoggedIsAdm') === 'true')
                setUsersLists(res.data);
        })
            .catch(er => setUsersLists(null));
        await axios.get(`${urlDocker}/customer`, axiosConfig).then(res => setCustomersLists(res.data)).catch(er => setCustomersLists(null));
    }

    const handleOpenModalInfos = (customer) => {
        setEditingCustomer(customer);
        setIsModalOpen(true);
    };

    const handleOpenCreateCustomerModal = () => {
        setIsModalOpenCustomer(true);
    };

    const handleOpenCreateUserModal = () => {
        setIsModalOpenUser(true);
    };

    const handleCloseModalCustomer = () => {
        setCreatingCustomer(null);
        isModalOpenCustomer(false);
    };
    const handleCloseModalInfos = () => {
        setEditingCustomer(null);
        setIsModalOpen(false);
    };
    const handleCloseModalUser = () => {
        setCreatingUser(null);
        setIsModalOpenUser(false);
    };
    function transformDateFormat(inputDate) {
        const inputDateTime = new Date(inputDate);
        if (!isNaN(inputDateTime.getTime())) {
            const day = inputDateTime.getDate().toString().padStart(2, '0');
            const month = (inputDateTime.getMonth() + 1).toString().padStart(2, '0');
            const year = inputDateTime.getFullYear();
            const hours = inputDateTime.getHours().toString().padStart(2, '0');
            const minutes = inputDateTime.getMinutes().toString().padStart(2, '0');
            const transformedDate = `${day}/${month}/${year} às ${hours}:${minutes}`;
            return transformedDate;
        }
        return inputDate;
    }

    const handleUpdateCustomer = async (updatedData) => {
        const updateScheduleData = {
            customerId: updatedData.id,
            schedule: updatedData.schedule
        }
        const updateStatusData = {
            customerId: updatedData.id,
            showedUp: updatedData.customerShowedUp
        }
        const authToken = getAuthToken();

        axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
        };
        axios.put(`${urlDocker}/customer/updateSchedule`, updateScheduleData, axiosConfig)
            .then(response => {
                if (response.data) {
                    getUsersAndCustomers();
                }
            })
            .then(response => {
                axios.put(`${urlDocker}/customer/updateCustomerStatus`, updateStatusData, axiosConfig)
                    .then(response => {
                        if (response.data) {
                            getUsersAndCustomers()
                        }
                    })
                    handleCloseModalInfos();
                    setUpdateCustomerError('')
            })
            .catch(error => {
                setUpdateCustomerError(error.response.data)
                console.error('Error Update:', error);
            });


    };
    const handleCreateCustomer = async (newCustomer) => {
        const createCustomerData = {
            name: newCustomer.name,
            schedule: newCustomer.schedule
        }

        const authToken = getAuthToken();

        axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
        };
        axios.post(`${urlDocker}/customer/`, createCustomerData, axiosConfig)
            .then(response => {
                if (response.data) {
                    setIsModalOpenCustomer(false);
                    getUsersAndCustomers()
                }
            })
            .catch(error => {
                window.alert(`${error.response.data}`)
                console.error('Error Creating Customer:', error);
            });


        handleCloseModalUser();
    };
    const handleCreateUser = async (newUser) => {

        const createUserData = {
            email: newUser.email,
            password: newUser.password
        }
        const authToken = getAuthToken();

        axiosConfig = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
        };
        axios.post(`${urlDocker}/admin/user`, createUserData, axiosConfig)
            .then(response => {
                if (response.data) {
                    setIsModalOpenCustomer(false);
                    getUsersAndCustomers();
                }
            })
            .catch(error => {
                window.alert(`${error.response.data}`)
                console.error('Error Creating User:', error);
            });


        handleCloseModalUser();
    };
    const formatDateForInput = (dateString) => {
        const date = new Date(dateString);
        const offset = +3 * 60; // GMT-3 in minutes

        date.setMinutes(date.getMinutes() - date.getTimezoneOffset() + offset);

        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };


    return (
        <>
            <div className='logout-button-div' >
                <button className='logout-button' onClick={() => handleLogout()}>Logout</button>
            </div>
            <h1>Calendar Scheduler</h1>
            <h2>User: {!!userLoggerEmail && userLoggerEmail}</h2>
            <h2>Tenant Id: {!!userUserLoggerTenant && userUserLoggerTenant}</h2>
            <div className="columns-container">
                <div className='column'>
                    <h3>Users</h3>
                    {!!usersLists && userLoggerIsAdmin ? usersLists?.map((user, index) => (
                        <div key={index} className="column">
                            <div className='info-user'>
                                <p><b>Email:</b>{` ${user.email}`}</p>
                                <p><b>Role:</b>{` ${user.role == 1 ? 'Admin' : 'Secretary'}`}</p>
                                <div className='div-buttons'>
                                    {/* <p> */}
                                    <button
                                        // disabled={!localStorage.getItem('userLoggedIsAdm') || userLoggerIsAdmin}
                                        className='deleteCustomer'
                                        onClick={() => { handleDeletedUser(user) }}
                                    >
                                        Delete User
                                    </button>
                                    {/* </p> */}

                                </div>

                            </div>
                            <div className='info-user'>

                            </div>

                        </div>
                    )) : (
                        <div className="column">
                            <p>{`Email: ${userLoggerEmail}`}</p>
                            <p>{`Role: Secretary`}</p>
                        </div>
                    )
                    }
                </div>

                <div className='column'>
                    <h3>Customers</h3>
                    {!!customersLists && customersLists.map((customer, index) => (
                        // <div key={index} className="column">
                        customer.customerShowedUp ?
                            <div className='card-color'>
                                <p><b>Name:</b>{` ${customer.name}`}</p>
                                <p><b>Schedule:</b>{` ${transformDateFormat(customer.schedule)}`}</p>
                                <p><b>Showed Up:</b>{` ${customer.customerShowedUp == true ? 'Yes' : 'No'}`}</p>
                                <div className='div-buttons'>
                                    <button className='editInfo' onClick={() => { handleOpenModalInfos(customer) }}>Edit Infos</button>
                                    <button className='deleteCustomer' onClick={() => { handleDeletedeCustomer(customer) }}>Delete Customer</button>
                                </div>
                            </div>
                            :
                            <div className='card-uncolor'>
                                <p><b>Name:</b>{` ${customer.name}`}</p>
                                <p><b>Schedule:</b>{` ${transformDateFormat(customer.schedule)}`}</p>
                                <p><b>Showed Up:</b>{` ${customer.customerShowedUp == true ? 'Yes' : 'No'}`}</p>
                                <div className='div-buttons'>
                                    <button className='editInfo' onClick={() => { handleOpenModalInfos(customer) }}>Edit Infos</button>
                                    <button className='deleteCustomer' onClick={() => { handleDeletedeCustomer(customer) }}>Delete Customer</button>
                                </div>
                            </div>

                        // </div>
                    ))}

                    {isModalOpen && editingCustomer && (
                        <div className="modal">
                            <h2>Edit Customer Information</h2>
                            <p>{`Editing customer: ${editingCustomer.name}`}</p>
                            <label>DATE:</label>
                            <input
                                type="datetime-local"
                                value={editingCustomer.schedule ? formatDateForInput(editingCustomer.schedule) : ''}
                                onChange={(e) => setEditingCustomer({ ...editingCustomer, schedule: e.target.value })}
                            />
                            <div className='showedUp'>
                                <label>PRESENCE: Showed Up?</label>
                                <input
                                    type="checkbox"
                                    label='Showed Up?'
                                    checked={editingCustomer.customerShowedUp === true}
                                    onChange={(e) => setEditingCustomer({ ...editingCustomer, customerShowedUp: e.target.checked })}
                                />
                            </div>
                            <button onClick={() => handleUpdateCustomer(editingCustomer)}>Save Changes</button>
                            <button onClick={handleCloseModalInfos}>Cancel</button>
                            {updateCustomerError.length > 1 ? <p style={{color:'red'}}>{updateCustomerError}</p> : ''}
                        </div>
                    )}

                    {isModalOpenCustomer && (
                        <div className="modal">
                            <h2>Create Customer</h2>
                            <label>Name:</label>
                            <input
                                type="text"
                                onChange={(e) => setCreatingCustomer({ ...creatingCustomer, name: e.target.value })}
                            />
                            <div className='showedUp'>
                                <label>DATE:</label>
                                <input
                                    type="datetime-local"
                                    onChange={(e) => setCreatingCustomer({ ...creatingCustomer, schedule: e.target.value })}
                                />
                            </div>
                            <button onClick={() => handleCreateCustomer(creatingCustomer)}>Save Changes</button>
                            <button onClick={handleCloseModalCustomer}>Cancel</button>

                        </div>
                    )}

                    {isModalOpenUser && (
                        <div className="modal">
                            <h2>Create User</h2>
                            <label>Email:</label>
                            <input
                                type="email"
                                onChange={(e) => setCreatingUser({ ...creatingUser, email: e.target.value })}
                            />
                            <label>Password:</label>
                            <input
                                type="text"
                                onChange={(e) => setCreatingUser({ ...creatingUser, password: e.target.value })}
                            />
                            <button onClick={() => handleCreateUser(creatingUser)}>Save Changes</button>
                            <button onClick={handleCloseModalUser}>Cancel</button>

                        </div>
                    )}
                </div>
            </div>
            <div className='create-btns'>
                <button
                    className='create-customer-btn'
                    onClick={() => handleOpenCreateUserModal()}
                // disabled={userLoggerIsAdmin}
                >
                    Create User
                </button>
                <button
                    className='create-customer-btn'
                    onClick={() => handleOpenCreateCustomerModal()}
                >
                    Create Customer
                </button>

            </div>
        </>

    );
};

export default Lists;
