import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import TiltCard from './Tilt'
import {
  Activity,
  ArrowUp,
  Car,
  CreditCard,
  Gift,
  Home,
  PiggyBank,
  ShoppingCart,
  PieChart,
  ChevronDown,
  ChevronUp,
  CircleAlert,
  Utensils,
  ArrowDown,
  Zap,
  TrendingUp,
  Clock,
  RefreshCw,
  Wallet
} from 'lucide-react'
import { styles } from '../assets/dummyStyles'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import API_BASE_URL from '../utils/config'


const API_BASE = API_BASE_URL

// Category icons mapping
const CATEGORY_ICONS = {
  Food: <Utensils className="w-4 h-4" />,
  Housing: <Home className="w-4 h-4" />,
  Transport: <Car className="w-4 h-4" />,
  Shopping: <ShoppingCart className="w-4 h-4" />,
  Entertainment: <Gift className="w-4 h-4" />,
  Utilities: <Zap className="w-4 h-4" />,
  Healthcare: <Activity className="w-4 h-4" />,
  Salary: <ArrowUp className="w-4 h-4" />,
  Freelance: <CreditCard className="w-4 h-4" />,
  Savings: <PiggyBank className="w-4 h-4" />,
}

// filter function for transactions based on category
const filterTransactions = (transactions, frame) => {
  const now = new Date()
  const today = new Date(now).setHours(0, 0, 0, 0)

  switch (frame) {
    case "daily":
      return transactions.filter((t) => new Date(t.date) >= today)
    case "weekly": {
      const startOfWeek = new Date(today)
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
      return transactions.filter((t) => new Date(t.date) >= startOfWeek)
    }
    case "monthly":
      return transactions.filter(
        (t) => new Date(t.date).getMonth() === now.getMonth()
      )
    default:
      return transactions
  }
}

// safe array extraction from API response
const safeArrayFromResponse = (res) => {
  const body = res?.data
  if (!body) return []
  if (Array.isArray(body)) return body
  if (Array.isArray(body.data)) return body.data
  if (Array.isArray(body.incomes)) return body.incomes
  if (Array.isArray(body.expenses)) return body.expenses
  return []
}

const Layout = ({ onLogout, user, token }) => {

  const [transactions, setTransactions] = useState([])
  const [timeFrame, setTimeFrame] = useState("monthly")
  const [loading, setLoading] = useState(false)
  const [showAllTransactions, setShowAllTransactions] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)


  // to fetch transactions from API
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const [incomeRes, expenseRes] = await Promise.all([
        axios.get(`${API_BASE}/income/get`, { headers }),
        axios.get(`${API_BASE}/expense/get`, { headers }),
      ]);

      const incomes = safeArrayFromResponse(incomeRes).map((i) => ({
        ...i,
        type: "income",
      }));
      const expenses = safeArrayFromResponse(expenseRes).map((e) => ({
        ...e,
        type: "expense",
      }));

      const allTransactions = [...incomes, ...expenses]
        .map((t) => ({
          id: t._id || t.id || t.id_str || Math.random().toString(36).slice(2),
          description: t.description || t.title || t.note || "",
          amount: t.amount != null ? Number(t.amount) : Number(t.value) || 0,
          date: t.date || t.createdAt || new Date().toISOString(),
          category: t.category || t.type || "Other",
          type: t.type,
          raw: t,
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      setTransactions(allTransactions);
      setLastUpdated(new Date());
    } catch (err) {
      console.error(
        "Failed to fetch transactions",
        err?.response || err.message || err
      );
    } finally {
      setLoading(false);
    }
  };
  // API calls for adding, editing, deleting transactions
  // add transaction function with error handling and response normalization
  const addTransaction = async (transaction) => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const endpoint =
        transaction.type === "income" ? "income/add" : "expense/add";
      await axios.post(`${API_BASE}/${endpoint}`, transaction, { headers });
      await fetchTransactions();
      return true;
    } catch (err) {
      console.error(
        "Failed to add transaction",
        err?.response || err.message || err
      );
      throw err;
    }
  };
  // edit transaction function with error handling and response normalization
  const editTransaction = async (id, transaction) => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const endpoint =
        transaction.type === "income" ? "income/update" : "expense/update";
      await axios.put(`${API_BASE}/${endpoint}/${id}`, transaction, {
        headers,
      });
      await fetchTransactions();
      return true;
    } catch (err) {
      console.error(
        "Failed to edit transaction",
        err?.response || err.message || err
      );
      throw err;
    }
  };
  // delete transaction function with error handling and response normalization
  const deleteTransaction = async (id, type) => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const endpoint = type === "income" ? "income/delete" : "expense/delete";
      await axios.delete(`${API_BASE}/${endpoint}/${id}`, { headers });
      await fetchTransactions();
      return true;
    } catch (err) {
      console.error(
        "Failed to delete transaction",
        err?.response || err.message || err
      );
      throw err;
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // filtered transactions based on selected time frame, memoized for performance optimization
  const filteredTransactions = useMemo(
    () => filterTransactions(transactions, timeFrame),
    [transactions, timeFrame]
  );

  const stats = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const last30DaysTransactions = transactions.filter(
      (t) => new Date(t.date) >= thirtyDaysAgo
    );

    const last30DaysIncome = last30DaysTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const last30DaysExpenses = last30DaysTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const allTimeIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const allTimeExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const savingsRate =
      last30DaysIncome > 0
        ? Math.round(
          ((last30DaysIncome - last30DaysExpenses) / last30DaysIncome) * 100
        )
        : 0;

    const last60DaysAgo = new Date(now);
    last60DaysAgo.setDate(now.getDate() - 60);

    const previous30DaysTransactions = transactions.filter((t) => {
      const date = new Date(t.date);
      return date >= last60DaysAgo && date < thirtyDaysAgo;
    });

    const previous30DaysExpenses = previous30DaysTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expenseChange =
      previous30DaysExpenses > 0
        ? Math.round(
          ((last30DaysExpenses - previous30DaysExpenses) /
            previous30DaysExpenses) *
          100
        )
        : 0;

    return {
      totalTransactions: transactions.length,
      last30DaysIncome,
      last30DaysExpenses,
      last30DaysSavings: last30DaysIncome - last30DaysExpenses,
      allTimeIncome,
      allTimeExpenses,
      allTimeSavings: allTimeIncome - allTimeExpenses,
      last30DaysCount: last30DaysTransactions.length,
      savingsRate,
      expenseChange,
    };
  }, [transactions]);
  // label for current time frame, memoized for performance optimization
  const timeFrameLabel = useMemo(
    () =>
      timeFrame === "daily"
        ? "Today"
        : timeFrame === "weekly"
          ? "This Week"
          : "This Month",
    [timeFrame]
  );
  // context object to pass down to child components via Outlet context, memoized for performance optimization
  const outletContext = useMemo(
    () => ({
      transactions: filteredTransactions,
      addTransaction,
      editTransaction,
      deleteTransaction,
      refreshTransactions: fetchTransactions,
      timeFrame,
      setTimeFrame,
      lastUpdated,
    }),
    [filteredTransactions, timeFrame, lastUpdated]
  );
  const getSavingsRating = (rate) =>
    rate > 30 ? "Excellent" : rate > 20 ? "Good" : "Needs improvement";
  // top 5 expense categories with total amounts, memoized for performance optimization
  const topCategories = useMemo(
    () =>
      Object.entries(
        transactions
          .filter((t) => t.type === "expense")
          .reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
            return acc;
          }, {})
      )
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5),
    [transactions]
  );

  const displayedTransactions = showAllTransactions
    ? transactions
    : transactions.slice(0, 4);

  // Reserved for upcoming UI sections; intentionally kept in Layout for next integration.
  const reservedForFutureUse = useMemo(
    () => ({
      CATEGORY_ICONS,
      timeFrameLabel,
      outletContext,
      topCategories,
      displayedTransactions,
      filteredTransactionsCount: filteredTransactions.length,
      loading,
    }),
    [
      timeFrameLabel,
      outletContext,
      topCategories,
      displayedTransactions,
      filteredTransactions.length,
      loading,
    ]
  );
  const location = useLocation();
  const isProfilePage = location.pathname === '/profile';

  return (
    <div className={styles.layout.root}>
      <Navbar onLogout={onLogout} user={user} token={token} />
      <Sidebar user={user} isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarCollapsed} onLogout={onLogout} />
      
      <div className={styles.layout.mainContainer(sidebarCollapsed)}>
        {!isProfilePage && (
          <div className={styles.header.container}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className={`${styles.header.title} flex items-center gap-2 text-gray-900`}>
                Dashboard <span className="text-xl animate-pulse">👋</span>
              </h1>
              <p className={styles.header.subtitle}>
                Welcome back, <span className="font-bold text-teal-600">{user?.name || 'User'}</span>! 
                Ready to manage your finances?
              </p>
            </motion.div>
          </div>
        )}

        {!isProfilePage && (
          <div className={styles.statCards.grid}>
          {/* total balance */}
          <TiltCard className={styles.statCards.card}>
            <div className={styles.statCards.cardHeader}>
              <div>
                <p className={styles.statCards.cardTitle}>Total Balance</p>
                <p className={styles.statCards.cardValue}>₹
                  {stats.allTimeSavings.toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className={styles.statCards.iconContainer("purple")}>
                <Wallet className={styles.statCards.icon("purple")} />

              </div>

            </div>
            <p className={styles.statCards.cardFooter}>
              <span className='text-teal-600 font-medium'>
                +₹{stats.last30DaysSavings.toLocaleString()}
              </span>{" "}
              this month
            </p>
          </TiltCard>

          {/* monthly income */}
          <TiltCard className={styles.statCards.card}>
            <div className={styles.statCards.cardHeader}>
              <div>
                <p className={styles.statCards.cardTitle}>Monthly Income</p>
                <p className={styles.statCards.cardValue}>₹
                  {stats.last30DaysIncome.toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className={styles.statCards.iconContainer("blue")}>
                <ArrowUp className={styles.statCards.icon("blue")} />

              </div>
            </div>
            <p className={styles.statCards.cardFooter}>
              <span className='text-green-600 font-medium'>
                +9.8%
              </span>{" "}
              from last month
            </p>
          </TiltCard>

          {/* monthly expanse */}
          <TiltCard className={styles.statCards.card}>
            <div className={styles.statCards.cardHeader}>
              <div>
                <p className={styles.statCards.cardTitle}>Monthly Expanse</p>
                <p className={styles.statCards.cardValue}>₹
                  {stats.last30DaysExpenses.toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className={styles.statCards.iconContainer("orange")}>
                <ArrowDown className={styles.statCards.icon("orange")} />

              </div>
            </div>
            <p className={styles.statCards.cardFooter}>
              <span className={`${styles.colors.expenseChange(stats.expenseChange)} font-medium`}>
                {stats.expenseChange > 0 ? "+" : ""}
                {stats.expenseChange}%
              </span>{" "}
              from last month
            </p>
          </TiltCard>

          {/* savings rate */}
          <TiltCard className={styles.statCards.card}>
            <div className={styles.statCards.cardHeader}>
              <div>
                <p className={styles.statCards.cardTitle}>Saving Rate</p>
                <p className={styles.statCards.cardValue}>
                  {stats.savingsRate.toFixed(2)}%
                </p>
              </div>
              <div className={styles.statCards.iconContainer("red")}>
                <PiggyBank className={styles.statCards.icon("red")} />

              </div>
            </div>
            <p className={styles.statCards.cardFooter}>
              {getSavingsRating(stats.savingsRate)}
            </p>
          </TiltCard>
        </div>
        )}
        <div className={isProfilePage ? "w-full" : styles.grid.main}>
          <div className={isProfilePage ? "w-full" : styles.grid.leftColumn}>
            <div className={isProfilePage ? "" : styles.cards.base}>
              {!isProfilePage && (
                <div className={styles.cards.header}>
                  <h3 className={styles.cards.title}>
                    <TrendingUp className="w-6 h-6 text-teal-600" />
                    Financial Trends
                    <span className='text-sm text-gray-500 font-normal' >
                      {timeFrameLabel}
                    </span>
                  </h3>
                </div>
              )}
              <Outlet context={outletContext} />
            </div>


          </div>
          {/* right side   */}
          {!isProfilePage && (
            <div className={styles.grid.rightColumn}>
              <TiltCard className={styles.cards.base}>
                <div className={styles.transactions.cardHeader}>
                  <h3 className={styles.transactions.cardTitle}>
                    <Clock className=" w-6 h-6 text-purple-300" />
                    Recent transections
                  </h3>
                  <button
                    onClick={fetchTransactions}
                    disabled={loading}
                    className={styles.transactions.refreshButton}>
                    <RefreshCw className={styles.transactions.refreshIcon(loading)} />
                  </button>
                </div>
                <div className={styles.transactions.dataStackingInfo}>
                  <CircleAlert className={styles.transactions.dataStackingIcon} />
                  <span>Transactions are Stacked by date ( newest first ) </span>
                </div>
                <div className={styles.transactions.listContainer}>
                  {displayedTransactions.map((transaction) => {
                    const { id, type, category, description, date, amount } = transaction
                    return (
                      <div key={id} className={styles.transactions.transactionItem}>
                        <div className='flex items-center gap-1 md:gap-4 lg:gap-3 '>
                          <div
                            className={`p-2 rounded-lg ${styles.colors.transaction.bg(type)}`}>
                            {CATEGORY_ICONS[category]}
                          </div>
                          <div className={styles.transactions.details}>
                            <p className={styles.transactions.description}>
                              {description}
                            </p>

                            <p className={styles.transactions.meta}>
                              {new Date(date).toLocaleDateString()}
                              <span className='ml-2 capitalize'>
                                {category}
                              </span>
                            </p>
                          </div>
                        </div>
                        <span className={styles.colors.transaction.text(type)}>
                          {type === "income" ? "+" : "-"}₹{Number(amount)}
                        </span>
                      </div>
                    )
                  })}

                  {
                    transactions.length === 0 ? (
                      <div className={styles.transactions.emptyState}>
                        <div className={styles.transactions.emptyIconContainer}>
                          <Clock className={styles.transactions.emptyIcon} />
                        </div>
                        <p className={styles.transactions.emptyText}>
                          No recent transactions
                        </p>
                      </div>
                    ) : (
                      <div className={styles.transactions.viewAllContainer}>
                        <button
                          onClick={() => setShowAllTransactions(!showAllTransactions)}
                          className={styles.transactions.viewAllButton}
                        >
                          {showAllTransactions ? (
                            <>
                              <ChevronUp className='w-5 h-5' />
                              Show Less
                            </>
                          ) : (
                            <>
                              <ChevronDown className='w-5 h-5' />
                              View All Transactions ({transactions.length})
                            </>
                          )}

                        </button>
                      </div>
                    )
                  }

                </div>
              </TiltCard>
              {/* spend by category     */}
              <TiltCard className={styles.cards.base}>
                <h3 className={styles.categories.title}>
                  <PieChart className={styles.categories.titleIcon} />
                  Spending by category
                </h3>
                <div className={styles.categories.list}>
                  {topCategories.map(([category, amount]) => (
                    <div
                      key={category}
                      className={styles.categories.categoryItem}>
                      <div className='flex items-center gap-3'>
                        <div className={styles.categories.categoryIconContainer}>

                          {CATEGORY_ICONS[category]}
                        </div>
                        <span className={styles.categories.categoryName}>{category}</span>

                      </div>
                      <span className={styles.categories.categoryAmount}>
                        ₹{amount}
                      </span>
                    </div>
                  ))}
                </div>
                <div className={styles.categories.summaryContainer}>
                  <div className={styles.categories.summaryGrid}>
                    <div className={styles.categories.summaryIncomeCard}>
                      <p className={styles.categories.summaryTitle}>
                        Total Income
                      </p>
                      <p className={styles.categories.summaryValue}>
                        ₹{stats.allTimeIncome.toLocaleString()}
                      </p>
                    </div>

                    <div className={styles.categories.summaryExpenseCard}>
                      <p className={styles.categories.summaryTitle}>
                        Total Expanse
                      </p>
                      <p className={styles.categories.summaryValue}>
                        ₹{stats.allTimeExpenses.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Layout
