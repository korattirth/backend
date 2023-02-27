class UserDto {
    constructor(user) {
        this.userId = user._id;
        this.fName = user.FName;
        this.lName = user.LName;
        this.email = user.Email;
        this.homeAddress = user.HomeAddress;
        this.address2 = user.Address2;
        this.city = user.City;
        this.state = user.State;
        this.zipcode = user.Zipcode;
        this.dob = user.DOB;
        this.role = user.UserRole;
        this.isActive = user.IsActive;
        this.image = user.Image
    }
}

module.exports = UserDto