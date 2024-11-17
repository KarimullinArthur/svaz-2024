import React, { useState } from 'react';
import {AdminForm} from './AdminForm';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import {Axios} from '@/api/Axios'

interface User {
  _id: string;
  username: string;
  email?: string;
  blocked: boolean;
  isAdmin: boolean;
  isOperator: boolean;
}

export const AdminPage = () => {
  const [searchUsername, setSearchUsername] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(false);

  // Handle search by username
  const handleSearch = async () => {
    setError(null);
    try {
      const response = await Axios.get(`/admin/user/username/${searchUsername}`);
      setUser(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'User not found');
      setUser(null);
    }
  };

  const handleSuccess = () => {
    setRefresh(!refresh);
    setUser(null);
    setSearchUsername('');
  };

  const handleType: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    setSearchUsername(e.target.value)
    if(e.target.value.length===0){
      setUser(null)
    }
  }


  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5 }}>
      <Typography variant="h4" mb={4}>
        Admin Dashboard
      </Typography>

      {/* Username Search */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <TextField
          fullWidth
          label="Search by Username"
          value={searchUsername}
          onChange={handleType}
        />
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Search
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Display User Info if Found */}
      {user && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6">User Found:</Typography>
          <Typography>ID: {user._id}</Typography>
          <Typography>Username: {user.username}</Typography>
          <Typography>Email: {user.email || 'N/A'}</Typography>
          <Typography>Blocked: {user.blocked ? 'Yes' : 'No'}</Typography>
          <Typography>Admin: {user.isAdmin ? 'Yes' : 'No'}</Typography>
          <Typography>Operator: {user.isOperator ? 'Yes' : 'No'}</Typography>
        </Box>
      )}

      {/* User Form for Edit/Delete using User ID */}
      <AdminForm userId={user?._id} onSuccess={handleSuccess} />
    </Box>
  );
};
