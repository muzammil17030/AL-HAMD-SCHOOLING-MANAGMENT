import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getDatabase, ref, push, onValue, remove, update } from 'firebase/database';


// Styled components
const RegistrationContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: #3f51b5;
  text-align: center;
`;

const Form = styled.form`
  display: grid;
  gap: 15px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
`;

const Button = styled.button`
  background-color: #3f51b5;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #303f9f;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const Th = styled.th`
  background-color: #3f51b5;
  color: white;
  padding: 10px;
  text-align: left;
`;

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
`;

const ActionButton = styled.button`
  background-color: #4CAF50;
  border: none;
  color: white;
  padding: 5px 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  margin: 2px 2px;
  cursor: pointer;
`;

const DeleteButton = styled(ActionButton)`
  background-color: #f44336;
`;

// Interface for form data
interface RegistrationData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  grade: string;
  parentName: string;
  parentEmail: string;
  phoneNumber: string;
  address: string;
}

// Main component
const Registration: React.FC = () => {
  const [formData, setFormData] = useState<RegistrationData>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    grade: '',
    parentName: '',
    parentEmail: '',
    phoneNumber: '',
    address: '',
  });
  const [registrations, setRegistrations] = useState<Array<RegistrationData & { id: string }>>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const db = getDatabase();
    const registrationsRef = ref(db, 'Registration');

    onValue(registrationsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedRegistrations = [];
      for (const key in data) {
        loadedRegistrations.push({ id: key, ...data[key] });
      }
      setRegistrations(loadedRegistrations);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const db = getDatabase();
    const registrationsRef = ref(db, 'Registration');

    if (editingId) {
      update(ref(db, `Registration/${editingId}`), formData);
      setEditingId(null);
    } else {
      push(registrationsRef, formData);
    }

    setFormData({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      grade: '',
      parentName: '',
      parentEmail: '',
      phoneNumber: '',
      address: '',
    });
    alert(editingId ? 'Registration updated successfully!' : 'Registration submitted successfully!');
  };

  const handleEdit = (registration: RegistrationData & { id: string }) => {
    setFormData(registration);
    setEditingId(registration.id);
  };

  const handleDelete = (id: string) => {
    const db = getDatabase();
    remove(ref(db, `Registration/${id}`));
  };

  return (
    <RegistrationContainer>
      <Title>School Registration</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <Input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
        <Input
          type="date"
          name="dateOfBirth"
          placeholder="Date of Birth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          required
        />
        <Select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </Select>
        <Select
          name="grade"
          value={formData.grade}
          onChange={handleChange}
          required
        >
          <option value="">Select Grade</option>
          <option value="1">Grade 1</option>
          <option value="2">Grade 2</option>
          <option value="3">Grade 3</option>
          <option value="4">Grade 4</option>
          <option value="5">Grade 5</option>
          <option value="6">Grade 6</option>
          <option value="7">Grade 7</option>
          <option value="8">Grade 8</option>
          <option value="9">Grade 9</option>
          <option value="10">Grade 10</option>
        </Select>
        <Input
          type="text"
          name="parentName"
          placeholder="Parent/Guardian Name"
          value={formData.parentName}
          onChange={handleChange}
          required
        />
        <Input
          type="email"
          name="parentEmail"
          placeholder="Parent/Guardian Email"
          value={formData.parentEmail}
          onChange={handleChange}
          required
        />
        <Input
          type="tel"
          name="phoneNumber"
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />
        <Input
          type="text"
          name="address"
          placeholder="Home Address"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <Button type="submit">{editingId ? 'Update Registration' : 'Submit Registration'}</Button>
      </Form>

      <Table>
        <thead>
          <tr>
            <Th>Name</Th>
            <Th>Grade</Th>
            <Th>Parent Name</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {registrations.map((registration) => (
            <tr key={registration.id}>
              <Td>{`${registration.firstName} ${registration.lastName}`}</Td>
              <Td>{registration.grade}</Td>
              <Td>{registration.parentName}</Td>
              <Td>
                <ActionButton onClick={() => handleEdit(registration)}>Edit</ActionButton>
                <DeleteButton onClick={() => handleDelete(registration.id)}>Delete</DeleteButton>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </RegistrationContainer>
  );
};

export default Registration;