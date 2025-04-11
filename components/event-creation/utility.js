export const getChangedFields = (original, current) => {
    const changes = {};
    for (let key in current) {
      if(key==="isEditing"){
        continue;
      }
      if (current[key] !== original[key]) {
        changes[key] = current[key];
      }
    }
    console.log(changes)
    return changes;
  };