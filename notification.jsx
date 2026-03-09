import { useEffect, useState } from "react";
import "./Notification.css";

function Notification() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {

    const messages = [
      "New task added",
      "User logged in",
      "Backup completed",
      "Profile updated",
      "New message received"
    ];

    const interval = setInterval(() => {
      const randomMessage =
        messages[Math.floor(Math.random() * messages.length)];

      setNotifications((prev) => [
        ...prev,
        { id: Date.now(), text: randomMessage }
      ]);
    }, 5000);

    return () => clearInterval(interval);

  }, []);

  return (
    <div className="notification-box">
      <h3>Notifications</h3>

      {notifications.map((note) => (
        <div key={note.id} className="notification">
          🔔 {note.text}
        </div>
      ))}
    </div>
  );
}

export default Notification;