function getPageForToday(totalPages: number): number {
  const today = new Date().toISOString().split("T")[0];
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = (hash << 5) - hash + today.charCodeAt(i);
    hash |= 0;
  }
  return (Math.abs(hash) % totalPages) + 1;
}

export { getPageForToday };
