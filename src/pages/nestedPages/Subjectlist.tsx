import React, { useState, useEffect } from 'react';
import { ref, onValue, remove, update } from 'firebase/database';
import { db } from '../../config/Firebaseconfig';
import styled from 'styled-components';

interface Subject {
  id: string;
  name: string;
  code: string;
  creditHours: number;
  department: string;
  instructor: string;
  grade: string;
}

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px;
  background-color: #f0f4f8;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
  font-size: 36px;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background-color: #ffffff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
`;

const Th = styled.th`
  background-color: #3498db;
  color: white;
  padding: 15px;
  text-align: left;
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
`;

const Td = styled.td`
  padding: 15px;
  border-bottom: 1px solid #e0e0e0;
  font-size: 14px;
  transition: background-color 0.3s ease;

  &:last-child {
    border-bottom: none;
  }
`;

const Tr = styled.tr`
  &:hover {
    background-color: #f5f5f5;
  }
`;

const Button = styled.button`
  padding: 8px 15px;
  margin-right: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
`;

const EditButton = styled(Button)`
  background-color: #2ecc71;
  color: white;

  &:hover {
    background-color: #27ae60;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #e74c3c;
  color: white;

  &:hover {
    background-color: #c0392b;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  font-size: 14px;
`;

export default function SubjectList() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedSubject, setEditedSubject] = useState<Subject | null>(null);

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
  }, []);

  const handleEdit = (subject: Subject) => {
    setEditingId(subject.id);
    setEditedSubject({ ...subject });
  };

  const handleSave = (id: string) => {
    if (editedSubject) {
      const subjectRef = ref(db, `Subjects/${id}`);
      update(subjectRef, editedSubject)
        .then(() => {
          setEditingId(null);
          setEditedSubject(null);
        })
        .catch((error) => {
          console.error("Error updating subject: ", error);
        });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      const subjectRef = ref(db, `Subjects/${id}`);
      remove(subjectRef)
        .then(() => {
          console.log("Subject deleted successfully");
        })
        .catch((error) => {
          console.error("Error deleting subject: ", error);
        });
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, field: keyof Subject) => {
    if (editedSubject) {
      setEditedSubject({ ...editedSubject, [field]: event.target.value });
    }
  };

  return (
    <Container>
      <Title>Subject List</Title>
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
            <Tr key={subject.id}>
              <Td>
                {editingId === subject.id ? (
                  <Input
                    value={editedSubject?.name || ''}
                    onChange={(e) => handleInputChange(e, 'name')}
                  />
                ) : (
                  subject.name
                )}
              </Td>
              <Td>
                {editingId === subject.id ? (
                  <Input
                    value={editedSubject?.code || ''}
                    onChange={(e) => handleInputChange(e, 'code')}
                  />
                ) : (
                  subject.code
                )}
              </Td>
              <Td>
                {editingId === subject.id ? (
                  <Input
                    type="number"
                    value={editedSubject?.creditHours || 0}
                    onChange={(e) => handleInputChange(e, 'creditHours')}
                  />
                ) : (
                  subject.creditHours
                )}
              </Td>
              <Td>
                {editingId === subject.id ? (
                  <Input
                    value={editedSubject?.department || ''}
                    onChange={(e) => handleInputChange(e, 'department')}
                  />
                ) : (
                  subject.department
                )}
              </Td>
              <Td>
                {editingId === subject.id ? (
                  <Input
                    value={editedSubject?.instructor || ''}
                    onChange={(e) => handleInputChange(e, 'instructor')}
                  />
                ) : (
                  subject.instructor
                )}
              </Td>
              <Td>
                {editingId === subject.id ? (
                  <Input
                    value={editedSubject?.grade || ''}
                    onChange={(e) => handleInputChange(e, 'grade')}
                  />
                ) : (
                  subject.grade
                )}
              </Td>
              <Td>
                {editingId === subject.id ? (
                  <EditButton onClick={() => handleSave(subject.id)}>Save</EditButton>
                ) : (
                  <EditButton onClick={() => handleEdit(subject)}>Edit</EditButton>
                )}
                <DeleteButton onClick={() => handleDelete(subject.id)}>Delete</DeleteButton>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}