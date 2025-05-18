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

SET User[3].name TO "John Smith";`
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
}`
    }
  ];