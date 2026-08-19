import { createContext, useContext, useReducer } from "react";

const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

const initialState = {
  user: null,
  isAuthenticated: false,
  error: "",
};

const reducer = function (state, action) {
  switch (action.type) {
    case "login":
      return { ...state, isAuthenticated: true, user: action.payload };
    case "logout":
      return initialState;
    case "error":
      return { ...initialState, error: action.payload };
    default:
      return { ...state, error: "Unknown action type" };
  }
};

const AuthContext = createContext();
const AuthProvider = function ({ children }) {
  const [{ user, isAuthenticated, error }, dispatch] = useReducer(
    initialState,
    reducer,
  );

  function login({ email, password }) {
    if (email !== FAKE_USER.email && password !== FAKE_USER.password)
      return dispatch({
        type: "error",
        payload: "Incorrect email or password",
      });
    dispatch({ type: "login", payload: FAKE_USER });
  }

  function logout() {
    dispatch({ type: "logout" });
  }

  return <AuthContext.Provider value={ user, isAuthenticated, error, login, logout }>{children}</AuthContext.Provider>;
};

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    return console.log("AuthContext used outside AuthProvider");

  return context;
}

export { AuthProvider, useAuth };
