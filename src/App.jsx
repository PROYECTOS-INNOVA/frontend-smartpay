import React, { useEffect } from 'react';
import AppRoutes from './routes/AppRoutes';

function App() {
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .swal2-zindex-fix {
        z-index: 10050 !important;
      }
      .swal2-container {
        z-index: 10050 !important;
      }
      .swal2-backdrop-show {
        z-index: 10049 !important;
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <AppRoutes />
  );
}

export default App;