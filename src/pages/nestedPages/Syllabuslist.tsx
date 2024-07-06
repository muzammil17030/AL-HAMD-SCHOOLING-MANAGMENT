import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, update, remove } from 'firebase/database';
import styled from 'styled-components';

interface Course {
  id: string;
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

const CourseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const CourseCard = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CourseTitle = styled.h2`
  color: #3498db;
  margin-bottom: 10px;
`;

const CourseInfo = styled.p`
  color: #34495e;
  margin-bottom: 5px;
`;

const Button = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2980b9;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #e74c3c;

  &:hover {
    background-color: #c0392b;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
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

const TextArea = styled.textarea`
  padding: 10px;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  resize: vertical;
`;

export default function Syllabuslist(): JSX.Element {
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [newCourse, setNewCourse] = useState<Omit<Course, 'id'>>({
    title: '',
    description: '',
    instructor: '',
    duration: '',
    startDate: '',
  });

  useEffect(() => {
    const db = getDatabase();
    const coursesRef = ref(db, 'courses');
    const teachersRef = ref(db, 'TeacherAddEdit');

    const coursesUnsubscribe = onValue(coursesRef, (snapshot) => {
      const data = snapshot.val();
      const loadedCourses: Course[] = [];
      for (const key in data) {
        loadedCourses.push({ id: key, ...data[key] });
      }
      setCourses(loadedCourses);
    });

    const teachersUnsubscribe = onValue(teachersRef, (snapshot) => {
      const data = snapshot.val();
      const loadedTeachers: Teacher[] = [];
      for (const key in data) {
        loadedTeachers.push({ id: key, name: data[key].name });
      }
      setTeachers(loadedTeachers);
    });

    return () => {
      coursesUnsubscribe();
      teachersUnsubscribe();
    };
  }, []);

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setNewCourse(course);
  };

  const handleUpdateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCourse) {
      const db = getDatabase();
      const courseRef = ref(db, `courses/${editingCourse.id}`);
      update(courseRef, newCourse);
      setEditingCourse(null);
      setNewCourse({ title: '', description: '', instructor: '', duration: '', startDate: '' });
    }
  };

  const handleDeleteCourse = (id: string) => {
    const db = getDatabase();
    const courseRef = ref(db, `courses/${id}`);
    remove(courseRef);
  };

  const handleCancelEdit = () => {
    setEditingCourse(null);
    setNewCourse({ title: '', description: '', instructor: '', duration: '', startDate: '' });
  };

  return (
    <Container>
      <Title>Syllabus List</Title>
      <CourseGrid>
        {courses.map((course) => (
          <CourseCard key={course.id}>
            {editingCourse && editingCourse.id === course.id ? (
              <Form onSubmit={handleUpdateCourse}>
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
                  placeholder="Duration"
                  value={newCourse.duration}
                  onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                />
                <Input
                  type="date"
                  value={newCourse.startDate}
                  onChange={(e) => setNewCourse({ ...newCourse, startDate: e.target.value })}
                />
                <Button type="submit">Update Course</Button>
                <Button type="button" onClick={handleCancelEdit}>Cancel</Button>
              </Form>
            ) : (
              <>
                <CourseTitle>{course.title}</CourseTitle>
                <CourseInfo>{course.description}</CourseInfo>
                <CourseInfo>Instructor: {course.instructor}</CourseInfo>
                <CourseInfo>Duration: {course.duration}</CourseInfo>
                <CourseInfo>Start Date: {course.startDate}</CourseInfo>
                <Button onClick={() => handleEditCourse(course)}>Edit</Button>
                <DeleteButton onClick={() => handleDeleteCourse(course.id)}>Delete</DeleteButton>
              </>
            )}
          </CourseCard>
        ))}
      </CourseGrid>
    </Container>
  );
}