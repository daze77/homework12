const inquirer = require('inquirer');
const Choice = require('inquirer/lib/objects/choice');
const dbConnect = require('./app/connection');
const orm = require( './app/orm' );


async function company() {
    const {companyOptions} = await inquirer
    .prompt([
     {
        type: 'list',
        name: 'companyOptions',
        message: 'What would you like to do?',
        choices: [
          {
            name: "View Information (Employees, Departments, Roles)",
            value: "View",

          },
          {
            name: "Add Information (Employees, Departments, Roles",
            value: "Add",

          },
          {
            name: "Delete information (Employees, Departments, Roles)",
            value: "Delete",

          },
          {
            name: "Update Information (Employees Manager, Employees Role)",
            value: "Update",
          },
          {
            name: "Quit",
            value: "Quit",
          },
        ]
      },
    ]);
  switch (companyOptions) {

    case "View":
      return whatToView()

    case "Add":
      return whatToAdd()

    case "Update":
      return whatToUpdate()

    case "Delete":
      return whatToDelete()

    default:
      return console.log ("Thank you! Have a great day!");
  }
}
company()




// function for user to input what they would like to view
async function whatToView(){
  const viewOptions = await inquirer
  .prompt([
    {
      type: "list",
      name: "viewList",
      message: "Please select the information you would like to view",
      choices:["View Employees", "View Departments", "View Roles", "Go Back"]
    }
    
  ])
  console.log(`what to view option = `, viewOptions)
  veiwInfoSelected(viewOptions)
}

// function to call database details based on user selection
async function veiwInfoSelected(viewOptions){
  let option = viewOptions
  console.log(`option is:`, option)
  if(option.viewList === "View Employees"){
    await orm.getEmployeeInformation();
    whatToView()
    } else if (option.viewList === "View Departments"){
      await orm.getallDepartments();
      whatToView()
    } else if (option.viewList === "View Roles"){
      await orm.getallRoles();
      whatToView()
    } else {
      company()
    }

}



// function to for user input of what information to be added
async function whatToAdd(){
  const addOptions = await inquirer
  .prompt([
    {
      type: "list",
      name: "viewList",
      message: "Please select the type of information you would like to add",
      choices: ["Add Employees", "Add Departments", "Add Roles", "Go Back"]
    }
  ])
  console.log(`information type to add = `, addOptions)
  addSelectedInfoType(addOptions)
}

// function to determine what add function to call based on user input
function addSelectedInfoType(addOptions){
  let option = addOptions
  console.log(`option is:`, option)
  if(option.viewList === "Add Employees"){
    addEmployees();
    
    } else if (option.viewList === "Add Departments"){
      addDepartmentDetails();
      
    } else if (option.viewList === "Add Roles"){
      addRoleDetails();
      
    } else {
      company()
    }

}


// add functions run based on which option the user selected
async function addEmployees(){
  let manager = await orm.managerList()
  let roles = await orm.getallRoles()
  const newEmployee = await inquirer
  .prompt([
      {
          type: "input",
          name:"eFirstName",
          message:"Enter the employees first name?",
      },
      {
          type: "input",
          name:"eLastName",
          message:"Enter the employees last name?",
      },
      {
          type: "list",
          name:"eRole",
          message:"Enter the employees role?",
          choices(){
            const fullRolesList = []
            roles.forEach(({title, id}) => {
              fullRolesList.push(id + " " + title);
            });
            return fullRolesList;
          },
      },
      {
          type: "list",
          name:"eManager",
          message:"Select the Employees Manager",
          choices(){
            const managerNameList = []
            manager.forEach(({first_name, last_name, id}) => {
              managerNameList.push({firstname: `${first_name}`, lastname: `${last_name}`, id: id});
            });
            console.log(`checking this out`, managerNameList)
            const manName =[]
            managerNameList.forEach(({id, firstname, lastname})=>{
              manName.push(id + " " + firstname + " " + lastname);
            });
            return manName;
          },
          
      },
  ])

   console.log(`this is the new employee`, newEmployee)
   orm.addEmployeetoDB(newEmployee)

   whatToAdd()    
}
async function addDepartmentDetails(){
  let department = await orm.getallDepartments()
  console.log('department list pulled', department)
  const newDepartment = await inquirer
  .prompt([
      {
          type: "input",
          name:"departmentName",
          message:"Please enter the new Department Name",
      },
  ])
  console.log(`this is the new department`, newDepartment.departmentName ) 
  orm.addDepartment(newDepartment.departmentName)
  
  whatToAdd()
}
async function addRoleDetails(){
  let department = await orm.getallDepartments()
  const newRole = await inquirer
  .prompt([
      {
          type: "input",
          name:"roleName",
          message:"Please enter the new Role Name",
      },
      {
        type: "input",
        name:"salary",
        message:"Please enter the new Role Salary",
      },
      {
        type: "rawlist",
        name:"departmentName",
        message:"Please align with a department",
        choices(){
          const departmentList = []
          department.forEach(({name}) => {
            departmentList.push(name);
          });
          console.log(`updated`, departmentList)
          return departmentList;
          
        },

      },
  ])
  console.log(`this is the new roll`, newRole.roleName, newRole.salary, newRole.departmentName ) 
  orm.addRoles(newRole)
  
  whatToAdd()
}

// function to determine what information the user would like to update
async function whatToUpdate(){
  const updateOptions = await inquirer
  .prompt([
    {
      type: "list",
      name: "viewList",
      message: "Please select the type of employee information you would like to update",
      choices: ["Employees Manager", "Employees Role", "Go Back"]
    }
  ])
  console.log(`information type to add = `, updateOptions)
  updateSelectedInfoType(updateOptions)
}

// function to determine next set of functions based on user selection of what they would like to update
function updateSelectedInfoType(updateOptions){
  let option = updateOptions
  console.log(`option is:`, option)
  if(option.viewList === "Employees Manager"){
    updateEmployeeManager();
    } else if (option.viewList === "Employees Role"){
      updateEmployeeRole();
    } else {
      company()
    }

}

// update functions
async function updateEmployeeRole(){
  let employees = await orm.getEmployeeInformation();
  let roles = await orm.getallRoles()

  console.log (`this is the employee pull from db`, employees)
  
  const eUPdate = await inquirer
  .prompt([
      {
          type: "list",
          name:"employeeupdate",
          message:"Which Employee would you like to update?",
          choices(){
            const employeeList = []
            employees.forEach(({first_name, last_name, id}) => {
              employeeList.push(first_name + " " + last_name);
            });
            return employeeList;
          }
      },
      {
        type: "list",
        name: "newRole",
        message:"Please select the employess new role.",
        choices(){
          const fullRolesList = []
          roles.forEach(({title}) => {
            fullRolesList.push(title);
          });
          return fullRolesList; 
        },
      }
    ])
    console.log(`this is the updated employee details`, eUPdate)
    orm.updateEmployee(eUPdate)

    whatToUpdate()


}
async function updateEmployeeManager(){
  let employees = await orm.getEmployeeInformation();
  let manager = await orm.managerList()

  console.log (`this is the employee pull from db`, employees)
  
  const eUPdate = await inquirer
  .prompt([
      {
          type: "list",
          name:"employeeupdate",
          message:"Which Employee would you like to update?",
          choices(){
            const employeeList = []
            employees.forEach(({first_name, last_name}) => {
              employeeList.push(first_name + " " + last_name);
            });
            return employeeList;
          }
      },
      {
        type: "list",
        name: "newManager",
        message:"Please select the employess new role.",
        choices(){
          const fullManagerList = []
          manager.forEach(({first_name, last_name}) => {
            fullManagerList.push(first_name + " " + last_name);
          });
          return fullManagerList; 
        },
      }
    ])
    console.log(`this is the updated employee details`, eUPdate)
    orm.updateEmployeeManager(eUPdate)

    whatToUpdate()


}



// function to determine what the user would like to delete
async function whatToDelete(){
  const deleteOption = await inquirer
  .prompt([
    {
      type: "list",
      name: "viewList",
      message: "Please select the type of iinformation you would like to delete",
      choices: ["Employees", "Departments", "Roles", "Go Back"]
    }
  ])
  console.log(`information type to delete = `, deleteOption)
  updateSelectedInfoType(deleteOption)
}
