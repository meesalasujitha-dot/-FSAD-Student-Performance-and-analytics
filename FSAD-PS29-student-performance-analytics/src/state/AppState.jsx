import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { computeStudentSummary, generateReportRows } from '../utils/data.js'

const AppCtx = createContext(null)

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const initial = (() => {
  // Check if user is legally signed in via localStorage
  let isAuthed = false;
  let user = null;
  let role = null;
  const token = localStorage.getItem('auth_token');
  if (token) {
     isAuthed = true;
     user = { name: localStorage.getItem('auth_name') };
     role = localStorage.getItem('auth_role');
  }

  return {
    session: {
      isAuthed,
      role, // 'admin' | 'student'
      user,
      token
    },
    ui: {
      toasts: [],
      chatOpen: false,
      theme: 'light',
    },
    data: {
      students: [],
      reports: [],
      summary: computeStudentSummary([]),
    },
  }
})()

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16)
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN': {
      const { role, name, token } = action.payload
      localStorage.setItem('auth_token', token)
      localStorage.setItem('auth_name', name)
      localStorage.setItem('auth_role', role)
      
      return {
        ...state,
        session: { isAuthed: true, role, user: { name }, token },
      }
    }
    case 'LOGOUT': {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_name')
      localStorage.removeItem('auth_role')
      return { ...state, session: { isAuthed: false, role: null, user: null, token: null } }
    }
    case 'TOAST': {
      const toast = { id: uid(), ...action.payload }
      return { ...state, ui: { ...state.ui, toasts: [toast, ...state.ui.toasts].slice(0, 4) } }
    }
    case 'DISMISS_TOAST': {
      return { ...state, ui: { ...state.ui, toasts: state.ui.toasts.filter(t => t.id !== action.payload) } }
    }
    case 'TOGGLE_CHAT': {
      return { ...state, ui: { ...state.ui, chatOpen: !state.ui.chatOpen } }
    }
    case 'SET_STUDENTS': {
      const students = action.payload;
      return {
        ...state,
        data: {
          ...state.data,
          students,
          reports: generateReportRows(students),
          summary: computeStudentSummary(students),
        },
      }
    }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initial)

  const apiFetch = async (endpoint, options = {}) => {
    const headers = { 'Content-Type': 'application/json' };
    if (state.session.token) {
      headers['Authorization'] = `Bearer ${state.session.token}`;
    }
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: { ...headers, ...options.headers }
    });
    if (!response.ok) {
       throw new Error(await response.text() || response.statusText);
    }
    // Return json if available or simple text
    const text = await response.text();
    try {
      return text ? JSON.parse(text) : {};
    } catch {
      return text;
    }
  }

  // Load students automatically when logged in
  useEffect(() => {
    if (state.session.isAuthed) {
       apiFetch('/students')
         .then(data => dispatch({ type: 'SET_STUDENTS', payload: data }))
         .catch(err => {
            console.error('Failed to fetch students:', err);
            api.toast({title: 'Error', message: 'Failed to load students data', tone: 'critical'});
         });
    }
  }, [state.session.isAuthed, state.session.token]);

  const api = useMemo(() => ({
    ...state,
    login: async (role, email, password) => {
      // Actually login via backend
      try {
        const response = await apiFetch('/auth/login', {
           method: 'POST',
           body: JSON.stringify({ email, password, role })
        });
        
        let userRole = response.role === "ROLE_ADMIN" ? "admin" : "student";
        
        dispatch({ type: 'LOGIN', payload: { role: userRole, name: response.name, token: response.token } })
        dispatch({ type: 'TOAST', payload: { title: 'Welcome', message: `Signed in as ${userRole === 'admin' ? 'Admin' : 'Student'}.`, tone: 'success' } })
        return true;
      } catch (err) {
        dispatch({ type: 'TOAST', payload: { title: 'Login Failed', message: err.message || 'Invalid credentials.', tone: 'critical' } })
        return false;
      }
    },
    logout: () => {
      dispatch({ type: 'LOGOUT' })
      dispatch({ type: 'TOAST', payload: { title: 'Signed out', message: 'You have been logged out.', tone: 'neutral' } })
    },
    toast: (t) => dispatch({ type: 'TOAST', payload: t }),
    dismissToast: (id) => dispatch({ type: 'DISMISS_TOAST', payload: id }),
    toggleChat: () => dispatch({ type: 'TOGGLE_CHAT' }),
    upsertStudent: async (s) => {
       try {
           const endpoint = s.id ? `/students/${s.id}` : '/students';
           const method = s.id ? 'PUT' : 'POST';
           const saved = await apiFetch(endpoint, {
               method,
               body: JSON.stringify(s)
           });
           
           // After saving, reload all to keep simple, or just manually map:
           apiFetch('/students').then(data => dispatch({ type: 'SET_STUDENTS', payload: data }));
           api.toast({title: 'Success', message: 'Student saved successfully', tone: 'success'});
       } catch (err) {
           api.toast({title: 'Error', message: 'Failed to save student', tone: 'critical'});
       }
    },
    deleteStudent: async (id) => {
       try {
         await apiFetch(`/students/${id}`, { method: 'DELETE' });
         apiFetch('/students').then(data => dispatch({ type: 'SET_STUDENTS', payload: data }));
         api.toast({title: 'Removed', message: 'Student deleted.', tone: 'neutral'});
       } catch (err) {
         api.toast({title: 'Error', message: 'Failed to delete student', tone: 'critical'});
       }
    },
    updateProfile: async (name) => {
       try {
         const resp = await apiFetch('/users/profile', {
            method: 'PUT',
            body: JSON.stringify({ name })
         });
         
         if (resp && resp.name) {
            let userRole = state.session.role; // Keep current session role visually
            let userToken = state.session.token;
            // Fake a LOGOUT/LOGIN or just force an action
            dispatch({ type: 'LOGIN', payload: { role: userRole, name: resp.name, token: userToken } })
            api.toast({title: 'Saved', message: 'Profile updated matching database.', tone: 'success'});
            return true;
         }
       } catch (err) {
         api.toast({title: 'Error', message: 'Failed to update profile.', tone: 'critical'});
         return false;
       }
    }
  }), [state])

  return <AppCtx.Provider value={api}>{children}</AppCtx.Provider>
}

export function useApp() {
  const ctx = useContext(AppCtx)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
