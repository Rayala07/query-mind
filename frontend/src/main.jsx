import ReactDOM from "react-dom/client"
import App from "./app/App"
import { store } from "./app/app.store"
import Provider from "@reduxjs/toolkit"

ReactDOM.createRoot(document.querySelector("#root")).render(
    <Provider store={store}>
        <App />
    </Provider>
)