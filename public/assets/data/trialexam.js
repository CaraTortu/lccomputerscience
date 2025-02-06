// data/questions.js
export const questions = {
  year: 2019,
  exam: "Trial Exam",
  course: "Computer Science",
  des: "Leaving Certificate Examination Sample Paper",
  paper: "Higher Level",
  duration: "1.5 hours",
  totalmarks: 130,
  questioncountA: 12,
  totalmarksA: 60,
  questioncountB: 3,
  totalmarksB: 70,
  questioncountC: 3,
  totalmarksC: 80,
  imageofpaper: "/images/exam-paper.png",
  examiner: "Department of Education",
  examdate: "2019-05-15",
  instructions: "Answer all questions in Section A, Section B and Section C.",
  
  sectionA: [
    {
      id: 1,
      question: "Question 1",
      partstoquesion: 1,
      questiontext: "For each of the JavaScript Boolean expressions listed below state whether they evaluate to true or false.",
      questiontextreadable: "For each of the JavaScript Boolean expressions listed below, state whether they evaluate to **true** or **false**.",
      imagequestion: '/images/exam-images/trialexam/sectiona/q1.png',
      imageparts: '',
      imagemarkingscheme: '',
      imagemarkingschemeparts: '',
      imageofpart: '',
      answertype: 'table',
      table: {
        headers: ["Boolean Expression", "Result"],
        rows: [
          ["7 > 5", ""],
          ["(7 < 5) && false", ""],
          ["(7 == 5) || true", ""],
          ["(7 != 5) || false", ""],
          ["(!false) && (!true)", ""],
        ],
        answers: ["true", "false", "true", "true", "false"],
        fieldnames: ["q1p1", "q1p2", "q1p3", "q1p4", "q1p5"],
      },
      parts: [
        { id: 0, text: "7 > 5", correct: "true", field:'', fieldtype:'text', fieldname:'q1p1', size: 1, imageq:'' },
        { id: 1, text: "(7 < 5) && false", correct: "false", field:'', fieldtype:'text', fieldname:'q1p2', size: 1, imageq:'' },
        { id: 2, text: "(7 == 5) || true", correct: "true", field:'', fieldtype:'text', fieldname:'q1p3', size: 1, imageq:'' },
        { id: 3, text: "(7 != 5) || false", correct: "true", field:'', fieldtype:'text', fieldname:'q1p4', size: 1, imageq:'' },
        { id: 4, text: "(!false) && (!true)", correct: "false", field:'', fieldtype:'text', fieldname:'q1p5', size: 1, image1:'' },
      ],
      marks: 5,
      breakdown: "1 mark per correct part",
      markingscheme: [
        { fieldname:'q1p1', answer: "true" },
        { fieldname:'q1p2', answer: "false" },
        { fieldname:'q1p3', answer: "true" },
        { fieldname:'q1p4', answer: "true" },
        { fieldname:'q1p5', answer: "false" },
      ],
      topic: "Boolean Logic",
      difficulty: "Easy",
      tags: ["JavaScript", "Boolean Expressions"],
    },
    {
      id: 2,
      question: "Question 2",
      partstoquesion: 2,
      questiontext: "Add the following two binary numbers and convert your answer to decimal (base 10).",
      questiontextreadable: "Perform the following binary addition and conversion tasks.",
      imagequestion: '/images/exam-images/trialexam/sectiona/q2.png',
      imageparts: '["/images/exam-images/trialexam/sectiona/q2a.png", "/images/exam-images/trialexam/sectiona/q2b.png"]',
      imagemarkingscheme: '',
      imagemarkingschemeparts: '',
      imageofpart: '',
      answertype: 'input',
      parts: [
        {
          id: "(a)",
          text: "Add the following two binary numbers:\n0 1 0 0 1 0 1 0 + 1 0 0 1 1 0 0 1",
          correct: "11100011",
          field:'input',
          fieldtype:'text',
          fieldname:'q2p1',
          size: 1,
          imageq:'/images/exam-images/trialexam/sectiona/q2a.png'
        },
        {
          id: "(b)",
          text: "Convert your answer to decimal (base 10).",
          correct: "227",
          field:'input',
          fieldtype:'text',
          fieldname:'q2p2',
          size: 1,
          imageq:'/images/exam-images/trialexam/sectiona/q2b.png'
        },
      ],
      marks: 5,
      breakdown: "2 marks for (a), 3 marks for (b)",
      markingscheme: [
        { fieldname: "q2p1", answer: "11100011" },
        { fieldname: "q2p2", answer: "227" },
      ],
      topic: "Binary Arithmetic",
      difficulty: "Medium",
      tags: ["Binary", "Arithmetic"],
    },
    {
      id: 3,
      question: "Question 3",
      partstoquesion: 1,
      questiontext: "Complete the truth table below from the logic diagram shown. The first row has already been completed.",
      questiontextreadable: "Complete the truth table below from the logic diagram shown. The first row has already been completed.",
      imagequestion: '/images/exam-images/trialexam/sectiona/q3.png',
      imageparts: '',
      imagemarkingscheme: '',
      imagemarkingschemeparts: '',
      imageofpart: '/images/exam-images/trialexam/sectiona/q3image.png',
      imageside: 'right',
      answertype: 'table',
      table: {
        headers: ["", "A", "B", "Q=NOT A", "P = Q AND B"],
        rows: [
          ["1.", "0", "0", "1", "0"],
          ["2.", "0", "1", "", ""],
          ["3.", "1", "0", "", ""],
          ["4.", "1", "1", "", ""],
        ],
        answers: ["1", "1", "0", "0", "0", "0"],
        fieldnames: ["q3p1a", "q3p1b", "q3p2a", "q3p2b", "q3p3a", "q3p3b"],
      },
      parts: [
        {
          id: 1,
          text: "A=0 B=1",
          subparts: [
            {
              subpartid: 3,
              text: "Q=1",
              correct: "1",
              fieldname: "q3p1a",
            },
            {
              subpartid: 4,
              text: "P=1",
              correct: "1",
              fieldname: "q3p1b",
            },
          ],
          field:'input',
          fieldtype:'text',
          fieldname:'q3p1',
          fieldlength: 2,
          size:1,
          imageq:''
        },
        {
          id: 2,
          text: "A=1 B=0",
          subparts: [
            {
              subpartid: 3,
              text: "Q=0",
              correct: "0",
              fieldname: "q3p2a",
            },
            {
              subpartid: 4,
              text: "P=0",
              correct: "0",
              fieldname: "q3p2b",
            },
          ],
          field:'input',
          fieldtype:'text',
          fieldname:'q3p2',
          size:1,
          imageq:''
        },
        {
          id: 3,
          text: "A=1 B=1",
          subparts: [
            {
              subpartid: 3,
              text: "Q=0",
              correct: "0",
              fieldname: "q3p3a",
            },
            {
              subpartid: 4,
              text: "P=0",
              correct: "0",
              fieldname: "q3p3b",
            },
          ],
          field:'input',
          fieldtype:'text',
          fieldname:'q3p3',
          size:1,
          imageq:''
        },
      ],
      marks: 5,
      breakdown: "1 mark per correct part",
      markingscheme: [
        { fieldname: "q3p1a", answer: "1" },
        { fieldname: "q3p1b", answer: "1" },
        { fieldname: "q3p2a", answer: "0" },
        { fieldname: "q3p2b", answer: "0" },
        { fieldname: "q3p3a", answer: "0" },
        { fieldname: "q3p3b", answer: "0" },
      ],
      topic: "Logic Gates",
      difficulty: "Medium",
      tags: ["Logic", "Truth Table"],
    },
    {
      id: 4,
      question: "Question 4",
      partstoquesion: 2,
      questiontext: "Abstraction is a key pillar of computational thinking and programming.",
      questiontextreadable: "Abstraction is a key pillar of computational thinking and programming.",
      imagequestion: '/images/exam-images/trialexam/sectiona/q1.png',
      imageparts: '',
      imagemarkingscheme: '',
      imagemarkingschemeparts: '',
      imageofpart: '',
      answertype: 'textarea',
      parts: [
        {
          id: "(a)",
          text: "Define what is meant by the term abstraction in the context of computational thinking.",
          correct: "Abstraction is the process of simplifying complex problems by focusing on the essential details and ignoring irrelevant information.",
          field:'textarea',
          fieldtype:'text',
          fieldname:'q4p1',
          size: 4,
          imageq:''
        },
        {
          id: "(b)",
          text: "Explain how functions can be used by programmers to achieve abstraction.",
          correct: "Functions allow programmers to group together a sequence of statements into a single block of code that can be called multiple times with different inputs. This allows the programmer to abstract away the details of the code and focus on the higher-level logic of the program.",
          field:'textarea',
          fieldtype:'text',
          fieldname:'q4p2',
          size: 4,
          imageq:''
        },
      ],
      marks: 5,
      breakdown: "2 marks for (a), 3 marks for (b)",
      markingscheme: [
        { fieldname: "q4p1", answer: "Abstraction is the process of simplifying complex problems by focusing on the essential details and ignoring irrelevant information." },
        { fieldname: "q4p2", answer: "Functions allow programmers to group together a sequence of statements into a single block of code that can be called multiple times with different inputs. This allows the programmer to abstract away the details of the code and focus on the higher-level logic of the program." },
      ],
      topic: "Computational Thinking",
      difficulty: "Medium",
      tags: ["Abstraction", "Functions"],
    },
    {
      id: 5,
      question: "Question 5",
      partstoquesion: 2,
      questiontext: "This JavaScript code shows the definition of a recursive function called mystery. The final line of code displays the output returned when mystery is called with an argument of 4.",
      questiontextreadable: "This JavaScript code shows the definition of a recursive function called mystery. The final line of code displays the output returned when mystery is called with an argument of 4.",
      imagequestion: '/images/exam-images/trialexam/sectiona/q1.png',
      imageparts: '',
      imagemarkingscheme: '',
      imagemarkingschemeparts: '',
      imageofpart: '',
      answertype: ['radio', 'textarea'],
      code: `function mystery(n) { 
  if (n === 0)
    return 0;
  return n + mystery(n - 1);
} 
alert(mystery(4));`,
      parts: [
        {
          id: "(a)",
          text: "Which of the following values is displayed when the program is run? (Tick one option.)",
          options: ["4", "1", "24", "12"],
          correct: "24",
          field:'radio',
          fieldtype:'text',
          imageq:''
        },
        {
          id: "(b)",
          text: "What makes the function mystery a recursive function?",
          correct: "The function calls itself within its definition. This allows it to repeatedly call itself with a smaller argument until it reaches a base case. The base case stops the recursion and returns a value.",
          field:'textarea',
          fieldtype:'text',
          fieldname:'q5p2',
          size: 6,
          imageq:''
        },
      ],
      marks: 5,
      breakdown: "2 marks for (a), 3 marks for (b)",
      markingscheme: [
        { fieldname: "q5p1", answer: "24" },
        { fieldname: "q5p2", answer: "The function calls itself within its definition. This allows it to repeatedly call itself with a smaller argument until it reaches a base case. The base case stops the recursion and returns a value." },
      ],
      topic: "Recursion",
      difficulty: "Medium",
      tags: ["JavaScript", "Recursion"],
    },
    {
      id: 6,
      question: "Question 6",
      partstoquesion: 1,
      questiontext: "The JavaScript code below shows the definition of a function called maxNum. The function returns the largest of three integers x, y and z. The final line of code displays the output returned when maxNum is called using the three arguments 2, 4 and 1. The call results in 4 being displayed in an alert pop-up box.",
      questiontextreadable: "The JavaScript code below shows the definition of a function called maxNum. The function returns the largest of three integers x, y and z. The final line of code displays the output returned when maxNum is called using the three arguments 2, 4 and 1. The call results in 4 being displayed in an alert pop-up box.",
      imagequestion: '/images/exam-images/trialexam/sectiona/q1.png',
      imageparts: '',
      imagemarkingscheme: '',
      imagemarkingschemeparts: '',
      imageofpart: '',
      answertype: ['input', 'textarea'],
      code: `function maxNum(x, y, z) {
  if (x >= y && x >= z) {
    return x;
  } else if (y >= x && y >= z) {
    return y;
  } else {
    return z;
  }
}
alert(maxNum(2, 4, 1));`,
      parts: [
        {
          id: "(a)",
          text: "The three arguments 2, 4 and 1 constitute a test case designed specifically to trigger the statement, return y. Suggest two further test cases that could be used to test maxNum as follows:",
          subparts: [
            {
              subpartid: "i",
              text: "A test case designed to trigger return x",
              correct: "4, 2, 1 or a range of numbers of (biggest, middle, smallest)",
              field:'input',
              fieldtype:'text',
              fieldname:'q6p1',
              size: 2,
              imageq:''
            },
            {
              subpartid: "ii",
              text: "A test case designed to trigger return z",
              correct: "2, 1, 4 or a range of numbers of (smallest, middle, biggest)",
              field:'input',
              fieldtype:'text',
              fieldname:'q6p2',
              size: 2,
              imageq:''
            },
          ],
        },
        {
          id: "(b)",
          text: "Explain why this solution is not suitable if we wish to find the maximum of a larger number of arguments.",
          correct: "The solution is not scalable because it requires adding additional else if statements for each additional argument. This would make the code more complex and harder to maintain. A better solution would be to use the Math.max function, which can take any number of arguments and return the maximum value.",
          field:'textarea',
          fieldtype:'text',
          fieldname:'q6p3',
          size: 6,
          imageq:''
        },
      ],
      marks: 5,
      breakdown: "2 marks for (a), 3 marks for (b)",
      markingscheme: [
        { fieldname: "q6p1", answer: "4, 2, 1 or a range of numbers of (biggest, middle, smallest) or similar" },
        { fieldname: "q6p2", answer: "2, 1, 4 or a range of numbers of (smallest, middle, biggest) or similar" },
        { fieldname: "q6p3", answer: "The solution is not scalable because it requires adding additional else if statements for each additional argument. This would make the code more complex and harder to maintain. A better solution would be to use the Math.max function, which can take any number of arguments and return the maximum value." },
      ],
      topic: "JavaScript Functions",
      difficulty: "Medium",
      tags: ["JavaScript", "Functions"],
    },
    {
      id: 7,
      question: "Question 7",
      partstoquesion: 1,
      questiontext: "The intention of the HTML shown below is to gather information from an end-user.",
      questiontextreadable: "The intention of the HTML shown below is to gather information from an end-user.",
      imagequestion: '/images/exam-images/trialexam/sectiona/q1.png',
      imageparts: '',
      imagemarkingscheme: '',
      imagemarkingschemeparts: '',
      imageofpart: '',
      answertype: ['textarea'],
      code: `<!DOCTYPE html>
<html>
  <body>
    <h1>Survey</h1>
    <form action="">
      <label>Name:</label>
      <input type="text" value="Enter name">
      <fieldset>
        <legend>Do you wear glasses?</legend>
        <input type="radio">Yes
        <input type="radio" checked>No
      </fieldset>
      <input type="submit" value="Back">
      <input type="submit" value="Next">
    </form>
    <p>Thank you for taking part.</p>
  </body>
</html>`,
      parts: [
        {
          id: "",
          text: "Explain how the HTML form might look in a typical web browser.",
          correct: "The form would display a text input field for the user to enter their name, followed by a radio button group with two options for the user to select whether they wear glasses. The 'No' option would be pre-selected. Below the radio buttons, there would be two submit buttons labeled 'Back' and 'Next'. Finally, there would be a paragraph thanking the user for taking part in the survey.",
          field:'textarea',
          fieldtype:'text',
          fieldname:'q7p1',
          size: 8,
          imageq:''
        },
      ],
      marks: 5,
      breakdown: "5 marks for the correct explanation",
      markingscheme: [
        { fieldname: "q7p1", answer: "The form would display a text input field for the user to enter their name, followed by a radio button group with two options for the user to select whether they wear glasses. The 'No' option would be pre-selected. Below the radio buttons, there would be two submit buttons labeled 'Back' and 'Next'. Finally, there would be a paragraph thanking the user for taking part in the survey." },
      ],
      topic: "HTML Forms",
      difficulty: "Easy",
      tags: ["HTML", "Forms"],
    },
    {
      id: 8,
      question: "Question 8",
      partstoquesion: 2,
      questiontext: "Fit Don’t Quit is the name of a fitness club that uses a computer system to store information about its members.",
      questiontextreadable: "Fit Don’t Quit is the name of a fitness club that uses a computer system to store information about its members.",
      imagequestion: '/images/exam-images/trialexam/sectiona/q1.png',
      imageparts: '',
      imagemarkingscheme: '',
      imagemarkingschemeparts: '',
      imageofpart: '',
      answertype: ['input', 'textarea'],
      parts: [
        {
          id: "(a)",
          text: "State the most suitable data type for each of the following three items:",
          subparts: [
            {
              subpartid: "i",
              text: "Member Identification (e.g. 1754):",
              correct: "Int or Integer",
              field:'input',
              fieldtype:'text',
              fieldname:'q8p1',
              size: 1,
              imageq:''
            },
            {
              subpartid: "ii",
              text: "Member Name (e.g. Mary Murphy):",
              correct: "String",
              field:'input',
              fieldtype:'text',
              fieldname:'q8p2',
              size: 1,
              imageq:''
            },
            {
              subpartid: "iii",
              text: "Amount Paid (e.g. 45.50):",
              correct: "Float or Double",
              field:'input',
              fieldtype:'text',
              fieldname:'q8p3',
              size: 1,
              imageq:''
            },
          ],
        },
        {
          id: "(b)",
          text: "Suggest the name and purpose of another useful variable for the Fit Don't Quit computer system to capture information about its members. It should be a Boolean variable.",
          subparts: [
            {
              subpartid: "i",
              text: "Name:",
              correct: "ActiveMember",
              field:'input',
              fieldtype:'text',
              fieldname:'q8p4',
              size: 1,
              imageq:''
            },
            {
              subpartid: "ii",
              text: "Purpose:",
              correct: "This variable could be used to indicate whether a member is currently active or has left the club. It would be a Boolean variable with a value of true for active members and false for inactive members.",
              field:'textarea',
              fieldtype:'text',
              fieldname:'q8p5',
              size: 2,
              imageq:''
            },
          ],
        },
      ],
      marks: 5,
      breakdown: "3 marks for (a), 2 marks for (b)",
      markingscheme: [
        { fieldname: "q8p1", answer: "Int or Integer" },
        { fieldname: "q8p2", answer: "String or Str" },
        { fieldname: "q8p3", answer: "Float or Double" },
        { fieldname: "q8p4", answer: "ActiveMember or similiar for question" },
        { fieldname: "q8p5", answer: "This variable could be used to indicate whether a member is currently active or has left the club. It would be a Boolean variable with a value of true for active members and false for inactive members. Based on the answer given to q8p4" },
      ],
      topic: "Data Types",
      difficulty: "Easy",
      tags: ["Data Types", "Variables"],
    },
       {
      id: 9,
      question: "Question 9",
      partstoquesion: 2,
      questiontext: "Define what is meant by the term relational database and explain the purpose of a primary key in a relational database.",
      questiontextreadable: "Define what is meant by the term relational database and explain the purpose of a primary key in a relational database.",
      imagequestion: '/images/exam-images/trialexam/sectiona/q1.png',
      imageparts: '',
      imagemarkingscheme: '',
      imagemarkingschemeparts: '',
      imageofpart: '',
      answertype: ['textarea'],
      parts: [
        {
          id: "(a)",
          text: "Define what is meant by the term relational database.",
          correct: "A relational database is a type of database that stores and provides access to data points that are related to one another. It uses a structure that allows the user to identify and access data in relation to another piece of data in the database.",
          field:'textarea',
          fieldtype:'text',
          fieldname:'q9p1',
          size: 4,
          imageq:''
        },
        {
          id: "(b)",
          text: "Explain the purpose of a primary key in a relational database.",
          correct: "A primary key is a unique identifier for each record in a database table. It ensures that each record can be uniquely identified and accessed. The primary key also enforces data integrity by preventing duplicate records and ensuring that each record is unique.",
          field:'textarea',
          fieldtype:'text',
          fieldname:'q9p2',
          size: 4,
          imageq:''

        },
      ],
      marks: 5,
      breakdown: "3 marks for (a), 2 marks for (b)",
      markingscheme: [
        { fieldname: "q9p1", answer: "A relational database is a type of database that stores and provides access to data points that are related to one another. It uses a structure that allows the user to identify and access data in relation to another piece of data in the database." },
        { fieldname: "q9p2", answer: "A primary key is a unique identifier for each record in a database table. It ensures that each record can be uniquely identified and accessed. The primary key also enforces data integrity by preventing duplicate records and ensuring that each record is unique." },
      ],
      topic: "Databases",
      difficulty: "Medium",
      tags: ["Databases", "Relational Database"],
    },
    {
      id: 10,
      question: "Question 10",
      partstoquesion: 2,
      questiontext: "On 15 May 2019, robotic engineers from Trinity College Dublin unveiled Stevie II, Ireland’s first socially assistive robot.",
      questiontextreadable: "On 15 May 2019, robotic engineers from Trinity College Dublin unveiled Stevie II, Ireland’s first socially assistive robot.",
      imagequestion: '/images/exam-images/trialexam/sectiona/q1.png',
      imageparts: '',
      imagemarkingscheme: '',
      imagemarkingschemeparts: '',
      imageofpart: '/images/exam-images/trialexam/sectiona/q10image.png',
      answertype: ['textarea'],
      parts: [
        {
          id: "(a)",
          text: "Identify two ways in which robots such as Stevie II could have a positive impact on the lives of elderly people.",
          subparts: [
            {
              subpartid: "i",
              text: "",
              correct: "Providing companionship and social interaction to reduce feelings of loneliness and isolation.",
              field:'textarea',
              fieldtype:'text',
              fieldname:'q10p1',
              size: 3,
              imageq:''
            },
            {
              subpartid: "ii",
              text: "",
              correct: "Assisting with daily tasks such as reminding residents to take medication or assisting with light housework.",
              field:'textarea',
              fieldtype:'text',
              fieldname:'q10p2',
              size: 3,
              imageq:''
            }
          ]
        },
        {
          id: "(b)",
          text: "Outline one ethical concern that relates to socially assistive robots such as Stevie II.",
          correct: "Some residents may find it difficult to interact with robots or may prefer human companionship. There are also concerns about privacy and data security when using robots in care settings. Potential drawbacks include the loss of human contact and the potential for robots to replace human caregivers. There are also concerns about the ethical implications of using robots to provide care and the potential for robots to be used inappropriately or to cause harm to residents.",
          field:'textarea',
          fieldtype:'text',
          fieldname:'q10p3',
          size: 4,
          imageq:''
          
        }
      ],
      marks: 5,
      breakdown: "2 marks for (a), 3 marks for (b)",
      markingscheme: [
        { fieldname: "q10p1", answer: "Providing companionship and social interaction to reduce feelings of loneliness and isolation. Or a similar answer" },
        { fieldname: "q10p2", answer: "Assisting with daily tasks such as reminding residents to take medication or assisting with light housework. Or a similar answer. Or a similar answer" },
        { fieldname: "q10p3", answer: "Some residents may find it difficult to interact with robots or may prefer human companionship. There are also concerns about privacy and data security when using robots in care settings. Potential drawbacks include the loss of human contact and the potential for robots to replace human caregivers. There are also concerns about the ethical implications of using robots to provide care and the potential for robots to be used inappropriately or to cause harm to residents. Or a similar answer" },
      ],
      topic: "Robotics",
      difficulty: "Medium",
      tags: ["Robotics", "Ethics"]
    },
    {
      id: 11,
      question: "Question 11",
      partstoquesion: 2,
      questiontext: "Algorithms, software and smart technologies have a growing presence in cities around the world. Artificial intelligence (AI), agent‐based modelling, the internet of things and machine learning can be found practically everywhere now. www.govtech.com, Silvio Carta, July 2019",
      questiontextreadable: "Algorithms, software and smart technologies have a growing presence in cities around the world. Artificial intelligence (AI), agent‐based modelling, the internet of things and machine learning can be found practically everywhere now. www.govtech.com, Silvio Carta, July 2019",
      imagequestion: '/images/exam-images/trialexam/sectiona/q1.png',
      imageparts: '',
      imagemarkingscheme: '',
      imagemarkingschemeparts: '',
      imageofpart: '',
      answertype: ['textarea'],
      parts: [
        {
          id: "(a)",
          text: "State one example of agent‐based modelling.",
          correct: "Agent-based modelling is used in traffic simulations to model the behavior of individual vehicles and drivers in a city. This allows urban planners to test different scenarios and predict traffic patterns based on real-world data or hypothetical situations.",
          field:'textarea',
          fieldtype:'text',
          fieldname:'q11p1',
          size: 5,
          imageq:''
        },
        {
          id: "(b)",
          text: "Explain how agent‐based modelling can be used to demonstrate emergent behaviours.",
          correct: "Agent-based modelling can demonstrate emergent behaviors by simulating the interactions between individual agents in a system. These interactions can lead to complex patterns and behaviors that emerge from the interactions of the agents. By modeling the behavior of each agent and the rules that govern their interactions, the model can show how emergent behaviors arise from simple rules and interactions.",
          field:'textarea',
          fieldtype:'text',
          fieldname:'q11p2',
          size: 5,
          imageq:''
        }
      ],
      marks: 5,
      breakdown: "3 marks for (a), 2 marks for (b)",
      markingscheme: [
        { fieldname: "q11p1", answer: "Agent-based modelling is used in traffic simulations to model the behavior of individual vehicles and drivers in a city. This allows urban planners to test different scenarios and predict traffic patterns based on real-world data or hypothetical situations." },
        { fieldname: "q11p2", answer: "Agent-based modelling can demonstrate emergent behaviors by simulating the interactions between individual agents in a system. These interactions can lead to complex patterns and behaviors that emerge from the interactions of the agents. By modeling the behavior of each agent and the rules that govern their interactions, the model can show how emergent behaviors arise from simple rules and interactions." },
      ],
      topic: "Smart Technologies",
      difficulty: "Medium",
      tags: ["AI", "IoT", "Machine Learning"]
    },
    {
      id: 12,
      question: "Question 12",
      partstoquesion: 2,
      questiontext: "The diagram below illustrates the typical stages of a software development design process. Outline briefly the main purpose of the (i) design and (ii) create stages.",
      questiontextreadable: "The diagram below illustrates the typical stages of a software development design process. Outline briefly the main purpose of the (i) design and (ii) create stages.",
      imagequestion: '/images/exam-images/trialexam/sectiona/q1.png',
      imageparts: '',
      imagemarkingscheme: '',
      imagemarkingschemeparts: '',
      imageofpart: '',
      answertype: ['textarea'],
      parts: [
        {
          id: "(a)",
          text: "Design:",
          correct: "The design stage involves creating detailed plans and specifications for the software based on the requirements gathered during the analysis stage. This includes designing the user interface, database structure, and system architecture.",
          field:'textarea',
          fieldtype:'text',
          fieldname:'q12p1',
          size: 4,
          imageq:''
        },
        {
          id: "(b)",
          text: "Create:",
          correct: "The create stage involves writing the actual code for the software based on the design specifications. This includes implementing the user interface, database functionality, and system logic according to the design plans.",
          field:'textarea',
          fieldtype:'text',
          fieldname:'q12p2',
          size: 4,
          imageq:''
        }
      ],
      marks: 5,
      breakdown: "3 marks for better answer, 2 marks for other",
      markingscheme: [
        { fieldname: "q12p1", answer: "The design stage involves creating detailed plans and specifications for the software based on the requirements gathered during the analysis stage. This includes designing the user interface, database structure, and system architecture." },
        { fieldname: "q12p2", answer: "The create stage involves writing the actual code for the software based on the design specifications. This includes implementing the user interface, database functionality, and system logic according to the design plans." }
      ],
      topic: "Software Development",
      difficulty: "Medium",
      tags: ["Software Development", "Design Process"]
    }
        
    ],
    sectionB: [
      // questions for section B
    ],
    sectionC: [
      // questions for section C
    ],
  };