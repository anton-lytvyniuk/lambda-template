const OBFUSCATED_STRING = '*******';

function getProperty(object, propertyPath) {
  const props = propertyPath.split('.');

  return props.reduce((acc, prop) => (acc ? acc[prop] : acc), object);
}

function setProperty(object, propertyPath, value) {
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
}

function deepCopy(object) {
  return JSON.parse(JSON.stringify(object));
}

module.exports = (object, propertiesToObfuscate = []) => {
  if (typeof object !== 'object' || !propertiesToObfuscate.length) {
    return object;
  }
  const obfuscatedObject = deepCopy(object);

  propertiesToObfuscate.forEach((propertyName) => {
    if (getProperty(obfuscatedObject, propertyName) !== undefined) {
      setProperty(obfuscatedObject, propertyName, OBFUSCATED_STRING);
    }
  });
  return obfuscatedObject;
};
