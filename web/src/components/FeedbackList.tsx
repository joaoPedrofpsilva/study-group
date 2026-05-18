import { FeedBack } from "../types/feedback";

interface FeedbackListProps {
  feedbacks: FeedBack[];
}

function FeedbackList({ feedbacks }: FeedbackListProps) {
  return (
    <div>
      <h2>Feedbacks</h2>
      {feedbacks.length === 0 ? (
        <p>Nenhum feedback encontrado.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {feedbacks.map((fb) => (
            <li
              key={fb.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: 8,
                padding: 16,
                marginBottom: 12,
              }}
            >
              <strong>{fb.autor}</strong> — Nota: {fb.nota}/5
              <p>{fb.mensagem}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FeedbackList;
