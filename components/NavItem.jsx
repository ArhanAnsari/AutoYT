export function NavItem({ icon, label }) {
  return (
    <div className="flex items-center space-x-3 p-2 hover:bg-rose-500 dark:hover:bg-rose-400 rounded-lg cursor-pointer text-gray-900 dark:text-white">
      {icon}
      <span className="text-lg">{label}</span>
    </div>
  );
}
