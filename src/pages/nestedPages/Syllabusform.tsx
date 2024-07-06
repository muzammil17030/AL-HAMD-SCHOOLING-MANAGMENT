import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getDatabase, ref, push, onValue } from 'firebase/database';

interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  startDate: string;
}

interface Teacher {
  id: string;
  name: string;
}

const LMSContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Roboto', sans-serif;
  background-color: #f5f5f5;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: #3f51b5;
  text-align: center;
  font-size: 2.5em;
  margin-bottom: 30px;
`;

const AddCourseForm = styled.form`
  margin-top: 30px;
  display: grid;
  gap: 15px;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #dddddd;
  border-radius: 4px;
  font-size: 1em;
`;

const Select = styled.select`
  padding: 10px;
  border: 1px solid #dddddd;
  border-radius: 4px;
  font-size: 1em;
`;

const TextArea = styled.textarea`
  padding: 10px;
  border: 1px solid #dddddd;
  border-radius: 4px;
  font-size: 1em;
  resize: vertical;
`;

const Button = styled.button`
  background-color: #3f51b5;
  color: #ffffff;
  border: none;
  padding: 12px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  font-size: 1em;
  font-weight: bold;

  &:hover {
    background-color: #303f9f;
  }
`;

const Syllabus: React.FC = () => {
  const [newCourse, setNewCourse] = useState<Omit<Course, 'id'>>({
    title: '',
    description: '',
    instructor: '',
    duration: '',
    startDate: '',
  });
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    const db = getDatabase();
    const teachersRef = ref(db, 'TeacherAddEdit');

    onValue(teachersRef, (snapshot) => {
      const data = snapshot.val();
      const loadedTeachers: Teacher[] = [];
      for (const key in data) {
        loadedTeachers.push({ id: key, name: data[key].name });
      }
      setTeachers(loadedTeachers);
    });
  }, []);

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCourse.title && newCourse.description && newCourse.instructor && newCourse.duration && newCourse.startDate) {
      try {
        const db = getDatabase();
        const coursesRef = ref(db, 'courses');
        await push(coursesRef, newCourse);
        
        alert('Course added successfully!');
        setNewCourse({ title: '', description: '', instructor: '', duration: '', startDate: '' });
      } catch (error) {
        console.error('Error adding course:', error);
        alert('Failed to add course. Please try again.');
      }
    } else {
      alert('Please fill in all fields.');
    }
  };

  return (
    <LMSContainer>
      <Title>Syllabus Form</Title>
      <AddCourseForm onSubmit={handleAddCourse}>
        <Input
          type="text"
          placeholder="Course Title"
          value={newCourse.title}
          onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
        />
        <TextArea
          placeholder="Course Description"
          value={newCourse.description}
          onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
        />
        <Select
          value={newCourse.instructor}
          onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
        >
          <option value="">Select Instructor</option>
          {teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.name}>
              {teacher.name}
            </option>
          ))}
        </Select>
        <Input
          type="text"
          placeholder="Course Duration (e.g., 8 weeks)"
          value={newCourse.duration}
          onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
        />
        <Input
          type="date"
          placeholder="Start Date"
          value={newCourse.startDate}
          onChange={(e) => setNewCourse({ ...newCourse, startDate: e.target.value })}
        />
        <Button type="submit">Add Course</Button>
      </AddCourseForm>
    </LMSContainer>
  );
};

export default Syllabus;