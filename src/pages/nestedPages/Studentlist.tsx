import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, remove, update } from 'firebase/database';
import BAButton from '../../components/BAButton';
import app from '../../config/Firebaseconfig';

interface Student {
  id: string;
  name: string;
  fatherName: string;
  grade: string;
  shift: 'Morning' | 'Noon';
  gender: 'Male' | 'Female' | 'Other';
}

const gradeOptions = [
  'Nursery', 'Kindergarten', 'Prep', 
  '1st', '2nd', '3rd', '4th', '5th', 
  '6th', '7th', '8th', '9th', '10th (Matric)'
];

export default function Studentlist() {
  const [students, setStudents] = useState<Student[]>([]);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  const getGradeValue = (grade: string): number => {
    return gradeOptions.indexOf(grade);
  };

  useEffect(() => {
    const db = getDatabase(app);
    const studentsRef = ref(db, 'StudentAddEdit');

    const unsubscribe = onValue(studentsRef, (snapshot) => {
      setLoading(true);
      const data = snapshot.val();
      if (data) {
        const studentList = Object.entries(data).map(([id, student]) => ({
          id,
          ...(student as Omit<Student, 'id'>)
        }));
        // Sort students by grade
        const sortedStudents = studentList.sort((a, b) => 
          getGradeValue(a.grade) - getGradeValue(b.grade)
        );
        setStudents(sortedStudents);
      } else {
        setStudents([]);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching data:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = (id: string) => {
    const db = getDatabase(app);
    const studentRef = ref(db, `StudentAddEdit/${id}`);
    remove(studentRef);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
  };

  const handleUpdate = () => {
    if (editingStudent) {
      const db = getDatabase(app);
      const studentRef = ref(db, `StudentAddEdit/${editingStudent.id}`);
      update(studentRef, editingStudent);
      setEditingStudent(null);
    }
  };

  const containerStyle = {
    backgroundColor: '#f0f8ff',
    padding: '30px',
    borderRadius: '15px',
    boxShadow: '10px 30px 40px rgba(0,0,0,0.5)',
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

  const buttonStyle = {
    padding: '8px 15px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };

  const LoadingSpinner = () => (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  return (
    <div className="container mt-4" style={containerStyle}>
      <h2 className="mb-4 text-info" style={headerStyle}>Added Students </h2>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="table table-hover " style={tableStyle}>
            <thead style={theadStyle}>
              <tr >
                <th className='text-success fst-italic'>Name</th>
                <th className='text-success fst-italic'>Father's Name</th>
                <th className='text-success fst-italic'>Grade</th>
                <th className='text-success fst-italic'>Shift</th>
                <th className='text-success fst-italic'>Gender</th>
                <th className='text-success fst-italic'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{editingStudent?.id === student.id ? 
                    <input 
                      value={editingStudent.name} 
                      onChange={(e) => setEditingStudent({...editingStudent, name: e.target.value})}
                      className="form-control"
                    /> : student.name}
                  </td>
                  <td>{editingStudent?.id === student.id ? 
                    <input 
                      value={editingStudent.fatherName} 
                      onChange={(e) => setEditingStudent({...editingStudent, fatherName: e.target.value})}
                      className="form-control"
                    /> : student.fatherName}
                  </td>
                  <td>{editingStudent?.id === student.id ? 
                    <select 
                      value={editingStudent.grade} 
                      onChange={(e) => setEditingStudent({...editingStudent, grade: e.target.value})}
                      className="form-control"
                    >
                      {gradeOptions.map((grade) => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </select> : student.grade}
                  </td>
                  <td>{editingStudent?.id === student.id ? 
                    <select 
                      value={editingStudent.shift} 
                      onChange={(e) => setEditingStudent({...editingStudent, shift: e.target.value as 'Morning' | 'Noon'})}
                      className="form-control"
                    >
                      <option value="Morning">Morning</option>
                      <option value="Noon">Noon</option>
                    </select> : student.shift}
                  </td>
                  <td>{editingStudent?.id === student.id ? 
                    <select 
                      value={editingStudent.gender} 
                      onChange={(e) => setEditingStudent({...editingStudent, gender: e.target.value as 'Male' | 'Female' | 'Other'})}
                      className="form-control"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select> : student.gender}
                  </td>
                  <td>
                    {editingStudent?.id === student.id ? (
                      <>
                        <BAButton onClick={handleUpdate} label="Save" style={{ ...buttonStyle, backgroundColor: '#2ecc71', color: 'white', marginRight: '5px' }} />
                        <BAButton onClick={() => setEditingStudent(null)} label="Cancel" style={{ ...buttonStyle, backgroundColor: '#e74c3c', color: 'white' }} />
                      </>
                    ) : (
                      <>
                        <BAButton onClick={() => handleEdit(student)} label="Edit" style={{ ...buttonStyle, backgroundColor: '#3498db', color: 'white', marginRight: '5px' }} />
                        <BAButton onClick={() => handleDelete(student.id)} label="Delete" style={{ ...buttonStyle, backgroundColor: '#e74c3c', color: 'white' }} />
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}