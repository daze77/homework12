const db = require(`./connection`)('employeesDB', 'Summer77')


async function getEmployeeInformation( first_name='' ){
    const sql = `SELECT * FROM employee `+ (first_name ? `WHERE first_name = ?` : '' );
    const results = await db.query(sql);
    console.table(results)
    return ( results);
}




async function getallDepartments( name='' ){
    const sql = `SELECT * FROM department `+ (name ? `WHERE name = ?` : '' );
    const results = await db.query(sql);
    console.table(results)
    return ( results);
  }
  
  async function getallRoles( title='' ){
    const sql = `SELECT * FROM role `+ (title ? `WHERE title = ?` : '' );
    const results = await db.query(sql);
    console.table(results)
    return ( results );
  }
 

  async function addEmployeetoDB(newEmployee){
    const manager = newEmployee.eManager
    const splitmanager = manager.split(" ")
    const role = newEmployee.eRole
    const splitrole = role.split(" ")
    console.log(`this is the add employee function`, newEmployee)
    console.log(`first name`, newEmployee.eManager)
    let managerID = splitmanager[0]
    let roleID = splitrole[0]
    console.log(`manager number`, managerID)
    console.log(`Role ID `, roleID)
    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${newEmployee.eFirstName}", "${newEmployee.eLastName}", ${roleID}, ${managerID})`
    const result = await db.query(sql)
    return (result)


  }

  async function addDepartment(departmentName){
    console.log(`this is the add department function`, departmentName)
    const sql = `INSERT INTO department (name) VALUES ("${departmentName}")`
    const result = await db.query(sql)
    return (result)
  }

  async function addRoles(newRole){
    const depID = await locateDepartmentID(newRole.departmentName)
    console.log(`dep ID is `, depID)
    console.log(`this is the add roles function`, newRole)
    const sql = `INSERT INTO role (title, salary, department_id) VALUES ("${newRole.roleName}", "${newRole.salary}", "${depID}")`
    const result = await db.query(sql)
    return (result)
  }






async function managerList(){
    const sql = `SELECT first_name, last_name, id FROM employee WHERE role_id = manager_id`
    const manager =  await db.query(sql)
    return manager

}


async function locateDepartmentID(depName){
  const sql = `SELECT id FROM department WHERE name = "${depName}"`;
  const results = await db.query(sql)
  console.log(`the number result is`, results)
  console.log(`the number ID is `, results[0].id)
  return results[0].id
}

async function locateRoleID(roleName){
  const sql = `SELECT id FROM role WHERE title = "${roleName}"`;
  const results = await db.query(sql)
  console.log(`the role number result is`, results)
  console.log(`the role number ID is `, results[0].id)
  return results[0].id
}



async function updateEmployee(employee){
  const roleID = await locateRoleID(employee.newRole)
  const employeeName = employee.employeeupdate
  const employeeconcat = employeeName.split(" ").join("")
  console.log(`roleID is `, roleID)
  const sql = `UPDATE employee SET role_id = ${roleID} WHERE CONCAT(first_name,last_name) = "${employeeconcat}"`;
  const results = await db.query(sql)
  return (results)

}





// always close the db (ORM)
function closeORM(){
    return db.close()
}


module.exports = { getEmployeeInformation, getallDepartments, getallRoles, addEmployeetoDB, managerList, addDepartment, addRoles, closeORM, updateEmployee }



