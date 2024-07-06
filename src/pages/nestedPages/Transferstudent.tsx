import React, { useState, useEffect } from 'react';
import { ref, onValue, get, push, remove, update } from 'firebase/database';
import { db } from '../../config/Firebaseconfig';
import styled from 'styled-components';

interface StudentState {
  studentId: string;
  name: string;
  fatherName: string;
  grade: string;
  shift: string;
  gender: string;
  toSchool: string;
}

interface Student {
  id: string;
  name: string;
  fatherName: string;
  grade: string;
  shift: string;
  gender: string;
  toSchool: string;
}

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 40px;
  background-color: #f0f8ff;
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
  display: flex;
  flex-direction: column;
  margin-bottom: 40px;
  background-color: #ffffff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
`;

const Label = styled.label`
  margin-bottom: 20px;
  color: #34495e;
  font-weight: bold;
  font-size: 18px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-top: 10px;
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
  margin-top: 10px;
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
  display: block;
  width: 100%;
  padding: 15px;
  margin-top: 35px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 20px;
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
  font-size: 18px;
  font-weight: bold;
`;

const Td = styled.td`
  border-bottom: 1px solid #ecf0f1;
  padding: 15px;
  font-size: 16px;
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

const schools = [
  'AL-HAMD CAMPUS 2',
  'AL-HAMD CAMPUS 3',
  'AL-HAMD CAMPUS 4',
  'Shah Schooling system campus 2'
];

const StudentForm: React.FC = () => {
  const [state, setState] = useState<StudentState>({
    studentId: '',
    name: '',
    fatherName: '',
    grade: '',
    shift: '',
    gender: '',
    toSchool: '',
  });

  const [students, setStudents] = useState<Student[]>([]);
  const [transferredStudents, setTransferredStudents] = useState<Student[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const studentsRef = ref(db, 'StudentAddEdit');
    onValue(studentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const studentList: Student[] = Object.entries(data).map(([id, student]: [string, any]) => ({
          id,
          ...student,
        }));
        setStudents(studentList);
      }
    });

    const transferredStudentsRef = ref(db, 'TransferredStudents');
    onValue(transferredStudentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const transferredList: Student[] = Object.entries(data).map(([id, student]: [string, any]) => ({
          id,
          ...student,
        }));
        setTransferredStudents(transferredList);
      }
    });
  }, []);

  const handleStudentChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const studentId = event.target.value;
    if (studentId) {
      const studentRef = ref(db, `StudentAddEdit/${studentId}`);
      const snapshot = await get(studentRef);
      const studentData = snapshot.val();
      if (studentData) {
        setState({
          studentId,
          name: studentData.name,
          fatherName: studentData.fatherName,
          grade: studentData.grade,
          shift: studentData.shift,
          gender: studentData.gender,
          toSchool: '',
        });
      }
    } else {
      setState({
        studentId: '',
        name: '',
        fatherName: '',
        grade: '',
        shift: '',
        gender: '',
        toSchool: '',
      });
    }
    setIsEditing(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const transferredStudentsRef = ref(db, 'TransferredStudents');
    if (isEditing) {
      const updateRef = ref(db, `TransferredStudents/${state.studentId}`);
      update(updateRef, state)
        .then(() => {
          alert('Student transfer record updated successfully!');
          setIsEditing(false);
        })
        .catch((error) => {
          alert('Error updating student transfer record: ' + error.message);
        });
    } else {
      push(transferredStudentsRef, state)
        .then(() => {
          alert('Student transferred successfully!');
        })
        .catch((error) => {
          alert('Error transferring student: ' + error.message);
        });
    }
    setState({
      studentId: '',
      name: '',
      fatherName: '',
      grade: '',
      shift: '',
      gender: '',
      toSchool: '',
    });
  };

  const handleEdit = (student: Student) => {
    setState({
      studentId: student.id,
      name: student.name,
      fatherName: student.fatherName,
      grade: student.grade,
      shift: student.shift,
      gender: student.gender,
      toSchool: student.toSchool,
    });
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    const transferredStudentRef = ref(db, `TransferredStudents/${id}`);
    remove(transferredStudentRef)
      .then(() => {
        alert('Student transfer record deleted successfully!');
      })
      .catch((error) => {
        alert('Error deleting student transfer record: ' + error.message);
      });
  };

  return (
    <Container>
      <Title>{isEditing ? 'Edit Transfer' : 'Transfer Student'}</Title>
      <Form onSubmit={handleSubmit}>
        {!isEditing && (
          <Label>
            Select Student:
            <Select
              name="studentId"
              value={state.studentId}
              onChange={handleStudentChange}
              required
            >
              <option value="">Select a student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </Select>
          </Label>
        )}
        <Label>
          Name:
          <Input
            type="text"
            name="name"
            value={state.name}
            readOnly={!isEditing}
            onChange={handleInputChange}
          />
        </Label>
        <Label>
          Father's Name:
          <Input
            type="text"
            name="fatherName"
            value={state.fatherName}
            readOnly={!isEditing}
            onChange={handleInputChange}
          />
        </Label>
        <Label>
          Grade:
          <Input
            type="text"
            name="grade"
            value={state.grade}
            readOnly={!isEditing}
            onChange={handleInputChange}
          />
        </Label>
        <Label>
          Shift:
          <Input
            type="text"
            name="shift"
            value={state.shift}
            readOnly={!isEditing}
            onChange={handleInputChange}
          />
        </Label>
        <Label>
          Gender:
          <Input
            type="text"
            name="gender"
            value={state.gender}
            readOnly={!isEditing}
            onChange={handleInputChange}
          />
        </Label>
        <Label>
          To School:
          <Select
            name="toSchool"
            value={state.toSchool}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a school</option>
            {schools.map((school, index) => (
              <option key={index} value={school}>
                {school}
              </option>
            ))}
          </Select>
        </Label>
        <Button type="submit">{isEditing ? 'Update Transfer' : 'Transfer Student'}</Button>
      </Form>

      <Title>Transferred Students</Title>
      <Table>
        <thead>
          <tr>
            <Th>Name</Th>
            <Th>Father's Name</Th>
            <Th>Grade</Th>
            <Th>Shift</Th>
            <Th>Gender</Th>
            <Th>To School</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {transferredStudents.map((student) => (
            <tr key={student.id}>
              <Td>{student.name}</Td>
              <Td>{student.fatherName}</Td>
              <Td>{student.grade}</Td>
              <Td>{student.shift}</Td>
              <Td>{student.gender}</Td>
              <Td>{student.toSchool}</Td>
              <Td>
                <EditButton onClick={() => handleEdit(student)}>Edit</EditButton>
                <DeleteButton onClick={() => handleDelete(student.id)}>Delete</DeleteButton>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default StudentForm;