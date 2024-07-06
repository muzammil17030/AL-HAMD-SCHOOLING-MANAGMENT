import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import BAButton from '../../components/BAButton';
import { getDatabase, ref, push } from 'firebase/database';
import app from '../../config/Firebaseconfig';
interface Student {
  name: string;
  fatherName: string;
  grade: string;
  shift: 'Morning' | 'Noon';
  gender: 'Male' | 'Female' | 'Other';
}

const Students: React.FC = () => {
  const [newStudent, setNewStudent] = useState<Student>({ 
    name: '', 
    fatherName: '', 
    grade: 'Nursery', 
    shift: 'Morning',
    gender: 'Male'
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'danger'>('success');

  const classes = [
    'Nursery', 'Prep', 'One', 'Two', 'Three', 'Four', 'Five',
    'Six', 'Seven', 'Eight', 'Nine', 'Matric'
  ];

  const handleAddStudent = async () => {
    if (newStudent.name && newStudent.fatherName && newStudent.grade && newStudent.shift && newStudent.gender) {
      try {
        const db = getDatabase(app);
        const studentRef = ref(db, 'StudentAddEdit');
        await push(studentRef, newStudent);

        setNewStudent({ 
          name: '', 
          fatherName: '', 
          grade: 'Nursery', 
          shift: 'Morning',
          gender: 'Male'
        });
        setAlertMessage('Student added successfully!');
        setAlertType('success');
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      } catch (error) {
        console.error("Error adding student: ", error);
        setAlertMessage('Error adding student. Please try again.');
        setAlertType('danger');
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      }
    } else {
      setAlertMessage('Please fill all fields');
      setAlertType('danger');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  return (
    <div className="container py-5 mt-3 mb-3" style={{ backgroundColor: '#f0f8ff' }}>
      <h1 className='text-primary mb-4'>Student Management</h1>
      {showAlert && (
        <div className={`alert alert-${alertType}`} role="alert">
          {alertMessage}
        </div>
      )}
      <form className="mb-4 p-4 bg-white rounded shadow">
        <div className="row">
          <div className="col-md-4 mb-3">
            <label className='form-label fw-bold fs-5'>Name:</label>
            <input
              type="text"
              value={newStudent.name}
              onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
              className="form-control fst-italic"
              placeholder="Enter name"
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className='form-label fw-bold fs-5'>Father's Name:</label>
            <input
              type="text"
              value={newStudent.fatherName}
              onChange={(e) => setNewStudent({ ...newStudent, fatherName: e.target.value })}
              className="form-control fst-italic"
              placeholder="Enter father's name"
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className='form-label fw-bold fs-5'>Class:</label>
            <select
              value={newStudent.grade}
              onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })}
              className="form-select fst-italic"
            >
              {classes.map((cls) => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4 mb-3">
            <label className='form-label fw-bold fs-5'>Shift:</label>
            <div>
              <label className="me-2 fst-italic">
                <input
                  type="radio"
                  checked={newStudent.shift === 'Morning'}
                  onChange={() => setNewStudent({ ...newStudent, shift: 'Morning' })}
                /> Morning
              </label>
              <label className='fst-italic'>
                <input
                  type="radio"
                  checked={newStudent.shift === 'Noon'}
                  onChange={() => setNewStudent({ ...newStudent, shift: 'Noon' })}
                /> Noon
              </label>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <label className='form-label fw-bold fs-5'>Gender:</label>
            <div>
              <label className="me-2 fst-italic">
                <input
                  type="radio"
                  checked={newStudent.gender === 'Male'}
                  onChange={() => setNewStudent({ ...newStudent, gender: 'Male' })}
                /> Male
              </label>
              <label className="me-2 fst-italic">
                <input
                  type="radio"
                  checked={newStudent.gender === 'Female'}
                  onChange={() => setNewStudent({ ...newStudent, gender: 'Female' })}
                /> Female
              </label>
              <label className='fst-italic'>
                <input
                  type="radio"
                  checked={newStudent.gender === 'Other'}
                  onChange={() => setNewStudent({ ...newStudent, gender: 'Other' })}
                /> Other
              </label>
            </div>
          </div>
          <div className="col-md-4 d-flex align-items-end">
            <BAButton onClick={handleAddStudent} label='Add Student'/>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Students;