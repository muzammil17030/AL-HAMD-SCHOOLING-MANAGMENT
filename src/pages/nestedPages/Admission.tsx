import React, { useState, useEffect } from 'react';
import { getDatabase, ref, push, onValue, remove, update, Database, DatabaseReference } from 'firebase/database';
import styled from 'styled-components';

interface AdmissionData {
  id: string;
  studentName: string;
  class: string;
  parentName: string;
  contactNumber: string;
  address: string;
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

const Admission: React.FC = () => {
  const [admissions, setAdmissions] = useState<AdmissionData[]>([]);
  const [formData, setFormData] = useState<Omit<AdmissionData, 'id'>>({
    studentName: '',
    class: '',
    parentName: '',
    contactNumber: '',
    address: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const db: Database = getDatabase();
    const admissionsRef: DatabaseReference = ref(db, 'Admission');

    const unsubscribe = onValue(admissionsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedAdmissions: AdmissionData[] = [];
      for (const key in data) {
        loadedAdmissions.push({ id: key, ...data[key] });
      }
      setAdmissions(loadedAdmissions);
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
    const admissionsRef: DatabaseReference = ref(db, 'Admission');

    if (editingId) {
      update(ref(db, `Admission/${editingId}`), formData);
      setEditingId(null);
    } else {
      push(admissionsRef, formData);
    }

    setFormData({
      studentName: '',
      class: '',
      parentName: '',
      contactNumber: '',
      address: '',
    });
  };

  const handleEdit = (admission: AdmissionData) => {
    setFormData(admission);
    setEditingId(admission.id);
  };

  const handleDelete = (id: string) => {
    const db: Database = getDatabase();
    remove(ref(db, `Admission/${id}`));
  };

  return (
    <Container>
      <Title>Admission Form</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="studentName"
          placeholder="Student Name"
          value={formData.studentName}
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
        <Input
          type="text"
          name="parentName"
          placeholder="Parent Name"
          value={formData.parentName}
          onChange={handleInputChange}
          required
        />
        <Input
          type="tel"
          name="contactNumber"
          placeholder="Contact Number"
          value={formData.contactNumber}
          onChange={handleInputChange}
          required
        />
        <Input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleInputChange}
          required
        />
        <Button type="submit">{editingId ? 'Update' : 'Submit'}</Button>
      </Form>

      <Table>
        <thead>
          <tr>
            <Th>Student Name</Th>
            <Th>Class</Th>
            <Th>Parent Name</Th>
            <Th>Contact Number</Th>
            <Th>Address</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {admissions.map((admission) => (
            <tr key={admission.id}>
              <Td>{admission.studentName}</Td>
              <Td>{admission.class}</Td>
              <Td>{admission.parentName}</Td>
              <Td>{admission.contactNumber}</Td>
              <Td>{admission.address}</Td>
              <Td>
                <ActionButton onClick={() => handleEdit(admission)}>Edit</ActionButton>
                <DeleteButton onClick={() => handleDelete(admission.id)}>Delete</DeleteButton>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Admission;