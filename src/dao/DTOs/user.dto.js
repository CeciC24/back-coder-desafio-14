export default class UserDTO {
    constructor(user) {
        this.first_name = user.first_name
        this.last_name = user.last_name
        this.email = user.email
        this.age = user.age
        this.password = user.password
        this.role = user.role ? user.role : 'user'
    }
    
    // * Se pide la edad directamente, pero en esta alternativa se calcula a partir de la fecha de nacimiento
    /* constructor(user) {
        this.first_name = user.first_name
        this.last_name = user.last_name
        this.email = user.email
        this.age = age(user.dateOfBirth)
        this.password = user.password
        this.role = user.role
    } */

    /* age(dateOfBirth) {
        if (!dateOfBirth) {
            return null;
        }
        const today = new Date();
        const birthDate = new Date(this.dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const month = today.getMonth() - birthDate.getMonth();
        if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    } */
}

export class CurrentUserDTO {
    constructor(user) {
        this.first_name = user.first_name
        this.last_name = user.last_name
        this.email = user.email
        this.age = user.age
        this.role = user.role
    }
}