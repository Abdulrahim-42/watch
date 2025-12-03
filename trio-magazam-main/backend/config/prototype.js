const students = [
    { name: 'Revan', age: 20, grades: [85, 90, 78] },
    { name: 'Aysel', age: 22, grades: [88, 92, 84] },
    { name: 'Murad', age: 21, grades: [75, 80, 89] }
];


const studentInfo = Array.prototype.map.call(students, function (student) {
    const averageGrade = student.grades.reduce((sum, grade) => sum + grade, 0) / student.grades.length;

    return {
        fullName: student.name,
        age: student.age,
        averageGrade: averageGrade.toFixed(2),
        info: `Tələbə: ${student.name}, Yaş: ${student.age}, Orta qiymət: ${averageGrade.toFixed(2)}`
    };
});

console.log(studentInfo);


//yakinda yakinda