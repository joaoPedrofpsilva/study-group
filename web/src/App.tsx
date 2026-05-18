import React, { useState, useEffect } from "react";
import "./App.css";
import { FeedBack } from "./types/feedback";
import FeedbackList from "./components/FeedbackList";

function App() {
  const [feedbacks, setFeedbacks] = useState<FeedBack[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/feedbacks/list")
      .then((response) => response.json())
      .then((data) => setFeedbacks(data))
      .catch((error) => console.error("Erro ao buscar feedbacks:", error));
  }, []);

  return (
    <div className="App">
      <h1>Study Group</h1>
      <FeedbackList feedbacks={feedbacks} />
    </div>
  );
}

export default App;
