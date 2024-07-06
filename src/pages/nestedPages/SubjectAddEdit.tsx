import React, { useState, useEffect } from 'react';
import { ref, onValue, push, update, remove, get } from 'firebase/database';
import { db } from '../../config/Firebaseconfig';
import styled from 'styled-components';

interface Subject {
  id: string;
  name: string;
  code: string;
  description: string;
  creditHours: number;
  department: string;
  instructor: string;
  grade: string;
}

interface Teacher {
  id: string;
  name: string;
}

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px;
  background-color: #f5f7fa;
  border-radius: 15px;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: #2c3e50;
  text-align: center;
  margin-bottom: 35px;
  font-size: 36px;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 40px;
  background-color: #ffffff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  color: #34495e;
  font-weight: bold;
  font-size: 16px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-top: 8px;
  border: 2px solid #3498db;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;

  &:focus {
    border-color: #2980b9;
    box-shadow: 0 0 10px rgba(52, 152, 219, 0.3);
    outline: none;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  margin-top: 8px;
  border: 2px solid #3498db;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  background-color: white;

  &:focus {
    border-color: #2980b9;
    box-shadow: 0 0 10px rgba(52, 152, 219, 0.3);
    outline: none;
  }
`;

const Button = styled.button`
  grid-column: 1 / -1;
  padding: 15px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #2980b9;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(52, 152, 219, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 40px;
  background-color: #ffffff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
`;

const Th = styled.th`
  background-color: #3498db;
  color: white;
  padding: 15px;
  text-align: left;
  font-size: 16px;
  font-weight: bold;
`;

const Td = styled.td`
  border-bottom: 1px solid #ecf0f1;
  padding: 15px;
  font-size: 14px;
`;

const ActionButton = styled.button`
  padding: 8px 15px;
  margin-right: 8px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
`;

const EditButton = styled(ActionButton)`
  background-color: #2ecc71;
  color: white;

  &:hover {
    background-color: #27ae60;
    box-shadow: 0 2px 8px rgba(46, 204, 113, 0.4);
  }
`;

const DeleteButton = styled(ActionButton)`
  background-color: #e74c3c;
  color: white;

  &:hover {
    background-color: #c0392b;
    box-shadow: 0 2px 8px rgba(231, 76, 60, 0.4);
  }
`;

const subjectOptions = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science',
  'Literature', 'History', 'Geography', 'Economics', 'Psychology'
];

const departmentOptions = [
  'Science', 'Arts', 'Commerce', 'Engineering', 'Medicine',
  'Social Sciences', 'Education', 'Law', 'Business'
];

const gradeOptions = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'];

export default function SubjectAddEdit() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [currentSubject, setCurrentSubject] = useState<Subject>({
    id: '',
    name: '',
    code: '',
    description: '',
    creditHours: 0,
    department: '',
    instructor: '',
    grade: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const subjectsRef = ref(db, 'Subjects');
    onValue(subjectsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const subjectList: Subject[] = Object.entries(data).map(([id, subject]: [string, any]) => ({
          id,
          ...subject,
        }));
        setSubjects(subjectList);
      }
    });

    const teachersRef = ref(db, 'TeacherAddEdit');
    get(teachersRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const teacherList: Teacher[] = Object.entries(data).map(([id, teacher]: [string, any]) => ({
          id,
          name: teacher.name,
        }));
        setTeachers(teacherList);
      }
    });
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setCurrentSubject((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const subjectsRef = ref(db, 'Subjects');
    if (isEditing) {
      const updateRef = ref(db, `Subjects/${currentSubject.id}`);
      update(updateRef, currentSubject)
        .then(() => {
          alert('Subject updated successfully!');
          setIsEditing(false);
        })
        .catch((error) => {
          alert('Error updating subject: ' + error.message);
        });
    } else {
      push(subjectsRef, currentSubject)
        .then(() => {
          alert('Subject added successfully!');
        })
        .catch((error) => {
          alert('Error adding subject: ' + error.message);
        });
    }
    setCurrentSubject({
      id: '',
      name: '',
      code: '',
      description: '',
      creditHours: 0,
      department: '',
      instructor: '',
      grade: '',
    });
  };

  const handleEdit = (subject: Subject) => {
    setCurrentSubject(subject);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    const subjectRef = ref(db, `Subjects/${id}`);
    remove(subjectRef)
      .then(() => {
        alert('Subject deleted successfully!');
      })
      .catch((error) => {
        alert('Error deleting subject: ' + error.message);
      });
  };

  return (
    <Container>
      <Title>{isEditing ? 'Edit Subject' : 'Add New Subject'}</Title>
      <Form onSubmit={handleSubmit}>
        <Label>
          Subject Name:
          <Select
            name="name"
            value={currentSubject.name}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Subject</option>
            {subjectOptions.map((subject, index) => (
              <option key={index} value={subject}>
                {subject}
              </option>
            ))}
          </Select>
        </Label>
        <Label>
          Subject Code:
          <Input
            type="text"
            name="code"
            value={currentSubject.code}
            onChange={handleInputChange}
            required
          />
        </Label>
        <Label>
          Description:
          <Input
            type="text"
            name="description"
            value={currentSubject.description}
            onChange={handleInputChange}
          />
        </Label>
        <Label>
          Credit Hours:
          <Input
            type="number"
            name="creditHours"
            value={currentSubject.creditHours}
            onChange={handleInputChange}
            required
          />
        </Label>
        <Label>
          Department:
          <Select
            name="department"
            value={currentSubject.department}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Department</option>
            {departmentOptions.map((dept, index) => (
              <option key={index} value={dept}>
                {dept}
              </option>
            ))}
          </Select>
        </Label>
        <Label>
          Instructor:
          <Select
            name="instructor"
            value={currentSubject.instructor}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Instructor</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.name}>
                {teacher.name}
              </option>
            ))}
          </Select>
        </Label>
        <Label>
          Grade:
          <Select
            name="grade"
            value={currentSubject.grade}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Grade</option>
            {gradeOptions.map((grade, index) => (
              <option key={index} value={grade}>
                {grade}
              </option>
            ))}
          </Select>
        </Label>
        <Button type="submit">{isEditing ? 'Update Subject' : 'Add Subject'}</Button>
      </Form>

      <Title>Subjects List</Title>
      <Table>
        <thead>
          <tr>
            <Th>Name</Th>
            <Th>Code</Th>
            <Th>Credit Hours</Th>
            <Th>Department</Th>
            <Th>Instructor</Th>
            <Th>Grade</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject) => (
            <tr key={subject.id}>
              <Td>{subject.name}</Td>
              <Td>{subject.code}</Td>
              <Td>{subject.creditHours}</Td>
              <Td>{subject.department}</Td>
              <Td>{subject.instructor}</Td>
              <Td>{subject.grade}</Td>
              <Td>
                <EditButton onClick={() => handleEdit(subject)}>Edit</EditButton>
                <DeleteButton onClick={() => handleDelete(subject.id)}>Delete</DeleteButton>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}