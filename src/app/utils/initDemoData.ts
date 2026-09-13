// Initialize demo data for testing
export function initDemoData() {
  // Check if demo data already exists
  const users = localStorage.getItem('mathverse_users');
  
  if (!users) {
    // Create demo users
    const demoUsers = [
      {
        id: 'student1',
        name: 'Ana García',
        email: 'student@demo.com',
        password: 'demo123',
        type: 'student',
        school: 'Colegio San José',
        metaPoints: 150,
        hearts: 20,
        lastLoginDate: new Date().toDateString(),
        streakDays: 3,
        dracoOutfits: ['default', 'wizard'],
        equippedOutfit: 'wizard',
        classCode: 'ABC123',
      },
      {
        id: 'teacher1',
        name: 'Profesor Carlos',
        email: 'teacher@demo.com',
        password: 'demo123',
        type: 'teacher',
        school: 'Colegio San José',
        metaPoints: 0,
        hearts: 20,
        lastLoginDate: new Date().toDateString(),
        streakDays: 1,
        dracoOutfits: ['default'],
        equippedOutfit: 'default',
      }
    ];
    
    localStorage.setItem('mathverse_users', JSON.stringify(demoUsers));
    
    // Create demo class
    const demoClass = [{
      code: 'ABC123',
      name: 'Matemáticas 5° A',
      teacherId: 'teacher1',
      teacherName: 'Profesor Carlos',
      createdAt: new Date().toISOString(),
    }];
    
    localStorage.setItem('mathverse_classes', JSON.stringify(demoClass));
    
    // Create some demo progress for student
    const demoProgress = {
      suma: {
        1: { completed: true, stars: 3, attempts: 1, errors: 0, lastAttempt: new Date().toISOString() },
        2: { completed: true, stars: 3, attempts: 1, errors: 1, lastAttempt: new Date().toISOString() },
        3: { completed: true, stars: 2, attempts: 2, errors: 3, lastAttempt: new Date().toISOString() },
      },
      resta: {
        1: { completed: true, stars: 3, attempts: 1, errors: 0, lastAttempt: new Date().toISOString() },
        2: { completed: true, stars: 2, attempts: 1, errors: 2, lastAttempt: new Date().toISOString() },
      },
      multiplicacion: {
        1: { completed: true, stars: 3, attempts: 1, errors: 1, lastAttempt: new Date().toISOString() },
      },
    };
    
    localStorage.setItem('mathverse_progress_student1', JSON.stringify(demoProgress));
    
    console.log('✅ Demo data initialized successfully!');
  }
}