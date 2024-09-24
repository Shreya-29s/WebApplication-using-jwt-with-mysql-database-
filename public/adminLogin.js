const table = document.getElementById('tableBenefits');
const addForm = document.getElementById('addBenefit');
const updateForm = document.getElementById('updateBenefit');
const requestP=document.getElementById('requestP');
window.onload = () => {
    display();
    addForm.style.display = 'none';
    updateForm.style.display = 'none';
    requestP.style.display='none';
};

function display() {
    const benefitsRequest = new XMLHttpRequest();
    const usersRequest = new XMLHttpRequest();

    benefitsRequest.open("GET", "http://localhost:5000/benefits", true);
    benefitsRequest.send();
    benefitsRequest.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            const benefitsData = JSON.parse(this.responseText);
            renderTable(benefitsData);
        } else if (this.readyState === 4) {
            console.error("Error fetching benefits data");
            alert("Error accessing benefits data");
        }
    };

    usersRequest.open("GET", "http://localhost:5000/users", true);
    usersRequest.send();
    usersRequest.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            const userData = JSON.parse(this.responseText);
            renderuserTable(userData);
        } else if (this.readyState === 4) {
            console.error("Error fetching users data");
            alert("Error accessing users data");
        }
    };
}

function renderTable(data) {
    // table.innerHTML = ""; 
    for (const bene of data) {
        const row = document.createElement('tr');
        row.className = "benefit";
        row.id = 'row' + bene.id;
        row.innerHTML = `
        <td class="id">${bene.id}</td>
        <td class="name">${bene.benefit_name}</td>
        <td class="desc">${bene.description}</td>
        <td class="elig">${bene.eligibility_criteria}</td>
        <td class="amt">${bene.coverage_amount}</td>
        <td class="start">${bene.start_date}</td>
        <td class="end">${bene.end_date}</td>
        <td>
            <button class="button" onclick="showUpdateForm(${bene.id},'${bene.benefit_name}','${bene.description}','${bene.eligibility_criteria}','${bene.coverage_amount}','${bene.start_date}','${bene.end_date}')">Update</button>
            <button  class="button" onclick="deleteBenefit(${bene.id})">Delete</button>
        </td>`;
        table.appendChild(row);
    }
}

function renderuserTable(userData) {
    const container = document.getElementById('usersContainer'); // Assuming you have a container div with this ID
    container.innerHTML = ""; // Clear previous content

    for (const user of userData) {
        const div = document.createElement('div');
        div.className = "container" + user.id;
        div.id="user"+user.id;
        const userID=user.user_id;
        const h3 = document.createElement('h3');
        h3.innerHTML = user.username;
        const deleteU = document.createElement('button');
        deleteU.className="deleteU";
        deleteU.innerHTML = "Delete";
        deleteU.onclick = () => deleteUser(user.id);

        div.appendChild(h3);
        div.appendChild(deleteU);
        const userTable = document.createElement('table');
        userTable.id = "table" + user.id;

        const row = document.createElement('tr');
        row.className = "tableHeader";
        row.innerHTML = `
            <th>Benefit_Id</th>
            <th>Benefit_Name</th>
            <th>Description</th>
            <th>Eligibility_Criteria</th>
            <th>Coverage_Amount</th>
            <th>Start_Date</th>
            <th>End_Date</th>`;
        userTable.appendChild(row);

        div.appendChild(userTable);
        container.appendChild(div);

        const userBenefitsRequest = new XMLHttpRequest();
        userBenefitsRequest.open("GET", `http://localhost:5000/inventorys/${user.id}`, true);
        userBenefitsRequest.send();
        userBenefitsRequest.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                const userBenefits = JSON.parse(this.responseText);
                if(userBenefits.length !==0){
                for (const bene of userBenefits) {
                    const row = document.createElement('tr');
                    row.id = "benefits" + bene.user_id;
                    row.innerHTML = `
                        <td class="id">${bene.benefitsID}</td>
                        <td class="name">${bene.benefit_name}</td>
                        <td class="desc">${bene.description}</td>
                        <td class="elig">${bene.eligibility_criteria}</td>
                        <td class="amt">${bene.coverage_amount}</td>
                        <td class="start">${bene.start_date}</td>
                        <td class="end">${bene.end_date}</td>`;
                    userTable.appendChild(row);
                }
                }
                else{
                    userTable.innerHTML='';
                }
            } else if (this.readyState === 4) {
                console.error("Error fetching user benefits data");
                alert("Error accessing user benefits data");
            }
        };
    }
}


function addBenefit() {
    addForm.style.display = 'block';
    updateForm.style.display = 'none';

    const addSubmit = document.getElementById('addSubmit');
    const addcross=document.getElementById('cross');
    addcross.addEventListener( 'click' , () =>{
        addForm.style.display = 'none';
    });
    addSubmit.onclick = () => {
        const name = document.getElementById('benefitName').value;
        const desc = document.getElementById('Description').value;
        const elig = document.getElementById('Eligibility_Criteria').value;
        const amt = document.getElementById('Coverage_Amount').value;
        const start = document.getElementById('Start_Date').value;
        const end = document.getElementById('End_Date').value;

        if (validate(name, desc, elig, amt, start, end)) {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", "http://localhost:5000/inventorys", true);
            xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    display();
                    addForm.reset();
                    addForm.style.display = 'none';
                }
            };

            xhr.send(JSON.stringify({
                benefit_name: name,
                description: desc,
                eligibility_criteria: elig,
                coverage_amount: amt,
                start_date: start,
                end_date: end
            }));
        }
    };
}

function showUpdateForm(id,name,desc,elig,amt,start,end) {
    addForm.style.display = 'none';
    updateForm.style.display = 'block';

    const xhr = new XMLHttpRequest();

    xhr.open("GET", `http://localhost:5000/benefits/${id}`, true);
    xhr.send();
    xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            const benefitData = JSON.parse(this.responseText);
            console.log(benefitData.name); 
            console.log("update functionn ")
            document.getElementById('UbenefitName').value = name;
            document.getElementById('UDescription').value = desc;
            document.getElementById('UEligibility_Criteria').value = elig;
            document.getElementById('UCoverage_Amount').value = amt;
            document.getElementById('UStart_Date').value = start;
            document.getElementById('UEnd_Date').value = end;
        } else if (this.readyState === 4) {
            console.log("error");
            alert("Error accessing data");
        }
    };
    const updatecross=document.getElementById('Ucross');
    updatecross.addEventListener( 'click' , () =>{
        updateForm.style.display = 'none';
    })
    const updateSubmit = document.getElementById('updateSubmit');
    updateSubmit.onclick = () => updateBenefit(id);
}
function updateBenefit(id) {

    const name = document.getElementById('UbenefitName').value;
    const desc = document.getElementById('UDescription').value;
    const elig = document.getElementById('UEligibility_Criteria').value;
    const amt = document.getElementById('UCoverage_Amount').value;
    const start = document.getElementById('UStart_Date').value;
    const end = document.getElementById('UEnd_Date').value;

    if (validate(name, desc, elig, amt, start, end)) {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", `http://localhost:5000/benefits/${id}`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                display();
                updateForm.reset();
                updateForm.style.display = 'none';
            }
        };

        xhr.send(JSON.stringify({
            benefit_name: name,
            description: desc,
            eligibility_criteria: elig,
            coverage_amount: amt,
            start_date: start,
            end_date: end
        }));
    }
}


function deleteBenefit(id) {
    const xhr = new XMLHttpRequest();
    xhr.open("DELETE", `http://localhost:5000/benefits/${id}`, true);

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            display();
        }
    };

    xhr.send();
}

function validate(name, desc, elig, amt, start, end) {
    // Add your validation logic here
    if (!name || !desc || !elig || !amt || !start || !end) {
        alert("All fields are required.");
        return false;
    }
    return true;
}

function showRequest()
{
    requestP.style.display='block';
    
    fetchRequest();  
    document.getElementById('Rcross').addEventListener('click',()=>{
        requestP.style.display='none';
    }) 
}
function fetchRequest() {
    const table = document.getElementById('Brequest');
    const xhr = new XMLHttpRequest();
    const uxhr=new XMLHttpRequest();
    xhr.open("GET", "http://localhost:5000/requestBenefits", true);
    
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            console.log(data);
            for (const req of data) {
                const row = document.createElement('tr');
                row.id = "request" + req.id;
                row.className = "requests";
                row.innerHTML = `
                <td>${req.id}</td>
                <td>${req.user_id}</td>
                <td>${req.benefitsID}</td>
                <td>${req.status}</td>
                <td>
                    <button class="accept" onclick="acceptBRequest(${req.id},${req.user_id},${req.benefitsID})">Accept</button>
                    <button class="reject" onclick="rejectBRequest(${req.id},${req.user_id},${req.benefitsID})">Reject</button>
                    <button class="delete" onclick="deleteB(${req.id})">Delete</button>
                </td>
                `;
                table.appendChild(row);
            }
        }
        else{
            console.log(xhr.statusText);
        }
    };
    xhr.send();

    const Utable = document.getElementById('Urequest');
    uxhr.open("GET", "http://localhost:5000/requestUsers", true);
    uxhr.send();
    uxhr.onreadystatechange = function() {
        if (uxhr.readyState === 4 && uxhr.status === 200) {
            const data = JSON.parse(uxhr.responseText);
            for (const req of data) {
                // console.log(req);
                const row = document.createElement('tr');
                row.id = "request" + req.id;
                row.className = "requests";
                row.innerHTML = `
                <td>${req.id}</td>
                <td>${req.username}</td>
                <td>${req.securitycode}</td>
                <td>${req.status}</td>
                <td>
                    <button class="accept" onclick="acceptURequest(${req.id},'${req.username}','${req.password}','${req.securitycode}')">Accept</button>
                    <button class="reject" onclick="rejectURequest(${req.id})">Reject</button>
                    <button class="delete" onclick="deleteU(${req.id})">Delete</button>
                </td>
                `;
                Utable.appendChild(row);
            }
        }
    };
}

function acceptBRequest(id, userid, benefitsid) {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", `http://localhost:5000/requestBenefits/${id}`, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", `${localStorage.getItem('token')}`);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            alert("Accepted the request");
            // Update inventory
            // addToInventory(userid, benefitsid);
            window.reload();
        }
    };
    xhr.send(JSON.stringify({
        user_id:userid,
        benefitsID:benefitsid,
        status: "accepted"
    }));
}

function rejectBRequest(id,userid, benefitsid) {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", `http://localhost:5000/requestBenefits/${id}`, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", `${localStorage.getItem('token')}`);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            alert("Rejected the request");
            // Optionally remove the row from the table or update its status
        }
    };
    xhr.send(JSON.stringify({
        user_id:userid,
        benefitsID:benefitsid,
        status: "rejected"
    }));
}

function deleteB(id) {
    const xhr = new XMLHttpRequest();
    xhr.open("DELETE", `http://localhost:5000/requestBenefits/${id}`, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            alert("Deleted the request");
            document.getElementById(`request${id}`).remove(); // Remove the row from the table
        }
    };
    xhr.send();
}

function acceptURequest(id, userName, Password,securityCode) {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", `http://localhost:5000/requestUsers/${id}`, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", `Bearer ${localStorage.getItem('token')}`);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            alert("Accepted the request");
            // Update inventory
            // addToInventory(userid, benefitsid);
        }
    };
    xhr.send(JSON.stringify({
        username: userName,
        password: Password,
        securitycode: securityCode,
        status: "accepted"
    }));
}

function rejectURequest(id) {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", `http://localhost:5000/requestUsers/${id}`, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", `${localStorage.getItem('token')}`);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            alert("Rejected the request");
            // Optionally remove the row from the table or update its status
        }
    };
    xhr.send(JSON.stringify({
        status: "Rejected"
    }));
}

function deleteU(id) {
    const xhr = new XMLHttpRequest();
    xhr.open("DELETE", `http://localhost:5000/requestUsers/${id}`, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            alert("Deleted the request");
            document.getElementById(`request${id}`).remove(); // Remove the row from the table
        }
    };
    xhr.send();
}


function deleteUser(id){
    const xhr = new XMLHttpRequest();
    xhr.open("DELETE", `http://localhost:5000/users/${id}`, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            alert("Deleted the user");
            document.getElementById(`user${id}`).remove(); // Remove the row from the table
        }
    };
    xhr.send();

}