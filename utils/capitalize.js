exports.capitalize = function (str) {
    return str.split(/[\s]+/).map(word => {
      let parts = word.split('-');
      return parts.map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join('-');
    }).join(' ');
  }
  