# Stev232sTeamBuilder

## Description


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
