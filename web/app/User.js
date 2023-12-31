class User {
  // subject to change

  // initializes user with just email and password from signu[]
  constructor(email, username, firstName, lastName) {
    this.email = email;
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phoneNumber;
    this.location;
    this.age;
    this.gender;
    this.friends;
    this.state;
    this.country;
    this.zipCode;
    this.address;
    this.city;
    this.birthday;
    this.reportReason;
    this.profileImage;
    this.blocked_users;
    this.profileImage;
    this.blocked;
    this.numBasketball;
    this.numTennis;
    this.numSoccer;
    this.numWeights;
  }

  // adds new field to a user - username, age etc.
  addField(fieldName, val) {
    this[fieldName] = val;
  }
}

export default User;
