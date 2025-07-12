export const generateTeacherId = () => {
  const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const number = String(Math.floor(100 + Math.random() * 900));
  return letter + number;
};
