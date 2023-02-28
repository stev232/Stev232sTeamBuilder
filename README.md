# Stev232sTeamBuilder

## Description

In this project I use a sql script to create a database along with three tables. The user will input data that will populate each of these tables using inquirer. The user can also view the data that is in each table and this is done by using easy-table. This project demonstrates the usage of SELECT, INSERT INTO, UPDATE, and JOIN sql commands. This project also displays the usage of a menu system in inquirer by using the input type of list. To help pace the database calls this project also uses mysql2-promise instead of just using mysql2. This allows me to force the script to wait for a response from the db before running the next command.

## Installation

In order to run this project you will need to manually enter your database password into line 19 "password: 'enter password here'". Then you will need to do "mysql -u root -p" in your terminal. After you enter mysql command interface you will then run "./db/schema.db". This will build your database and set up your tables. You can now exit the mysql command interface and run "npm run".

## Acceptance Criteria

GIVEN a command-line application that accepts user input <br>
__WHEN__ I start the application <br>
*THEN* I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role <br>
__WHEN__ I choose to view all departments <br>
*THEN* I am presented with a formatted table showing department names and department ids <br>
__WHEN__ I choose to view all roles <br>
*THEN* I am presented with the job title, role id, the department that role belongs to, and the salary for that role <br>
__WHEN__ I choose to view all employees <br>
*THEN* I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to <br>
__WHEN__ I choose to add a department <br>
*THEN* I am prompted to enter the name of the department and that department is added to the database <br>
__WHEN__ I choose to add a role <br>
*THEN* I am prompted to enter the name, salary, and department for the role and that role is added to the database <br>
__WHEN__ I choose to add an employee <br>
*THEN* I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database <br>
__WHEN__ I choose to update an employee role <br>
*THEN* I am prompted to select an employee to update and their new role and this information is updated in the database <br>

## Database architecture

* department
    * id: INT PRIMARY KEY
    * name: VARCHAR(30) to hold department name
* role
    * id: INT PRIMARY KEY
    * title: VARCHAR(30) to hold role title
    * salary: DECIMAL to hold role salary
    * department_id: INT to hold reference to department role belongs to
* employee
    * id: INT PRIMARY KEY
    * first_name: VARCHAR(30) to hold employee first name
    * last_name: VARCHAR(30) to hold employee last name
    * role_id: INT to hold reference to employee role
    * manager_id: INT to hold reference to another employee that is the manager of the current employee (null if the employee has no manager)

![path](./images/DatabaseStructure.png)

## Demo Video

https://drive.google.com/file/d/1CfqW4y728My16Rl2evf6RRkehR-MA20w/view