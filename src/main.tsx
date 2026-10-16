import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {FilePickerProvider} from "./Context/FilePickerContext.tsx";
import {MessageProvider} from "./hooks/MessageProvider.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <FilePickerProvider>
          <MessageProvider>
              <App />
          </MessageProvider>
  </FilePickerProvider>
  </StrictMode>,
)
