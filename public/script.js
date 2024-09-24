document.addEventListener('DOMContentLoaded', () => {
    const userButton = document.getElementById('userButton');
    const adminButton = document.getElementById('adminButton');
    const userLoginForm = document.getElementById('userLoginForm');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const overlay = document.getElementById('overlay');
    const registerButton = document.getElementById('registerButton');
    const userLogin = document.getElementById('userLogin');
    const adminLogin = document.getElementById('adminLogin');

    function showForm(form) {
        overlay.style.display = 'block';
        form.style.display = 'block';
    }

    function hideForms() {
        overlay.style.display = 'none';
        userLoginForm.style.display = 'none';
        adminLoginForm.style.display = 'none';
    }

    userButton.addEventListener('click', () => {
        hideForms();
        showForm(userLoginForm);
    });

    adminButton.addEventListener('click', () => {
        hideForms();
        showForm(adminLoginForm);
    });

    adminLogin.addEventListener('click', () => {
        const adminUN = document.getElementById('usernameAdmin').value;
        const adminPW = document.getElementById('passwordAdmin').value;
    
        fetch('http://localhost:5000/adminlogin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: adminUN, password: adminPW })
        })
        .then(response => {
            if (!response.ok) {
                alert("response not received");
                return;
            }
            return response.json();
        })
        .then(data => {
            if (data.token) {
                localStorage.setItem('token', data.token);  // Store token in localStorage
                console.log('Login successful. Redirecting to AdminDisplay.html...');
                window.location.href = 'adminLogin.html';  // Correct redirection
            } else {
                console.log('Login failed. Showing error message.');
                alert( 'Invalid username or password');
                window.location.reload();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
            window.location.reload();
            // return;
        });
    });

    userLogin.addEventListener('click', () => {
        const userUN = document.getElementById('usernameUser').value;
        const userPW = document.getElementById('passwordUser').value;
        const userSC = document.getElementById('securityCode').value;
    
        if (userUN === '' || userPW === '' || userSC === '') {
            alert("Please fill in all fields");
            return;
        }
    
        fetch('http://localhost:5000/userlogin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: userUN, password: userPW, securitycode: userSC })
        })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem('token', data.token);  // Store token in localStorage
                alert("User logged in");
                window.location.href = `userLogin.html?username=${userUN}`;
            } else {
                alert("Incorrect details or admin has rejected your request for register");
                window.location.reload();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("An error occurred. Please try again later.");
            window.location.reload();
        });
    });
    
    registerButton.addEventListener('click', () => {
        const userUN = document.getElementById('usernameUser').value;
        const userPW = document.getElementById('passwordUser').value;
        const userSC = document.getElementById('securityCode').value;
    
        if (userUN === '' || userPW === '' || userSC === '') {
            alert("Please fill in all fields");
            return;
        }

        fetch('http://localhost:5000/requestUsers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ username: userUN, password: userPW, securitycode: userSC })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Request for user registration has been sent. Try to log in after 10 minutes. If accepted, the user can log in.");
            } else {
                alert("request not sent");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("An error occurred. Please try again later.");
            window.location.reload();
        });
    });
});
