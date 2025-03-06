const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs')

const { initializeDatabase } = require('./db/db.connection');
const { Student } = require('./models/students.model');
const Teacher = require('./models/teachers.model')
const { error } = require('console');

app.use(cors());
app.use(express.json());

initializeDatabase();

app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

/*const jsonData = fs.readFileSync('./teachers.json')
const teachersData = JSON.parse(jsonData)*/

const seedData = () => {
  try{
    for(const studentData of studentsData){
      const student = Student({
        name: studentData.name,
        age: studentData.age,
        gender: studentData.gender,
        marks: studentData.marks,
        attendance: studentData.attendance,
        grade: studentData.grade,
      })

      student.save()
    }
  }
  catch(error){
    console.log(error)
  }
}

const seedTeacherData = () => {
  try{
    for(const teacherData of teachersData){
      const teacher = Teacher({
        name: teacherData.name,
        subject: teacherData.subject,
        experience: teacherData.experience,
        email: teacherData.email,
        phone: teacherData.phone,
      })
      teacher.save()
    }
  }
  catch(error){
    throw error
  }
}

//seedData()
//seedTeacherData()

app.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/students', async (req, res) => {
  const { name, age, grade } = req.body;

  try {
    const student = new Student({ name, age, grade });
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/students/:studentId', async(req, res) => {
  try{
    const student = await Student.findById(req.params.studentId)
    if(student){
      res.status(200).json(student)
    }
    else{
      res.status(400).json({error: 'Student not found.'})
    }
  }
  catch(error){
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.put('/students/:id', async (req, res) => {
  const studentId = req.params.id;
  const updatedStudentData = req.body;

  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      updatedStudentData,
      { new: true },
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(updatedStudent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/students/:id', async (req, res) => {
  const studentId = req.params.id;

  try {
    const deletedStudent = await Student.findByIdAndDelete(studentId);
    if (!deletedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res
      .status(200)
      .json({
        message: 'Student deleted successfully',
        student: deletedStudent,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

 app.get('/teachers', async(req, res) => {
    try{
      const teachers = await Teacher.find()
      if(teachers){
        res.status(200).json(teachers)
      }
    }
    catch(error){
      res.status(500).json({error: 'Internal Server Error'})
    }
 })

 app.delete('/teachers/:teacherId', async(req, res) => {
  try{
    const deletedTeacher = await Teacher.findByIdAndDelete(req.params.teacherId)
    if (!deletedTeacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    res.status(200).json(deletedTeacher)
  }
  catch(error){
    res.status(500).json({error: 'Internal Server Error'})
  }
 })

app.put('/teachers/:teacherId', async(req, res) => {
  try{
    const teacherId = req.params.teacherId
    const updatedTeacher = await Teacher.findByIdAndUpdate(teacherId, req.body, {new: true})
    if (!updatedTeacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    res.status(200).json(updatedTeacher)
  }
  catch(error){
    res.status(500).json({error: 'Internal Server Error'})
  }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
