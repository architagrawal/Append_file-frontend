// App.tsx
import React from "react";
import FileInputComponent from "./FileInputComponent"; // Import your custom component

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Archit's project</h1>
      </header>
      <main className="container mx-auto mt-8">
        <FileInputComponent /> {/* Use your custom component */}
      </main>
    </div>
  );
};

export default App;
