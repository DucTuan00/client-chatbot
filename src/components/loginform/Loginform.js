import React, { useState } from 'react';
import './Loginform.css';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'
const Loginform = ({ onUserLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    const login = async () => {
        try {
            const response = await fetch('http://localhost:5000/users/login', { // Update URL to port 5000
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
    
            if (!response.ok) {
                throw new Error('Login failed');
            }
    
            const data = await response.json();
            console.log(data); // Check the successful login response
    
            // Optionally, store token or user info here
            
            if(data.token){
                
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', jwtDecode(data.token).id);
                onUserLogin(jwtDecode(data.token).name); // Pass the email or other relevant data to the parent component
            }else{
                onUserLogin(null);
            }
            
            
            
    
            navigate('/'); // Navigate to home after successful login
        } catch (error) {
            console.error(error);
            setMessage('Login failed. Please try again.');
        }
    };
    
    

    const register = async (name, email, password) => {
        if (!name || !email || !password) {
            setMessage('Please fill in all fields.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/users/registration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const responseData = await response.json(); // Parse the response
            console.log('Response Data:', responseData);

            if (!response.ok) {
                throw new Error(responseData.error || 'Registration failed');
            }

            setMessage('Registration successful! Please log in.');
            toggleMode();
        } catch (error) {
            console.error(error);
            setMessage(`Registration failed: ${error.message}`);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (isLogin) {
            login(); // Call login without parameters, using state
        } else {
            if (password !== confirmPassword) {
                setMessage('Passwords do not match.');
                return;
            }
            register(name, email, password);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setName('');
        setMessage('');
    };

    return (
        <div className="bg-fullscreen py-3 py-md-5">
            <div className="container">
                <div className="row justify-content-md-center">
                    <div className="col-12 col-md-11 col-lg-8 col-xl-7 col-xxl-6">
                        <div className="p-4 p-md-5 rounded shadow-sm custom-color">
                            <form onSubmit={handleSubmit}>
                                <div className="row gy-3 gy-md-4 overflow-hidden">
                                    <div className="col-12">
                                        <label htmlFor="email" className="form-label text-light">Email <span className="text-danger">*</span></label>
                                        <div className="input-group">
                                            <input type="email" className="form-control" name="email" id="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="password" className="form-label text-light">Password <span className="text-danger">*</span></label>
                                        <div className="input-group">
                                            <input type="password" className="form-control" name="password" id="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                                        </div>
                                    </div>
                                    {!isLogin && (
                                        <>
                                            <div className="col-12">
                                                <label htmlFor="confirmPassword" className="form-label text-light">Confirm Password <span className="text-danger">*</span></label>
                                                <div className="input-group">
                                                    <input type="password" className="form-control" name="confirmPassword" id="confirmPassword" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                                </div>
                                            </div>
                                            <div className="col-12">
                                                <label htmlFor="name" className="form-label text-light">Name <span className="text-danger">*</span></label>
                                                <div className="input-group">
                                                    <input type="text" className="form-control" name="name" id="name" required value={name} onChange={(e) => setName(e.target.value)} />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    <div className="col-12">
                                        <div className="d-grid">
                                            <button type="submit">
                                                {isLogin ? 'Log In' : 'Register'}
                                            </button>
                                        </div>
                                    </div>
                                    {message && (
                                        <div className="col-12">
                                            <div className="alert alert-danger" role="alert">
                                                {message}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </form>
                            <div className="row">
                                <div className="col-12">
                                    <hr className="mt-5 mb-4 border-secondary-subtle" />
                                    <div className="d-flex gap-2 gap-md-4 flex-column flex-md-row justify-content-md-center">
                                        <a href="#!" onClick={toggleMode} className="link-secondary text-decoration-none">
                                            {isLogin ? 'Create new account' : 'Already have an account? Log In'}
                                        </a>
                                        <a href="#!" className="link-secondary text-decoration-none">Forgot password</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Loginform;
