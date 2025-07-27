// components/Layout.jsx
export default function Layout({ children }) {
  return (
    <div className="app">
      <Navbar />
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          {children}
        </div>
      </div>
    </div>
  );
}