import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SearchIcon from '@mui/icons-material/Search';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { Box, IconButton, useTheme } from '@mui/material';
import InputBase from '@mui/material/InputBase';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ColorModeContext, tokens } from '../../../src/theme';
import { UserContext } from '../../App';
import { LogoutOutlined } from '@mui/icons-material';

const Topbar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);
    const { setIsAuthorized } = useContext(UserContext);
    const navigate = useNavigate();

    function logout() {
        localStorage.removeItem('user');
        localStorage.setItem('isAuthorized', false);
        setIsAuthorized(false);
        navigate('/');
    }

    return (
        <Box display="flex" justifyContent="space-between" p={2}>
            {/* SEARCH BAR */}
            <Box
                display="flex"
                backgroundColor={colors.primary[400]}
                borderRadius="3px"
            >
                <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
                <IconButton type="button" sx={{ p: 1 }}>
                    <SearchIcon />
                </IconButton>
            </Box>

            {/* ICONS */}
            <Box display="flex">
                <IconButton onClick={colorMode.toggleColorMode}>
                    {theme.palette.mode === 'dark' ? (
                        <DarkModeOutlinedIcon />
                    ) : (
                        <LightModeOutlinedIcon />
                    )}
                </IconButton>
                <IconButton>
                    <NotificationsOutlinedIcon />
                </IconButton>
                <IconButton onClick={() => navigate('/profileForm')}>
                    <SettingsOutlinedIcon />
                </IconButton>
                <IconButton onClick={() => navigate('/profile')}>
                    <PersonOutlinedIcon />
                </IconButton>
                <IconButton onClick={() => logout()}>
                    <LogoutOutlined />
                </IconButton>
            </Box>
        </Box>
    );
};

export default Topbar;
