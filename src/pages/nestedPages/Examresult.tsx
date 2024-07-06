import React, { useState, useEffect } from 'react';
import { getDatabase, ref, push, onValue, remove, update, Database, DatabaseReference } from 'firebase/database';
import styled from 'styled-components';

interface ExamResult {
  id: string;
  studentName: string;
  class: string;
  subject: string;
  score: number;
  totalMarks: number;
  examDate: string;
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

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const AverageScore = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #2c3e50;
`;

const ExamResult: React.FC = () => {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [formData, setFormData] = useState<Omit<ExamResult, 'id'>>({
    studentName: '',
    class: '',
    subject: '',
    score: 0,
    totalMarks: 100,
    examDate: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterClass, setFilterClass] = useState<string>('');

  useEffect(() => {
    const db: Database = getDatabase();
    const resultsRef: DatabaseReference = ref(db, 'ExamResult');

    const unsubscribe = onValue(resultsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedResults: ExamResult[] = [];
      for (const key in data) {
        loadedResults.push({ id: key, ...data[key] });
      }
      setResults(loadedResults);
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'score' || name === 'totalMarks' ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const db: Database = getDatabase();
    const resultsRef: DatabaseReference = ref(db, 'ExamResult');

    if (editingId) {
      update(ref(db, `ExamResult/${editingId}`), formData);
      setEditingId(null);
    } else {
      push(resultsRef, formData);
    }

    setFormData({
      studentName: '',
      class: '',
      subject: '',
      score: 0,
      totalMarks: 100,
      examDate: '',
    });
  };

  const handleEdit = (result: ExamResult) => {
    setFormData(result);
    setEditingId(result.id);
  };

  const handleDelete = (id: string) => {
    const db: Database = getDatabase();
    remove(ref(db, `ExamResult/${id}`));
  };

  const filteredResults = filterClass
    ? results.filter(result => result.class === filterClass)
    : results;

  const averageScore = filteredResults.length > 0
    ? filteredResults.reduce((sum, result) => sum + (result.score / result.totalMarks) * 100, 0) / filteredResults.length
    : 0;

  return (
    <Container>
      <Title>Exam Results</Title>
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
          name="subject"
          placeholder="Subject"
          value={formData.subject}
          onChange={handleInputChange}
          required
        />
        <Input
          type="number"
          name="score"
          placeholder="Score"
          value={formData.score}
          onChange={handleInputChange}
          required
        />
        <Input
          type="number"
          name="totalMarks"
          placeholder="Total Marks"
          value={formData.totalMarks}
          onChange={handleInputChange}
          required
        />
        <Input
          type="date"
          name="examDate"
          value={formData.examDate}
          onChange={handleInputChange}
          required
        />
        <Button type="submit">{editingId ? 'Update' : 'Add'} Exam Result</Button>
      </Form>

      <FilterContainer>
        <Select
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
        >
          <option value="">All Classes</option>
          <option value="Class 1">Class 1</option>
          <option value="Class 2">Class 2</option>
          <option value="Class 3">Class 3</option>
          <option value="Class 4">Class 4</option>
          <option value="Class 5">Class 5</option>
          <option value="Class 6">Class </option>
          <option value="Class 7">Class 7</option>
          <option value="Class 8">Class 8</option>
          <option value="Class 9">Class 9</option>
          <option value="Class 10">Class 10</option>
        </Select>
        <AverageScore>Average Score: {averageScore.toFixed(2)}%</AverageScore>
      </FilterContainer>

      <Table>
        <thead>
          <tr>
            <Th>Student Name</Th>
            <Th>Class</Th>
            <Th>Subject</Th>
            <Th>Score</Th>
            <Th>Total Marks</Th>
            <Th>Percentage</Th>
            <Th>Exam Date</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {filteredResults.map((result) => (
            <tr key={result.id}>
              <Td>{result.studentName}</Td>
              <Td>{result.class}</Td>
              <Td>{result.subject}</Td>
              <Td>{result.score}</Td>
              <Td>{result.totalMarks}</Td>
              <Td>{((result.score / result.totalMarks) * 100).toFixed(2)}%</Td>
              <Td>{result.examDate}</Td>
              <Td>
                <ActionButton onClick={() => handleEdit(result)}>Edit</ActionButton>
                <DeleteButton onClick={() => handleDelete(result.id)}>Delete</DeleteButton>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ExamResult;