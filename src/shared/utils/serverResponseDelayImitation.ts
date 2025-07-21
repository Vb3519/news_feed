const serverResponseDelayImitation = async (delayTimer: number) => {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve('');
    }, delayTimer);
  });
};

export default serverResponseDelayImitation;
