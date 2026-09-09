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
        
        // Mock authentication (simulate network request)
        setTimeout(() => {
            if (email === 'admin@lab.com' && password === 'senha123') {
                // Generate fake token and user data
                const user = {
                    id: 1,
                    name: 'Dra. Ana Silva',
                    email: 'admin@lab.com',
                    role: 'administrador',
                    crbm: '12345-CRBM'
                };
                
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
                alert('Credenciais inválidas. Use: admin@lab.com / senha123');
            }
        }, 1000);
    });
});
