const students = [
  { name: "Yash", marks: 85, subject: "Math" },
  { name: "Riya", marks: 35, subject: "Science" },
  { name: "Kabir", marks: 72, subject: "Math" },
  { name: "Ananya", marks: 91, subject: "English" },
  { name: "Rahul", marks: 28, subject: "Science" },
  { name: "Meera", marks: 66, subject: "English" },
  { name: "Arjun", marks: 49, subject: "Math" },
  { name: "Sara", marks: 38, subject: "English" },
  { name: "Dev", marks: 74, subject: "Science" },
  { name: "Isha", marks: 82, subject: "Math" }
];
const passStudents = students.filter(student => student.marks >= 40);
console.log(passStudents);

const failStudents = students.filter(student => student.marks < 40);
console.log(failStudents);

const averageMarks =students.reduce((sum, student) => sum + student.marks, 0) / students.length;
console.log("Average Marks: " + averageMarks);

const topper = students.reduce((max, student) =>student.marks > max.marks ? student : max);
console.log(topper);

const groupBySubject = students.reduce((group, student) => {
  if (!group[student.subject]) {
    group[student.subject] = [];
  }
  group[student.subject].push(student);
  return group;
}, {});
console.log(groupBySubject);