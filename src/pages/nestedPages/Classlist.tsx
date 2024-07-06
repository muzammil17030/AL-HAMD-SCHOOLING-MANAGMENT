import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getDatabase, ref, get, remove, update } from 'firebase/database';
import { app } from '../../config/Firebaseconfig';

const database = getDatabase(app);

interface ClassData {
  id: string;
  className: string;
  instructor: string;
  instructorName: string;
}

interface Teacher {
  id: string;
  name: string;
}

const Container = styled.div`
  max-width: 1000px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #f0f4f8;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: #2c3e50;
  text-align: center;
  margin-bottom: 2rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  background-color: #3498db;
  color: white;
  padding: 1rem;
  text-align: left;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #bdc3c7;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
`;

const EditButton = styled(Button)`
  background-color: #f39c12;
  color: white;
  margin-right: 0.5rem;

  &:hover {
    background-color: #d35400;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #e74c3c;
  color: white;

  &:hover {
    background-color: #c0392b;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 400px;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
`;

const SaveButton = styled(Button)`
  background-color: #2ecc71;
  color: white;

  &:hover {
    background-color: #27ae60;
  }
`;

export default function Classlist() {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [editingClass, setEditingClass] = useState<ClassData | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    fetchClasses();
    fetchTeachers();
  }, []);

  const fetchClasses = async () => {
    const classesRef = ref(database, 'ClassForm');
    const snapshot = await get(classesRef);
    if (snapshot.exists()) {
      const classesData = snapshot.val();
      const classesList = await Promise.all(
        Object.entries(classesData).map(async ([id, data]: [string, any]) => {
          const instructorName = await getInstructorName(data.instructor);
          return {
            id,
            className: data.className,
            instructor: data.instructor,
            instructorName,
          };
        })
      );
      setClasses(classesList);
    }
  };

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

  const getInstructorName = async (instructorId: string): Promise<string> => {
    const instructorRef = ref(database, `TeacherAddEdit/${instructorId}`);
    const snapshot = await get(instructorRef);
    if (snapshot.exists()) {
      return snapshot.val().name;
    }
    return 'Unknown';
  };

  const handleEdit = (classData: ClassData) => {
    setEditingClass(classData);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        const classRef = ref(database, `ClassForm/${id}`);
        await remove(classRef);
        await fetchClasses();
      } catch (error) {
        console.error('Error deleting class:', error);
      }
    }
  };

  const handleSave = async () => {
    if (editingClass) {
      try {
        const classRef = ref(database, `ClassForm/${editingClass.id}`);
        await update(classRef, {
          className: editingClass.className,
          instructor: editingClass.instructor,
        });
        setEditingClass(null);
        await fetchClasses();
      } catch (error) {
        console.error('Error updating class:', error);
      }
    }
  };

  return (
    <Container>
      <Title>Class List</Title>
      <Table>
        <thead>
          <tr>
            <Th>Class Name</Th>
            <Th>Instructor</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {classes.map((classData) => (
            <tr key={classData.id}>
              <Td>{classData.className}</Td>
              <Td>{classData.instructorName}</Td>
              <Td>
                <EditButton onClick={() => handleEdit(classData)}>Edit</EditButton>
                <DeleteButton onClick={() => handleDelete(classData.id)}>Delete</DeleteButton>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      {editingClass && (
        <Modal>
          <ModalContent>
            <h2>Edit Class</h2>
            <Input
              value={editingClass.className}
              onChange={(e) => setEditingClass({ ...editingClass, className: e.target.value })}
              placeholder="Class Name"
            />
            <Select
              value={editingClass.instructor}
              onChange={(e) => setEditingClass({ ...editingClass, instructor: e.target.value })}
            >
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </option>
              ))}
            </Select>
            <SaveButton onClick={handleSave}>Save</SaveButton>
            <Button onClick={() => setEditingClass(null)}>Cancel</Button>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
}