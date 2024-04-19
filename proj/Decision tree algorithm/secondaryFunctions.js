export function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

export function copyObjectWithoutKey(obj, keyToRemove) {
    
    const copiedObject = { ...obj };

    if (copiedObject.hasOwnProperty(keyToRemove)) {
        delete copiedObject[keyToRemove];
    }

    return copiedObject;
}


export function deepCopyArray(arr) {
    return arr.map(item => Array.isArray(item) ? deepCopyArray(item) :
     (item instanceof Object) ? deepCopyObject(item) : item);
}

export function deepRemoveFromArray(arr, itemToRemove) {
    for (let i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i])) {
            deepRemoveFromArray(arr[i], itemToRemove);
        } else if (arr[i] instanceof Object) {
            deepRemoveFromObject(arr[i], itemToRemove);
        } else if (arr[i] === itemToRemove) {
            arr.splice(i, 1);
            i--;
        }
    }
    return arr;
}

export function createObject(atributesName){
    const object = {};
    atributesName.forEach((atributesName)=>{
      object[atributesName] = null;
    });
    return object;
}