import { useRef, useState } from 'react'
import { ToastContext } from './ToastContext'
import Toast from '../components/ui/Toast'

export default function ToastProvider({ children }) {
  const [toast, setToast] = useState({ texto: '', visible: false })
  const temporizador = useRef(null)

  // muestra el aviso 2 segundos (si llega otro, reinicia el tiempo)
  const mostrarToast = (texto) => {
    clearTimeout(temporizador.current)
    setToast({ texto, visible: true })
    temporizador.current = setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2200)
  }

  return (
    <ToastContext.Provider value={{ mostrarToast }}>
      {children}
      <Toast texto={toast.texto} visible={toast.visible} />
    </ToastContext.Provider>
  )
}
