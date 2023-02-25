const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
var Table = require('easy-table');

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
    console.log(`Connected to the books_db database.`)
);

function mainMenu() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'mainMenu',
            message: 'What would you like to do?',
            choices: ['View all departments', 'View all roles', 'View all employees', 
            'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'QUIT'],
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
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployee();
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

function displayDepartments(isUpdate) {
    const query = 'SELECT * FROM department';
    runQuery(query);

    if(!isUpdate) {
        mainMenu();
    }
}

function displayRoles(isUpdate) {
    const query = 'SELECT * FROM role';
    runQuery(query);
    
    if(!isUpdate) {
        mainMenu();
    }
}

function displayEmployees(isUpdate) {
    const query = 'SELECT * FROM employee';
    runQuery(query);
    
    if(!isUpdate) {
        mainMenu();
    }
}

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What is the department name?',
            name: 'department',
        },
    ])
    let query = 'INSERT * FROM department';
    runQuery(query);
    mainMenu();
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
            meesage: 'What is the salary for this role?',
            name: 'roleSalary',
        },
        {
            type: 'choice',
            message: 'What department does this role belong to?',
            name: 'department',
        }
    ])
    let query = 'INSERT * FROM role';
    runQuery(query);
    mainMenu();
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
            type: 'choice',
            message: 'What role does this employee belong too?'
        }
    ])
    let query = 'INSERT * FROM employee';
    runQuery(query);
    mainMenu();
}

function updateEmployee() {
    inquirer.prompt([

    ])
    let query = `INSERT * FROM employee WHERE employee.id=${ id }`;
    runQuery(query);
    mainMenu();
}

function runQuery(query) {
    /*db.query(query, function (err, results) {
        console.log(query);
        menuInquirer();
    });*/
    console.log(query);

}