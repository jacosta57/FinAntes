import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [state, setState] = useState({
    incomeSources: [],
    budgetCategories: [],
    investments: [],
    financialGoals: [],
    regularExpenses: [],
    upcomingExpenses: [],
    userProfile: null,
    loading: false,
    error: null
  });

  const fetchAllData = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const [income, budget, investments, goals, regular, upcoming, user] = await Promise.all([
        axios.get('/api/income'),
        axios.get('/api/budget'),
        axios.get('/api/investments'),
        axios.get('/api/goals'),
        axios.get('/api/regular-expenses'),
        axios.get('/api/upcoming-expenses'),
        axios.get('/api/user')
      ]);
      
      let cleanUser = null;
      if (user.data) {
        const { _id, userID, ...rest } = user.data;
        cleanUser = rest;
      }
      
      setState({
        incomeSources: income.data || [],
        budgetCategories: budget.data || [],
        investments: investments.data || [],
        financialGoals: goals.data || [],
        regularExpenses: regular.data || [],
        upcomingExpenses: upcoming.data || [],
        userProfile: cleanUser,
        loading: false,
        error: null
      });
      
      if (cleanUser && cleanUser.theme) {
        document.documentElement.setAttribute('data-theme', cleanUser.theme);
        document.documentElement.setAttribute('data-color', cleanUser.color);
      }
    } catch (err) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: err.response?.data?.message || err.message || 'Failed to fetch data'
      }));
    }
  };

  const createApiMethods = (endpoint, stateKey) => ({
    add: async (data) => {
      const response = await axios.post(endpoint, data);
      const newItem = response.data;
      setState(prev => ({ ...prev, [stateKey]: [...prev[stateKey], newItem] }));
      return newItem;
    },
    update: async (id, data) => {
      const response = await axios.put(`${endpoint}/${id}`, data);
      const updatedItem = response.data;
      setState(prev => ({
        ...prev,
        [stateKey]: prev[stateKey].map(item => item._id === id ? updatedItem : item)
      }));
      return updatedItem;
    },
    delete: async (id) => {
      await axios.delete(`${endpoint}/${id}`);
      setState(prev => ({
        ...prev,
        [stateKey]: prev[stateKey].filter(item => item._id !== id)
      }));
    }
  });

  const incomeMethods = createApiMethods('/api/income', 'incomeSources');
  const budgetMethods = createApiMethods('/api/budget', 'budgetCategories');
  const investmentMethods = createApiMethods('/api/investments', 'investments');
  const goalMethods = createApiMethods('/api/goals', 'financialGoals');
  const regularExpenseMethods = createApiMethods('/api/regular-expenses', 'regularExpenses');
  const upcomingExpenseMethods = createApiMethods('/api/upcoming-expenses', 'upcomingExpenses');

  const updateUserProfile = async (profileData) => {
    const response = await axios.put('/api/user/update', profileData);
    
    let cleanUser = null;
    if (response.data) {
      const { _id, userID, ...rest } = response.data;
      cleanUser = rest;
    }
    
    setState(prev => ({ ...prev, userProfile: cleanUser }));
    
    if (profileData.theme !== undefined) {
      document.documentElement.setAttribute('data-theme', profileData.theme);
    }
    if (profileData.color !== undefined) {
      document.documentElement.setAttribute('data-color', profileData.color);
    }
    
    return cleanUser;
  };

  const updatePassword = async (passwordData) => {
    const response = await axios.put('/api/user/password', passwordData);
    return response.data;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAllData();
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const value = {
    ...state,
    fetchData: fetchAllData,
    addIncome: incomeMethods.add,
    updateIncome: incomeMethods.update,
    deleteIncome: incomeMethods.delete,
    addBudget: budgetMethods.add,
    updateBudget: budgetMethods.update,
    deleteBudget: budgetMethods.delete,
    addGoal: goalMethods.add,
    updateGoal: goalMethods.update,
    deleteGoal: goalMethods.delete,
    addInvestment: investmentMethods.add,
    updateInvestment: investmentMethods.update,
    deleteInvestment: investmentMethods.delete,
    addRegularExpense: regularExpenseMethods.add,
    updateRegularExpense: regularExpenseMethods.update,
    deleteRegularExpense: regularExpenseMethods.delete,
    addUpcomingExpense: upcomingExpenseMethods.add,
    updateUpcomingExpense: upcomingExpenseMethods.update,
    deleteUpcomingExpense: upcomingExpenseMethods.delete,
    updateUserProfile,
    updatePassword
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};