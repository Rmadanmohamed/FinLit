/**
 * Digital Financial Literacy & Inclusion Platform
 * Registered Users Display
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize auth manager
    const authManager = new AuthManager();
    
    // Initialize registered users table
    initRegisteredUsersTable(authManager);
    
    // Initialize search functionality
    initSearchFunctionality();
    
    // Initialize pagination
    initPagination();
});

/**
 * Initialize registered users table
 */
function initRegisteredUsersTable(authManager) {
    const tableBody = document.getElementById('users-table-body');
    const noUsersMessage = document.getElementById('no-users-message');
    
    if (!tableBody) return;
    
    // Get registered users
    const registeredUsers = authManager.getRegisteredUsers();
    
    // Check if there are any users
    if (registeredUsers.length === 0) {
        tableBody.innerHTML = '';
        noUsersMessage.style.display = 'block';
        return;
    }
    
    // Hide no users message
    noUsersMessage.style.display = 'none';
    
    // Sort users by registration date (newest first)
    registeredUsers.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Generate table rows
    let tableHTML = '';
    
    registeredUsers.forEach(user => {
        // Get first letter of username for avatar
        const firstLetter = user.username.charAt(0).toUpperCase();
        
        // Format date
        const registrationDate = new Date(user.date);
        const formattedDate = registrationDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        // Generate random number of calculations (for demo purposes)
        const calculationsCount = Math.floor(Math.random() * 10);
        
        // Create table row
        tableHTML += `
            <tr class="user-row" data-username="${user.username}" data-email="${user.email}">
                <td>
                    <div class="user-icon">
                        <div class="user-avatar">${firstLetter}</div>
                        ${user.username}
                    </div>
                </td>
                <td>
                    <div class="user-email">
                        <i class="fas fa-envelope"></i>
                        ${user.email}
                    </div>
                </td>
                <td>
                    <div class="user-date">
                        <i class="fas fa-calendar-alt"></i>
                        ${formattedDate}
                    </div>
                </td>
                <td>
                    <div class="user-calculations">
                        <span class="calculation-badge">
                            <i class="fas fa-calculator"></i>
                            ${calculationsCount}
                        </span>
                    </div>
                </td>
            </tr>
        `;
    });
    
    // Update table
    tableBody.innerHTML = tableHTML;
    
    // Add click event to rows for expanding details (optional feature)
    document.querySelectorAll('.user-row').forEach(row => {
        row.addEventListener('click', function() {
            const username = this.getAttribute('data-username');
            const email = this.getAttribute('data-email');
            
            // Toggle details row
            const detailsRow = document.querySelector(`.user-details-row[data-username="${username}"]`);
            
            if (detailsRow) {
                detailsRow.classList.toggle('active');
            } else {
                // Create details row if it doesn't exist
                const newDetailsRow = document.createElement('tr');
                newDetailsRow.className = 'user-details-row active';
                newDetailsRow.setAttribute('data-username', username);
                
                // Create details content
                newDetailsRow.innerHTML = `
                    <td colspan="4">
                        <div class="user-details-content">
                            <div class="user-detail-item">
                                <div class="user-detail-label">Username</div>
                                <div class="user-detail-value">${username}</div>
                            </div>
                            <div class="user-detail-item">
                                <div class="user-detail-label">Email</div>
                                <div class="user-detail-value">${email}</div>
                            </div>
                            <div class="user-detail-item">
                                <div class="user-detail-label">Status</div>
                                <div class="user-detail-value">
                                    <span class="status-indicator status-active"></span>
                                    Active
                                </div>
                            </div>
                            <div class="user-detail-item">
                                <div class="user-detail-label">Last Login</div>
                                <div class="user-detail-value">Today</div>
                            </div>
                        </div>
                    </td>
                `;
                
                // Insert after current row
                this.parentNode.insertBefore(newDetailsRow, this.nextSibling);
            }
        });
    });
    
    // Update pagination info
    updatePaginationInfo(registeredUsers.length);
}

/**
 * Initialize search functionality
 */
function initSearchFunctionality() {
    const searchInput = document.getElementById('user-search');
    const tableRows = document.querySelectorAll('.user-row');
    const noUsersMessage = document.getElementById('no-users-message');
    
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        let visibleRows = 0;
        
        tableRows.forEach(row => {
            const username = row.getAttribute('data-username').toLowerCase();
            const email = row.getAttribute('data-email').toLowerCase();
            
            if (username.includes(searchTerm) || email.includes(searchTerm)) {
                row.style.display = '';
                visibleRows++;
                
                // Hide details row if open
                const detailsRow = document.querySelector(`.user-details-row[data-username="${row.getAttribute('data-username')}"]`);
                if (detailsRow) {
                    detailsRow.classList.remove('active');
                }
            } else {
                row.style.display = 'none';
                
                // Hide details row
                const detailsRow = document.querySelector(`.user-details-row[data-username="${row.getAttribute('data-username')}"]`);
                if (detailsRow) {
                    detailsRow.style.display = 'none';
                }
            }
        });
        
        // Show/hide no users message
        if (visibleRows === 0) {
            noUsersMessage.style.display = 'block';
        } else {
            noUsersMessage.style.display = 'none';
        }
        
        // Update pagination info
        updatePaginationInfo(visibleRows);
    });
}

/**
 * Initialize pagination
 */
function initPagination() {
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    
    if (!prevButton || !nextButton) return;
    
    // For demo purposes, we'll just disable the buttons
    // In a real app, this would implement actual pagination
    prevButton.disabled = true;
    nextButton.disabled = true;
}

/**
 * Update pagination info
 */
function updatePaginationInfo(totalUsers) {
    const pageInfo = document.getElementById('page-info');
    
    if (!pageInfo) return;
    
    // For demo purposes, we'll just show the total number of users
    // In a real app, this would show actual page numbers
    pageInfo.textContent = `Showing ${totalUsers} user${totalUsers !== 1 ? 's' : ''}`;
}

/**
 * Add a new user to the table (called when a new user registers)
 */
function addNewUserToTable(user) {
    const tableBody = document.getElementById('users-table-body');
    const noUsersMessage = document.getElementById('no-users-message');
    
    if (!tableBody) return;
    
    // Hide no users message
    noUsersMessage.style.display = 'none';
    
    // Get first letter of username for avatar
    const firstLetter = user.username.charAt(0).toUpperCase();
    
    // Format date
    const registrationDate = new Date(user.date);
    const formattedDate = registrationDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
    
    // Create new row
    const newRow = document.createElement('tr');
    newRow.className = 'user-row highlight-new';
    newRow.setAttribute('data-username', user.username);
    newRow.setAttribute('data-email', user.email);
    
    // Set row content
    newRow.innerHTML = `
        <td>
            <div class="user-icon">
                <div class="user-avatar">${firstLetter}</div>
                ${user.username}
            </div>
        </td>
        <td>
            <div class="user-email">
                <i class="fas fa-envelope"></i>
                ${user.email}
            </div>
        </td>
        <td>
            <div class="user-date">
                <i class="fas fa-calendar-alt"></i>
                ${formattedDate}
            </div>
        </td>
        <td>
            <div class="user-calculations">
                <span class="calculation-badge">
                    <i class="fas fa-calculator"></i>
                    0
                </span>
            </div>
        </td>
    `;
    
    // Add to table at the top
    tableBody.insertBefore(newRow, tableBody.firstChild);
    
    // Update pagination info
    const totalUsers = document.querySelectorAll('.user-row').length;
    updatePaginationInfo(totalUsers);
    
    // Add click event for expanding details
    newRow.addEventListener('click', function() {
        const username = this.getAttribute('data-username');
        const email = this.getAttribute('data-email');
        
        // Toggle details row
        const detailsRow = document.querySelector(`.user-details-row[data-username="${username}"]`);
        
        if (detailsRow) {
            detailsRow.classList.toggle('active');
        } else {
            // Create details row
            const newDetailsRow = document.createElement('tr');
            newDetailsRow.className = 'user-details-row active';
            newDetailsRow.setAttribute('data-username', username);
            
            // Create details content
            newDetailsRow.innerHTML = `
                <td colspan="4">
                    <div class="user-details-content">
                        <div class="user-detail-item">
                            <div class="user-detail-label">Username</div>
                            <div class="user-detail-value">${username}</div>
                        </div>
                        <div class="user-detail-item">
                            <div class="user-detail-label">Email</div>
                            <div class="user-detail-value">${email}</div>
                        </div>
                        <div class="user-detail-item">
                            <div class="user-detail-label">Status</div>
                            <div class="user-detail-value">
                                <span class="status-indicator status-active"></span>
                                Active
                            </div>
                        </div>
                        <div class="user-detail-item">
                            <div class="user-detail-label">Last Login</div>
                            <div class="user-detail-value">Today</div>
                        </div>
                    </div>
                </td>
            `;
            
            // Insert after current row
            this.parentNode.insertBefore(newDetailsRow, this.nextSibling);
        }
    });
}

// Add sample users for demonstration if none exist
document.addEventListener('DOMContentLoaded', function() {
    const authManager = new AuthManager();
    const registeredUsers = authManager.getRegisteredUsers();
    
    // If no users exist, add sample users
    if (registeredUsers.length === 0) {
        const sampleUsers = [
            {
                username: 'JohnDoe',
                email: 'john.doe@example.com',
                date: new Date(2023, 0, 15).toISOString()
            },
            {
                username: 'JaneSmith',
                email: 'jane.smith@example.com',
                date: new Date(2023, 1, 20).toISOString()
            },
            {
                username: 'AhmedHassan',
                email: 'ahmed.hassan@example.com',
                date: new Date(2023, 2, 5).toISOString()
            },
            {
                username: 'SaraAli',
                email: 'sara.ali@example.com',
                date: new Date(2023, 3, 10).toISOString()
            },
            {
                username: 'MohamedKhalid',
                email: 'mohamed.khalid@example.com',
                date: new Date(2023, 4, 25).toISOString()
            }
        ];
        
        // Save sample users
        localStorage.setItem('registered_users', JSON.stringify(sampleUsers));
        
        // Reload the table
        initRegisteredUsersTable(authManager);
    }
});
