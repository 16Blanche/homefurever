import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk'; // Example: Import redux-thunk middleware
import rootReducer from './reducers'; // Example: Import your root reducer

// Define initial state if needed
const initialState = {};

// Define middleware
const middleware = [thunk]; // Add other middleware here if needed

// Create store
const store = createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(...middleware),
    // Add other enhancers here if needed
  )
);

export default store;
