import './App.css'

function App() {
  return (
    <main className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h1 className="card-title mb-3">OctoFit Tracker</h1>
              <p className="card-text text-muted">
                React 19 + Vite frontend scaffolded for the OctoFit Tracker app.
              </p>
              <div className="d-flex gap-2">
                <a className="btn btn-primary" href="https://vite.dev/" target="_blank" rel="noreferrer">
                  Vite Docs
                </a>
                <a className="btn btn-outline-secondary" href="https://react.dev/" target="_blank" rel="noreferrer">
                  React Docs
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default App
