//به دلیل اینه حجم فایل باید کمتر از ۵ مگابایت  باشد 
//من فقط کامپوننت مورد نظر را اپلود کردم
// و کل پروژه ی ریکت را به دلیل حجم بسیار بالا و محدودیت سایت اپلود نکردم

import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Checkbox,
    Button,
    Modal
} from '@mui/material';
import { Pagination } from '@mui/lab';
import './UsersTable.css';

const UsersTable = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newUser, setNewUser] = useState({
        id: '',
        first_name: '',
        last_name: '',
        email: '',
        title: '',
        amount: '',
        status: ''
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('https://reqres.in/api/users');
                const data = await response.json();
                setUsers(data.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const filterUsers = () => {
            const filtered = users.filter(
                (user) =>
                    user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredUsers(filtered);
        };

        filterUsers();
    }, [searchTerm, users]);

    const handleSearchTermChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleUserSelect = (event, userId) => {
        const isChecked = event.target.checked;

        if (isChecked) {
            setSelectedUsers((prevSelectedUsers) => [...prevSelectedUsers, userId]);
        } else {
            setSelectedUsers((prevSelectedUsers) =>
                prevSelectedUsers.filter((id) => id !== userId)
            );
        }
    };

    const handleSelectAll = (event) => {
        const isChecked = event.target.checked;

        if (isChecked) {
            const allUserIds = currentUsers.map((user) => user.id);
            setSelectedUsers(allUserIds);
        } else {
            setSelectedUsers([]);
        }
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleAddModalOpen = () => {
        setShowAddModal(true);
    };

    const handleAddModalClose = () => {
        setShowAddModal(false);
    };

    const handleSaveNewUser = () => {
        if (newUser.first_name && newUser.last_name && newUser.email) {
            const updatedUsers = [...users, newUser];
            setUsers(updatedUsers);
            handleAddModalClose();
            setNewUser({
                id: '',
                first_name: '',
                last_name: '',
                email: '',
                title: '',
                amount: '',
                status: ''
            });
        } else {
            alert('Please fill in all the required fields.');
        }
    };

    const handleNewUserChange = (event) => {
        setNewUser((prevNewUser) => ({
            ...prevNewUser,
            [event.target.name]: event.target.value
        }));
    };


    const handleDeleteUser = (userId) => {
        setFilteredUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    };



    const usersPerPage = 4;
    const pageCount = Math.ceil(filteredUsers.length / usersPerPage);
    const offset = (currentPage - 1) * usersPerPage;
    const currentUsers = filteredUsers.slice(offset, offset + usersPerPage);

    return (
        <div>
            <TextField
                style={{ marginTop: '30px', width: '300px' }}
                label="Search"
                variant="outlined"
                value={searchTerm}
                onChange={handleSearchTermChange}
            />
            <Button style={{ marginRight: '1330px' }} onClick={handleAddModalOpen} color="primary" variant="contained">
                Add New
            </Button>

            <TableContainer style={{ marginTop: '20px' }} component={Paper}>

                <Table>

                    <TableHead>

                        <TableRow>

                            <TableCell>
                                <Checkbox
                                    checked={selectedUsers.length === currentUsers.length}
                                    onChange={handleSelectAll}
                                />
                            </TableCell>
                            <TableCell>Image</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentUsers.map((user, index) => (
                            <TableRow
                                className={index % 2 === 0 ? 'even' : 'odd'}
                                key={user.id}
                            >

                                <TableCell>
                                    <Checkbox
                                        checked={selectedUsers.includes(user.id)}
                                        onChange={(event) => handleUserSelect(event, user.id)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <img
                                        style={{ borderRadius: '80px', width: '50px', height: '50px' }}
                                        src={user.avatar}
                                        alt="User"
                                    />
                                </TableCell>
                                <TableCell>{user.first_name + user.last_name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.title}</TableCell>
                                <TableCell>{user.amount}</TableCell>
                                <TableCell>{user.status}</TableCell>
                                <Button
                                style={{backgroundColor:'red',marginTop:'20px',fontSize:'10px'}}
                                    variant="contained"
                                    
                                    onClick={() => handleDeleteUser(user.id)}
                                >
                                    Delete
                                </Button>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Pagination
                style={{ marginTop: '20px', textAlign: 'center' }}
                count={pageCount}
                page={currentPage}
                onChange={handlePageChange}
            />



            <Modal
                style={{ backgroundColor: 'white',borderRadius:'20px',width:'610px' ,height:'600px',marginTop:'100px',marginLeft:'420px'}}
                open={showAddModal}
                onClose={handleAddModalClose}
                aria-labelledby="add-modal-title"
                aria-describedby="add-modal-description"
            >
                <div className="add-modal-container">
                    <h2 style={{textAlign:'center'}} id="add-modal-title">Add New User</h2>
                    <div className="add-modal-content">
                        <TextField
                            style={{marginLeft:'10px'}}
                            name="first_name"
                            label="First Name"
                            variant="outlined"
                            value={newUser.first_name}
                            onChange={handleNewUserChange}
                            required
                        />
                        <TextField
                            name="last_name"
                            label="Last Name"
                            variant="outlined"
                            value={newUser.last_name}
                            onChange={handleNewUserChange}
                            required
                        />
                        <TextField
                            name="email"
                            label="Email"
                            variant="outlined"
                            value={newUser.email}
                            onChange={handleNewUserChange}
                            required
                        />

                    </div>
                    <Button style={{marginLeft:'250px',marginTop:'20px'}} onClick={handleSaveNewUser} color="primary" variant="contained">
                        Save
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default UsersTable;



