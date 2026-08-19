import { createContext, useContext, useReducer } from "react";

const FAKE_USER = {
  name: "Marinus",
  email: "marinus@example.com",
  password: "qwerty",
  avatar: "https://avatars.githubusercontent.com/u/156594144?v=4",
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
    reducer,
    initialState,
  );

  function login({ email, password }) {
    if (email === FAKE_USER.email && password === FAKE_USER.password)
      // login successful
      return dispatch({ type: "login", payload: FAKE_USER });
    // error: incorrect email or password
    dispatch({
      type: "error",
      payload: "Incorrect email or password",
    });
  }

  function logout() {
    dispatch({ type: "logout" });
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, error, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    return console.log("AuthContext used outside AuthProvider");

  return context;
}

export { AuthProvider, useAuth };
