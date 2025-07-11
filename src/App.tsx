import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  Home, 
  Upload, 
  List, 
  Users, 
  Settings,
  Database,
  Activity,
  Menu,
  X,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { UploadForm } from './components/UploadForm';
import { VersionsList } from './components/VersionsList';
import MainDashboard from './components/MainDashboard';
import ApplicationsManager from './components/ApplicationsManager';
import AppDetail from './components/AppDetail';
import UsersDashboard from './components/UsersDashboard';
import { Login } from './components/Login';
import { UserProfile } from './components/UserProfile';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

const AppContainer = styled.div`
  min-height: 100vh;
  background: #f5f6fa;
  display: flex;
`;

const Sidebar = styled.aside<{ $isOpen: boolean }>`
  width: ${props => props.$isOpen ? '280px' : '80px'};
  background: #1a237e;
  color: white;
  transition: width 0.3s ease;
  position: fixed;
  height: 100vh;
  z-index: 1000;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    width: ${props => props.$isOpen ? '280px' : '0'};
    transform: translateX(${props => props.$isOpen ? '0' : '-100%'});
  }
`;

const SidebarHeader = styled.div<{ $isOpen: boolean }>`
  padding: 1.5rem 1rem;
  border-bottom: 1px solid #2c3e8b;
  display: flex;
  align-items: center;
  gap: 1rem;
  
  .logo {
    background: white;
    color: #1a237e;
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }
  
  .title {
    font-size: 1.1rem;
    font-weight: 600;
    white-space: nowrap;
    opacity: ${props => props.$isOpen ? '1' : '0'};
    transition: opacity 0.3s ease;
  }
`;

const Nav = styled.nav`
  padding: 1rem 0;
`;

const NavItem = styled(NavLink)<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
  
  &.active {
    background: rgba(255, 255, 255, 0.15);
    color: white;
    border-left-color: #ff6b35;
  }
  
  .label {
    white-space: nowrap;
    opacity: ${props => props.$isOpen ? '1' : '0'};
    transition: opacity 0.3s ease;
  }
  
  .icon {
    min-width: 24px;
    flex-shrink: 0;
  }
`;

const MainContent = styled.main<{ $sidebarOpen: boolean }>`
  flex: 1;
  margin-left: ${props => props.$sidebarOpen ? '280px' : '80px'};
  transition: margin-left 0.3s ease;
  
  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const TopBar = styled.header`
  background: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
  
  .left {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .mobile-menu {
    display: none;
    background: none;
    border: none;
    color: #333;
    cursor: pointer;
    
    @media (max-width: 768px) {
      display: block;
    }
  }
  
  .title {
    font-size: 1.2rem;
    font-weight: 600;
    color: #333;
  }
  
  .right {
    display: flex;
    align-items: center;
    gap: 1rem;
    color: #666;
    font-size: 0.9rem;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: #f0f0f0;
    border-radius: 20px;
    cursor: pointer;
    transition: background 0.2s;
    
    &:hover {
      background: #e0e0e0;
    }
  }
  
  .logout-btn {
    background: none;
    border: none;
    color: #666;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: all 0.2s;
    
    &:hover {
      background: #f0f0f0;
      color: #333;
    }
  }
`;

const ToggleButton = styled.button`
  position: absolute;
  top: 50%;
  right: -12px;
  transform: translateY(-50%);
  background: #ff6b35;
  color: white;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const Overlay = styled.div<{ $show: boolean }>`
  display: ${props => props.$show ? 'block' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const ComingSoon = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  text-align: center;
  padding: 2rem;
  
  .icon {
    color: #ccc;
    margin-bottom: 1rem;
  }
  
  h2 {
    color: #333;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #666;
  }
`;

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { user, token, logout, isAuthenticated } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleUploadSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const navigation = [
    { path: '/', icon: Home, label: 'Dashboard', exact: true },
    { path: '/apps', icon: Database, label: 'Applicazioni' },
    { path: '/upload', icon: Upload, label: 'Upload File' },
    { path: '/versions', icon: List, label: 'Gestisci Versioni' },
    { path: '/users', icon: Users, label: 'Utenti' },
    { path: '/profile', icon: UserIcon, label: 'Profilo' },
    { path: '/settings', icon: Settings, label: 'Impostazioni', disabled: true },
  ];

  // If not authenticated, show only login page
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <AppContainer>
      <Sidebar $isOpen={sidebarOpen}>
        <SidebarHeader $isOpen={sidebarOpen}>
          <div className="logo">
            <Database size={20} />
          </div>
          <div className="title">Version Manager</div>
        </SidebarHeader>
        
        <Nav>
          {navigation.map((item) => (
            <NavItem
              key={item.path}
              to={item.path}
              $isOpen={sidebarOpen}
              className={({ isActive }) => (isActive && item.exact) ? 'active' : ''}
              style={{ 
                opacity: item.disabled ? 0.5 : 1,
                pointerEvents: item.disabled ? 'none' : 'auto'
              }}
            >
              <item.icon className="icon" size={20} />
              <span className="label">{item.label}</span>
            </NavItem>
          ))}
        </Nav>
        
        <ToggleButton onClick={toggleSidebar}>
          {sidebarOpen ? <X size={12} /> : <Menu size={12} />}
        </ToggleButton>
      </Sidebar>

      <Overlay $show={sidebarOpen} onClick={() => setSidebarOpen(false)} />

      <MainContent $sidebarOpen={sidebarOpen}>
        <TopBar>
          <div className="left">
            <button 
              className="mobile-menu"
              onClick={toggleSidebar}
            >
              <Menu size={20} />
            </button>
            <div className="title">
              <Routes>
                <Route path="/" element="📊 Dashboard Multi-App" />
                <Route path="/apps" element="📱 Gestione Applicazioni" />
                <Route path="/app/:appIdentifier" element="📱 Dettaglio App" />
                <Route path="/upload" element="📤 Upload Nuova Versione" />
                <Route path="/versions" element="📱 Gestione Versioni" />
                <Route path="/users" element="👥 Gestione Utenti" />
                <Route path="/profile" element="👤 Profilo Utente" />
                <Route path="/settings" element="⚙️ Impostazioni" />
              </Routes>
            </div>
          </div>
          <div className="right">
            <UserSection>
              <NavLink to="/profile" className="user-info">
                <UserIcon size={16} />
                <span>{user?.username || 'User'}</span>
              </NavLink>
              <button className="logout-btn" onClick={logout} title="Logout">
                <LogOut size={18} />
              </button>
            </UserSection>
          </div>
        </TopBar>

        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <MainDashboard />
            </ProtectedRoute>
          } />
          <Route path="/apps" element={
            <ProtectedRoute>
              <ApplicationsManager />
            </ProtectedRoute>
          } />
          <Route path="/app/:appIdentifier" element={
            <ProtectedRoute>
              <AppDetail />
            </ProtectedRoute>
          } />
          <Route path="/upload" element={
            <ProtectedRoute>
              <UploadForm onUploadSuccess={handleUploadSuccess} />
            </ProtectedRoute>
          } />
          <Route path="/versions" element={
            <ProtectedRoute>
              <VersionsList refreshTrigger={refreshTrigger} />
            </ProtectedRoute>
          } />
          <Route path="/users" element={
            <ProtectedRoute>
              <UsersDashboard />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <UserProfile user={user} authToken={token || ''} />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <ComingSoon>
                <Settings className="icon" size={64} />
                <h2>Impostazioni</h2>
                <p>Configurazione sistema in sviluppo</p>
              </ComingSoon>
            </ProtectedRoute>
          } />
        </Routes>
      </MainContent>
    </AppContainer>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;