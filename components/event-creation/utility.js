export const getChangedFields = (original, current) => {
    const changes = {};
    for (let key in current) {
      if (current[key] !== original[key]) {
        changes[key] = current[key];
      }
    }
    return changes;
  };