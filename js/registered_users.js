// The directory is restricted until a server-side administrative role exists.
document.addEventListener('DOMContentLoaded', () => {
    const table = document.getElementById('users-table-body');
    if (table) table.replaceChildren();
    const message = document.getElementById('no-users-message');
    if (message) {
        message.textContent = 'The user directory is restricted for privacy.';
        message.style.display = 'block';
    }
    for (const id of ['prev-page', 'next-page', 'user-search']) {
        const element = document.getElementById(id);
        if (element) element.disabled = true;
    }
});
