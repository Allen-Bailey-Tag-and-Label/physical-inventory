export default (v) => {
  const date = new Date(v);

  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear().toString().slice(-2)} ${
    ((date.getHours() - 1) % 12) + 1
  }:${date.getMinutes().toString().padStart(2, '0')} ${date.getHours() >= 12 ? 'PM' : 'AM'}`;
};
