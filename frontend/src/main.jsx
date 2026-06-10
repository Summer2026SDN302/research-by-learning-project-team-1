import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <App />
                <Toaster
                    position='top-right'
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: '#ffffff',
                            border: '1px solid oklch(0.92 0.01 260)',
                            color: 'oklch(0.15 0.02 260)',
                            borderRadius: '8px',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                            fontSize: '14px',
                            padding: '12px 16px',
                            fontWeight: '500'
                        }
                    }}
                />
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>
);
