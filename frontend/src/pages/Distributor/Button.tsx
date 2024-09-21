import { HTMLAttributes } from 'react';
interface ButtonProps {
  text: string;
  disabled?: boolean;
  theme?: 'primary' | 'secondary' | 'edit' | 'submit' | 'upload';
}

const Button: React.FC<ButtonProps & HTMLAttributes<HTMLButtonElement>> = ({
  text,
  onClick,
  disabled = false,
  theme = 'secondary',
}) => {
  const getThemeClass = () => {
    switch (theme) {
      case 'primary':
        return 'text-[#3370FF] bg-white border-[#3370FF] border font-bold  px-8 ';
      case 'edit':
        return 'bg-white px-5 text-[#3370FF] border font-normal border-[#3370FF] ';
      case 'submit':
        return 'bg-[#3370FF] text-white font-bold  px-5 ';
      default: // secondary
        return 'bg-[#3370FF] text-white font-bold  px-8 ';
    }
  };
  if (disabled)
    return (
      <button
        disabled
        className="rounded-lg border border-transparent bg-[#3370FF80]/50 px-8 py-3 text-xl font-bold text-white disabled:cursor-not-allowed"
      >
        {text}
      </button>
    );
  return (
    <button
      onClick={onClick}
      className={`${getThemeClass()} rounded-lg border py-3 text-xl font-bold`}
    >
      <span> {text}</span>
    </button>
  );
};

export default Button;
