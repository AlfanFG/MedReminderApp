import React, {createContext, useReducer} from 'react';

const DUMMY_EXPENSES = [
  {
    id: 'e1',
    description: 'A pair of shoes',
    medName: 'Diare',
    time: new Date('2022-01-05'),
    reminderTimes: 'Once a day',
  },
  {
    id: 'e2',
    description: 'A pair of trousers',
    medName: 'Diare',
    time: new Date('2022-01-05'),
    reminderTimes: 'Once a day',
  },
  {
    id: 'e3',
    description: 'Some bananas',
    medName: 'Diare',
    time: new Date('2021-12-01'),
    reminderTimes: 'Once a day',
  },
  {
    id: 'e4',
    description: 'A book',
    medName: 'Diare',
    time: new Date('2022-02-19'),
    reminderTimes: 'Once a day',
  },
  {
    id: 'e5',
    description: 'Another book',
    medName: 'Diare',
    time: new Date('2022-02-18'),
    reminderTimes: 'Once a day',
  },
  {
    id: 'e6',
    description: 'A pair of trousers',
    medName: 'Diare',
    time: new Date('2022-01-05'),
    reminderTimes: 'Once a day',
  },
  {
    id: 'e7',
    description: 'Some bananas',
    medName: 'Diare',
    time: new Date('2021-12-01'),
    reminderTimes: 'Once a day',
  },
  {
    id: 'e8',
    description: 'A book',
    medName: 'Diare',
    time: new Date('2022-02-19'),
    reminderTimes: 'Once a day',
  },
  {
    id: 'e9',
    description: 'Another book',
    medName: 'Diare',
    time: new Date('2022-02-18'),
    reminderTimes: 'Once a day',
  },
];

export const ExpensesContext = createContext({
  expenses: [],
  addExpense: ({description, medName, date, reminderTimes}) => {},
  deleteExpense: id => {},
  updateExpense: (id, {description, medName, date, reminderTimes}) => {},
});

function expensesReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      const id = new Date().toString() + Math.random().toString();
      return [{...action.payload, id: id}, ...state];
    case 'UPDATE':
      const updatableExpenseIndex = state.findIndex(
        expense => expense.id === action.payload.id,
      );
      const updatableExpense = state[updatableExpenseIndex];
      const updatedItem = {...updatableExpense, ...action.payload.data};
      const updatedExpenses = [...state];
      updatedExpenses[updatableExpenseIndex] = updatedItem;
      return updatedExpenses;
    case 'DELETE':
      return state.filter(expense => expense.id !== action.payload);
    default:
      return state;
  }
}

function ExpensesContextProvider({children}) {
  const [expensesState, dispatch] = useReducer(expensesReducer, DUMMY_EXPENSES);

  function addExpense(expenseData) {
    dispatch({type: 'ADD', payload: expenseData});
  }

  function deleteExpense(id) {
    dispatch({type: 'DELETE', payload: id});
  }

  function updateExpense(id, expenseData) {
    dispatch({type: 'UPDATE', payload: {id: id, data: expenseData}});
  }

  const value = {
    expenses: expensesState,
    addExpense: addExpense,
    deleteExpense: deleteExpense,
    updateExpense: updateExpense,
  };

  return (
    <ExpensesContext.Provider value={value}>
      {children}
    </ExpensesContext.Provider>
  );
}

export default ExpensesContextProvider;
