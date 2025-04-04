export function Button({ onClick, children }) {
    return (
      <button 
        onClick={onClick} 
        className="p-2 bg-rose-600 dark:bg-rose-700 text-white rounded-lg hover:bg-rose-500 dark:hover:bg-rose-500"
      >
        {children}
      </button>
    );
  }