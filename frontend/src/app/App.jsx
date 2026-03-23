import { RouterProvider } from "react-router-dom";
import routes from "./app.routes";
import "./app/index.css"

const App = () => {
  return (
    <RouterProvider router={routes} />
  )
}

export default App