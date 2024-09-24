// Initialize the addBenefit variable with the correct ID of the add button
const addBenefit = document.getElementById('addButton'); // Ensure 'addButton' matches the ID in your HTML
var userId;
// Function to show the popup
function showPopup() {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('popupForm').style.display = 'block';
    
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:5000/benefits', true);
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const benefitsData = JSON.parse(xhr.responseText);
            const btable = document.getElementById('btable');
            btable.innerHTML = `<thead>
                <tr>
                    <th>id</th>
                    <th>benefit name</th>
                    <th>description</th>
                    <th>eligibility criteria</th>
                    <th>coverage amount</th>
                    <th>start date</th>
                    <th>end date</th>
                    <th>Add</th>
                </tr></thead>`; // Clear the table before adding new rows
            
            for (const bene of benefitsData) {
                const row = document.createElement('tr');
                row.className = 'benefit';
                row.id = 'row' + bene.id;
                row.innerHTML = `
                    <td class="id">${bene.id}</td>
                    <td class="name">${bene.benefit_name}</td>
                    <td class="desc">${bene.description}</td>
                    <td class="elig">${bene.eligibility_criteria}</td>
                    <td class="amt">${bene.coverage_amount}</td>
                    <td class="start">${bene.start_date}</td>
                    <td class="end">${bene.end_date}</td>
                    <td class="addB">
                        <button class="addB" id="add${bene.id}" onclick="addBenefitByID(${bene.id})">add</button>
                        
                    </td>

                `;
                btable.appendChild(row);
            }
        } else if (xhr.readyState === 4) {
            console.error("Error accessing data: " + xhr.statusText);
            alert("Error accessing data(all benefits)");
        }
    };
}

// Function to hide the popup
function hidePopup() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('popupForm').style.display = 'none';
}

// Add event listeners for the cross button and overlay
document.getElementById('cross').addEventListener('click', hidePopup);
document.getElementById('overlay').addEventListener('click', hidePopup);

// Load the page and display user benefits
window.onload = () => {
    const params = new URLSearchParams(window.location.search);
    const username = params.get('username');

    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:5000/users', true);
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const userData = JSON.parse(xhr.responseText);
            for (const user of userData) {
                if (user.username === username) {
                    userId=user.id;
                    display(user.id);
                }
            }
        } else if (xhr.readyState === 4) {
            console.error("Error accessing data: " + xhr.statusText);
            alert("Error accessing data(user id)");
        }
    };
};

// Function to display user benefits
function display(id) {
    const table = document.getElementById('userBenefitTable');
    // table.innerHTML = ''; // Clear the table before adding new rows

    const xhr = new XMLHttpRequest();
    xhr.open('GET', `http://localhost:5000/inventorys/${id}`, true);
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const benefitsData = JSON.parse(xhr.responseText);
            for (const bene of benefitsData) {
                const row = document.createElement('tr');
                row.className = 'benefit';
                row.id = 'row' + bene.id;
                row.innerHTML = `
                    <td class="id">${bene.benefitsID}</td>
                    <td class="name">${bene.benefit_name}</td>
                    <td class="desc">${bene.description}</td>
                    <td class="elig">${bene.eligibility_criteria}</td>
                    <td class="amt">${bene.coverage_amount}</td>
                    <td class="start">${bene.start_date}</td>
                    <td class="end">${bene.end_date}</td>
                    <td>
                    <button class="delete" onclick="deleteBenefit(${bene.id})">delete</button>
                    <button class="specialB" onclick="special(${row.id})"> Special </button>
                    </td>
                `;
                table.appendChild(row);
            }
        } else if (xhr.readyState === 4) {
            console.error("Error accessing data: " + xhr.statusText);
            alert("Error accessing data(benefits user table)");
        }
    };
}

// Add an event listener to the addBenefit button
addBenefit.addEventListener('click', () => {
    showPopup(); // Show the popup when the button is clicked
});
// Function to add a benefit by ID
function addBenefitByID(Benefitid) {
    fetch("http://localhost:5000/requestBenefits", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('token')}` // Uncomment if you use token-based authentication
        },
        body: JSON.stringify({ user_id: userId, benefitsID: Benefitid })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Benefit request sent successfully");
            // Optionally, reload the page or update UI here
            // window.location.reload();
        } else {
            alert("Request for adding benefit was rejected");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("An error occurred. Please try again later.");
    });
}
function deleteBenefit(invenID) {
    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', `http://localhost:5000/inventorys/${invenID}`, true);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 201) {
                alert("Benefit deleted successfully");
                window.location.reload();
            } else {
                alert("Error deleting benefit: " + xhr.statusText);
            }
        }
    };
}

function special(id)
{
    if(id.style.backgroundColor === 'lightblue')
    {
        id.style.backgroundColor = 'white';
    }
    else{
    id.style.backgroundColor = 'lightblue';
    }

}
