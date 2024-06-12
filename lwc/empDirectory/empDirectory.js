import { LightningElement, wire } from 'lwc';
import getEmployees from '@salesforce/apex/EmployeeController.getEmployees';
import createEmployee from '@salesforce/apex/EmployeeController.createEmployee';
import updateEmployee from '@salesforce/apex/EmployeeController.updateEmployee';
import deleteEmployee from '@salesforce/apex/EmployeeController.deleteEmployee';

export default class empDirectory extends LightningElement {
    employees;
    showModal = false;
    name;
    email;
    department;
    position;
    dob;
    phone;
    empId;

    @wire(getEmployees)
    wiredEmployees({ error, data }) {
        if (data) {
            this.employees = data.map(emp => ({ ...emp, Date_of_Birth: new Date(emp.Date_of_Birth__c).toDateString() }));
        } else if (error) {
            console.error('Error retrieving employee data:', error);
        }
    }

    handleAddEmployee() {
        this.showModal = true;
    }

    handleNameChange(event) {
        this.name = event.target.value;
    }

    handleEmailChange(event) {
        this.email = event.target.value;
    }

    handleDepartmentChange(event) {
        this.department = event.target.value;
    }

    handlePositionChange(event) {
        this.position = event.target.value;
    }

    handleDobChange(event) {
        this.dob = event.target.value;
    }

    handlePhoneChange(event) {
        this.phone = event.target.value;
    }

    handleSave() {
        if (this.empId) {
            updateEmployee({ empId: this.empId, name: this.name, email: this.email, department: this.department, position: this.position, dob: this.dob, phone: this.phone })
                .then(() => {
                    this.closeModal();
                    this.refreshData();
                })
                .catch(error => {
                    console.error('Error updating employee:', error);
                });
        } else {
            createEmployee({ name: this.name, email: this.email, department: this.department, position: this.position, dob: this.dob, phone: this.phone })
                .then(() => {
                    this.closeModal();
                    this.refreshData();
                })
                .catch(error => {
                    console.error('Error creating employee:', error);
                });
        }
    }

    handleEdit(event) {
        this.empId = event.target.value;
        const emp = this.employees.find(e => e.Id === this.empId);
        this.name = emp.Name;
        this.email = emp.Email;
        this.department = emp.Department;
        this.position = emp.Position;
        this.dob = emp.Date_of_Birth__c;
        this.phone = emp.Phone__c;
        this.showModal = true;
    }

    handleDelete(event) {
        const empId = event.target.value;
        deleteEmployee({ empId })
            .then(() => {
                this.refreshData();
            })
            .catch(error => {
                console.error('Error deleting employee:', error);
            });
    }

    closeModal() {
        this.showModal = false;
        this.clearFields();
    }

    clearFields() {
        this.name = '';
        this.email = '';
        this.department = '';
        this.position = '';
        this.dob = '';
        this.phone = '';
        this.empId = null;
    }

    refreshData() {
        return refreshApex(this.employees);
    }
}
