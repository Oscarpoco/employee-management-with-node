import './signIn.css';
import Notification from './notification';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/FirebaseConfig';

function SignIn({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [notification, setNotification] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();
        
        try {
            // Firebase email/password sign-in
            await signInWithEmailAndPassword(auth, username, password);
            onLogin();
        } catch (error) {
            setNotification('Invalid credentials');
            setTimeout(() => setNotification(''), 2000);
        }
    };

    return (
        <div className='form-box'>
            <div className='sign-in-form'>
                <div className='admin'>ADMIN LOGIN</div>
                <form onSubmit={handleLogin}>
                    <input
                        type='text'
                        id='username'
                        placeholder='Username'
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type='password'
                        id='password'
                        placeholder='Password'
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button>LOGIN</button>
                    {notification && <Notification message={notification} type="success" />}
                </form>
            </div>
            <div className='logo-box'>
                <img src='admin.jpeg' alt='logo' />
            </div>
        </div>
    );
}

export default SignIn;
