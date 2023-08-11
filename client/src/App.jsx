import axios from "axios";
import Router from "./Router";
import { Context } from "./Context";

function App() {

  axios.defaults.baseURL = "http://localhost:5000";

  return (
    <Context>
      <Router />
    </Context>
  )
}

export default App;
