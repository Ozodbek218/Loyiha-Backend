const validateUser = (data) => {
  const errors = [];

  if (!data.firstName || data.firstName.trim().length === 0) {
    errors.push('First name is required');
  }
  if (!data.lastName || data.lastName.trim().length === 0) {
    errors.push('Last name is required');
  }
  if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.push('Valid email is required');
  }

  if (errors.length > 0) {
    return {
      error: {
        details: errors.map(msg => ({ message: msg }))
      }
    };
  }

  return { error: null };
};

module.exports = {
  validateUser
};
