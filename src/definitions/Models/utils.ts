export namespace Utils {
  export function toPrettyObject(doc: any, obj: any): any {
    if (obj._id) {
      obj.id = obj._id;
      delete obj._id;
    }
    return obj;
  }
}
