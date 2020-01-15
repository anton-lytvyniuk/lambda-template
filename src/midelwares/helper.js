exports.getProperty = (object, propertyPath) => {
  const props = propertyPath.split('.');

  return props.reduce((acc, prop) => (acc ? acc[prop] : acc), object);
};

exports.setProperty = (object, propertyPath, value) => {
  const props = propertyPath.split('.');

  return props.reduce((acc, prop, index) => {
    // check if it is last property
    // if it is last one mutate accamulator and return full object
    if (index === props.length - 1) {
      acc[prop] = value;
      return object;
    }

    if (!acc[prop] || typeof acc[prop] !== 'object') {
      acc[prop] = {};
    }

    return acc[prop];
  }, object);
};

exports.deepCopy = (object) => JSON.parse(JSON.stringify(object));
