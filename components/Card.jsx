export function Card({ title, description }) {
    return (
      <div className="p-5 bg-white dark:bg-gray-800 shadow rounded-lg">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </div>
    );
  }