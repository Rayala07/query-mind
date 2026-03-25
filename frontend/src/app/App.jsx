import { RouterProvider } from "react-router-dom";
import routes from "./app.routes";
import "./index.css"
import useAuth from "../features/auth/hooks/useAuth";
import { useEffect } from "react";

const App = () => {

  const auth = useAuth()

  useEffect(() => {
    auth.handleGetMe()
  }, [])

  return (
    <RouterProvider router={routes} />
  )
}

export default App