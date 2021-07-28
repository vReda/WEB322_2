
const Sequelize = require('sequelize');

var sequelize = new Sequelize('d941lc8rltnbt4', 'ympxuzbmixyhwe', '610029e28ff796c920ba537ddd5e239b96f9fcf995a322ead53722bfa57d64c1', {
    host: 'ec2-34-204-128-77.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    }
   });

//Define the employee model
var Employee = sequelize.define('Employee', {
    employeeNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email:Sequelize.STRING,
    SSN:Sequelize.STRING,
    addressStreet:Sequelize.STRING,
    addressCity:Sequelize.STRING,
    addressState:Sequelize.STRING,
    addressPostal:Sequelize.STRING,
    maritalStatus:Sequelize.STRING,
    isManager:Sequelize.BOOLEAN,
    employeeManagerNum:Sequelize.INTEGER,
    status:Sequelize.STRING,
    hireDate:Sequelize.STRING
});

//Define the department model
var Department = sequelize.define('Department', {
    departmentId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    departmentName: Sequelize.STRING
});

Department.hasMany(Employee, {foreignKey: 'Department'});



module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        sequelize.sync().then( () => {
            resolve();
        }).catch(()=>{
            reject("unable to sync the database"); return;
        });
       })
}

module.exports.getAllEmployees = function(){
    return new Promise(function (resolve, reject) {
        Employee.findAll({ //find any that have this id
            order: ["employeeNum"],
            raw: true
        }).then((data) => { //if successful
            //console.log(data[0].Department)
            resolve(data); //resolve the inquiry
        }).catch((err) => { //otherwise, nothing found, send error
            reject("no results returned"); return;
        });
       })
};

module.exports.addEmployee = function (employeeData) {
    return new Promise(function (resolve, reject) {
        employeeData.isManager = (employeeData.isManager) ? true : false; 
        for (employee in employeeData ) {
            if (employeeData.employeeManagerNum=="") {
                employeeData.employeeManagerNum=null;
            }
        }
        Employee.create(employeeData).then(() => { 
            resolve();
        }).catch((err)=>{
            reject("Unable to create employee"); return;
        });
       })
};


module.exports.getEmployeeByNum = function (num) {
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {
                employeeNum: num,
            },
            raw: true
        }).then(function (data) {
            resolve(data[0]);
        }).catch(() => {
            reject("no results returned"); return;
        });
       })
};

module.exports.getEmployeesByStatus = function (status) {
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {
                status: status,
            },
            raw: true
        }).then(function (data) {
            resolve(data);
        }).catch(() => {
            reject("no results returned"); return;
        });
       })
};


module.exports.getEmployeesByDepartment = function (department) {
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {
                Department: department
            },
            raw: true
        }).then(function (data) {
            resolve(data);
        }).catch(() => {
            reject("no results returned"); return;
        });
       })
};

module.exports.getEmployeesByManager = function (manager) {
    return new Promise(function (resolve, reject) {
        Employee.findAll({
            where: {
                employeeManagerNum: manager
            },
            raw: true
        }).then(function (data) {
            resolve(data);
        }).catch(() => {
            reject("no results returned"); return;
        });
       })
};


module.exports.getDepartments = function(){
    return new Promise(function (resolve, reject) {
        Department.findAll({
            order: ["departmentId"],
            raw: true
        }).then((data) => {
            resolve(data);
        }).catch((err) => {
            reject("no results returned"); return;
        });
       })
};


module.exports.addDepartment = function (departmentData) {
    return new Promise(function (resolve, reject) {
        for (department in departmentData ) {
            if (departmentData.departmentName=="") {
                departmentData.departmentName=null;
            }
        }
        Department.create(departmentData).then(() => { 
            resolve();
        }).catch((err)=>{
            reject("Unable to create department"); return;
        });
       })
};

module.exports.updateDepartment = function(departmentData) {
    return new Promise(function (resolve, reject) {
        for (department in departmentData ) {
            if (departmentData.departmentName=="") {
                departmentData.departmentName=null;
            }
        }
        Department.update(departmentData, {
            where: { departmentId: departmentData.departmentId } 
        }).then(() => {
            resolve();
        }).catch((e) => {
            reject("unable to update department"); return;
        });
       })
};

module.exports.getDepartmentById = function (departmentId) {
    return new Promise(function (resolve, reject) {
        Department.findAll({
            where: {
                departmentId: departmentId
            },
            raw: true
        }).then(function (data) {
            resolve(data[0]);
        }).catch(() => {
            reject("no results returned"); return;
        });
       })
};

module.exports.deleteDepartmentById = function(id){
    return new Promise(function (resolve, reject) {
        Department.destroy({
            where: { departmentId: id }
        }).then(function () {
            resolve();
        }).catch((err) => {
            reject("unable to delete department"); return;
        });
    });
};


module.exports.updateEmployee = function(employeeData) {
    return new Promise(function (resolve, reject) {
        employeeData.isManager = (employeeData.isManager) ? true : false; 
        for (employee in employeeData ) {
            if (employeeData.employeeManagerNum=="") {
                employeeData.employeeManagerNum=null;
            }
        }
        Employee.update(employeeData, {
            where: { employeeNum: employeeData.employeeNum } 
        }).then(() => {
            resolve();
        }).catch((err) => {
            reject("unable to update employee"); return;
        });
       })
}

module.exports.deleteEmployeeByNum = function(empNum){
    return new Promise(function (resolve, reject) {
        Employee.destroy({
            where: { employeeNum: empNum }
        }).then(function () {
            resolve();
        }).catch((err) => {
            reject("unable to delete employee"); return;
        });
    });
};