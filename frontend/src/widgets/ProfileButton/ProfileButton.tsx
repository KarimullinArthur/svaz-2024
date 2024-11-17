import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import { Button, Typography } from '@mui/material';
import { StoreInstance } from '@/Store/Store';
import { observer } from 'mobx-react-lite';
import UserManagement from '../UserManagement/UserManagement';
import SignInForm from '../SignInForm/SignInForm';

const ProfileButton = observer(() => {
  const [open, setOpen] = useState(false);



  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const user = StoreInstance.user
  return (
    <div>
      <Button onClick={handleOpen} size="large" variant='contained'>{user ? user.username : 'Войти'}</Button>
      <Dialog open={open} onClose={handleClose}>
        {user ? <UserManagement  close={handleClose}/> : <SignInForm close={handleClose}/>}
      </Dialog>
    </div>
  );
})

export default ProfileButton;