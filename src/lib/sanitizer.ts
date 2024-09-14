import sanitize from "sanitize-html";

export default function(field: any){
    for (const key in field) {
      if (typeof field[key] === 'string') {
        field[key] = sanitize(field[key]).trim();
      }
    }
};