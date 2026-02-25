import { motion as Motion } from "framer-motion";

const blobs = [
  "blob-a",
  "blob-b",
  "blob-c"
];

export const AppBackground = () => {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <Motion.div
        className="animated-gradient"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
        }}
        transition={{ duration: 18, ease: "linear", repeat: Infinity }}
      />
      {blobs.map((blob, index) => (
        <Motion.div
          key={blob}
          className={`blob ${blob}`}
          animate={{
            y: [0, -20, 0],
            x: [0, index % 2 === 0 ? 12 : -10, 0]
          }}
          transition={{
            duration: 8 + index * 2,
            ease: "easeInOut",
            repeat: Infinity
          }}
        />
      ))}
    </div>
  );
};

