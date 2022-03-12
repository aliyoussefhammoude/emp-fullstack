

//
//
// THIS FILE (client.js) is the FrontEnd of the whole application
//
//


import React, { useState, useEffect } from 'react';
import ReactTable from "react-table-6";
import "react-table-6/react-table.css"; 
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

import './client.css';

function Client() {
 
  const [user, setUser] = useState({});

  const [allManagers, setAllManagers] = useState({});
  const [allCEO, setAllCEO] = useState({});
  const [ceosAndManagers, setCeosAndManagers] = useState();
  const [managerids, setManagerids] = useState();

 
 // this is the useEffect to give me everything i need from the database on page load.
  useEffect(() => {
    let managerOpt = document.querySelector('#managers');

    fetch("http://localhost:5000/getAllData")
    .then(response => response.json())
    .then(data => {
      // console.log(data['data'])
      setUser(data['data'])
    })


    fetch('http://localhost:5000/getAllManagers')
    .then(response => response.json())
    .then(data => {
        //getChefs(data['data'])
        setAllManagers(data['data'])
    })


    fetch('http://localhost:5000/getAllCeo')
    .then(response => response.json())
    .then(data => {

      setAllCEO(data['data'])

    })

    fetch('http://localhost:5000/getAllCeoAndManagers')
    .then(response => response.json())
    .then(data => {

      setCeosAndManagers(data['data'])
      //to remove all child options from all the renders before last render in "Managed by: "
      //otherwise it will give me dublicates of everything every new render.
      removeAllChildNodes(managerOpt);

    })

    fetch('http://localhost:5000/getAllManageid')
    .then(response => response.json())
    .then(data => {

      setManagerids(data['data'])

    })
  }, [])
  
    
  // this is the columns for the table.
  const columns = [{  
      Header: 'ID',  
      accessor: 'id'  
    },{  
      Header: 'First Name',  
      accessor: 'firstname'  
    },{
      Header: 'Last Name',  
      accessor: 'lastname'
    },{
      Header: 'Salary',  
      accessor: 'salary'
    },{
      Header: 'Is CEO',  
      accessor: 'isceo'
    },{
      Header: 'Is Manager',  
      accessor: 'ismanager'
    },{
      Header: 'Managed By',  
      accessor: 'managerid'
    },{
      Header: 'Edit',  
      accessor: 'edit'
    },{
      Header: 'Delete',  
      accessor: 'delete'
    }];


    // this function handles salary depending on rank and employment times the coefficient
    // we use it to send the end result to the database
    const handleSalary = () => {
        const employment = document.querySelector("#employment").value
        const rankInput = document.querySelector('#rank').value;
        
        if (employment === "Employee") {
          return (rankInput * 1.125)
        }else if (employment === "Manager") {
            return (rankInput * 1.725)
        }else if (employment === "CEO") {
            return (rankInput * 2.725)
        }
    }

    // this function returns if the employee is a ceo or not
    // we use it to send the end result to the database
    const HandleisCEO = () => {
        const employment = document.querySelector("#employment").value

        if (employment === "Employee") {
            return false
        }else if (employment === "Manager") {
            return false
        }else if (employment === "CEO") {
            return true
        }
    }

    // this function returns if the employe is a manager or not
    // we use it to send the end result to the database
    const HandleisManager = () => {
        const employment = document.querySelector("#employment").value

        if (employment === "Employee") {
            return false
        }else if (employment === "Manager") {
            return true
        }else if (employment === "CEO") {
            return false
        }
    }

    // this function looks dynamicly at what ever data sent in as an object array
    // then returning the data inside options to have the ability to choose from the options later
    function getChefs(data) {
      const managerOpt = document.querySelector('#managers');
  
      Array.from(data).forEach(element => {
          var opt = document.createElement('option');
          opt.setAttribute("value", element.id);
          opt.setAttribute("id", "opts");
          opt.innerHTML = element.firstname
  
          managerOpt.appendChild(opt);
      })
    }

    // this function dynamicly removes all the options from parent element, 
    // this is used to clear all options to escape dublicates when render multiple times
    function removeAllChildNodes(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    // this function looks at what you choose in the "what kind of employment" options
    // it looks at the database, if there already is a CEO there, then you cant create another one
    function ceoOrManagers() {
      const employmentInput = document.querySelector('#employment').value;
      let managerOpt = document.querySelector('#managers');

            if (allCEO[0] && employmentInput === "CEO") {
                document.getElementById("add-btn").disabled = true;
                document.querySelector('#div').style.display = "none";  

            }else if(allCEO[0] && employmentInput === "Employee") {
                removeAllChildNodes(managerOpt);

                document.getElementById("add-btn").disabled = false;
                document.querySelector('#div').style.display = "block";
                getChefs(allManagers);
                

            }else if(allCEO[0] && employmentInput === "Manager") {
              removeAllChildNodes(managerOpt);

              document.getElementById("add-btn").disabled = false;
              document.querySelector('#div').style.display = "block";
              getChefs(ceosAndManagers)

          }else if(!allCEO[0] && (employmentInput === "Employee" || employmentInput === "Manager" || employmentInput === "CEO")) {
                document.getElementById("add-btn").disabled = false;
                document.querySelector('#div').style.display = "block";  
            }
    }


    // this function gives me the ID of the row you just clicked "edit" on
    // this is for later use, when you really edit then it updates the right ID-row
    function handleEditRow(id) {
      const updateSection = document.querySelector('#update-row');
      updateSection.hidden = false;
      id = Object.values(id.currentTarget)[1].rowid;

      document.querySelector("#idnr").value= id;
    }

    // this function updates the database with all the new information you just edited
    // on the specific row with the help of handleEditRow-function for the right ID
    function handleUpdate() {
        const updateEmpInput = document.querySelector('#update-emp-input');
        const updateNameInput = document.querySelector('#update-name-input');

        const isCEO = () => {
            if (updateEmpInput.value === "Employee") {
                return false
            }else if (updateEmpInput.value === "Manager") {
                return false
            }else if (updateEmpInput.value === "CEO") {
                return true
            }
        }
        const isMANAGER = () => {
            if (updateEmpInput.value === "Employee") {
                return false
            }else if (updateEmpInput.value === "Manager") {
                return true
            }else if (updateEmpInput.value === "CEO") {
                return false
            }
        }
        fetch('http://localhost:5000/update', {
            method: 'PATCH',
            headers: {
                'Content-type' : 'application/json'
            },
            body: JSON.stringify({
                id: document.querySelector("#idnr").value,
                firstname: updateNameInput.value,
                isceo: isCEO(),
                ismanager: isMANAGER()
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload();
            }
        })
    }

    // this function deletes the row in the table
    // if an employee has a manager, then you can't delete the row
    function deleteRowById(id) {

      let manArray = [];
      let allManagers = [];
      const theId = Object.values(id.currentTarget)[1].rowid;

      id = theId;
      document.querySelector("#idnr").value= id;

      manArray = (Array.of(managerids));
      let y = Object.values(manArray[0]);

      y.filter(x=>allManagers.push(x.managerid));

      if (allManagers.includes(theId)) {
        alert("This employee is a manager for someone, you can't delete!")
      }else{

          fetch('http://localhost:5000/delete/' + id, {
              method: 'DELETE'
          })
          .then(response => response.json())
          .then(data => {
              if (data.success) {
                  location.reload();
              }
          });
      }
    }


    // this function inserts new row in the table with the new information, 
    // here is also some validation and requirements to create the row
    function handleClick(e) {
      e.preventDefault()

      if ((document.querySelector("#fname").value === "") || (document.querySelector("#lname").value === "")) {

        alert("Name is required, please man, fill in some values...");

      }else {

        fetch('http://localhost:5000/insert', {
          headers: {
              'Content-type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify({
              firstname : document.querySelector("#fname").value,
              lastname : document.querySelector("#lname").value,
              salary : handleSalary(),
              isceo : HandleisCEO(),
              ismanager : HandleisManager(),
              managerid : document.querySelector('#managers').value
          })
        })
        .then(response => response.json())
        .then(data => insertRowIntoTable(data['data']))
      
        location.reload();

        }
    }

// here is the JSX / HTML for the whole page -->
    return (
      
    <div className="App">
      <div className='formClass'>
        <form>
            <label>Enter your first name:
              <input
                className="space"
                type="text" 
                id="fname"
                name="firstn"
                required
              />
            </label>

            <div className="break"></div>

            <label>Enter your last name:
              <input
                className="space"
                type="text" 
                id="lname"
                name="lastn"
              />
            </label>

            <div className="break"></div>

            <label >What kind of employment?
              <select className="space" id="employment" onChange={ceoOrManagers} defaultValue="" >
                  <option value="Employee">Employee</option>
                  <option value="Manager">Manager</option>
                  <option value="CEO">CEO</option>
              </select>
              
            </label>

            <div className="break"></div>

            <label>How many years of experience do you have?
            <select className="space" id="rank">
                  <option value={1} >1 year</option>
                  <option value={2} >2 years</option>
                  <option value={3} >3 years</option>
                  <option value={4} >4 years</option>
                  <option value={5} >5 years</option>
                  <option value={6} >6 years</option>
                  <option value={7} >7 years</option>
                  <option value={8} >8 years</option>
                  <option value={9} >9 years</option>
                  <option value={10} >10 years</option>
              </select>
            </label>

            <div className="break"></div>

            <div id="div">
              <label>Managed by: 
                    <select className="space" id="managers" onLoad={getChefs(allManagers)}>
                      <option value={null} ></option>
                    </select>
              </label>
            </div>

            <div className="break"></div>

            <input type="submit" id="add-btn" onClick={handleClick}/>
        </form>

        <section hidden id="update-row">
              <input id="idnr" hidden></input>

              <label>Name: </label>
              <input type="text" id="update-name-input"/>
              <div className="break"></div>

              <label>Employment: </label>
              <select id="update-emp-input">
                  <option value="Employee">Employee</option>
                  <option value="Manager">Manager</option>
                  <option value="CEO">CEO</option>
              </select>
              <button id="update-row-btn" onClick={handleUpdate}>Update</button>
        </section>
    </div>



      <ReactTable data={Array.from(user).map(x => {
        // console.log(x)
          x.delete = <Button className="delete-row-btn" rowid={x.id} onClick={deleteRowById}>Delete</Button>;
          x.edit = <Button className="edit-row-btn" rowid={x.id} onClick={handleEditRow}>Edit</Button>;
          return x
        })} 
                  columns={columns}
      />

      
    </div>
    );
  
}

export default Client;
