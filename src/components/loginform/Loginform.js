import React, { useState } from 'react';
import "./Loginform.css"
import { useNavigate } from 'react-router-dom';

const Loginform = () => {
    // Mock data
    const [email, setEmail] = useState('user@example.com');
    const [password, setPassword] = useState('password123');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('John Doe');
    const [isLogin, setIsLogin] = useState(true);
    const [message, setMessage] = useState('');

    const navigate = useNavigate();
    const handleSubmit = (e) => {
 
        e.preventDefault();
        // Here you would handle form submission, e.g., authentication
        if (isLogin) {
            // Mock login logic
            if (email !== 'user@example.com' || password !== 'password123') {
                setMessage('Invalid email or password');
            } else {
                setMessage('Login successful!');
                navigate('/home');
            }
        } else {
            // Mock registration logic
            if (password !== confirmPassword) {
                setMessage('Passwords do not match');
            } else {
                setMessage('Registration successful!');
            }
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setMessage(''); // Clear message on toggle
        setEmail(''); // Clear email
        setPassword(''); // Clear password
        setConfirmPassword(''); // Clear confirm password
        setName(''); // Clear name
    };

    return (
        <div className="bg-fullscreen py-3 py-md-5">
            <div className="container">
                <div className="row justify-content-md-end">
                    <div className="col-12 col-md-11 col-lg-8 col-xl-7 col-xxl-6">
                        <div className="p-4 p-md-5 rounded shadow-sm custom-color">
                            <div className="row">
                                <div className="col-12">
                                    <div className="text-center mb-5">
                                        <a href="#!">
                                            <img src="logo.png" alt="BootstrapBrain Logo" width="150px" height="75px" />
                                        </a>
                                    </div>
                                </div>
                            </div>
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
                                            <button className="btn btn-primary btn-lg" type="submit">
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