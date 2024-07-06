// TeacherAllocation.tsx
import { useState, useEffect } from 'react';
import { ref, onValue, push, set, remove, update } from 'firebase/database';
import { db } from '../../config/Firebaseconfig';
import styled from 'styled-components';

interface Teacher {
  id: string;
  name: string;
}

interface Subject {
  id: string;
  name: string;
}

interface Allocation {
  id: string;
  teacherName: string;
  subjectName: string;
  timestamp: string;
}

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f0f8ff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: #2c3e50;
  text-align: center;
  margin-bottom: 20px;
`;

const SelectWrapper = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  color: #34495e;
  font-weight: bold;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  font-size: 16px;
`;

const Button = styled.button`
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2980b9;
  }
`;

const AllocationList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin-top: 20px;
`;

const AllocationItem = styled.li`
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AllocationInfo = styled.span`
  font-size: 16px;
  color: #333;
`;

const ActionButton = styled.button`
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-left: 5px;
`;

const EditButton = styled(ActionButton)`
  background-color: #f39c12;
  color: white;

  &:hover {
    background-color: #e67e22;
  }
`;

const DeleteButton = styled(ActionButton)`
  background-color: #e74c3c;
  color: white;

  &:hover {
    background-color: #c0392b;
  }
`;

export default function TeacherAllocation() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [editingAllocation, setEditingAllocation] = useState<Allocation | null>(null);

  useEffect(() => {
    const teachersRef = ref(db, 'TeacherAddEdit');
    const allocationsRef = ref(db, 'allocations');

    onValue(teachersRef, (snapshot) => {
      const data = snapshot.val();
      const teacherList: Teacher[] = [];
      const subjectList: Subject[] = [];
      if (data) {
        Object.entries(data).forEach(([id, value]: [string, any]) => {
          if (value.name) {
            teacherList.push({ id, name: value.name });
          }
          if (value.subject) {
            subjectList.push({ id, name: value.subject });
          }
        });
      }
      setTeachers(teacherList);
      setSubjects(subjectList);
    });

    onValue(allocationsRef, (snapshot) => {
      const data = snapshot.val();
      const allocationList: Allocation[] = [];
      if (data) {
        Object.entries(data).forEach(([id, value]: [string, any]) => {
          allocationList.push({ id, ...value });
        });
      }
      setAllocations(allocationList);
    });
  }, []);

  const handleAllocation = () => {
    if (selectedTeacher && selectedSubject) {
      const allocationsRef = ref(db, 'allocations');
      const newAllocationRef = push(allocationsRef);
      set(newAllocationRef, {
        teacherName: selectedTeacher,
        subjectName: selectedSubject,
        timestamp: new Date().toISOString()
      }).then(() => {
        alert('Allocation added successfully');
        setSelectedTeacher('');
        setSelectedSubject('');
      }).catch((error) => {
        alert('Error adding allocation: ' + error.message);
      });
    } else {
      alert('Please select both a teacher and a subject');
    }
  };

  const handleEdit = (allocation: Allocation) => {
    setEditingAllocation(allocation);
    setSelectedTeacher(allocation.teacherName);
    setSelectedSubject(allocation.subjectName);
  };

  const handleUpdate = () => {
    if (editingAllocation && selectedTeacher && selectedSubject) {
      const allocationRef = ref(db, `allocations/${editingAllocation.id}`);
      update(allocationRef, {
        teacherName: selectedTeacher,
        subjectName: selectedSubject,
        timestamp: new Date().toISOString()
      }).then(() => {
        alert('Allocation updated successfully');
        setEditingAllocation(null);
        setSelectedTeacher('');
        setSelectedSubject('');
      }).catch((error) => {
        alert('Error updating allocation: ' + error.message);
      });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this allocation?')) {
      const allocationRef = ref(db, `allocations/${id}`);
      remove(allocationRef).then(() => {
        ;
      }).catch((error) => {
        alert('Error deleting allocation: ' + error.message);
      });
    }
  };

  return (
    <Container>
      <Title>Teacher Allocation</Title>
      <SelectWrapper>
        <Label htmlFor="teacher-select">Select Teacher:</Label>
        <Select
          id="teacher-select"
          value={selectedTeacher}
          onChange={(e) => setSelectedTeacher(e.target.value)}
        >
          <option value="">--Please choose a teacher--</option>
          {teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.name}>
              {teacher.name}
            </option>
          ))}
        </Select>
      </SelectWrapper>
      <SelectWrapper>
        <Label htmlFor="subject-select">Select Subject:</Label>
        <Select
          id="subject-select"
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          <option value="">--Please choose a subject--</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.name}>
              {subject.name}
            </option>
          ))}
        </Select>
      </SelectWrapper>
      <Button onClick={editingAllocation ? handleUpdate : handleAllocation}>
        {editingAllocation ? 'Update Allocation' : 'Allocate'}
      </Button>
      <AllocationList>
        {allocations.map((allocation) => (
          <AllocationItem key={allocation.id}>
            <AllocationInfo>
              {allocation.teacherName} - {allocation.subjectName}
            </AllocationInfo>
            <div>
              <EditButton onClick={() => handleEdit(allocation)}>Edit</EditButton>
              <DeleteButton onClick={() => handleDelete(allocation.id)}>Delete</DeleteButton>
            </div>
          </AllocationItem>
        ))}
      </AllocationList>
    </Container>
  );
}