export interface QueryExample {
  name: string;
  description: string;
  query: string;
}

export const queryExamples: QueryExample[] = [
  {
    name: "Insert User",
    description: "Command to insert several users",
    query: `LOCK User[1], User[2], User[3];
      
SET User[1].name TO "John Doe";
SET User[1].age TO 30;
SET User[1].email TO "john@example.com";

SET User[2].name TO "Jane Doe";
SET User[2].age TO 25;
SET User[2].email TO "jane@example.com";

SET User[3].name TO "John Smith";`,
  },
  {
    name: "Query User",
    description: "Simple query to retrieve a user's name with Option handling",
    query: `LOCK User[1];
      
x: Option<String> = GET User[1].name;
match x {
    Some(value) => {
        return value;
    }
    None => {
        return "None";
    }
}`,
  },
  {
    name: "Set Ages",
    description: "Set ages for users with a loop",
    query: `LOCK User[1], User[2], User[3], User[4];

func setUserAges(ids: Int[], ages: Int[]): Int[] {
    setUsers: Int[] = [];
    index: Int = 0;

    while (index < len(ids)) do {
        idOpt: Option<Int> = get(ids, index);
        match (idOpt) {
            Some(id) => {
                ageOpt: Option<Int> = get(ages, index);
                match (ageOpt) {
                    Some(val) => {
                        SET User[id].age TO val;
                        push(setUsers, id);
                    }
                    None => {
                        
                    }
                }
            }
            None => {

            }
        }
        index = index + 1;
    }

    return setUsers;
}

return setUserAges([1,2,3,4], [20, 30, 40, 50]);`,
  },
  {
    name: "Get Multiple User Ages",
    description: "Retrieve ages for multiple users by their IDs",
    query: `LOCK User[1], User[2], User[3], User[4];

func getMultipleUserAges(ids: Int[]): String {
  result: String = "User ages:";
  
  for id in ids {
    ageOpt: Option<Int> = GET User[id].age;
    
    match ageOpt {
      Some(age) => {
        result = result + "\nUser ID " + NumericToString(id) + ": " + NumericToString(age);
      }
      None => {
        result = result + "\nUser ID " + NumericToString(id) + ": No age found";
      }
    }
  }
  
  return result;
}

return getMultipleUserAges([1, 2, 3, 4]);`,
  },
  {
    name: "Get Average Age",
    description: "Calculate the average age of an array of users",
    query: `LOCK User[1], User[2], User[3], User[4];

func getAverageAges(ids: Int[]): Double {
    sum: Double = 0;
    count: Int = 0;
    for id in ids {
        age: Option<Int> = GET User[id].age;
        match (age) {
            Some(val) => {
                sum = sum + val;
                count = count + 1;
                print("User found with");
                print(NumericToString(val));
            }
            None => {
                print("User not found");
                print(NumericToString(id));
            }
        }
    }

    return sum / count;
}

return getAverageAges([1,2,3,4]);`,
  },
  {
    name: "Delete User",
    description: "Delete a user by ID",
    query: `LOCK User[1];

func deleteUser(id: Int) {
    DEL User[id].name;
    DEL User[id].age;
    DEL User[id].email;
}

deleteUser(1);

return "OK";`,
  },

  {
    name: "Multi-Delete Users",
    description: "Delete multiple users by their IDs",
    query: `LOCK User[1], User[2], User[3];

func deleteMultipleUsers(ids: Int[]): String {
  deletedCount: Int = 0;
  
  for id in ids {
    DEL User[id].name;
    DEL User[id].age;
    DEL User[id].email;
    deletedCount = deletedCount + 1;
    print("Deleted user: " + NumericToString(id));
  }
  
  return "Successfully deleted " + NumericToString(deletedCount) + " users";
}

return deleteMultipleUsers([1, 2, 3]);`,
  },
  {
    name: "Get User Name",
    description: "Retrieve a user's name by ID",
    query: `LOCK User[1];

func getUserName(id: Int): String {
  nameOpt: Option<String> = GET User[id].name;
  
  match nameOpt {
    Some(name) => {
      return "User found: " + name;
    }
    None => {
      return "No user found with ID: " + NumericToString(id);
    }
  }
}

return getUserName(1);`,
  },
  {
    name: "Is User Adult",
    description: "Check if a user is an adult based on their age",
    query: `LOCK User[1];

func isUserAdult(id: Int): String {
  ageOpt: Option<Int> = GET User[id].age;
  
  match ageOpt {
    Some(age) => {
      if (age >= 18) {
        return "User ID " + NumericToString(id) + " is an adult (age: " + NumericToString(age) + ")";
      } else {
        return "User ID " + NumericToString(id) + " is a minor (age: " + NumericToString(age) + ")";
      }
    }
    None => {
      return "No age information found for user ID: " + NumericToString(id);
    }
  }
}

return isUserAdult(1);`,
  },
];
