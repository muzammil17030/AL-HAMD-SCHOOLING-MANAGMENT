import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getDatabase, ref, push, set, get, remove, update } from 'firebase/database';
import { app } from '../../config/Firebaseconfig';

const database = getDatabase(app);

interface Student {
  id: string;
  name: string;
  class: string;
}

interface FeeStructure {
  id: string;
  className: string;
  feeAmount: number;
}

interface FeeSubmission {
  id: string;
  studentId: string;
  feeStructureId: string;
  amountPaid: number;
  paymentDate: string;
  paymentMethod: string;
}

const Container = styled.div`
  max-width: 800px;
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
  flex-direction: column;
  gap: 1rem;
`;

const Label = styled.label`
  font-weight: bold;
  color: #34495e;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  font-size: 1rem;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
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
  padding: 0.5rem;
  text-align: left;
`;

const Td = styled.td`
  padding: 0.5rem;
  border-bottom: 1px solid #bdc3c7;
`;

const ActionButton = styled.button`
  padding: 0.25rem 0.5rem;
  margin-right: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
`;

const EditButton = styled(ActionButton)`
  background-color: #f39c12;
  color: white;
`;

const DeleteButton = styled(ActionButton)`
  background-color: #e74c3c;
  color: white;
`;

const RemainingBalance = styled.span<{ balance: number }>`
  color: ${props => props.balance > 0 ? '#e74c3c' : '#27ae60'};
  font-weight: bold;
`;

export default function FeeSubmission() {
  const [students, setStudents] = useState<Student[]>([]);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [feeSubmissions, setFeeSubmissions] = useState<FeeSubmission[]>([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedFeeStructure, setSelectedFeeStructure] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [editingSubmission, setEditingSubmission] = useState<FeeSubmission | null>(null);

  useEffect(() => {
    fetchStudents();
    fetchFeeStructures();
    fetchFeeSubmissions();
  }, []);

  const fetchStudents = async () => {
    const studentsRef = ref(database, 'StudentAddEdit');
    const snapshot = await get(studentsRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      const studentList = Object.entries(data).map(([id, value]: [string, any]) => ({
        id,
        name: value.name,
        class: value.class,
      }));
      setStudents(studentList);
    }
  };

  const fetchFeeStructures = async () => {
    const feeStructuresRef = ref(database, 'Feestructure');
    const snapshot = await get(feeStructuresRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      const feeStructureList = Object.entries(data).map(([id, value]: [string, any]) => ({
        id,
        className: value.className,
        feeAmount: value.feeAmount,
      }));
      setFeeStructures(feeStructureList);
    }
  };

  const fetchFeeSubmissions = async () => {
    const feeSubmissionsRef = ref(database, 'FeeSubmission');
    const snapshot = await get(feeSubmissionsRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      const feeSubmissionList = Object.entries(data).map(([id, value]: [string, any]) => ({
        id,
        ...value,
      }));
      setFeeSubmissions(feeSubmissionList);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const feeSubmissionRef = ref(database, 'FeeSubmission');
    const newFeeSubmissionRef = push(feeSubmissionRef);
    await set(newFeeSubmissionRef, {
      studentId: selectedStudent,
      feeStructureId: selectedFeeStructure,
      amountPaid: parseFloat(amountPaid),
      paymentDate,
      paymentMethod,
    });
    alert('Fee submission successful!');
    resetForm();
    fetchFeeSubmissions();
  };

  const resetForm = () => {
    setSelectedStudent('');
    setSelectedFeeStructure('');
    setAmountPaid('');
    setPaymentDate('');
    setPaymentMethod('');
    setEditingSubmission(null);
  };

  const handleEdit = (submission: FeeSubmission) => {
    setEditingSubmission(submission);
    setSelectedStudent(submission.studentId);
    setSelectedFeeStructure(submission.feeStructureId);
    setAmountPaid(submission.amountPaid.toString());
    setPaymentDate(submission.paymentDate);
    setPaymentMethod(submission.paymentMethod);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSubmission) {
      const feeSubmissionRef = ref(database, `FeeSubmission/${editingSubmission.id}`);
      await update(feeSubmissionRef, {
        studentId: selectedStudent,
        feeStructureId: selectedFeeStructure,
        amountPaid: parseFloat(amountPaid),
        paymentDate,
        paymentMethod,
      });
      alert('Fee submission updated successfully!');
      resetForm();
      fetchFeeSubmissions();
    }
  };

  const handleDelete = async (submissionId: string) => {
    if (window.confirm('Are you sure you want to delete this fee submission?')) {
      const feeSubmissionRef = ref(database, `FeeSubmission/${submissionId}`);
      await remove(feeSubmissionRef);
      alert('Fee submission deleted successfully!');
      fetchFeeSubmissions();
    }
  };

  const calculateRemainingBalance = (submission: FeeSubmission) => {
    const feeStructure = feeStructures.find(f => f.id === submission.feeStructureId);
    if (feeStructure) {
      return feeStructure.feeAmount - submission.amountPaid;
    }
    return 0;
  };

  return (
    <Container>
      <Title>Fee Submission</Title>
      <Form onSubmit={editingSubmission ? handleUpdate : handleSubmit}>
        <Label>
          Student:
          <Select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            required
          >
            <option value="">Select a student</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name} - {student.class}
              </option>
            ))}
          </Select>
        </Label>
        <Label>
          Fee:
          <Select
            value={selectedFeeStructure}
            onChange={(e) => setSelectedFeeStructure(e.target.value)}
            required
          >
            <option value="">Select a fee structure</option>
            {feeStructures.map((feeStructure) => (
              <option key={feeStructure.id} value={feeStructure.id}>
                {feeStructure.className} - ${feeStructure.feeAmount}
              </option>
            ))}
          </Select>
        </Label>
        <Label>
          Amount Paid:
          <Input
            type="number"
            value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value)}
            required
          />
        </Label>
        <Label>
          Payment Date:
          <Input
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            required
          />
        </Label>
        <Label>
          Payment Method:
          <Select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            required
          >
            <option value="">Select a payment method</option>
            <option value="Cash">Cash</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </Select>
        </Label>
        <Button type="submit">
          {editingSubmission ? 'Update Fee Submission' : 'Submit Fee'}
        </Button>
      </Form>

      <Table>
        <thead>
          <tr>
            <Th>Student</Th>
            <Th>Fee Structure</Th>
            <Th>Amount Paid</Th>
            <Th>Remaining Balance</Th>
            <Th>Payment Date</Th>
            <Th>Payment Method</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {feeSubmissions.map((submission) => {
            const remainingBalance = calculateRemainingBalance(submission);
            return (
              <tr key={submission.id}>
                <Td>{students.find(s => s.id === submission.studentId)?.name}</Td>
                <Td>{feeStructures.find(f => f.id === submission.feeStructureId)?.className}</Td>
                <Td>${submission.amountPaid}</Td>
                <Td>
                  <RemainingBalance balance={remainingBalance}>
                    ${remainingBalance}
                  </RemainingBalance>
                </Td>
                <Td>{submission.paymentDate}</Td>
                <Td>{submission.paymentMethod}</Td>
                <Td>
                  <EditButton onClick={() => handleEdit(submission)}>Edit</EditButton>
                  <DeleteButton onClick={() => handleDelete(submission.id)}>Delete</DeleteButton>
                </Td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
}