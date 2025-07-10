import { motion } from "motion/react";
import { ComponentType, FC } from "react";

export const Trasition = <P extends object>(
  Component: ComponentType<P>
): FC<P> => {
  // <P extends object> mean it can take props P as object only  // FC<P> mean functional component with props is type of function Trasition
  return (props: P) => (
    <>
      
      <motion.div 
          initial={{ opacity: "0%" }}
          animate={{ opacity: "100%" }}
          exit={{ opacity: "0%" }}
          transition={{ duration: 0.5,delay:0.2, ease: "linear" }}
          >
        <Component {...props} />
      </motion.div>
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`layer${i}`}
          className={`slide z-20 ${i%2==0?"b":"w"}`}
          initial={{ width: "100%" }}
          animate={{ width: "0%" }}
          exit={{ width: "100%" }}
          style={{top:`calc(20vh*${i})`}}
          transition={{ duration: 0.5,delay:.1*i, ease: "linear" }}
        />
      ))}
    </>
  );
};
