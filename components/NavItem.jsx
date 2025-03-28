export function NavItem({ icon, label }) {
    return (
      <div className="flex items-center space-x-3 p-2 hover:bg-rose-500 rounded-lg cursor-pointer">
        {icon}
        <span className="text-lg">{label}</span>
      </div>
    );
  }