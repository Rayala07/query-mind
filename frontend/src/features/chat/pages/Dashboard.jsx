import { useChat } from "../hooks/useChat";
import { useEffect } from "react";

const Dashboard = () => {
  const { initSocketConnection } = useChat();

  useEffect(() => {
    initSocketConnection();
  }, []);

  return <div>Dashboard</div>;
}

export default Dashboard