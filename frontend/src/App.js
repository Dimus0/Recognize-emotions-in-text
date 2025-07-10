import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function EmotionDetector() {
  const [text, setText] = useState("");
  const [emotion, setEmotion] = useState(null);
  const [loading, setLoading] = useState(false);

  const handledSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setEmotion(null);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/recognition-emotion",
        { text }
      );
      setEmotion(response.data);

      // Мок-результат для тесту
      const mockResponse = {
        emotion:
          text.toLowerCase().includes("щасливий") ||
          text.toLowerCase().includes("радісний")
            ? "позитивна"
            : text.toLowerCase().includes("сумний") ||
              text.toLowerCase().includes("поганий")
            ? "негативна"
            : "нейтральна",
        score: Math.random() * 0.4 + 0.6,
      };
      setEmotion(mockResponse);
    } catch (error) {
      setEmotion({ error: "Помилка під час розпізнавання емоції" });
    }
    setLoading(false);
  };

  const getEmotionIcon = (emotionType) => {
    switch (emotionType) {
      case "позитивна":
        return "😊";
      case "негативна":
        return "😞";
      case "нейтральна":
        return "😐";
      default:
        return "❤️";
    }
  };

  const getProgressColor = (emotionType) => {
    switch (emotionType) {
      case "позитивна":
        return "#22c55e"; // зелений
      case "негативна":
        return "#ef4444"; // червоний
      case "нейтральна":
        return "#6b7280"; // сірий
      default:
        return "#8b5cf6"; // фіолетовий
    }
  };

  const getResultClass = (emotionType) => {
    switch (emotionType) {
      case "позитивна":
        return "result result-positive";
      case "негативна":
        return "result result-negative";
      case "нейтральна":
        return "result result-neutral";
      default:
        return "result";
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="header">
          <div className="header-icon">🧠</div>
          <h1 className="header-title">Визначення емоції в тексті</h1>
          <p className="header-subtitle">
            Введіть текст і дізнайтеся яку емоцію він передає
          </p>
        </div>

        <div className="card">
          <form onSubmit={handledSubmit}>
            <label htmlFor="text-input" className="label">
              Ваш текст для аналізу:
            </label>
            <div className="input-wrapper">
              <input
                id="text-input"
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Введіть текст тут..."
                className="input"
              />
              <span className="input-icon">❤️</span>
            </div>

            <button
              type="submit"
              disabled={loading || !text.trim()}
              className="button"
            >
              {loading ? "⏳ Обробляю..." : "📤 Аналізувати емоцію"}
            </button>
          </form>
        </div>

        {loading && (
          <div className="loading">
            <p>⏳ Обробка тексту...</p>
          </div>
        )}

        {emotion && !emotion.error && (
          <div className={getResultClass(emotion.emotion)}>
            <div className="emotion-icon">{getEmotionIcon(emotion.emotion)}</div>
            <h3>Емоція: {emotion.emotion}</h3>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${emotion.score * 100}%`,
                  background: getProgressColor(emotion.emotion),
                }}
              ></div>
            </div>
            <p>Точність: {(emotion.score * 100).toFixed(1)}%</p>
          </div>
        )}

        {emotion && emotion.error && (
          <div className="error">
            <div className="error-icon">❌</div>
            <h3>Помилка</h3>
            <p>{emotion.error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmotionDetector;
