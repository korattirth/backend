class UserDto {
    constructor(user) {
        this.userId = user._id;
        this.fName = user.fName;
        this.lName = user.lName;
        this.email = user.email;
        this.homeAddress = user.homeAddress;
        this.address2 = user.address2;
        this.city = user.city;
        this.state = user.state;
        this.zipcode = user.zipcode;
        this.dob = user.dob;
        this.role = user.role;
        this.isActive = user.isActive;
        this.image = user.image
    }
}

module.exports = UserDto