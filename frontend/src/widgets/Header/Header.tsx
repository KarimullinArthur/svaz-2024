import React from 'react';
import { AppBar,Typography, Toolbar} from "@mui/material"
import { Link } from 'react-router-dom';
import styles from './Header.module.css'
import ProfileButton from '../ProfileButton/ProfileButton';
import { observer } from 'mobx-react-lite';
import { ThemeToggleButton } from '@/app/ThemeContext';


const Header: React.FC = observer(() => {
  return (
    <AppBar sx={{width: "100vw"}}>
      <Toolbar className={styles.header}>

      <Link to={'/'}>
        <Typography className={styles.icon}  variant='h4'>ZVyaZ</Typography>
      </Link>
      <ThemeToggleButton />

      <div>
        <Typography variant="h6" align="right">
          <ProfileButton/>
        </Typography>
      </div>
      </Toolbar>

    </AppBar>
  );
});

export default Header;
