const Loader = () => {
    return (
      <span className="relative inline-block w-12 h-12 rotate-45">
        <span className="absolute w-6 h-6 top-[-24px] left-0 box-border animate-[animloader_2s_ease_infinite]"></span>
        <span className="absolute w-6 h-6 top-0 left-0 bg-white/85 shadow-[0_0_10px_rgba(0,0,0,0.15)] animate-[animloader2_1s_ease_infinite]"></span>
  
        <style>
          {`
            @keyframes animloader {
              0% {
                box-shadow: 0 24px rgba(255, 255, 255, 0), 24px 24px rgba(255, 255, 255, 0), 24px 48px rgba(255, 255, 255, 0), 0px 48px rgba(255, 255, 255, 0);
              }
              12% {
                box-shadow: 0 24px white, 24px 24px rgba(255, 255, 255, 0), 24px 48px rgba(255, 255, 255, 0), 0px 48px rgba(255, 255, 255, 0);
              }
              25% {
                box-shadow: 0 24px white, 24px 24px white, 24px 48px rgba(255, 255, 255, 0), 0px 48px rgba(255, 255, 255, 0);
              }
              37% {
                box-shadow: 0 24px white, 24px 24px white, 24px 48px white, 0px 48px rgba(255, 255, 255, 0);
              }
              50% {
                box-shadow: 0 24px white, 24px 24px white, 24px 48px white, 0px 48px white;
              }
              62% {
                box-shadow: 0 24px rgba(255, 255, 255, 0), 24px 24px white, 24px 48px white, 0px 48px white;
              }
              75% {
                box-shadow: 0 24px rgba(255, 255, 255, 0), 24px 24px rgba(255, 255, 255, 0), 24px 48px white, 0px 48px white;
              }
              87% {
                box-shadow: 0 24px rgba(255, 255, 255, 0), 24px 24px rgba(255, 255, 255, 0), 24px 48px rgba(255, 255, 255, 0), 0px 48px white;
              }
              100% {
                box-shadow: 0 24px rgba(255, 255, 255, 0), 24px 24px rgba(255, 255, 255, 0), 24px 48px rgba(255, 255, 255, 0), 0px 48px rgba(255, 255, 255, 0);
              }
            }
  
            @keyframes animloader2 {
              0% {
                transform: translate(0, 0) rotateX(0) rotateY(0);
              }
              25% {
                transform: translate(100%, 0) rotateX(0) rotateY(180deg);
              }
              50% {
                transform: translate(100%, 100%) rotateX(-180deg) rotateY(180deg);
              }
              75% {
                transform: translate(0, 100%) rotateX(-180deg) rotateY(360deg);
              }
              100% {
                transform: translate(0, 0) rotateX(0) rotateY(360deg);
              }
            }
          `}
        </style>
      </span>
    );
  };
  
  export default Loader;
  