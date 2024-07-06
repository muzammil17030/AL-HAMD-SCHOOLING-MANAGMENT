import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getDatabase, ref, push, set, get, remove, update } from 'firebase/database';
import { app } from '../../config/Firebaseconfig';

const database = getDatabase(app);

interface FeeStructure {
  id: string;
  className: string;
  feeAmount: number;
  description: string;
}

const Container = styled.div`
  max-width: 1000px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #f0f8ff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: #2c3e50;
  text-align: center;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2980b9;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 2rem;
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

const ActionButton = styled(Button)`
  margin-right: 0.5rem;
`;

const EditButton = styled(ActionButton)`
  background-color: #f39c12;

  &:hover {
    background-color: #d35400;
  }
`;

const DeleteButton = styled(ActionButton)`
  background-color: #e74c3c;

  &:hover {
    background-color: #c0392b;
  }
`;

export default function Feestructure() {
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [className, setClassName] = useState('');
  const [feeAmount, setFeeAmount] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchFeeStructures();
  }, []);

  const fetchFeeStructures = async () => {
    const feeStructuresRef = ref(database, 'Feestructure');
    const snapshot = await get(feeStructuresRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      const feeStructuresList = Object.entries(data).map(([id, value]: [string, any]) => ({
        id,
        ...value,
      }));
      setFeeStructures(feeStructuresList);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateFeeStructure();
    } else {
      await addFeeStructure();
    }
    resetForm();
    await fetchFeeStructures();
  };

  const addFeeStructure = async () => {
    const feeStructuresRef = ref(database, 'Feestructure');
    const newFeeStructureRef = push(feeStructuresRef);
    await set(newFeeStructureRef, {
      className,
      feeAmount: parseFloat(feeAmount),
      description,
    });
  };

  const updateFeeStructure = async () => {
    if (editingId) {
      const feeStructureRef = ref(database, `Feestructure/${editingId}`);
      await update(feeStructureRef, {
        className,
        feeAmount: parseFloat(feeAmount),
        description,
      });
    }
  };

  const handleEdit = (feeStructure: FeeStructure) => {
    setClassName(feeStructure.className);
    setFeeAmount(feeStructure.feeAmount.toString());
    setDescription(feeStructure.description);
    setEditingId(feeStructure.id);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this fee structure?')) {
      const feeStructureRef = ref(database, `Feestructure/${id}`);
      await remove(feeStructureRef);
      await fetchFeeStructures();
    }
  };

  const resetForm = () => {
    setClassName('');
    setFeeAmount('');
    setDescription('');
    setEditingId(null);
  };

  return (
    <Container>
      <Title>Fee Structure</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Class Name"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          required
        />
        <Input
          type="number"
          placeholder="Fee Amount"
          value={feeAmount}
          onChange={(e) => setFeeAmount(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <Button type="submit">{editingId ? 'Update' : 'Add'} Fee Structure</Button>
      </Form>

      <Table>
        <thead>
          <tr>
            <Th>Class Name</Th>
            <Th>Fee Amount</Th>
            <Th>Description</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {feeStructures.map((feeStructure) => (
            <tr key={feeStructure.id}>
              <Td>{feeStructure.className}</Td>
              <Td>${feeStructure.feeAmount.toFixed(2)}</Td>
              <Td>{feeStructure.description}</Td>
              <Td>
                <EditButton onClick={() => handleEdit(feeStructure)}>Edit</EditButton>
                <DeleteButton onClick={() => handleDelete(feeStructure.id)}>Delete</DeleteButton>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}