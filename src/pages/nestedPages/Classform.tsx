import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getDatabase, ref, push, get } from 'firebase/database';
import { app } from '../../config/Firebaseconfig';

const database = getDatabase(app);

interface ClassData {
  className: string;
  instructor: string;
}

interface Teacher {
  id: string;
  name: string;
}

interface Student {
  id: string;
  name: string;
  class: string;
}

const FormContainer = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #f0f4f8;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: #2c3e50;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
`;

const InputGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #34495e;
  font-weight: bold;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const Button = styled.button`
  background-color: #3498db;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2980b9;
  }
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 2rem;
`;

const Th = styled.th`
  background-color: #3498db;
  color: white;
  padding: 0.75rem;
  text-align: left;
`;

const Td = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid #bdc3c7;
`;

const Alert = styled.div`
  background-color: #2ecc71;
  color: white;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
`;

const classOptions = [
  'Prep', 'One', 'Two', 'Three', 'Four', 'Five',
  'Six', 'Seven', 'Eight', 'Nine', 'Matric'
];

export default function Classform() {
  const [classData, setClassData] = useState<ClassData>({
    className: '',
    instructor: '',
  });
  const [errors, setErrors] = useState<Partial<ClassData>>({});
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const fetchTeachers = async () => {
      const teachersRef = ref(database, 'TeacherAddEdit');
      const snapshot = await get(teachersRef);
      if (snapshot.exists()) {
        const teachersData = snapshot.val();
        const teachersList = Object.entries(teachersData).map(([id, data]: [string, any]) => ({
          id,
          name: data.name,
        }));
        setTeachers(teachersList);
      }
    };

    fetchTeachers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setClassData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const fetchStudents = async (className: string) => {
    const studentsRef = ref(database, 'StudentAddEdit');
    const snapshot = await get(studentsRef);
    if (snapshot.exists()) {
      const studentsData = snapshot.val();
      const studentsList = Object.entries(studentsData)
        .filter(([, data]: [string, any]) => data.class === className)
        .map(([id, data]: [string, any]) => ({
          id,
          name: data.name,
          class: data.class,
        }));
      setStudents(studentsList);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ClassData> = {};
    if (!classData.className) {
      newErrors.className = 'Class name is required';
    }
    if (!classData.instructor) {
      newErrors.instructor = 'Instructor name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const classFormRef = ref(database, 'ClassForm');
        await push(classFormRef, classData);
        console.log('Class added successfully');
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000); // Hide alert after 3 seconds
        await fetchStudents(classData.className);
      } catch (error) {
        console.error('Error adding class:', error);
      }
    }
  };

  return (
    <FormContainer>
      <Title>Add New Class</Title>
      {showAlert && <Alert>Class added successfully!</Alert>}
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label htmlFor="className">Class Name</Label>
          <Select
            id="className"
            name="className"
            value={classData.className}
            onChange={handleChange}
          >
            <option value="">Select a class</option>
            {classOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
          {errors.className && <ErrorMessage>{errors.className}</ErrorMessage>}
        </InputGroup>
        <InputGroup>
          <Label htmlFor="instructor">Instructor</Label>
          <Select
            id="instructor"
            name="instructor"
            value={classData.instructor}
            onChange={handleChange}
          >
            <option value="">Select an instructor</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </Select>
          {errors.instructor && <ErrorMessage>{errors.instructor}</ErrorMessage>}
        </InputGroup>
        <Button type="submit">Add Class</Button>
      </Form>

      {students.length > 0 && (
        <>
          <h2>Students in {classData.className}</h2>
          <Table>
            <thead>
              <tr>
                <Th>Name</Th>
                <Th>Class</Th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <Td>{student.name}</Td>
                  <Td>{student.class}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </FormContainer>
  );
}