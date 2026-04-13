import { motion } from "framer-motion";

const SuccessModal = ({ open, onClose, title = "STREAK SAVED! 🔥" }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="glass-card max-w-md p-6 text-center"
      >
        <h3 className="text-2xl font-bold text-cyan-300">{title}</h3>
        <motion.div
          className="my-3 text-5xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, -8, 8, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          🔥
        </motion.div>
        <p className="text-slate-200">Momentum locked in. Keep your preparation streak alive.</p>
        <button onClick={onClose} className="pro-btn mt-5 px-5 py-2.5">
          Continue
        </button>
      </motion.div>
    </div>
  );
};

export default SuccessModal;
