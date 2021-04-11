pragma solidity ^0.5.0;

contract Day1Registry {

  // define the struct Day1User
  struct Day1User {
    string name;
    string surname;
    address added_by;
  }

  // define the array of users
  Day1User[] public day1_users;

  function registerUser(string calldata _name, string calldata _surname) external returns(uint){
    // get an instance of a Day1User using the input variables and push into the array of day1_users, returns the id
    uint id = day1_users.push(Day1User(_name, _surname, msg.sender)) - 1;
    
    // return the user id
    return id;
  }

  function getNumberOfUsers() external view returns(uint) {
    // return the length of the day1_users array
    return day1_users.length;
  }

}