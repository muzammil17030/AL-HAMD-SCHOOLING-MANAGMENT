import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, update, remove } from 'firebase/database';
import app from '../../config/Firebaseconfig';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Teacher {
  id: string;
  name: string;
  fatherName: string;
  subject: string;
  shift: 'Morning' | 'Noon';
  gender: 'Male' | 'Female' | 'Other';
  salary: number;
  qualification: string;
  class: string;
}

const TeacherList: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  const subjectOptions = ['Mathematics', 'Science', 'English', 'History', 'Geography', 'Computer Science',
    'Physics', 'Chemistry', 'Biology', 'Literature', 'Art', 'Music', 'Physical Education'
  ];
  const qualificationOptions = ['Matric', 'Inter', 'Bachelors', 'Masters', 'PhD', 'Other'];
  const classOptions = ['Nursery', 'Kindergarten', 'Prep', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th (Matric)'];

  useEffect(() => {
    const db = getDatabase(app);
    const teacherRef = ref(db, 'TeacherAddEdit');
    onValue(teacherRef, (snapshot) => {
      const teachersData: Teacher[] = [];
      snapshot.forEach((childSnapshot) => {
        teachersData.push({ id: childSnapshot.key as string, ...childSnapshot.val() });
      });
      // Sort teachers by class
      teachersData.sort((a, b) => classOptions.indexOf(a.class) - classOptions.indexOf(b.class));
      setTeachers(teachersData);
      setLoading(false);
    });
  }, []);

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
  };

  const handleSave = () => {
    if (editingTeacher) {
      const db = getDatabase(app);
      const teacherRef = ref(db, `TeacherAddEdit/${editingTeacher.id}`);
      update(teacherRef, editingTeacher);
      setEditingTeacher(null);
    }
  };

  const handleDelete = (id: string) => {
    const db = getDatabase(app);
    const teacherRef = ref(db, `TeacherAddEdit/${id}`);
    remove(teacherRef);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (editingTeacher) {
      setEditingTeacher({
        ...editingTeacher,
        [e.target.name]: e.target.value
      });
    }
  };

  const containerStyle = {
    backgroundColor: '#f0f8ff',
    padding: '30px',
    borderRadius: '15px',
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
    maxWidth: '1200px',
    margin: '40px auto',
  };

  const headerStyle = {
    color: '#2c3e50',
    textAlign: 'center' as const,
    fontSize: '2.5rem',
    marginBottom: '30px',
    textTransform: 'uppercase' as const,
    letterSpacing: '2px',
    borderBottom: '3px solid #3498db',
    paddingBottom: '10px',
  };

  const tableStyle = {
    backgroundColor: 'white',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    borderRadius: '8px',
    overflow: 'hidden',
  };

  const theadStyle = {
    backgroundColor: '#3498db',
    color: 'white',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
  };

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>Teacher List</h1>
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive" style={tableStyle}>
          <table className="table table-hover mb-0">
            <thead style={theadStyle}>
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Father's Name</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Class</th>
                <th className="px-4 py-3">Shift</th>
                <th className="px-4 py-3">Gender</th>
                <th className="px-4 py-3">Salary</th>
                <th className="px-4 py-3">Qualification</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher.id} className={teacher.id === editingTeacher?.id ? 'table-primary' : ''}>
                  <td className="px-4 py-3">
                    {editingTeacher?.id === teacher.id ? (
                      <input type="text" name="name" value={editingTeacher.name} onChange={handleInputChange} className="form-control" />
                    ) : (
                      teacher.name
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingTeacher?.id === teacher.id ? (
                      <input type="text" name="fatherName" value={editingTeacher.fatherName} onChange={handleInputChange} className="form-control" />
                    ) : (
                      teacher.fatherName
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingTeacher?.id === teacher.id ? (
                      <select name="subject" value={editingTeacher.subject} onChange={handleInputChange} className="form-select">
                        {subjectOptions.map((subject) => (
                          <option key={subject} value={subject}>{subject}</option>
                        ))}
                      </select>
                    ) : (
                      teacher.subject
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingTeacher?.id === teacher.id ? (
                      <select name="class" value={editingTeacher.class} onChange={handleInputChange} className="form-select">
                        {classOptions.map((classOption) => (
                          <option key={classOption} value={classOption}>{classOption}</option>
                        ))}
                      </select>
                    ) : (
                      teacher.class
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingTeacher?.id === teacher.id ? (
                      <select name="shift" value={editingTeacher.shift} onChange={handleInputChange} className="form-select">
                        <option value="Morning">Morning</option>
                        <option value="Noon">Noon</option>
                      </select>
                    ) : (
                      teacher.shift
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingTeacher?.id === teacher.id ? (
                      <select name="gender" value={editingTeacher.gender} onChange={handleInputChange} className="form-select">
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    ) : (
                      teacher.gender
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingTeacher?.id === teacher.id ? (
                      <input type="number" name="salary" value={editingTeacher.salary} onChange={handleInputChange} className="form-control" />
                    ) : (
                      teacher.salary
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingTeacher?.id === teacher.id ? (
                      <select name="qualification" value={editingTeacher.qualification} onChange={handleInputChange} className="form-select">
                        {qualificationOptions.map((qualification) => (
                          <option key={qualification} value={qualification}>{qualification}</option>
                        ))}
                      </select>
                    ) : (
                      teacher.qualification
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingTeacher?.id === teacher.id ? (
                      <button className="btn btn-success btn-sm me-2" onClick={handleSave}>Save</button>
                    ) : (
                      <button className="btn btn-primary btn-sm me-2 mt-2" onClick={() => handleEdit(teacher)}>Edit</button>
                    )}
                    <button className="btn btn-danger btn-sm mt-2" onClick={() => handleDelete(teacher.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TeacherList;