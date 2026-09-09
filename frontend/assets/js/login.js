document.addEventListener('DOMContentLoaded', () => {
    // Check if already logged in
    if (localStorage.getItem('labsystem_token')) {
        window.location.href = 'dashboard.html';
    }

    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const btn = loginForm.querySelector('button');
        
        // Visual feedback
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Autenticando...';
        btn.disabled = true;
        
        const errorDiv = document.getElementById('login-error');
        errorDiv.style.display = 'none'; // hide error initially
        
        // Mock authentication (simulate network request)
        setTimeout(() => {
            const users = {
                'admin@lab.com': { id: 1, name: 'Dra. Ana Silva', role: 'administrador', crbm: '12345-CRBM' },
                'bio@lab.com': { id: 2, name: 'Dr. Carlos Mendes', role: 'biomedico', crbm: '54321-CRBM' },
                'recepcao@lab.com': { id: 3, name: 'Juliana Costa', role: 'recepcao' }
            };

            if (users[email] && password === '123') {
                // Generate fake token and user data
                const user = { ...users[email], email };
                
                localStorage.setItem('labsystem_token', 'mock_jwt_token_123abc');
                localStorage.setItem('labsystem_user', JSON.stringify(user));
                
                // Log the access
                const logs = JSON.parse(localStorage.getItem('labsystem_logs') || '[]');
                logs.push({
                    action: 'login',
                    user: user.name,
                    timestamp: new Date().toISOString(),
                    ip: '192.168.1.100' // Mock IP
                });
                localStorage.setItem('labsystem_logs', JSON.stringify(logs));
                
                window.location.href = 'dashboard.html';
            } else {
                btn.innerHTML = originalText;
                btn.disabled = false;
                errorDiv.style.display = 'block';
                
                // Add shake animation again if already visible
                errorDiv.style.animation = 'none';
                errorDiv.offsetHeight; // trigger reflow
                errorDiv.style.animation = 'shake 0.4s ease-in-out';
            }
        }, 800);
    });
});
