import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getDatabase, ref, get, remove} from 'firebase/database';
import { app } from '../../config/Firebaseconfig';

const database = getDatabase(app);

interface FeeSubmission {
  id: string;
  studentId: string;
  feeStructureId: string;
  amountPaid: number;
  paymentDate: string;
  paymentMethod: string;
}

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

const VoucherList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
`;

const Voucher = styled.div`
  background-color: #ffffff;
  border: 2px solid #3498db;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SchoolName = styled.h3`
  color: #2c3e50;
  font-size: 1rem;
  text-align: center;
  margin-bottom: 0.5rem;
`;

const VoucherTitle = styled.h2`
  color: #3498db;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const VoucherInfo = styled.p`
  color: #34495e;
  margin: 0.25rem 0;
`;

const Amount = styled.span`
  font-weight: bold;
  color: #27ae60;
`;

const RemainingBalance = styled.span`
  font-weight: bold;
  color: #e74c3c;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  color: white;
`;

const EditButton = styled(Button)`
  background-color: #f39c12;
`;

const DeleteButton = styled(Button)`
  background-color: #e74c3c;
`;

export default function Feevoucher() {
  const [feeSubmissions, setFeeSubmissions] = useState<FeeSubmission[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await fetchFeeSubmissions();
    await fetchStudents();
    await fetchFeeStructures();
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

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : 'Unknown Student';
  };

  const getFeeStructure = (feeStructureId: string) => {
    return feeStructures.find(f => f.id === feeStructureId);
  };

  const calculateRemainingBalance = (submission: FeeSubmission) => {
    const feeStructure = getFeeStructure(submission.feeStructureId);
    if (feeStructure) {
      return feeStructure.feeAmount - submission.amountPaid;
    }
    return 0;
  };

  const handleEdit = async (submission: FeeSubmission) => {
    // Implement your edit logic here
    console.log('Edit submission:', submission);
  };

  const handleDelete = async (submissionId: string) => {
    if (window.confirm('Are you sure you want to delete this fee submission?')) {
      const feeSubmissionRef = ref(database, `FeeSubmission/${submissionId}`);
      await remove(feeSubmissionRef);
      fetchFeeSubmissions();
    }
  };

  return (
    <Container>
      <Title>Fee Vouchers</Title>
      <VoucherList>
        {feeSubmissions.map((submission) => {
          const feeStructure = getFeeStructure(submission.feeStructureId);
          const remainingBalance = calculateRemainingBalance(submission);
          return (
            <Voucher key={submission.id}>
              <SchoolName>AL-HAMD SCHOOLING SYSTEM</SchoolName>
              <VoucherTitle>{getStudentName(submission.studentId)}</VoucherTitle>
              <VoucherInfo>Fee for class: {feeStructure?.className}</VoucherInfo>
              <VoucherInfo>Total Fee: ${feeStructure?.feeAmount}</VoucherInfo>
              <VoucherInfo>Amount Paid: <Amount>${submission.amountPaid}</Amount></VoucherInfo>
              <VoucherInfo>Remaining Balance: <RemainingBalance>${remainingBalance}</RemainingBalance></VoucherInfo>
              <VoucherInfo>Payment Date: {submission.paymentDate}</VoucherInfo>
              <VoucherInfo>Payment Method: {submission.paymentMethod}</VoucherInfo>
              <EditButton onClick={() => handleEdit(submission)}>Edit</EditButton>
              <DeleteButton onClick={() => handleDelete(submission.id)}>Delete</DeleteButton>
            </Voucher>
          );
        })}
      </VoucherList>
    </Container>
  );
}