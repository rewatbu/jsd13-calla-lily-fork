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
      className={`inline-flex items-center justify-center min-h-11 px-[22px] py-3 rounded-xl bg-[#9B151D] text-[#FFE5DE] font-semibold text-[15px] tracking-wide border-2 border-[#9B151D] cursor-pointer transition-all duration-150 hover:bg-[#7A1016] hover:border-[#7A1016] hover:-translate-y-px hover:shadow-[0_5px_14px_rgba(155,21,29,0.22)] active:translate-y-0 active:shadow-none focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#E8BFB5] disabled:bg-[#E8BFB5] disabled:border-[#E8BFB5] disabled:text-[#9A6A5E] disabled:opacity-65 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none ${className}`}
    >
      {name}
    </button>
  );
};

export default Button;