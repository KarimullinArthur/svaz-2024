import React, { useState, useEffect } from 'react';
import { TextField, Checkbox, FormControlLabel, Button, Box, Typography, Alert } from '@mui/material';
import {Axios} from '@/api/Axios'

interface UserFormProps {
  userId?: string;
  onSuccess?: () => void;
}

export const AdminForm: React.FC<UserFormProps> = ({ userId, onSuccess }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [blocked, setBlocked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOperator, setIsOperator] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Fetch user details by ID when the form is loaded
  useEffect(() => {
    if(!userId)return
    Axios
      .get(`/admin/user/${userId}`)
      .then((response) => {
        const user = response.data;
        setUsername(user.username);
        setEmail(user.email || '');
        setBlocked(user.blocked);
        setIsAdmin(user.isAdmin);
        setIsOperator(user.isOperator);
        setPassword(''); // Do not populate password for security reasons
      })
      .catch((err) => setError(err.response?.data?.message || 'Error fetching user data'));
  }, [userId]);

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const userData = {
      email: email || undefined,
      blocked,
      isAdmin,
      isOperator,
      password: password || undefined,
      username
    };
    
    try {
      if(userId){
        await Axios.patch(`/admin/user/${userId}`, userData);
      }else{
        await Axios.post(`/admin/user`, userData);
      }
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error saving user data');
    }
  };

  // Handle delete user by ID
  const handleDelete = async () => {
    try {
      await Axios.delete(`/admin/user/${userId}`);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error deleting user');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" mb={2}>{userId ? "Update" : "Create"} User</Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TextField fullWidth label="Username" value={username} onChange={(e) => setUsername(e.target.value)} sx={{ mb: 2 }} />
      <TextField
        fullWidth
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        sx={{ mb: 2 }}
      />

      <FormControlLabel
        control={<Checkbox checked={blocked} onChange={(e) => setBlocked(e.target.checked)} />}
        label="Blocked"
      />
      <FormControlLabel
        control={<Checkbox checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />}
        label="Admin"
      />
      <FormControlLabel
        control={<Checkbox checked={isOperator} onChange={(e) => setIsOperator(e.target.checked)} />}
        label="Operator"
      />

      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button variant="contained" color="primary" type="submit">{userId ? "Update": "Create"}</Button>
        {userId && <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>}
      </Box>
    </Box>
  );
};
