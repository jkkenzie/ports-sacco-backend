import aiRobotHelp from '../../assets/image/ai-robot-help.svg';

const gradientBorder = 'linear-gradient(90deg, #22b5e0 0%, #22acb6 25%, #4ade80 50%, #f59e0b 75%, #ef4444 100%)';

export function FloatingHelpButton() {
  return (
    <a
      href="#"
      className="fixed z-50 flex rounded-full shadow-md hover:shadow-lg transition-shadow no-underline"
      style={{
        right: '24px',
        top: '50%',
        transform: 'translateY(-50%)',
        padding: '2px',
        background: gradientBorder,
      }}
      aria-label="AI Help"
    >
      <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-white">
        <img src={aiRobotHelp} alt="" className="w-12 h-12 flex-shrink-0" aria-hidden />
        <span className="text-sm font-semibold text-gray-800 whitespace-nowrap">Need Assistance?</span>
      </span>
    </a>
  );
}
