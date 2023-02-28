const express = require('express');
const mysql = require('mysql2/promise');
const inquirer = require('inquirer');
var Table = require('easy-table');
let departmentList = [];
let roleList = [];
let employeeList = [];

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'team_db'
    },
    console.log(`Connected to the team_db database.`)
);

function mainMenu() {
    departmentList = [];
    roleList = [];
    employeeList = [];
    inquirer.prompt([
        {
            type: 'list',
            name: 'mainMenu',
            message: 'What would you like to do?',
            choices: ['View all departments', 'View all roles', 'View all employees', 
            'Add a department', 'Add a role', 'Add an employee', 'Update an employees role', 'QUIT'],
        },
    ])
    .then((response) => {
        switch(response.mainMenu) {
            case 'View all departments':
                displayDepartments(false);
                break;
            case 'View all roles':
                displayRoles(false);
                break;
            case 'View all employees':
                displayEmployees(false);
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role': 
                displayDepartments('role');
                break;
            case 'Add an employee':
                displayDepartments('employee');
                break;
            case 'Update an employees role':
                displayDepartments('updateEmployee');
                break;
            default:
                process.exit();
        }  
    });
}

app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

mainMenu();

function displayDepartments(origin) {
    const query = 'SELECT * FROM department';
    db.then(conn => conn.query(query))
    .then(([rows, fields]) => {
        for(let i = 0; i < rows.length; i ++) {
            departmentList[i] = rows[i].department_name;
        }
        if(origin === 'role') {
            addRole();
        } else if(origin === 'employee' || origin === 'updateEmployee') {
            displayRoles(origin);
        } else {
            let t = new Table
            rows.forEach(function(rows) {
                t.cell('id', rows.id)
                t.cell('name', rows.department_name)
                t.newRow()
            })
          
            console.log(t.toString());
            mainMenu();
        }
    });
}

function displayRoles(origin) {
    const query = 'SELECT role.id, title, department_name, salary FROM role JOIN department ON role.department_id = department.id';
    db.then(conn => conn.query(query))
    .then(([rows, fields]) => {
        for(let i = 0; i < rows.length; i ++) {
            roleList[i] = rows[i].title;
        }
        if(origin === 'employee' || origin === 'updateEmployee') {
            displayEmployees(origin);
        } else {
            let t = new Table
            rows.forEach(function(rows) {
                t.cell('id', rows.id)
                t.cell('title', rows.title)
                t.cell('department', rows.department_name)
                t.cell('salary', rows.salary)
                t.newRow()
            })
          
            console.log(t.toString());
            mainMenu();
        }
    })
    .catch(err => {
        console.log(err);
    });
}

function displayEmployees(origin) {
    const query = 'SELECT employee.id, first_name, last_name, title, department_name, salary, manager_id FROM employee JOIN role ON role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id';
    db.then(conn => conn.query(query))
    .then(([rows, fields]) => {
        for(let i = 0; i < rows.length; i ++) {
            employeeList[i] = rows[i].first_name + " " + rows[i].last_name;
        }
        if(origin === 'employee') {
            employeeList[employeeList.length] = 'null';
            addEmployee();
        } else if(origin === 'updateEmployee') {
            updateEmployee();
        } else {
            let t = new Table
            rows.forEach(function(rows) {
                let managerName = null;

                for(let i = 0; i < employeeList.length; i++) {
                    if(rows.manager_id == i) {
                        managerName = employeeList[i-1];
                    }
                }
                t.cell('id', rows.id)
                t.cell('first_name', rows.first_name)
                t.cell('last_name', rows.last_name)
                t.cell('title', rows.title)
                t.cell('department', rows.department_name)
                t.cell('salary', rows.salary)
                t.cell('manager', managerName)
                t.newRow()
            })
          
            console.log('\n' + t.toString());
            mainMenu();
        }
    });
}

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What is the department name?',
            name: 'department',
        },
    ])
    .then((response) => {
        let query = `INSERT INTO department (department_name) VALUES ("${ response.department }")`;
        db.then(conn => conn.query(query))
        .then((result) => {
            console.log(`Added ${ response.department } to the database`);
            mainMenu();
        })
        .catch(err => {
            console.log(err);
        });
    })
    .catch(err => {
        console.log(err);
    });
}

function addRole() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What is the role title?',
            name: 'roleTitle',
        },
        {
            type: 'input',
            message: 'What is the salary for this role?',
            name: 'roleSalary',
        },
        {
            type: 'list',
            name: 'department',
            message: 'What department does this role belong to?',
            choices: departmentList,
        },
    ])
    .then((response) => {
        for(let i = 0; i < departmentList.length; i++) {
            if(departmentList[i]===response.department) {
                let query = `INSERT INTO role (title, salary, department_id) VALUES ("${ response.roleTitle }", "${ response.roleSalary }", "${ i+1 }")`;
                db.then(conn => conn.query(query))
                .then(([rows, fields]) => {
                    for(let i = 0; i < rows.length; i ++) {
                        roleList[i] = rows[i].title;
                    }
                    console.log(`Added ${ response.roleTitle } to the database`);
                    mainMenu();
                })
                .catch(err => {
                    console.log(err);
                });
            }
        }
    })
    .catch(err => {
        console.log(err);
    });   
}

function addEmployee() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What is the employees first name?',
            name: 'firstName',
        },
        {
            type: 'input',
            message: 'What is the employees last name?',
            name: 'lastName',
        },
        {
            type: 'list',
            message: 'What role does this employee belong too?',
            choices: roleList,
            name: 'role',
        },
        {
            type: 'list',
            message: 'Who is this employees manager?',
            choices: employeeList,
            name: 'manager',
        },
    ])
    .then((response) => {
        let roleID;
        let managerID;
        let managerName = response.manager;
        db.then(conn => conn.query(`SELECT id FROM role WHERE title = '${ response.role }'`))
        .then(([rows, fields]) => {
            roleID = rows[0].id;
        })
        .then(() => {
            if(managerName != 'null') {
                managerName = managerName.split(" ");
                db.then(conn => conn.query(`SELECT id FROM employee WHERE first_name = '${ managerName[0] }' AND last_name = '${ managerName[1] }'`))
                .then(([rows, fields]) => {
                    managerID = rows[0].id;
                })
                .then(() => {
                    let query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${ response.firstName }', '${ response.lastName }', ${ roleID }, ${ managerID })`;
                    db.then(conn => conn.query(query))
                    .then(([rows, fields]) => {
                        for(let i = 0; i < rows.length; i ++) {
                            employeeList[i] = employeeList[i].first_name + employeeList[i].last_name;
                        }
                        console.log(`Added ${ response.firstName } ${ response.lastName } to the database`);
                        mainMenu();
                    })
                    .catch(err => {
                        console.log(err);
                    });
                });
            } else {
                managerID = 'NULL';
                let query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${ response.firstName }', '${ response.lastName }', ${ roleID }, ${ managerID })`;
                db.then(conn => conn.query(query))
                .then(([rows, fields]) => {
                    for(let i = 0; i < rows.length; i ++) {
                        employeeList[i] = employeeList[i].first_name + employeeList[i].last_name;
                    }
                    console.log(`Added ${ response.firstName } ${ response.lastName } to the database`);
                    mainMenu();
                })
                .catch(err => {
                    console.log(err);
                });
            }
        });
    });
}

function updateEmployee() {
    inquirer.prompt([
        {
            type: 'list',
            message: `Which employee's role do you want to update?`,
            name: 'employee',
            choices: employeeList,
        },
    ])
    .then((response) => {
        let employeeID;
        let roleID;
        let employee = response.employee.split(" ");
        db.then(conn => conn.query(`SELECT id FROM employee WHERE first_name = '${ employee[0] }' AND last_name = '${ employee[1] }'`))
        .then(([rows, fields]) => {
            employeeID = rows[0].id;
        })
        .then(() => {
            inquirer.prompt([
                {
                    type: 'list',
                    message: `Which employee's role do you want to update?`,
                    name: 'role',
                    choices: roleList,
                },
            ])
            .then((response) => {
                db.then(conn => conn.query(`SELECT id FROM role WHERE title = '${ response.role }'`))
                .then(([rows, fields]) => {
                    roleID = rows[0].id;
                })
                .then(() => {
                    let query = `UPDATE employee SET role_id = '${ roleID }' WHERE employee.id = '${ employeeID }'`;
                    db.then(conn => conn.query(query))
                    .then(() => {
                        console.log(`Updated employee's role`);
                        mainMenu();
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
            })
            .catch((err) => {
                console.log(err);
            });            
        })
        .catch((err) => {
            console.log(err);
        });
    })
    .catch((err) => {
        console.log(err);
    });
}