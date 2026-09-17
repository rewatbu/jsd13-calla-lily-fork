// ============================================================
// Button: ปุ่มสี crimson มาตรฐานของเว็บ
// - props: name (ข้อความบนปุ่ม), onClick, type,
//   disabled, className (เพิ่มเติม class Tailwind)
// ============================================================
const Button = ({
  name,
  onClick,
  type = "button",
  disabled = false,
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center min-h-11 px-[22px] py-3 rounded-xl bg-primary text-background font-semibold text-[15px] tracking-wide border-2 border-primary cursor-pointer transition-all duration-150 hover:bg-primary-hover hover:border-primary-hover hover:-translate-y-px hover:shadow-button-hover active:translate-y-0 active:shadow-none focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-border disabled:bg-border disabled:border-border disabled:text-muted-foreground disabled:opacity-65 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none ${className}`}
    >
      {name}
    </button>
  );
};

export default Button;