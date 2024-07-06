import React, { useState, useEffect } from 'react';
import { getDatabase, ref, push, onValue, remove, update, Database, DatabaseReference } from 'firebase/database';
import styled from 'styled-components';

interface ExamSchedule {
  id: string;
  subject: string;
  date: string;
  time: string;
  duration: string;
  class: string;
}

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
`;

const Title = styled.h1`
  color: #2c3e50;
  text-align: center;
  margin-bottom: 30px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
  background-color: #ecf0f1;
  padding: 20px;
  border-radius: 8px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
`;

const Button = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2980b9;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const Th = styled.th`
  background-color: #3498db;
  color: white;
  text-align: left;
  padding: 12px;
`;

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 12px;
`;

const ActionButton = styled(Button)`
  margin-right: 5px;
`;

const DeleteButton = styled(ActionButton)`
  background-color: #e74c3c;

  &:hover {
    background-color: #c0392b;
  }
`;

const ExamSchedule: React.FC = () => {
  const [schedules, setSchedules] = useState<ExamSchedule[]>([]);
  const [formData, setFormData] = useState<Omit<ExamSchedule, 'id'>>({
    subject: '',
    date: '',
    time: '',
    duration: '',
    class: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const db: Database = getDatabase();
    const schedulesRef: DatabaseReference = ref(db, 'ExamSchedule');

    const unsubscribe = onValue(schedulesRef, (snapshot) => {
      const data = snapshot.val();
      const loadedSchedules: ExamSchedule[] = [];
      for (const key in data) {
        loadedSchedules.push({ id: key, ...data[key] });
      }
      setSchedules(loadedSchedules);
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const db: Database = getDatabase();
    const schedulesRef: DatabaseReference = ref(db, 'ExamSchedule');

    if (editingId) {
      update(ref(db, `ExamSchedule/${editingId}`), formData);
      setEditingId(null);
    } else {
      push(schedulesRef, formData);
    }

    setFormData({
      subject: '',
      date: '',
      time: '',
      duration: '',
      class: '',
    });
  };

  const handleEdit = (schedule: ExamSchedule) => {
    setFormData(schedule);
    setEditingId(schedule.id);
  };

  const handleDelete = (id: string) => {
    const db: Database = getDatabase();
    remove(ref(db, `ExamSchedule/${id}`));
  };

  return (
    <Container>
      <Title>Exam Schedule</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleInputChange}
          required
        />
        <Input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          required
        />
        <Input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleInputChange}
          required
        />
        <Input
          type="text"
          name="duration"
          placeholder="Duration (e.g., 2 hours)"
          value={formData.duration}
          onChange={handleInputChange}
          required
        />
        <Select
          name="class"
          value={formData.class}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Class</option>
          <option value="Class 1">Class 1</option>
          <option value="Class 2">Class 2</option>
          <option value="Class 3">Class 3</option>
          <option value="Class 4">Class 4</option>
          <option value="Class 5">Class 5</option>
          <option value="Class 6">Class 6</option>
          <option value="Class 7">Class 7</option>
          <option value="Class 8">Class 8</option>
          <option value="Class 9">Class 9</option>
          <option value="Class 10">Class 10</option>
        </Select>
        <Button type="submit">{editingId ? 'Update' : 'Add'} Exam Schedule</Button>
      </Form>

      <Table>
        <thead>
          <tr>
            <Th>Subject</Th>
            <Th>Date</Th>
            <Th>Time</Th>
            <Th>Duration</Th>
            <Th>Class</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((schedule) => (
            <tr key={schedule.id}>
              <Td>{schedule.subject}</Td>
              <Td>{schedule.date}</Td>
              <Td>{schedule.time}</Td>
              <Td>{schedule.duration}</Td>
              <Td>{schedule.class}</Td>
              <Td>
                <ActionButton onClick={() => handleEdit(schedule)}>Edit</ActionButton>
                <DeleteButton onClick={() => handleDelete(schedule.id)}>Delete</DeleteButton>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ExamSchedule;