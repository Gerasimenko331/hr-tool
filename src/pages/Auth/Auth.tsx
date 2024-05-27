
import React, {useState, ChangeEvent} from 'react';
import { Button, Typography, Container, TextField, CircularProgress } from '@mui/material';
import { LoginUser } from '../../api/auth/auth';

export const Auth: React.FC = () => {

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [errorPasswordMessage, setErrorPasswordMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLoginChange = (event: ChangeEvent<HTMLInputElement>) => {
        setLogin(event.target.value);
    };

    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        const errorCode = await LoginUser(login, password);
        setIsLoading(false);
        if (errorCode !== 0) {
            setErrorPasswordMessage('Неправильный пароль или логин.');
        } else {
            setErrorPasswordMessage('');
            window.location.reload();
        }
    };

    return (
        <Container maxWidth="sm" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '200px', height: '400px', justifyContent: 'space-between' }}>
            <Typography variant="h5" style={{ margin: '20px 0' }}>
                Добро пожаловать! Пожалуйста, авторизуйтесь
            </Typography>
            <TextField
                id="outlined-password-input"
                label="Login"
                type="login"
                autoComplete="current-login"
                onChange={handleLoginChange}
            />
            <TextField
                error={errorPasswordMessage!==''}
                id="outlined-password-input"
                label="Password"
                type="password"
                autoComplete="current-password"
                onChange={handlePasswordChange}
                helperText={errorPasswordMessage}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
            >
                Войти
            </Button>
            {isLoading && <CircularProgress />}
        </Container>
    );
};
