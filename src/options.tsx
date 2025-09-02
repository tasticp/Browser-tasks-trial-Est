import { createRoot } from 'react-dom/client'
import './index.css'

function OptionsApp() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-2">Arc Trail Flow — Options</h1>
      <p className="text-sm text-gray-600">Configure extension preferences here.</p>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<OptionsApp />);


