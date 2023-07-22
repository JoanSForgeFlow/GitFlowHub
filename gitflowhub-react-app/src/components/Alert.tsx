// Define an interface for alert
interface AlertType {
  msg: string;
  error: boolean;
}

// Alert props
interface AlertProps {
  alert: AlertType;
}

export const Alert: React.FC<AlertProps> = ({ alert }) => {
  return (
    <div
      className={`${
        alert.error ? "from-red-400 to bg-red-600" : "from-sky-400 to-sky-600"
      } bg-gradient-to-br text-center p-3 rounded-xl uppercase text-white font-bold text-sm my-10`}
    >
      {alert.msg}
    </div>
  );
};
