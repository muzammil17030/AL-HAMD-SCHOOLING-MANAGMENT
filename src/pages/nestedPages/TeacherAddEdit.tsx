import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import BAButton from '../../components/BAButton';
import { getDatabase, ref, push } from 'firebase/database';
import app from '../../config/Firebaseconfig';

interface Teacher {
  name: string;
  fatherName: string;
  subject: string;
  qualification: string;
  shift: 'Morning' | 'Afternoon';
  gender: 'Male' | 'Female' | 'Other';
  salary: number;
  class: string;
}

const Teachers: React.FC = () => {
  const [newTeacher, setNewTeacher] = useState<Teacher>({ 
    name: '', 
    fatherName: '',
    subject: '', 
    qualification: 'Bachelors', 
    shift: 'Morning',
    gender: 'Male',
    salary: 0,
    class: ''
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'danger'>('success');

  const qualifications = [
    'Matric','inter','Bachelors', 'Masters', 'PhD', 'Other'
  ];

  const subjects = [
    'Mathematics', 'Science', 'English', 'History', 'Geography', 'Computer Science',
    'Physics', 'Chemistry', 'Biology', 'Literature', 'Art', 'Music', 'Physical Education'
  ];

  const classes = [
    'Nursery', 'Kindergarten', 'Prep', 
    '1st', '2nd', '3rd', '4th', '5th', 
    '6th', '7th', '8th', '9th', '10th (Matric)'
  ];

  const handleAddTeacher = async () => {
    if (newTeacher.name && newTeacher.fatherName && newTeacher.subject && newTeacher.qualification && newTeacher.shift && newTeacher.gender && newTeacher.salary && newTeacher.class) {
      try {
        const db = getDatabase(app);
        const teacherRef = ref(db, 'TeacherAddEdit');
        await push(teacherRef, newTeacher);

        setNewTeacher({ 
          name: '', 
          fatherName: '',
          subject: '', 
          qualification: 'Bachelors', 
          shift: 'Morning',
          gender: 'Male',
          salary: 0,
          class: ''
        });
        setAlertMessage('Teacher added successfully!');
        setAlertType('success');
        setShowAlert(true);
        setTimeout(() => setShowAlert(false), 3000);
      } catch (error) {
        console.error("Error adding teacher: ", error);
        setAlertMessage('Error adding teacher. Please try again.');
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
      <h1 className='text-primary mb-4'>Teacher Management</h1>
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
              value={newTeacher.name}
              onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
              className="form-control fst-italic"
              placeholder="Enter name"
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className='form-label fw-bold fs-5'>Father's Name:</label>
            <input
              type="text"
              value={newTeacher.fatherName}
              onChange={(e) => setNewTeacher({ ...newTeacher, fatherName: e.target.value })}
              className="form-control fst-italic"
              placeholder="Enter father's name"
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className='form-label fw-bold fs-5'>Subject to Teach:</label>
            <select
              value={newTeacher.subject}
              onChange={(e) => setNewTeacher({ ...newTeacher, subject: e.target.value })}
              className="form-select fst-italic"
            >
              <option value="">Select a subject</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4 mb-3">
            <label className='form-label fw-bold fs-5'>Qualification:</label>
            <select
              value={newTeacher.qualification}
              onChange={(e) => setNewTeacher({ ...newTeacher, qualification: e.target.value })}
              className="form-select fst-italic"
            >
              {qualifications.map((qual) => (
                <option key={qual} value={qual}>{qual}</option>
              ))}
            </select>
          </div>
          <div className="col-md-4 mb-3">
            <label className='form-label fw-bold fs-5'>Per Month Salary:</label>
            <input
              type="number"
              value={newTeacher.salary}
              onChange={(e) => setNewTeacher({ ...newTeacher, salary: Number(e.target.value) })}
              className="form-control fst-italic"
              placeholder="Enter salary"
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className='form-label fw-bold fs-5'>Class:</label>
            <select
              value={newTeacher.class}
              onChange={(e) => setNewTeacher({ ...newTeacher, class: e.target.value })}
              className="form-select fst-italic"
            >
              <option value="">Select a class</option>
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
                  checked={newTeacher.shift === 'Morning'}
                  onChange={() => setNewTeacher({ ...newTeacher, shift: 'Morning' })}
                /> Morning
              </label>
              <label className='fst-italic'>
                <input
                  type="radio"
                  checked={newTeacher.shift === 'Afternoon'}
                  onChange={() => setNewTeacher({ ...newTeacher, shift: 'Afternoon' })}
                /> Afternoon
              </label>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <label className='form-label fw-bold fs-5'>Gender:</label>
            <div>
              <label className="me-2 fst-italic">
                <input
                  type="radio"
                  checked={newTeacher.gender === 'Male'}
                  onChange={() => setNewTeacher({ ...newTeacher, gender: 'Male' })}
                /> Male
              </label>
              <label className="me-2 fst-italic">
                <input
                  type="radio"
                  checked={newTeacher.gender === 'Female'}
                  onChange={() => setNewTeacher({ ...newTeacher, gender: 'Female' })}
                /> Female
              </label>
              <label className='fst-italic'>
                <input
                  type="radio"
                  checked={newTeacher.gender === 'Other'}
                  onChange={() => setNewTeacher({ ...newTeacher, gender: 'Other' })}
                /> Other
              </label>
            </div>
          </div>

          <div className="col-md-4 d-flex align-items-end">
            <BAButton onClick={handleAddTeacher} label='Add Teacher'/>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Teachers;