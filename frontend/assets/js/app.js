document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    const token = localStorage.getItem('labsystem_token');
    if (!token && !window.location.pathname.endsWith('index.html')) {
        window.location.href = 'index.html';
        return;
    }

    // Load user profile
    const userStr = localStorage.getItem('labsystem_user');
    if (userStr) {
        const user = JSON.parse(userStr);
        const profileElements = document.querySelectorAll('.user-name');
        profileElements.forEach(el => el.textContent = user.name);
        
        const avatarElements = document.querySelectorAll('.avatar');
        avatarElements.forEach(el => {
            el.textContent = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        });
        
        const roleElements = document.querySelectorAll('.user-role');
        roleElements.forEach(el => {
            el.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
        });
    }

    // Logout function
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Log the action
            const logs = JSON.parse(localStorage.getItem('labsystem_logs') || '[]');
            const user = JSON.parse(userStr || '{}');
            logs.push({
                action: 'logout',
                user: user.name,
                timestamp: new Date().toISOString(),
                ip: '192.168.1.100'
            });
            localStorage.setItem('labsystem_logs', JSON.stringify(logs));
            
            localStorage.removeItem('labsystem_token');
            localStorage.removeItem('labsystem_user');
            window.location.href = 'index.html';
        });
    }

    // Sidebar active state
    const currentPath = window.location.pathname.split('/').pop();
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'dashboard.html')) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
});

// Utility functions for mock DB
window.db = {
    get: (table) => JSON.parse(localStorage.getItem(`labsystem_${table}`) || '[]'),
    set: (table, data) => localStorage.setItem(`labsystem_${table}`, JSON.stringify(data)),
    add: (table, item) => {
        const data = window.db.get(table);
        item.id = Date.now();
        item.created_at = new Date().toISOString();
        data.push(item);
        window.db.set(table, data);
        return item;
    },
    update: (table, id, item) => {
        let data = window.db.get(table);
        const index = data.findIndex(d => d.id == id);
        if (index > -1) {
            data[index] = { ...data[index], ...item, updated_at: new Date().toISOString() };
            window.db.set(table, data);
            return data[index];
        }
        return null;
    }
};

// Seed mock data if not exists
if (!localStorage.getItem('labsystem_seeded')) {
    const defaultExams = [
        { id: 1, code: 'HEM01', name: 'Hemograma Completo', category: 'Hematologia', price: 25.00 },
        { id: 2, code: 'GLI01', name: 'Glicose em Jejum', category: 'Bioquímica', price: 15.00 },
        { id: 3, code: 'COL01', name: 'Colesterol Total e Frações', category: 'Bioquímica', price: 30.00 }
    ];
    
    const defaultPatients = [
        { id: 1, full_name: 'João Carlos Silva', cpf: '123.456.789-00', birth_date: '1985-05-12', phone: '(11) 98765-4321', created_at: new Date().toISOString() },
        { id: 2, full_name: 'Maria Oliveira Souza', cpf: '987.654.321-99', birth_date: '1992-10-25', phone: '(11) 91234-5678', created_at: new Date().toISOString() }
    ];

    window.db.set('exams', defaultExams);
    window.db.set('patients', defaultPatients);
    window.db.set('requests', []);
    localStorage.setItem('labsystem_seeded', 'true');
}
